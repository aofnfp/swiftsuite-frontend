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

/* ── inject small-screen styles once ── */
if (typeof document !== "undefined" && !document.getElementById("du-sm-styles")) {
  const s = document.createElement("style");
  s.id = "du-sm-styles";
  s.textContent = `
    @keyframes du-panel-in {
      from { opacity: 0; transform: translateY(-12px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes du-item-in {
      from { opacity: 0; transform: translateX(10px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .du-sm-panel {
      animation: du-panel-in 0.22s cubic-bezier(0.16,1,0.3,1) both;
    }
    .du-sm-item { animation: du-item-in 0.18s cubic-bezier(0.16,1,0.3,1) both; }
    .du-sm-item:nth-child(1) { animation-delay: 0.04s; }
    .du-sm-item:nth-child(2) { animation-delay: 0.08s; }
    .du-sm-item:nth-child(3) { animation-delay: 0.12s; }

    .du-sm-link {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 12px; border-radius: 10px;
      font-size: 14px; font-weight: 600; color: #1a2e20;
      text-decoration: none;
      transition: background 0.14s, color 0.14s, transform 0.14s;
    }
    .du-sm-link:hover { background: #edf7f1; color: #027840; transform: translateX(3px); }
    .du-sm-link .du-sm-icon {
      width: 34px; height: 34px; border-radius: 9px;
      background: #f0faf3;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.14s;
    }
    .du-sm-link:hover .du-sm-icon { background: #c6e8d1; }

    .du-sm-btn {
      display: flex; align-items: center; gap: 12px;
      width: 100%; padding: 11px 12px; border-radius: 10px;
      background: none; border: none; cursor: pointer;
      font-size: 14px; font-weight: 600; color: #BB8232;
      text-align: left;
      transition: background 0.14s, color 0.14s, transform 0.14s;
    }
    .du-sm-btn:hover { background: #fff4e0; color: #a06820; transform: translateX(3px); }
    .du-sm-btn .du-sm-icon {
      width: 34px; height: 34px; border-radius: 9px;
      background: #fef4e6;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.14s;
    }
    .du-sm-btn:hover .du-sm-icon { background: #fde3b2; }

    .du-sm-admin {
      display: flex; align-items: center; gap: 12px;
      width: 100%; padding: 11px 12px; border-radius: 10px;
      background: none; border: none; cursor: pointer;
      font-size: 14px; font-weight: 600; color: #1a2e20;
      text-align: left;
      transition: background 0.14s, color 0.14s, transform 0.14s;
    }
    .du-sm-admin:hover { background: #edf7f1; color: #027840; transform: translateX(3px); }
    .du-sm-admin .du-sm-icon {
      width: 34px; height: 34px; border-radius: 9px;
      background: #f0faf3;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.14s;
    }
    .du-sm-admin:hover .du-sm-icon { background: #c6e8d1; }
  `;
  document.head.appendChild(s);
}

const DropdownUser = () => {
  const navigate = useNavigate();
  const isAdmin = useSelector((state) => state.permission?.isAdmin);
  const [fullName, setFullName] = useState(localStorage.getItem("fullName") || "");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  // true when viewport < 1024px (Tailwind's lg breakpoint)
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );

  const trigger = useRef(null);
  const dropdown = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  /* track breakpoint */
  useEffect(() => {
    const check = () => setIsSmallScreen(window.innerWidth < 1024);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* profile updates */
  useEffect(() => {
    const handle = () => setFullName(localStorage.getItem("fullName") || "");
    window.addEventListener("profile-updated", handle);
    window.addEventListener("storage", handle);
    return () => {
      window.removeEventListener("profile-updated", handle);
      window.removeEventListener("storage", handle);
    };
  }, []);

  /* large-screen only: position relative to trigger (original logic) */
  useEffect(() => {
    if (!dropdownOpen || !trigger.current || isSmallScreen) return;

    const updatePosition = () => {
      const rect = trigger.current.getBoundingClientRect();
      let left = rect.right - DROPDOWN_WIDTH;
      if (left < 8) left = rect.left;
      if (left + DROPDOWN_WIDTH > window.innerWidth - 8)
        left = Math.max(8, window.innerWidth - DROPDOWN_WIDTH - 8);
      setPos({ top: rect.bottom, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [dropdownOpen, isSmallScreen]);

  /* close on outside click / escape */
  useEffect(() => {
    if (!dropdownOpen) return;
    const onClickOutside = (e) => {
      if (
        dropdown.current && !dropdown.current.contains(e.target) &&
        trigger.current && !trigger.current.contains(e.target)
      ) setDropdownOpen(false);
    };
    const onEscape = (e) => { if (e.key === "Escape") setDropdownOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [dropdownOpen]);

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);
  const openSignOutModal = () => { setDropdownOpen(false); setIsSignOutModalOpen(true); };
  const closeSignOutModal = () => setIsSignOutModalOpen(false);
  const handleSignOut = useCallback(() => {
    localStorage.clear();
    closeSignOutModal();
    navigate("/signin");
  }, [navigate]);

  /* ─────────────────────────────────────────
     SMALL-SCREEN PANEL
     Uses: position fixed, top + right (not left).
     This guarantees true top-right anchoring
     regardless of scroll, sidebar, or layout.
  ───────────────────────────────────────── */
  const SmallScreenPanel = () => (
    <div
      ref={dropdown}
      className="du-sm-panel"
      style={{
        position: "fixed",
        top: 68,
        right: 12,           // ← right, not left
        width: Math.min(DROPDOWN_WIDTH, window.innerWidth - 24),
        zIndex: 100000,
        background: "#fff",
        borderRadius: 18,
        boxShadow:
          "0 12px 48px rgba(2,120,64,0.16), 0 2px 14px rgba(0,0,0,0.1)",
        border: "1px solid rgba(2,120,64,0.13)",
        overflow: "hidden",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── Green header ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #027840 0%, #03a856 100%)",
          padding: "16px 16px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative blobs */}
        <div style={{
          position: "absolute", top: -18, right: -18,
          width: 72, height: 72, borderRadius: "50%",
          background: "rgba(255,255,255,0.09)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -12, left: 50,
          width: 46, height: 46, borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: 11, position: "relative" }}>
          {/* avatar */}
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.5)",
            overflow: "hidden", flexShrink: 0,
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Profileimage />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              margin: 0, fontSize: 14, fontWeight: 800, color: "#fff",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {fullName || "User"}
            </p>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              marginTop: 3, fontSize: 11, fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              background: "rgba(255,255,255,0.18)",
              padding: "2px 8px", borderRadius: 20,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#7effa0", display: "inline-block",
              }} />
              Vendor
            </span>
          </div>

          {/* close × */}
          <button
            onClick={closeDropdown}
            type="button"
            aria-label="Close"
            style={{
              background: "rgba(255,255,255,0.2)", border: "none",
              borderRadius: 8, width: 28, height: 28, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#fff", fontSize: 18, lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* ── Nav links ── */}
      <div style={{ padding: "10px 10px 4px" }}>
        <ul style={{
          listStyle: "none", margin: 0, padding: 0,
          display: "flex", flexDirection: "column", gap: 2,
        }}>
          <li className="du-sm-item">
            <Link to="/layout/payment-history" onClick={closeDropdown} className="du-sm-link">
              <span className="du-sm-icon"><TfiWallet size={15} /></span>
              Payment History
            </Link>
          </li>
          <li className="du-sm-item">
            <Link to="/layout/settings" onClick={closeDropdown} className="du-sm-link">
              <span className="du-sm-icon"><MdOutlineSettings size={16} /></span>
              Settings
            </Link>
          </li>
          {isAdmin && (
            <li className="du-sm-item">
              <button
                type="button"
                className="du-sm-admin"
                onClick={() => { closeDropdown(); window.location.href = "/admin_layout"; }}
              >
                <span className="du-sm-icon"><GrUserAdmin size={15} /></span>
                Admin
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* divider */}
      <div style={{
        height: 1,
        background: "linear-gradient(90deg,transparent,#ddeee4,transparent)",
        margin: "4px 0",
      }} />

      {/* ── Sign out ── */}
      <div style={{ padding: "4px 10px 12px" }}>
        <button type="button" onClick={openSignOutModal} className="du-sm-btn">
          <span className="du-sm-icon"><LiaSignOutAltSolid size={16} /></span>
          Sign Out
        </button>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────
     LARGE-SCREEN PANEL  ← 100% original code
  ───────────────────────────────────────── */
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
              onClick={() => { closeDropdown(); window.location.href = "/admin_layout"; }}
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
    </div>
  );

  /* ── render ── */
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