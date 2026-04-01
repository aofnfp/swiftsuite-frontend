import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ChatDetailDrawer from "./ChatDetailDrawer";
import { FaXmark } from "react-icons/fa6";

const ChatDrawer = ({ onClose }) => {
  const [headerTop, setHeaderTop] = useState(90);
  const [activeTab, setActiveTab] = useState("users");
  const [selectedChat, setSelectedChat] = useState(null);
  const [vw, setVw] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const updateHeaderTop = () => {
      const header = document.getElementById("app-header");
      const top = header
        ? Math.ceil(header.getBoundingClientRect().bottom)
        : 90;
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

  const isMobile = vw < 640;

  const drawerW = useMemo(() => (isMobile ? vw : 400), [isMobile, vw]);
  const detailW = useMemo(() => (isMobile ? vw : 560), [isMobile, vw]);

  const usersChats = useMemo(
    () => [
      {
        id: "u1",
        name: "Daniel Mensah",
        lastMessage: "Bro, did you see the update?",
        time: "10:42 AM",
        messages: [
          { id: 1, from: "them", text: "Hey! You around?", time: "10:01 AM" },
          { id: 2, from: "me", text: "Yeah, what’s up?", time: "10:02 AM" },
          { id: 3, from: "them", text: "Bro, did you see the update?", time: "10:42 AM" },
        ],
      },
      {
        id: "u2",
        name: "Aisha Bello",
        lastMessage: "Okay noted. I’ll send it soon.",
        time: "Yesterday",
        messages: [
          { id: 1, from: "me", text: "Did you get the file?", time: "6:10 PM" },
          { id: 2, from: "them", text: "Not yet, checking now.", time: "6:12 PM" },
          { id: 3, from: "them", text: "Okay noted. I’ll send it soon.", time: "6:40 PM" },
        ],
      },
    ],
    []
  );

  const supportChats = useMemo(
    () => [
      {
        id: "s1",
        name: "Swiftsuite Customer Support",
        lastMessage: "Thanks, we’re looking into it.",
        time: "2:15 PM",
        messages: [
          { id: 1, from: "me", text: "Hi, I’m having an issue with my account.", time: "2:10 PM" },
          { id: 2, from: "them", text: "Hello! Can you describe what’s happening?", time: "2:12 PM" },
          { id: 3, from: "me", text: "My notifications aren’t updating.", time: "2:13 PM" },
          { id: 4, from: "them", text: "Thanks, we’re looking into it.", time: "2:15 PM" },
        ],
      },
    ],
    []
  );

  const list = activeTab === "users" ? usersChats : supportChats;

  const openChat = (chat) => setSelectedChat(chat);
  const closeChat = () => setSelectedChat(null);

  useEffect(() => {
    setSelectedChat(null);
  }, [activeTab]);

  const handleClose = () => {
    if (selectedChat) {
      setSelectedChat(null);
      setTimeout(() => {
        onClose();
      }, 280);
    } else {
      onClose();
    }
  };

  return (
    <>
      <motion.div
        style={{ top: headerTop, left: 0, right: 0, bottom: 0, position: "fixed" }}
        className="bg-black/50 z-[55]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      />

      {!isMobile && (
        <ChatDetailDrawer
          isOpen={!!selectedChat}
          headerTop={headerTop}
          rightOffset={drawerW}
          width={detailW}
          chat={selectedChat}
          onBack={closeChat}
          onClose={handleClose}
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
        className="bg-white shadow-lg z-[60] flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-5 flex items-center justify-between">
          <div className="font-semibold text-gray-900">Messages</div>
          <button onClick={handleClose} className="text-sm px-3 py-1 rounded-md hover:bg-gray-50">
            <FaXmark />
          </button>
        </div>

        <div className="px-4 pt-3">
          <div className="rounded-xl p-1 flex">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 text-sm py-2 rounded-[20px] ${
                activeTab === "users" ? "bg-[#027840] text-white" : "text-gray-600"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("support")}
              className={`flex-1 text-sm py-2 rounded-[20px] ${
                activeTab === "support" ? "bg-[#027840] text-white" : "text-gray-600"
              }`}
            >
              Customer Support
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3">
          {list.map((c) => (
            <button
              key={c.id}
              onClick={() => openChat(c)}
              className="w-full text-left px-3 py-3 rounded-xl hover:bg-gray-50 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-[5px] text-white bg-[#027840] flex items-center justify-center font-semibold">
                {c.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-gray-900 truncate">{c.name}</div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">{c.time}</div>
                </div>
                <div className="text-sm text-gray-600 truncate">{c.lastMessage}</div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {isMobile && (
        <ChatDetailDrawer
          isOpen={!!selectedChat}
          headerTop={headerTop}
          rightOffset={0}
          width={detailW}
          chat={selectedChat}
          onBack={closeChat}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default ChatDrawer;

