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

  const trigger = useRef(null);
  const dropdown = useRef(null);

  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleProfileUpdate = () => {
      setFullName(localStorage.getItem("fullName") || "");
    };

    window.addEventListener("profile-updated", handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    if (!dropdownOpen || !trigger.current) return;

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
  }, [dropdownOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (e) => {
      if (
        dropdown.current &&
        !dropdown.current.contains(e.target) &&
        trigger.current &&
        !trigger.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [dropdownOpen]);

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);

  const openSignOutModal = () => {
    setDropdownOpen(false);
    setIsSignOutModalOpen(true);
  };

  const closeSignOutModal = () => setIsSignOutModalOpen(false);

  const handleSignOut = useCallback(() => {
    localStorage.clear();
    closeSignOutModal();
    navigate("/signin");
  }, [navigate]);

  return (
    <div className="relative flex gap-3" aria-haspopup="true">
      <Profileimage />

      <button
        ref={trigger}
        onClick={() => setDropdownOpen((prev) => !prev)}
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

      {dropdownOpen &&
        createPortal(
          <div
            ref={dropdown}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: DROPDOWN_WIDTH,
              zIndex: 100000,
            }}
            className="rounded-sm border py-5 -mt-16 bg-white shadow-default"
            onClick={(e) => e.stopPropagation()}
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

            <ul className="flex flex-col gap-5 mt-4 px-6 py-7.5">
              <li>
                <Link
                  to="/layout/payment-history"
                  onClick={closeDropdown}
                  className="flex items-center gap-3.5 text-[#005D68] font-semibold"
                >
                  <TfiWallet size={18} />
                  Payment History
                </Link>
              </li>

              <li>
                <Link
                  to="/layout/settings"
                  onClick={closeDropdown}
                  className="flex items-center gap-3.5 text-[#005D68] font-semibold"
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
                    className="flex items-center gap-3.5 text-[#005D68] font-semibold"
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
              className="flex items-center gap-3.5 mt-7 px-6 text-[#BB8232] font-semibold"
            >
              <LiaSignOutAltSolid size={18} />
              Sign Out
            </button>
          </div>,
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
