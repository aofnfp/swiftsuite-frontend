import React, { useEffect, useRef, useState } from "react";
import { MdClose, MdOutlineChat, MdInsertDriveFile } from "react-icons/md";

const SupportModal = ({ isOpen, ticket, onClose, onOpenChats }) => {
  const modalCardRef = useRef(null);
  const [activeTab, setActiveTab] = useState("issue");

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab("issue");
  }, [isOpen, ticket?.id]);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    const onDown = (e) => {
      if (modalCardRef.current && !modalCardRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !ticket) return null;

  const formatTimestamp = (iso) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const statusPill = (status) => {
    const base =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border w-fit capitalize";
    if (status === "pending")
      return `${base} bg-yellow-50 text-yellow-700 border-yellow-200`;
    if (status === "closed")
      return `${base} bg-emerald-50 text-emerald-700 border-emerald-200`;
    if (status === "flagged")
      return `${base} bg-red-50 text-red-700 border-red-200`;
    return `${base} bg-gray-50 text-gray-700 border-gray-200`;
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" />

      <div
        ref={modalCardRef}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Ticket ID</p>
            <h3 className="text-lg font-bold">{ticket.id}</h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenChats?.(ticket)}
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-50"
              aria-label="Open chats drawer"
              title="Open chats"
            >
              <MdOutlineChat className="text-xl text-gray-700" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-50"
              aria-label="Close"
              title="Close"
            >
              <MdClose className="text-xl text-gray-700" />
            </button>
          </div>
        </div>

        <div className="border-t" />

        <div className="px-6 py-4 flex justify-center">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("issue")}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                activeTab === "issue"
                  ? "bg-[#027840] text-white border-[#027840]"
                  : "hover:bg-gray-50"
              }`}
            >
              Reported issue
            </button>

            <button
              onClick={() => setActiveTab("evidence")}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                activeTab === "evidence"
                  ? "bg-[#027840] text-white border-[#027840]"
                  : "hover:bg-gray-50"
              }`}
            >
              Supporting evidence
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          {activeTab === "issue" ? (
            <div className="border rounded-xl p-4 bg-gray-50">
              <div className="flex items-start gap-3">
                <img
                  src={ticket.avatar}
                  alt={ticket.complainant}
                  className="w-10 h-10 rounded-full border bg-white"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-gray-900">
                      {ticket.complainant}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(ticket.timestamp)}
                    </p>
                  </div>

                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {ticket.message || "No message provided."}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      Type: <span className="font-medium">{ticket.type}</span>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className={statusPill(ticket.status)}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-xl p-4 bg-white">
              {ticket.evidence?.length ? (
                <div className="space-y-3">
                  {ticket.evidence.map((ev, idx) => (
                    <div
                      key={`${ticket.id}-ev-${idx}`}
                      className="border rounded-xl p-3 flex items-center gap-3"
                    >
                      {ev.kind === "image" ? (
                        <img
                          src={ev.url}
                          alt={ev.name}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg border flex items-center justify-center bg-gray-50">
                          <MdInsertDriveFile className="text-2xl text-gray-700" />
                        </div>
                      )}

                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">
                          {ev.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {ev.kind === "image"
                            ? "Image evidence"
                            : "File evidence"}
                        </p>
                      </div>

                      <button
                        onClick={() => console.log("Open evidence:", ev)}
                        className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
                      >
                        Open
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  No supporting evidence uploaded for this ticket.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
