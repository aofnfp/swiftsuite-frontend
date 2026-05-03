import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { MdAutoAwesome, MdClose, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import HtmlEditor from "../components/HtmlEditor/HtmlEditor";

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

const HEADER_MAX = 80;

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

// Hardcoded starter snippets. Click a chip → fields populate, user can edit.
//
// IMPORTANT: the backend wraps every body inside `notification.html`, which
// already provides the "Hello {{first_name}}," greeting at the top and the
// "Best regards, The SwiftSuite Team" sign-off at the bottom. So bodies
// here should contain ONLY the message itself — no greeting, no sign-off.
const QUICK_TEMPLATES = [
  {
    name: "Welcome",
    fill: {
      types: ["email", "in_app"],
      recipients: ["all_users"],
      category: "Onboarding",
      header: "Welcome to SwiftSuite",
      body:
        "<p>Thanks for joining SwiftSuite. We're excited to have you on board.</p><p>If you ever need a hand getting set up, hit reply or message us in-app &mdash; we read every note.</p>",
      trigger_type: "immediately",
    },
  },
  {
    name: "Maintenance",
    fill: {
      types: ["email", "in_app"],
      recipients: ["all_users"],
      category: "Maintenance",
      header: "Scheduled maintenance window",
      body:
        "<p>We'll be performing scheduled maintenance shortly. You may notice brief interruptions during this window.</p><p>Thanks for your patience.</p>",
      trigger_type: "custom",
    },
  },
  {
    name: "Feature update",
    fill: {
      types: ["email", "in_app"],
      recipients: ["all_users"],
      category: "Product update",
      header: "Something new in SwiftSuite",
      body:
        "<p>We just shipped a small improvement we think you'll like. Open the app and have a look around.</p>",
      trigger_type: "immediately",
    },
  },
  {
    name: "Outage notice",
    fill: {
      types: ["email", "in_app"],
      recipients: ["all_users"],
      category: "Incident",
      header: "We're investigating an issue",
      body:
        "<p>We're aware of an issue affecting some users right now and our team is investigating. We'll send a follow-up as soon as it's resolved.</p>",
      trigger_type: "immediately",
    },
  },
];

// Cloudinary URL of the SwiftSuite logo used by the backend email template
// (see `swiftsuite-server/app/templates/notification.html`). Mirroring it in
// the live preview keeps the preview faithful to the delivered email.
const SWIFTSUITE_LOGO =
  "https://res.cloudinary.com/dtmhv0qae/image/upload/v1708637224/swiftsuitemain_narepe.png";

const validate = (form) => {
  const errs = {};
  if (form.types.length === 0) errs.types = "Pick at least one channel.";
  if (form.recipients.length === 0)
    errs.recipients = "Pick at least one recipient group.";
  if (!form.header?.trim()) errs.header = "Header is required.";
  if (form.header && form.header.length > HEADER_MAX)
    errs.header = `Header must be ${HEADER_MAX} characters or fewer.`;
  if (!form.body?.trim()) errs.body = "Body is required.";
  if (form.trigger_type === "custom") {
    if (!form.date) errs.date = "Pick a date.";
    if (!form.time) errs.time = "Pick a time.";
  }
  if (form.trigger_type === "recurring") {
    if (!form.recurring_frequency)
      errs.recurring_frequency = "Pick a frequency.";
    if (!form.recurring_start) errs.recurring_start = "Pick a start time.";
  }
  return errs;
};

const formatDate = (s) => {
  if (!s) return "";
  try {
    return new Date(s).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return s;
  }
};

const buildScheduleSummary = (form) => {
  if (form.trigger_type === "immediately")
    return "Sends immediately on save.";
  if (form.trigger_type === "custom" && form.date && form.time)
    return `Sends on ${formatDate(form.date)} at ${form.time}.`;
  if (
    form.trigger_type === "recurring" &&
    form.recurring_frequency &&
    form.recurring_start
  ) {
    const start = new Date(form.recurring_start);
    const startStr = start.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const timeStr = start.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    let s = `Sends ${form.recurring_frequency} starting ${startStr} at ${timeStr}`;
    if (form.recurring_end) {
      const end = new Date(form.recurring_end);
      s += `, ending ${end.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })}`;
    }
    return s + ".";
  }
  return "Schedule incomplete.";
};

const Section = ({ title, required, children }) => (
  <section className="pb-6 border-b border-gray-100 last:border-b-0">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
      {title}
      {required && (
        <span className="text-red-500 ml-1 normal-case font-normal">*</span>
      )}
    </h3>
    <div className="space-y-4">{children}</div>
  </section>
);

const Checkbox = ({ checked, onChange, children }) => (
  <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
    <span
      className={`relative w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
        checked
          ? "bg-[#027840] border-[#027840]"
          : "bg-white border-gray-300 hover:border-[#027840]"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      {checked && <IoMdCheckmark className="text-white" size={14} />}
    </span>
    <span>{children}</span>
  </label>
);

const FieldError = ({ message }) =>
  message ? <p className="text-xs text-red-600 mt-1">{message}</p> : null;

const RequiredLabel = ({ children, htmlFor, hint }) => (
  <label
    htmlFor={htmlFor}
    className="text-sm font-semibold flex items-center gap-1"
  >
    {children}
    <span className="text-red-500">*</span>
    {hint && (
      <span className="ml-auto text-xs font-normal text-gray-500">{hint}</span>
    )}
  </label>
);

// Strips HTML to plain text for showing the user a "you've drafted N chars"
// hint and for deciding whether to switch the modal to refinement mode.
const htmlToText = (html) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").trim();
};

const formatCost = (usd) => {
  if (typeof usd !== "number" || Number.isNaN(usd)) return "$0.00";
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(3)}`;
};

// Notification archetypes — must match VALID_ARCHETYPES on the backend.
const ARCHETYPE_OPTIONS = [
  { value: "incident",    label: "Incident",    hint: "Active outage / disruption" },
  { value: "maintenance", label: "Maintenance", hint: "Scheduled downtime" },
  { value: "update",      label: "Update",      hint: "Feature release / improvement" },
  { value: "headsup",     label: "Heads-up",    hint: "Short informational note" },
];

const LENGTH_OPTIONS = [
  { value: "short",    label: "Short" },
  { value: "standard", label: "Standard" },
  { value: "detailed", label: "Detailed" },
];

// Default length per archetype (mirrors backend _DEFAULT_LENGTH).
const DEFAULT_LENGTH = {
  incident:    "detailed",
  maintenance: "standard",
  update:      "standard",
  headsup:     "short",
};

// Fuzzy-match the freeform Category field against archetype keywords.
// Returns null if nothing matches; modal then defaults to "headsup".
const inferArchetypeFromCategory = (category) => {
  const c = (category || "").toLowerCase();
  if (!c) return null;
  if (/incident|outage|down|broken|disruption|degrad|failure/.test(c)) return "incident";
  if (/maintenance|scheduled|downtime|window|planned/.test(c)) return "maintenance";
  if (/update|release|feature|launch|new|improvement|product/.test(c)) return "update";
  return null;
};

const DraftWithAIModal = ({ isOpen, onClose, form, onUseDraft }) => {
  const [intent, setIntent] = useState("");
  const [busy, setBusy] = useState(false);
  const [draftHtml, setDraftHtml] = useState("");
  const [costUsd, setCostUsd] = useState(0);
  const [modelUsed, setModelUsed] = useState("");
  const [cacheHit, setCacheHit] = useState(false);
  const [archetype, setArchetype] = useState("headsup");
  const [length, setLength] = useState("short");
  // Tracks whether the admin has manually changed length so an archetype
  // switch doesn't overwrite their choice.
  const [lengthTouched, setLengthTouched] = useState(false);

  // Reset transient state every time the modal opens. Pre-select the
  // archetype from the form's Category field; default length follows
  // the chosen archetype.
  useEffect(() => {
    if (isOpen) {
      setIntent("");
      setBusy(false);
      setDraftHtml("");
      setCostUsd(0);
      setModelUsed("");
      setCacheHit(false);
      const inferred = inferArchetypeFromCategory(form.category) || "headsup";
      setArchetype(inferred);
      setLength(DEFAULT_LENGTH[inferred]);
      setLengthTouched(false);
    }
  }, [isOpen, form.category]);

  const onArchetypeChange = (value) => {
    setArchetype(value);
    if (!lengthTouched) setLength(DEFAULT_LENGTH[value]);
  };

  const onLengthChange = (value) => {
    setLength(value);
    setLengthTouched(true);
  };

  // Refinement source: prefer the most recent AI draft (so users iterate on
  // the AI's previous output); otherwise use what's currently in the form
  // body (so the very first call refines the user's own draft if any).
  const refinementSource = draftHtml || form.body || "";
  const isRefining = htmlToText(refinementSource).length > 0;

  const generate = async () => {
    setBusy(true);
    try {
      const res = await axiosInstance.post("/api/v2/notifications/draft-with-ai/", {
        archetype,
        length,
        intent: intent.trim(),
        header: form.header || "",
        category: form.category || "",
        recipients: form.recipients || [],
        current_body: refinementSource,
      });
      setDraftHtml(res.data?.html || "");
      setCostUsd(res.data?.cost_usd || 0);
      setModelUsed(res.data?.model_used || "");
      setCacheHit(Boolean(res.data?.cache_hit));
      const cost = res.data?.cache_hit
        ? "cached · $0.00"
        : formatCost(res.data?.cost_usd || 0);
      toast.success(`Draft generated · ${cost}`);
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.message || "Unknown error";
      toast.error(`AI draft failed: ${detail}`);
    } finally {
      setBusy(false);
    }
  };

  const useDraft = () => {
    if (!draftHtml) return;
    onUseDraft(draftHtml);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <MdAutoAwesome className="text-[#027840] text-xl" />
            <h3 className="font-semibold text-gray-800">
              {isRefining ? "Refine draft with AI" : "Draft with AI"}
            </h3>
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

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <p className="text-sm text-gray-600">
            {isRefining
              ? "Tell us how to improve the existing draft. We'll use the Header, Category, and Recipients you've already filled in."
              : "Tell us what this notification is about (optional). We'll use the Header, Category, and Recipients you've already filled in."}
          </p>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Type
            </p>
            <div className="flex flex-wrap gap-2">
              {ARCHETYPE_OPTIONS.map((opt) => {
                const active = archetype === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    title={opt.hint}
                    onClick={() => onArchetypeChange(opt.value)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      active
                        ? "bg-[#027840] text-white border-[#027840]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#027840] hover:text-[#027840]"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Length
            </p>
            <div className="flex flex-wrap gap-2">
              {LENGTH_OPTIONS.map((opt) => {
                const active = length === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onLengthChange(opt.value)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      active
                        ? "bg-[#027840] text-white border-[#027840]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#027840] hover:text-[#027840]"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            rows={4}
            placeholder={
              isRefining
                ? "e.g. Make it shorter and more empathetic"
                : "e.g. Maintenance window this Saturday 2-4am UTC"
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#027840]"
          />

          {draftHtml && (
            <div className="border border-gray-200 rounded-md">
              <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50 text-xs text-gray-600">
                <span>Preview</span>
                <span>
                  {modelUsed}
                  {" · "}
                  {cacheHit ? "cached · $0.00" : formatCost(costUsd)}
                </span>
              </div>
              <div
                className="prose prose-sm max-w-none px-4 py-3"
                dangerouslySetInnerHTML={{ __html: draftHtml }}
              />
            </div>
          )}
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
          {draftHtml && (
            <button
              type="button"
              onClick={useDraft}
              disabled={busy}
              className="px-3 py-2 text-sm border border-[#027840] text-[#027840] rounded-md bg-white hover:bg-[#027840] hover:text-white disabled:opacity-50"
            >
              Use this draft
            </button>
          )}
          <button
            type="button"
            onClick={generate}
            disabled={busy}
            className="px-4 py-2 text-sm bg-[#027840] text-white rounded-md hover:bg-[#089451] disabled:opacity-50 flex items-center gap-2"
          >
            {busy && (
              <span className="inline-block h-3 w-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {busy ? "Generating..." : draftHtml ? "Regenerate" : "Generate"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const NotificationDrawer = ({ isOpen, onClose, notification, onSaved }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [view, setView] = useState("form");
  const [aiModalOpen, setAiModalOpen] = useState(false);

  useEffect(() => {
    setOpenDropdown(null);
    setErrors({});
    setView("form");
    if (notification) setForm({ ...EMPTY_FORM, ...notification });
    else setForm(EMPTY_FORM);
  }, [notification, isOpen]);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const toggleArray = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));

  const handleTriggerChange = (value) => {
    setForm((prev) => ({
      ...prev,
      trigger_type: value,
      ...(value !== "custom" ? { date: "", time: "" } : {}),
      ...(value !== "recurring"
        ? {
            recurring_frequency: "",
            recurring_start: "",
            recurring_end: "",
            recurring_interval: 1,
          }
        : {}),
    }));
  };

  const applyTemplate = (tpl) => {
    setForm({ ...EMPTY_FORM, ...tpl.fill });
    setErrors({});
    toast.success(`${tpl.name} template applied`);
  };

  const scheduleSummary = useMemo(() => buildScheduleSummary(form), [form]);

  const submit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    try {
      setLoading(true);

      const payload = {
        ...form,
        date: form.trigger_type === "custom" ? form.date : null,
        time: form.trigger_type === "custom" ? form.time : null,
        recurring_frequency:
          form.trigger_type === "recurring" ? form.recurring_frequency : null,
        recurring_start:
          form.trigger_type === "recurring" ? form.recurring_start : null,
        recurring_end:
          form.trigger_type === "recurring" ? form.recurring_end : null,
        recurring_interval:
          form.trigger_type === "recurring" ? form.recurring_interval : null,
      };

      const response = notification
        ? await axiosInstance.put(
            `/api/v2/templates/${notification.id}/`,
            payload
          )
        : await axiosInstance.post("/api/v2/templates/", payload);

      toast.success(
        notification
          ? "Notification updated successfully"
          : "Notification created successfully"
      );
      onSaved(response.data, !!notification);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const previewBody = form.body?.trim()
    ? form.body
    : "<p style='color:#9ca3af;'>(empty body)</p>";

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
            className="fixed right-0 top-0 h-full w-full sm:w-[560px] lg:w-[760px] bg-white z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            {/* Header */}
            <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold">
                  {notification ? "Edit Notification" : "Create Notification"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {notification
                    ? "Update an existing notification template."
                    : "Compose a notification to send to your users."}
                </p>
              </div>
              <button
                onClick={onClose}
                className="-mr-2 p-2 rounded-md hover:bg-gray-100"
                aria-label="Close"
              >
                <MdClose size={22} />
              </button>
            </div>

            {/* View tabs */}
            <div className="px-4 sm:px-6 border-b">
              <div className="flex gap-6">
                {[
                  { id: "form", label: "Edit" },
                  { id: "preview", label: "Preview" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setView(t.id)}
                    className={`py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      view === t.id
                        ? "border-[#027840] text-[#027840]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
              {view === "form" ? (
                <div className="space-y-6">
                  {/* Quick-start templates */}
                  {!notification && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        Quick start
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {QUICK_TEMPLATES.map((tpl) => (
                          <button
                            key={tpl.name}
                            type="button"
                            onClick={() => applyTemplate(tpl)}
                            className="px-3 py-1.5 text-xs border border-gray-200 rounded-full bg-white hover:bg-gray-50 hover:border-[#027840] hover:text-[#027840] transition-colors"
                          >
                            {tpl.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recipients section */}
                  <Section title="Recipients" required>
                    <div>
                      <p className="text-sm font-medium mb-2">Channel</p>
                      <div className="grid grid-cols-2 gap-3">
                        {TYPE_OPTIONS.map((t) => (
                          <Checkbox
                            key={t.value}
                            checked={form.types.includes(t.value)}
                            onChange={() => toggleArray("types", t.value)}
                          >
                            {t.label}
                          </Checkbox>
                        ))}
                      </div>
                      <FieldError message={errors.types} />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Audience</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {RECIPIENT_OPTIONS.map((r) => (
                          <Checkbox
                            key={r.value}
                            checked={form.recipients.includes(r.value)}
                            onChange={() => toggleArray("recipients", r.value)}
                          >
                            {r.label}
                          </Checkbox>
                        ))}
                      </div>
                      <FieldError message={errors.recipients} />
                    </div>
                  </Section>

                  {/* Content section */}
                  <Section title="Content" required>
                    <div>
                      <label
                        htmlFor="notif-category"
                        className="text-sm font-semibold block mb-1"
                      >
                        Category
                      </label>
                      <input
                        id="notif-category"
                        value={form.category}
                        onChange={(e) => update("category", e.target.value)}
                        placeholder="e.g. Product update"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#027840]"
                      />
                    </div>

                    <div>
                      <RequiredLabel
                        htmlFor="notif-header"
                        hint={`${form.header.length} / ${HEADER_MAX}`}
                      >
                        Header
                      </RequiredLabel>
                      <input
                        id="notif-header"
                        value={form.header}
                        onChange={(e) => update("header", e.target.value)}
                        maxLength={HEADER_MAX}
                        placeholder="Short, scannable subject line"
                        className={`mt-1 w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#027840] ${
                          errors.header
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                      />
                      <FieldError message={errors.header} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <RequiredLabel>Body</RequiredLabel>
                        <button
                          type="button"
                          onClick={() => setAiModalOpen(true)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-[#027840] text-[#027840] bg-white hover:bg-[#027840] hover:text-white transition-colors"
                        >
                          <MdAutoAwesome className="text-sm" />
                          {form.body?.trim() ? "Refine with AI" : "Draft with AI"}
                        </button>
                      </div>
                      <div className="mt-1">
                        <HtmlEditor
                          value={form.body}
                          onChange={(html) => update("body", html)}
                          label={null}
                          height={280}
                          containerClassName="rounded-lg"
                          placeholder="Type your notification message..."
                        />
                      </div>
                      <FieldError message={errors.body} />
                    </div>
                  </Section>

                  {/* Scheduling section */}
                  <Section title="Scheduling">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="text-sm font-semibold block mb-1">
                          Timing
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === "trigger" ? null : "trigger"
                            )
                          }
                          className="w-full border border-gray-300 px-3 py-2 rounded-md flex justify-between items-center text-sm bg-white"
                        >
                          {
                            TIMING_OPTIONS.find(
                              (t) => t.value === form.trigger_type
                            )?.label
                          }
                          {openDropdown === "trigger" ? (
                            <MdKeyboardArrowUp />
                          ) : (
                            <MdKeyboardArrowDown />
                          )}
                        </button>
                        {openDropdown === "trigger" && (
                          <div className="absolute w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg z-10">
                            {TIMING_OPTIONS.map((t) => (
                              <div
                                key={t.value}
                                onClick={() => {
                                  handleTriggerChange(t.value);
                                  setOpenDropdown(null);
                                }}
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
                          <label className="text-sm font-semibold block mb-1">
                            Frequency
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === "frequency"
                                  ? null
                                  : "frequency"
                              )
                            }
                            className={`w-full border px-3 py-2 rounded-md flex justify-between items-center text-sm bg-white ${
                              errors.recurring_frequency
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                          >
                            {form.recurring_frequency || "Select frequency"}
                            {openDropdown === "frequency" ? (
                              <MdKeyboardArrowUp />
                            ) : (
                              <MdKeyboardArrowDown />
                            )}
                          </button>
                          {openDropdown === "frequency" && (
                            <div className="absolute w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg z-10">
                              {FREQUENCY_OPTIONS.map((f) => (
                                <div
                                  key={f.value}
                                  onClick={() => {
                                    update("recurring_frequency", f.value);
                                    setOpenDropdown(null);
                                  }}
                                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                >
                                  {f.label}
                                </div>
                              ))}
                            </div>
                          )}
                          <FieldError message={errors.recurring_frequency} />
                        </div>
                      )}
                    </div>

                    {form.trigger_type === "custom" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold block mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={form.date || ""}
                            onChange={(e) => update("date", e.target.value)}
                            className={`w-full border px-3 py-2 rounded-md text-sm ${
                              errors.date
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                          />
                          <FieldError message={errors.date} />
                        </div>
                        <div>
                          <label className="text-sm font-semibold block mb-1">
                            Time
                          </label>
                          <input
                            type="time"
                            value={form.time || ""}
                            onChange={(e) => update("time", e.target.value)}
                            className={`w-full border px-3 py-2 rounded-md text-sm ${
                              errors.time
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                          />
                          <FieldError message={errors.time} />
                        </div>
                      </div>
                    )}

                    {form.trigger_type === "recurring" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold block mb-1">
                            Start
                          </label>
                          <input
                            type="datetime-local"
                            value={form.recurring_start || ""}
                            onChange={(e) =>
                              update("recurring_start", e.target.value)
                            }
                            className={`w-full border px-3 py-2 rounded-md text-sm ${
                              errors.recurring_start
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                          />
                          <FieldError message={errors.recurring_start} />
                        </div>
                        <div>
                          <label className="text-sm font-semibold block mb-1">
                            End <span className="text-gray-400 font-normal">(optional)</span>
                          </label>
                          <input
                            type="datetime-local"
                            value={form.recurring_end || ""}
                            onChange={(e) =>
                              update("recurring_end", e.target.value)
                            }
                            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </Section>
                </div>
              ) : (
                /* Preview view — mirrors swiftsuite-server/app/templates/notification.html.
                   The Header field renders as the email's subject line (set by
                   the backend's send_normal_email task), not as a line inside
                   the body. Greeting and sign-off are added by the wrapper. */
                <div>
                  <p className="text-xs text-gray-500 mb-3">
                    Preview of how recipients will see this. Subject line,
                    greeting, and sign-off are added automatically &mdash; do
                    not duplicate them in the body.
                  </p>

                  {/* Inbox preview row — shows what lands in the user's mail list */}
                  <div className="mb-3 px-4 py-3 bg-white border border-gray-200 rounded-lg flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#027840] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      SS
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          SwiftSuite
                        </span>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          now
                        </span>
                      </div>
                      <div className="text-sm text-gray-800 truncate">
                        {form.header || (
                          <span className="text-gray-400">[subject line]</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {form.body
                          ? form.body
                              .replace(/<[^>]+>/g, " ")
                              .replace(/\s+/g, " ")
                              .trim()
                              .slice(0, 90) || "(empty body)"
                          : "(empty body)"}
                      </div>
                    </div>
                  </div>

                  {/* Email envelope mock */}
                  <div className="bg-[#F8F5FF] rounded-lg overflow-hidden border border-gray-200">
                    {/* Logo header */}
                    <div className="text-center py-5 px-4">
                      <img
                        src={SWIFTSUITE_LOGO}
                        alt="SwiftSuite"
                        className="inline-block max-w-[180px]"
                      />
                    </div>

                    {/* White content card */}
                    <div className="bg-white mx-4 mb-4 rounded p-5 text-[15px] leading-relaxed text-[#170045]">
                      <p className="mb-3">
                        Hello{" "}
                        <span className="text-gray-400">[first_name]</span>,
                      </p>

                      <div
                        className="mb-4"
                        dangerouslySetInnerHTML={{ __html: previewBody }}
                      />

                      <p className="mt-6">
                        Best regards,
                        <br />
                        <strong>The SwiftSuite Team</strong>
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="text-center pb-5 px-4">
                      <img
                        src={SWIFTSUITE_LOGO}
                        alt="SwiftSuite"
                        className="inline-block max-w-[80px] mb-2"
                      />
                      <p className="text-xs text-[#767579]">
                        © {new Date().getFullYear()} SwiftSuite. All rights
                        reserved.
                      </p>
                    </div>
                  </div>

                  {/* Send context (not part of the email itself) */}
                  <div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 space-y-1">
                    <div className="font-semibold text-gray-700 mb-1">
                      Delivery
                    </div>
                    <div>
                      <strong className="text-gray-700">Channels: </strong>
                      {form.types.length
                        ? form.types
                            .map(
                              (t) =>
                                TYPE_OPTIONS.find((o) => o.value === t)?.label
                            )
                            .join(", ")
                        : "—"}
                    </div>
                    <div>
                      <strong className="text-gray-700">Recipients: </strong>
                      {form.recipients.length
                        ? form.recipients
                            .map(
                              (r) =>
                                RECIPIENT_OPTIONS.find((o) => o.value === r)
                                  ?.label
                            )
                            .join(", ")
                        : "—"}
                    </div>
                    <div>
                      <strong className="text-gray-700">Schedule: </strong>
                      {scheduleSummary}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky footer */}
            <div className="px-4 sm:px-6 py-3 border-t bg-white flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <p className="text-xs text-gray-500 flex-1 truncate">
                {scheduleSummary}
              </p>
              <div className="flex gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={loading}
                  className="bg-[#027840] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {loading && (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"
                      />
                    </svg>
                  )}
                  {loading
                    ? "Saving..."
                    : notification
                    ? "Save changes"
                    : "Send notification"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
      <DraftWithAIModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        form={form}
        onUseDraft={(html) => update("body", html)}
      />
      <Toaster position="top-right" />
    </AnimatePresence>
  );
};

export default NotificationDrawer;
