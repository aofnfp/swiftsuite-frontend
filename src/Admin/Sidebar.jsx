import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  Shield,
  Bell,
  LifeBuoy,
  Settings,
} from "lucide-react";
import { HiUsers } from "react-icons/hi";
import { PiShoppingCartSimpleFill, PiArrowArcLeftBold } from "react-icons/pi";

import logo from "../Images/swiftlogo11.png";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin_layout", icon: LayoutDashboard },
    { name: "Vendors", path: "/admin_layout/vendor", icon: PiShoppingCartSimpleFill },
    { name: "Finance", path: "/admin_layout/finance", icon: Wallet },
    { name: "Users", path: "/admin_layout/users", icon: HiUsers },
    { name: "Reports and Analytics", path: "/admin_layout/report_analytics", icon: BarChart3 },
    { name: "Admin Management", path: "/admin_layout/management", icon: Shield },
    { name: "Notifications", path: "/admin_layout/notification", icon: Bell },
    { name: "Support", path: "/admin_layout/support", icon: LifeBuoy },
    { name: "Settings", path: "/admin_layout/settings", icon: Settings },
    { name: "Back to App", path: "/layout/home", icon: PiArrowArcLeftBold },
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#027840] text-white">
        <button
          onClick={() => setOpen(true)}
          className="text-2xl focus:outline-none"
        >
          ☰
        </button>
        <img src={logo} alt="Logo" className="h-8" />
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 z-50 h-screen w-64 bg-[#027840] text-white
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
      >
        <div className="px-6 py-6 border-b border-white/10 shrink-0">
          <img
            src={logo}
            alt="Logo"
            className="w-36 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          />
        </div>

        <nav className="py-4 flex-1 overflow-y-auto sidebar-scroll">
          {links.map((link) => {
            const Icon = link.icon;

            const isActive =
              location.pathname === link.path ||
              (link.name === "Vendors" &&
                (location.pathname.startsWith("/admin_layout/vendor") ||
                  location.pathname.startsWith("/admin_layout/newvendor")));

            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-6 mx-4 my-2 py-3 rounded-lg text-sm transition-all
                  ${
                    isActive
                      ? "bg-green-900 text-white"
                      : "text-gray-300 hover:bg-green-900 hover:text-white"
                  }`}
              >
                <Icon size={18} className="font-bold" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="md:hidden h-14" />
    </>
  );
};

export default Sidebar;
