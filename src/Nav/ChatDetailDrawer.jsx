

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosSend } from "react-icons/io";

const ChatDetailDrawer = ({
  isOpen,
  headerTop = 90,
  rightOffset = 400,
  width = 560,
  chat,
}) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isOpen) setMessage("");
  }, [isOpen]);

  useEffect(() => {
    setMessage("");
  }, [chat?.id]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  return (
    <AnimatePresence>
      {isOpen && chat && (
        <motion.div
          style={{
            top: headerTop,
            right: rightOffset,
            position: "fixed",
            height: `calc(100vh - ${headerTop}px)`,
            width,
          }}
          className="bg-white z-[58] flex flex-col"
          initial={{ x: width + 40 }}
          animate={{ x: 0 }}
          exit={{ x: width + 40 }}
          transition={{ duration: 0.28 }}
        >
          <div className="px-4 py-4 border-b flex items-center gap-3 bg-[#027840] text-white">
            <div className="w-10 h-10 rounded bg-white text-[#027840] flex items-center justify-center font-semibold">
              {chat.name
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="font-semibold truncate">{chat.name}</div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {chat.messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    m.from === "me" ? "bg-[#027840] text-white" : "bg-gray-100"
                  }`}
                >
                  <div>{m.text}</div>
                  <div className="text-[11px] mt-1 opacity-70">{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3">
            <div className="relative">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-xl pl-3 pr-10 py-2 text-sm"
                placeholder="Type a message…"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <IoIosSend />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatDetailDrawer;