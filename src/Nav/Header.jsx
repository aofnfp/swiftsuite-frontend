import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/Dashboard";
import { MdMenu } from "react-icons/md";
import DropdownUser from "./DropdownUser";
import { VscBell } from "react-icons/vsc";
import { PiChats } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logo from "../Images/mainlogo.svg";
import NotificationDrawer from "./NotificationDrawer";
import ChatDrawer from "./ChatDrawer";
import axios from "axios";

const Header = () => {
  const { toggleSideBar, sideBarOpen, setSideBarOpen, isTablet } =
    useContext(AppContext);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const headerRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setSideBarOpen(!isTablet);
  }, [isTablet, setSideBarOpen]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "https://service.swiftsuite.app/api/v2/notifications/unread_count/",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const unreadCount = res?.data?.unread_count ?? 0;
        setHasNewNotification(unreadCount > 0);
      } catch (error) {
        console.error("Failed to fetch unread notifications", error);
      }
    };

    fetchUnreadCount();
  }, []);

  useEffect(() => {
    setShowNotifications(false);
    setShowChats(false);
  }, [pathname]);

  const toggleNotifications = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNotifications((prev) => {
      const next = !prev;
      if (next) setShowChats(false);
      return next;
    });
  };

  const toggleChats = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowChats((prev) => {
      const next = !prev;
      if (next) setShowNotifications(false);
      return next;
    });
  };

  return (
    <>
      <motion.header
        id="app-header"
        ref={headerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={[
          "fixed top-0 left-0 right-0 w-screen z-[10] bg-white flex items-center justify-between",
          "px-4 md:px-10 py-5 lg:px-5 lg:py-0",
          !sideBarOpen ? "lg:ms-[65px] shadow-sm" : "border-b-1",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-5">
          <button
            type="button"
            className="flex items-center justify-between lg:hidden cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleSideBar();
            }}
            aria-label="Open menu"
          >
            <MdMenu size={25} />
          </button>

          <div className="w-[160px] lg:block hidden">
            <Link to="/">
              <img src={logo} alt="Logo" className="w-[196px] h-[88.2px]" />
            </Link>
          </div>
        </div>

        <div className="flex items-center md:gap-5">
          <div className="flex items-center md:gap-8 gap-4">
            <button
              type="button"
              onClick={toggleNotifications}
              className="relative focus:outline-none active:outline-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
              aria-label="Notifications"
            >
              <VscBell
                size={22}
                className={`transition-all duration-300 ${
                  showNotifications ? "text-[#027840]" : "text-gray-700"
                }`}
              />
              {hasNewNotification && (
                <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-[#D72326] rounded-full ring-2 ring-white" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleChats}
              className="relative focus:outline-none active:outline-none bg-[#E0F5E3] p-2 rounded-full"
              aria-label="Chats"
            >
              <PiChats
                size={22}
                className={`transition-all duration-300 ${
                  showChats ? "text-[#BB8232]" : "text-gray-700"
                }`}
              />
            </button>

            <DropdownUser />
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {showNotifications && (
          <NotificationDrawer onClose={() => setShowNotifications(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChats && <ChatDrawer onClose={() => setShowChats(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Header;
