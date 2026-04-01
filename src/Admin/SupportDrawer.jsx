import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";
import { IoIosSend } from "react-icons/io";

const SupportDrawer = ({
  isOpen,
  ticket,
  onClose,
  headerTop = 0,
  rightOffset = 0,
  width = 560,
  height = "50vh",
}) => {
  const [message, setMessage] = useState("");

  const chat = useMemo(() => {
    if (!ticket) return null;
    return {
      id: `${ticket.id}-main`,
      name: ticket.complainant || "Chat",
      messages: [
        {
          id: `${ticket.id}-m1`,
          from: "user",
          text: ticket.message || "No message provided.",
          time: new Date(ticket.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        {
          id: `${ticket.id}-m2`,
          from: "me",
          text: "Thanks for reaching out. We’re looking into this now.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    };
  }, [ticket]);

  useEffect(() => {
    if (!isOpen) setMessage("");
  }, [isOpen]);

  useEffect(() => {
    setMessage("");
  }, [ticket?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!ticket || !chat) return null;

  const initials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[84] bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            style={{
              top: headerTop,
              right: rightOffset,
              position: "fixed",
              width,
              height,
              willChange: "transform",
              overflow: "hidden",
              borderRadius: 0,
            }}
            className="bg-white z-[90] flex flex-col border-l border-b shadow-2xl"
            initial={{ x: width }}
            animate={{ x: 0 }}
            exit={{ x: width }}
            transition={{ type: "tween", duration: 0.28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 py-6 border-b flex items-center justify-between bg-[#027840]">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-none text-[#027840] bg-white flex items-center justify-center font-semibold">
                  {initials(chat.name)}
                </div>

                <div className="min-w-0">
                  <div className="font-semibold text-white truncate max-w-[360px]">
                    {chat.name}
                  </div>
                  <div className="text-xs text-white/80 truncate max-w-[360px]">
                    {ticket.id}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center hover:bg-white/10"
                aria-label="Close"
                title="Close"
              >
                <MdClose className="text-white text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
              {(chat.messages || []).map((m) => {
                const isMe = m.from === "me";
                return (
                  <div
                    key={m.id}
                    className={`w-full flex ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[78%] px-5 py-3 text-sm border ${
                        isMe
                          ? "bg-[#027840] text-white border-[#027840]"
                          : "bg-gray-100 text-gray-900 border-gray-200"
                      }`}
                    >
                      <div>{m.text}</div>
                      <div
                        className={`text-[11px] mt-2 ${
                          isMe ? "text-white/70" : "text-gray-500"
                        }`}
                      >
                        {m.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-8 py-6 border-t">
              <div className="relative">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Type a message…"
                />

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent active:scale-95 transition"
                  aria-label="Send message"
                  title="Send"
                >
                  <IoIosSend className="text-gray-700 text-2xl" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SupportDrawer;
