import React from "react";

export const ARCHETYPE_OPTIONS = [
  { value: "incident",    label: "Incident",    hint: "Active outage / disruption" },
  { value: "maintenance", label: "Maintenance", hint: "Scheduled downtime" },
  { value: "update",      label: "Update",      hint: "Feature release / improvement" },
  { value: "headsup",     label: "Heads-up",    hint: "Short informational note" },
];

export const LENGTH_OPTIONS = [
  { value: "short",    label: "Short" },
  { value: "standard", label: "Standard" },
  { value: "detailed", label: "Detailed" },
];

// Default length per archetype (mirrors backend _DEFAULT_LENGTH).
export const DEFAULT_LENGTH = {
  incident:    "detailed",
  maintenance: "standard",
  update:      "standard",
  headsup:     "short",
};

// Fuzzy-match the freeform Category field against archetype keywords.
// Returns null if nothing matches; caller falls back to "headsup".
export const inferArchetypeFromCategory = (category) => {
  const c = (category || "").toLowerCase();
  if (!c) return null;
  if (/incident|outage|down|broken|disruption|degrad|failure/.test(c)) return "incident";
  if (/maintenance|scheduled|downtime|window|planned/.test(c)) return "maintenance";
  if (/update|release|feature|launch|new|improvement|product/.test(c)) return "update";
  return null;
};

const Pill = ({ active, onClick, title, children }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
      active
        ? "bg-[#027840] text-white border-[#027840]"
        : "bg-white text-gray-700 border-gray-200 hover:border-[#027840] hover:text-[#027840]"
    }`}
  >
    {children}
  </button>
);

const AIPillStrip = ({ archetype, length, onArchetypeChange, onLengthChange }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 w-14">
        Type
      </span>
      <div className="flex flex-wrap gap-2">
        {ARCHETYPE_OPTIONS.map((opt) => (
          <Pill
            key={opt.value}
            active={archetype === opt.value}
            onClick={() => onArchetypeChange(opt.value)}
            title={opt.hint}
          >
            {opt.label}
          </Pill>
        ))}
      </div>
    </div>
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 w-14">
        Length
      </span>
      <div className="flex flex-wrap gap-2">
        {LENGTH_OPTIONS.map((opt) => (
          <Pill
            key={opt.value}
            active={length === opt.value}
            onClick={() => onLengthChange(opt.value)}
          >
            {opt.label}
          </Pill>
        ))}
      </div>
    </div>
  </div>
);

export default AIPillStrip;
