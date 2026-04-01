import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";
import { Icon } from "@iconify/react";
import axios from "axios";
import NotificationDetailDrawer from "./NotificationDetailDrawer";

const NotificationDrawer = ({ onClose }) => {
  const [headerTop, setHeaderTop] = useState(90);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const [vw, setVw] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const updateHeaderTop = () => {
      const header = document.getElementById("app-header");
      const top = header ? Math.ceil(header.getBoundingClientRect().bottom) : 90;
      setHeaderTop(top);
    };

    const updateVw = () => setVw(window.innerWidth);

    updateHeaderTop();
    updateVw();

    window.addEventListener("resize", updateHeaderTop);
    window.addEventListener("resize", updateVw);
    window.addEventListener("scroll", updateHeaderTop, true);

    return () => {
      window.removeEventListener("resize", updateHeaderTop);
      window.removeEventListener("resize", updateVw);
      window.removeEventListener("scroll", updateHeaderTop, true);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setNotifications([]);
          return;
        }

        const res = await axios.get(
          "https://service.swiftsuite.app/api/v2/notifications/",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setNotifications(res.data?.results || []);
      } catch (err) {
        console.error(err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const isMobile = vw < 640;
  const drawerW = useMemo(() => (isMobile ? vw : 400), [isMobile, vw]);
  const detailW = useMemo(() => (isMobile ? vw : 560), [isMobile, vw]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `https://service.swiftsuite.app/api/v2/notifications/${id}/read/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );

      setSelectedNotification((prev) =>
        prev?.id === id ? { ...prev, read: true } : prev
      );

      setOpenDropdownId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const closeDropdown = () => setOpenDropdownId(null);

  const openDetail = (n) => setSelectedNotification(n);
  const closeDetail = () => setSelectedNotification(null);

  return (
    <>
      <motion.div
        style={{ top: headerTop, left: 0, right: 0, bottom: 0, position: "fixed" }}
        className="bg-black/50 z-[55]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {!isMobile && (
        <NotificationDetailDrawer
          isOpen={!!selectedNotification}
          headerTop={headerTop}
          rightOffset={drawerW}
          width={detailW}
          notification={selectedNotification}
          onCloseDetail={closeDetail}
          onMarkAsRead={markAsRead}
        />
      )}

      <motion.div
        style={{
          top: headerTop,
          right: 0,
          position: "fixed",
          height: `calc(100vh - ${headerTop}px)`,
          width: drawerW,
        }}
        className="bg-white shadow-lg z-[60] overflow-hidden"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.28 }}
        onClick={(e) => {
          e.stopPropagation();
          closeDropdown();
        }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-[18px] font-semibold">Notifications</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="block lg:hidden"
          >
            <MdClose size={22} />
          </button>
        </div>

        <div className="py-4 space-y-3 overflow-y-auto transparent-scroll h-[calc(100%-64px)]">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-3 animate-pulse border-b">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))
          ) : notifications.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              No notifications found.
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`relative flex items-start gap-3 p-4 cursor-pointer transition
                  ${n.read ? "bg-white" : "bg-[#E6F4EC] hover:bg-[#DFF1E7]"}
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdownId(null);
                  openDetail(n);
                }}
              >
                {!n.read && (
                  <span className="absolute left-0 top-0 h-full w-1" />
                )}

                <div className="bg-[#D9D9D9] w-10 h-10 rounded-full flex justify-center items-center">
                  <Icon
                    icon="iconamoon:profile"
                    className="text-[#00000099] text-2xl"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-gray-800 line-clamp-1">
                    {n.title}
                  </p>

                  <div
                    className="text-sm text-gray-600 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: n.message }}
                  />

                  <div className="text-sm text-[#02784099] mt-1">
                    {formatTime(n.sent_at)}
                  </div>
                </div>

                <div
                  className="absolute top-2 right-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === n.id ? null : n.id);
                    }}
                    className="text-black font-bold text-lg px-2 py-1 hover:bg-gray-100 rounded"
                  >
                    ...
                  </button>

                  {openDropdownId === n.id && (
                    <div className="absolute right-0 mt-2 w-32 border border-gray-200 bg-white rounded-md shadow-lg z-[70]">
                      {!n.read ? (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(n.id);
                          }}
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-700 transition-all duration-150"
                        >
                          Mark as Read
                        </div>
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
                          Already Read
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {isMobile && (
        <NotificationDetailDrawer
          isOpen={!!selectedNotification}
          headerTop={headerTop}
          rightOffset={0}
          width={detailW}
          notification={selectedNotification}
          onCloseDetail={closeDetail}
          onMarkAsRead={markAsRead}
        />
      )}
    </>
  );
};

export default NotificationDrawer;
