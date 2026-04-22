import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";

import Profileimage from "./Profileimage";
import SignOutButton from "../pages/SignOutButton";

import { MdArrowDropUp, MdOutlineSettings } from "react-icons/md";
import { TfiWallet } from "react-icons/tfi";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { GrUserAdmin } from "react-icons/gr";

const DROPDOWN_WIDTH = 280;

const DropdownUser = () => {
  const navigate = useNavigate();
  const isAdmin = useSelector((state) => state.permission?.isAdmin);
  const [fullName, setFullName] = useState(localStorage.getItem("fullName") || "");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  const [mounted, setMounted] = useState(false);
  const [renderDropdown, setRenderDropdown] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const trigger = useRef(null);
  const dropdown = useRef(null);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    const check = () => setIsSmallScreen(window.innerWidth < 1024);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handle = () => setFullName(localStorage.getItem("fullName") || "");
    window.addEventListener("profile-updated", handle);
    window.addEventListener("storage", handle);

    return () => {
      window.removeEventListener("profile-updated", handle);
      window.removeEventListener("storage", handle);
    };
  }, []);

  useEffect(() => {
    if (dropdownOpen) {
      setRenderDropdown(true);
      const raf = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(raf);
    }

    setMounted(false);
    closeTimeoutRef.current = setTimeout(() => setRenderDropdown(false), 300);

    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!renderDropdown || !trigger.current || isSmallScreen) return;

    const updatePosition = () => {
      const rect = trigger.current.getBoundingClientRect();
      let left = rect.right - DROPDOWN_WIDTH;

      if (left < 8) left = rect.left;
      if (left + DROPDOWN_WIDTH > window.innerWidth - 8) {
        left = Math.max(8, window.innerWidth - DROPDOWN_WIDTH - 8);
      }

      setPos({ top: rect.bottom, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [renderDropdown, isSmallScreen]);

  useEffect(() => {
    if (!renderDropdown) return;

    const onClickOutside = (e) => {
      if (
        dropdown.current &&
        !dropdown.current.contains(e.target) &&
        trigger.current &&
        !trigger.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    const onEscape = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [renderDropdown]);

  useEffect(() => {
    if (!renderDropdown || !isSmallScreen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [renderDropdown, isSmallScreen]);

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);
  const toggleDropdown = useCallback(() => setDropdownOpen((prev) => !prev), []);
  const closeSignOutModal = useCallback(() => setIsSignOutModalOpen(false), []);

  const openSignOutModal = useCallback(() => {
    setDropdownOpen(false);
    setIsSignOutModalOpen(true);
  }, []);

  const handleSignOut = useCallback(() => {
    localStorage.clear();
    sessionStorage.clear();
    closeSignOutModal();
    navigate("/signin");
  }, [closeSignOutModal, navigate]);

  const baseItemClass =
    "flex items-center gap-3 rounded-[10px] px-3 py-[11px] text-sm font-semibold transition-all duration-150";
  const iconClass =
    "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] transition-all duration-150";

  const SmallScreenPanel = () => (
    <>
      <div
        onClick={closeDropdown}
        className={`fixed inset-0 z-[99998] bg-black/20 transition-opacity duration-300 ${
          mounted ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={dropdown}
        onClick={(e) => e.stopPropagation()}
        className={`fixed left-0 right-0 top-0 z-[99999] w-screen overflow-hidden rounded-b-[18px] border border-[rgba(2,120,64,0.13)] bg-white shadow-[0_12px_48px_rgba(2,120,64,0.16),0_2px_14px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out ${
          mounted ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
        }`}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-[#027840] to-[#03a856] px-4 pb-5 pt-4">
          <div className="pointer-events-none absolute -right-[18px] -top-[18px] h-[72px] w-[72px] rounded-full bg-white/10" />
          <div className="pointer-events-none absolute bottom-[-12px] left-[50px] h-[46px] w-[46px] rounded-full bg-white/10" />

          <div className="relative flex items-center gap-[11px]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/50 bg-white/20">
              <Profileimage />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold text-white">
                {fullName || "User"}
              </p>

              <span className="mt-[3px] inline-flex items-center gap-1 rounded-[20px] bg-white/20 px-2 py-[2px] text-[11px] font-bold text-white/90">
                <span className="inline-block h-[5px] w-[5px] rounded-full bg-[#7effa0]" />
                Vendor
              </span>
            </div>

            <button
              onClick={closeDropdown}
              type="button"
              aria-label="Close"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-none bg-white/20 text-[18px] leading-none text-white"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-[10px] pb-1 pt-[10px]">
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            <li
              className={`transition-all duration-300 ${
                mounted
                  ? "translate-y-0 opacity-100 delay-[40ms]"
                  : "-translate-y-2 opacity-0"
              }`}
            >
              <Link
                to="/layout/payment-history"
                onClick={closeDropdown}
                className={`${baseItemClass} text-[#1a2e20] hover:translate-x-[3px] hover:bg-[#edf7f1] hover:text-[#027840]`}
              >
                <span className={`${iconClass} bg-[#f0faf3]`}>
                  <TfiWallet size={15} />
                </span>
                Payment History
              </Link>
            </li>

            <li
              className={`transition-all duration-300 ${
                mounted
                  ? "translate-y-0 opacity-100 delay-[80ms]"
                  : "-translate-y-2 opacity-0"
              }`}
            >
              <Link
                to="/layout/settings"
                onClick={closeDropdown}
                className={`${baseItemClass} text-[#1a2e20] hover:translate-x-[3px] hover:bg-[#edf7f1] hover:text-[#027840]`}
              >
                <span className={`${iconClass} bg-[#f0faf3]`}>
                  <MdOutlineSettings size={16} />
                </span>
                Settings
              </Link>
            </li>

            {isAdmin && (
              <li
                className={`transition-all duration-300 ${
                  mounted
                    ? "translate-y-0 opacity-100 delay-[120ms]"
                    : "-translate-y-2 opacity-0"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    closeDropdown();
                    window.location.href = "/admin_layout";
                  }}
                  className={`${baseItemClass} w-full text-left text-[#1a2e20] hover:translate-x-[3px] hover:bg-[#edf7f1] hover:text-[#027840]`}
                >
                  <span className={`${iconClass} bg-[#f0faf3]`}>
                    <GrUserAdmin size={15} />
                  </span>
                  Admin
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="mx-0 my-1 h-px bg-[linear-gradient(90deg,transparent,#ddeee4,transparent)]" />

        <div className="px-[10px] pb-3 pt-1">
          <button
            type="button"
            onClick={openSignOutModal}
            className={`${baseItemClass} w-full text-left text-[#BB8232] hover:translate-x-[3px] hover:bg-[#fff4e0] hover:text-[#a06820]`}
          >
            <span className={`${iconClass} bg-[#fef4e6]`}>
              <LiaSignOutAltSolid size={16} />
            </span>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );

  const LargeScreenPanel = () => (
    <div
      ref={dropdown}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: DROPDOWN_WIDTH,
        zIndex: 100000,
      }}
      onClick={(e) => e.stopPropagation()}
      className={`-mt-16 rounded-sm border bg-white py-5 shadow-default transition-all duration-200 ${
        mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-3">
          <Profileimage />
          <div>
            <p className="text-sm font-bold">{fullName || "User"}</p>
            <p className="font-bold text-[#027840]">Vendor</p>
          </div>
        </div>

        <button onClick={closeDropdown} type="button">
          <MdArrowDropUp size={20} className="rotate-180" />
        </button>
      </div>

      <ul className="mt-4 flex flex-col gap-5 px-6 py-7.5">
        <li>
          <Link
            to="/layout/payment-history"
            onClick={closeDropdown}
            className="flex items-center gap-3.5 font-semibold text-[#005D68]"
          >
            <TfiWallet size={18} />
            Payment History
          </Link>
        </li>

        <li>
          <Link
            to="/layout/settings"
            onClick={closeDropdown}
            className="flex items-center gap-3.5 font-semibold text-[#005D68]"
          >
            <MdOutlineSettings size={18} />
            Settings
          </Link>
        </li>

        {isAdmin && (
          <li>
            <button
              type="button"
              onClick={() => {
                closeDropdown();
                window.location.href = "/admin_layout";
              }}
              className="flex items-center gap-3.5 font-semibold text-[#005D68]"
            >
              <GrUserAdmin size={18} />
              Admin
            </button>
          </li>
        )}
      </ul>

      <button
        type="button"
        onClick={openSignOutModal}
        className="mt-7 flex items-center gap-3.5 px-6 font-semibold text-[#BB8232]"
      >
        <LiaSignOutAltSolid size={18} />
        Sign Out
      </button>
    </div>
  );

  return (
    <div className="relative flex gap-3" aria-haspopup="true">
      <Profileimage />

      <button
        ref={trigger}
        onClick={toggleDropdown}
        className="flex items-center gap-4 focus:outline-none"
        aria-expanded={dropdownOpen}
        type="button"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-bold text-black">{fullName || "User"}</span>
          <span className="block text-start font-bold text-[#027840]">Vendor</span>
        </span>

        <MdArrowDropUp
          size={20}
          className={`block transition-transform duration-200 ${
            dropdownOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {renderDropdown &&
        createPortal(
          isSmallScreen ? <SmallScreenPanel /> : <LargeScreenPanel />,
          document.body
        )}

      <SignOutButton
        isOpen={isSignOutModalOpen}
        closeModal={closeSignOutModal}
        onConfirm={handleSignOut}
      />
    </div>
  );
};

export default DropdownUser;