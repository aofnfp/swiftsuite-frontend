import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MdAutoAwesome, MdClose } from "react-icons/md";
import { toast } from "sonner";
import axiosInstance from "../utils/axiosInstance";

export const formatCost = (usd) => {
  if (typeof usd !== "number" || Number.isNaN(usd)) return "$0.00";
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(3)}`;
};

// Cold-start prompt: opens only when the admin clicks "Draft with AI" on
// an empty body. Single-line topic input, then we generate and inject the
// returned HTML into the body via onDrafted.
const DraftWithAIPrompt = ({
  isOpen,
  onClose,
  archetype,
  length,
  form,
  onDrafted,
}) => {
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTopic("");
      setBusy(false);
      // Autofocus the topic input on open.
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const generate = async () => {
    setBusy(true);
    try {
      const res = await axiosInstance.post("/api/v2/notifications/draft-with-ai/", {
        archetype,
        length,
        intent: topic.trim(),
        header: form.header || "",
        category: form.category || "",
        recipients: form.recipients || [],
        // current_body intentionally omitted — this is the cold-start path.
      });
      const html = res.data?.html || "";
      const cost = res.data?.cache_hit
        ? "cached · $0.00"
        : formatCost(res.data?.cost_usd || 0);
      onDrafted(html);
      toast.success(`Draft generated · ${cost}`);
      onClose();
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.message || "Unknown error";
      toast.error(`AI draft failed: ${detail}`);
    } finally {
      setBusy(false);
    }
  };

  const onKeyDown = (e) => {
    // Cmd/Ctrl + Enter submits.
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!busy) generate();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <MdAutoAwesome className="text-[#027840] text-xl" />
            <h3 className="font-semibold text-gray-800">Draft with AI</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-gray-600">
            What's this notification about? We'll use the Header, Category, and Recipients you've already filled in.
          </p>
          <input
            ref={inputRef}
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="e.g. eBay's API is down due to a DNS issue"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#027840]"
          />
          <p className="text-[11px] text-gray-400">
            Tip: ⌘/Ctrl+Enter to generate
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={generate}
            disabled={busy}
            className="px-4 py-2 text-sm bg-[#027840] text-white rounded-md hover:bg-[#089451] disabled:opacity-50 flex items-center gap-2"
          >
            {busy && (
              <span className="inline-block h-3 w-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {busy ? "Generating..." : "Generate"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DraftWithAIPrompt;
