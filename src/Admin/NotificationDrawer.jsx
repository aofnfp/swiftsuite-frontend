import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdClose, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";

const TYPE_OPTIONS = [
  { label: "Email", value: "email" },
  { label: "In App", value: "in_app" },
];

const RECIPIENT_OPTIONS = [
  { label: "All Users", value: "all_users" },
  { label: "Team Admin", value: "team_admins" },
  { label: "Subaccount", value: "subaccounts" },
];

const TIMING_OPTIONS = [
  { label: "Send Immediately", value: "immediately" },
  { label: "Recurring", value: "recurring" },
  { label: "Custom", value: "custom" },
];

const FREQUENCY_OPTIONS = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const EMPTY_FORM = {
  types: [],
  recipients: [],
  category: "",
  header: "",
  body: "",
  trigger_type: "immediately",
  date: "",
  time: "",
  recurring_frequency: "",
  recurring_interval: 1,
  recurring_start: "",
  recurring_end: "",
};

const NotificationDrawer = ({ isOpen, onClose, notification, onSaved }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOpenDropdown(null);
    if (notification) setForm({ ...EMPTY_FORM, ...notification });
    else setForm(EMPTY_FORM);
  }, [notification, isOpen]);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const toggleArray = (key, value) => setForm(prev => ({
    ...prev,
    [key]: prev[key].includes(value) ? prev[key].filter(v => v !== value) : [...prev[key], value],
  }));

  const handleTriggerChange = (value) => {
    update("trigger_type", value);
    if (value !== "custom") { update("date", ""); update("time", ""); }
    if (value !== "recurring") { update("recurring_frequency", ""); update("recurring_start", ""); update("recurring_end", ""); update("recurring_interval", 1); }
  };

  const submit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        ...form,
        date: form.trigger_type === "custom" ? form.date : null,
        time: form.trigger_type === "custom" ? form.time : null,
        recurring_frequency: form.trigger_type === "recurring" ? form.recurring_frequency : null,
        recurring_start: form.trigger_type === "recurring" ? form.recurring_start : null,
        recurring_end: form.trigger_type === "recurring" ? form.recurring_end : null,
        recurring_interval: form.trigger_type === "recurring" ? form.recurring_interval : null,
      };

      const response = notification
        ? await axios.put(
            `https://service.swiftsuite.app/api/v2/templates/${notification.id}/`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        : await axios.post(
            "https://service.swiftsuite.app/api/v2/templates/",
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );

      toast.success(notification ? "Notification updated successfully" : "Notification created successfully");
      onSaved(response.data, !!notification);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-[460px] bg-white z-50 p-6 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{notification ? "Edit Notification" : "Create Notification"}</h2>
              <button onClick={onClose}><MdClose size={24} /></button>
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold mb-2 block">Type</label>
              <div className="grid grid-cols-2 gap-4">
                {TYPE_OPTIONS.map(t => (
                  <label key={t.value} className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.types.includes(t.value)}
                      onChange={() => toggleArray("types", t.value)}
                      className="w-5 h-5 appearance-none border-2 border-[#027840] rounded checked:bg-[#027840]"
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold mb-2 block">Recipients</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {RECIPIENT_OPTIONS.map(r => (
                  <label key={r.value} className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.recipients.includes(r.value)}
                      onChange={() => toggleArray("recipients", r.value)}
                      className="w-5 h-5 appearance-none border-2 border-[#027840] rounded checked:bg-[#027840]"
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-semibold block mb-1">Category</label>
              <input
                value={form.category}
                onChange={e => update("category", e.target.value)}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-[#027840]"
              />
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold block mb-1">Header</label>
              <input
                value={form.header}
                onChange={e => update("header", e.target.value)}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-[#027840]"
              />
            </div>

            <div className="mb-8">
              <label className="text-sm font-semibold block mb-1">Body</label>
              <textarea
                rows={4}
                value={form.body}
                onChange={e => update("body", e.target.value)}
                className="w-full border px-3 py-2 rounded-md resize-none focus:ring-2 focus:ring-[#027840]"
              />
            </div>

            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <label className="text-sm font-semibold block mb-1">Timing</label>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === "trigger" ? null : "trigger")}
                    className="w-full border px-3 py-2 rounded-md flex justify-between items-center text-sm"
                  >
                    {TIMING_OPTIONS.find(t => t.value === form.trigger_type)?.label}
                    {openDropdown === "trigger" ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                  </button>
                  {openDropdown === "trigger" && (
                    <div className="absolute w-full bg-white border rounded-md mt-1 shadow z-10">
                      {TIMING_OPTIONS.map(t => (
                        <div
                          key={t.value}
                          onClick={() => { handleTriggerChange(t.value); setOpenDropdown(null); }}
                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          {t.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {form.trigger_type === "recurring" && (
                  <div className="relative">
                    <label className="text-sm font-semibold block mb-1">Frequency</label>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === "frequency" ? null : "frequency")}
                      className="w-full border px-3 py-2 rounded-md flex justify-between items-center text-sm"
                    >
                      {form.recurring_frequency || "Select frequency"}
                      {openDropdown === "frequency" ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                    </button>
                    {openDropdown === "frequency" && (
                      <div className="absolute w-full bg-white border rounded-md mt-1 shadow z-10">
                        {FREQUENCY_OPTIONS.map(f => (
                          <div
                            key={f.value}
                            onClick={() => { update("recurring_frequency", f.value); setOpenDropdown(null); }}
                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                          >
                            {f.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {form.trigger_type === "custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" value={form.date || ""} onChange={e => update("date", e.target.value)} className="border px-3 py-2 rounded-md" />
                  <input type="time" value={form.time || ""} onChange={e => update("time", e.target.value)} className="border px-3 py-2 rounded-md" />
                </div>
              )}

              {form.trigger_type === "recurring" && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <input type="datetime-local" value={form.recurring_start || ""} onChange={e => update("recurring_start", e.target.value)} className="border px-3 py-2 rounded-md" />
                  <input type="datetime-local" value={form.recurring_end || ""} onChange={e => update("recurring_end", e.target.value)} className="border px-3 py-2 rounded-md" />
                </div>
              )}
            </div>

            <div className="flex justify-center pt-6">
            <button
              onClick={submit}
              disabled={loading}
              className="bg-[#027840] text-white px-16 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z" />
                </svg>
              )}
              {loading ? "Submitting..." : "Next"}
            </button>
          </div>

          </motion.div>
        </>
      )}
      <Toaster position="top-right" />
    </AnimatePresence>
  );
};

export default NotificationDrawer;
