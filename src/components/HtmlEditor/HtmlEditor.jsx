/**
 * HtmlEditor — reusable rich-text editor with full HTML rendering.
 *
 * Used in: product listing descriptions, admin notification bodies, and any
 * future place that needs to compose / edit / preview HTML content.
 *
 * Why we built this custom instead of using a library (Quill, CKEditor, TinyMCE,
 * SunEditor, etc.):
 *
 * Legacy eBay descriptions imported from inkFrog / Sozo-style templates contain
 * arbitrary HTML — full `<style>` blocks, external `<link rel="stylesheet">`,
 * Bootstrap-classed `<div>` grids, schema.org microdata, and `data-*` attributes.
 * The user needs to (a) view them rendered like eBay does, (b) edit them
 * without stripping anything, and (c) re-list the exact HTML back to eBay.
 *
 * Every third-party rich-text editor we tried failed one of those requirements:
 *   - Quill normalizes HTML into its own Delta model → strips divs/styles/classes.
 *   - CKEditor 5 + GeneralHtmlSupport preserves HTML in state but its Classic
 *     editor is contenteditable-on-a-div, so content `<link>`s don't load in
 *     the editor view. Also requires a cloud license key as of v44+.
 *   - SunEditor has iframe mode, but its `fullPage: true` parser fails on
 *     eBay's mixed head/body HTML with consistencyCheck errors.
 *   - CKEditor 4 matches the architecture perfectly (eBay/inkFrog use it) but
 *     is EOL since 2023 — not safe for new work.
 *
 * The solution: an iframe with `contenteditable="true"` body and a toolbar
 * that calls `document.execCommand` on the iframe's document. Same architecture
 * eBay's own Seller Hub uses. The browser handles HTML byte-for-byte — no
 * third-party parser or sanitizer in the loop.
 *
 * Key invariants (changing any of these will break something):
 *   - `sandbox="allow-same-origin allow-scripts"` — parent accesses the
 *     iframe's document for execCommand AND keyboard shortcuts /
 *     contenteditable behaviors run reliably across browsers. The combination
 *     would normally be unsafe (sandboxed scripts could break out via
 *     window.parent), but every srcdoc assignment passes through
 *     sanitizeForIframe (DOMPurify) which strips <script>, inline event
 *     handlers, javascript:/data: URIs, and other XSS vectors first. Do not
 *     loosen the sandbox or remove the sanitizer in isolation.
 *   - `iframeNode` is tracked via useState + callback ref, not a plain useRef.
 *     State triggers effects on mount/unmount, which is how fresh-mount
 *     detection works (critical for the Edit→HTML→Edit round-trip).
 *   - The content-sync useEffect is keyed on [iframeNode, value] and
 *     intentionally NOT on mode. Edit↔Preview toggling must not reload the
 *     iframe, or unsaved edits get wiped.
 *
 * execCommand is deprecated but universally supported and still the cleanest
 * way to drive a contenteditable from outside. Every browser vendor commits to
 * keeping it for the foreseeable future because there's no standards
 * replacement yet.
 *
 * See also: memory/description_editor_architecture.md in the Claude memory
 * dir for the full decision history.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";

// Strict allowlist for embedded iframes. Only video providers we trust to
// host the iframe content are permitted; anything else inserted (or pasted
// from a legacy template) is stripped during sanitization.
const ALLOWED_IFRAME_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "player.vimeo.com",
]);

// Recognize YouTube / Vimeo URLs in the formats users typically paste and
// return the canonical /embed URL the iframe needs. Returns null if the URL
// doesn't match a known provider so the caller can show an error.
const parseVideoUrl = (raw) => {
  if (!raw) return null;
  const url = String(raw).trim();
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (yt) {
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube.com/embed/${yt[1]}`,
    };
  }
  const vimeo = url.match(
    /(?:vimeo\.com\/(?:video\/|channels\/[^/]+\/|groups\/[^/]+\/videos\/)?|player\.vimeo\.com\/video\/)(\d+)/
  );
  if (vimeo) {
    return {
      provider: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}`,
    };
  }
  return null;
};

// Global hook: any sanitize call that produces an iframe must have a src
// pointing at one of the allowed hosts, otherwise the element is removed.
// Registered once at module load — DOMPurify dedupes by reference.
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName !== "iframe") return;
  const src = node.getAttribute && node.getAttribute("src");
  if (!src) {
    node.parentNode && node.parentNode.removeChild(node);
    return;
  }
  try {
    const u = new URL(src);
    if (u.protocol !== "https:" || !ALLOWED_IFRAME_HOSTS.has(u.hostname)) {
      node.parentNode && node.parentNode.removeChild(node);
    }
  } catch {
    node.parentNode && node.parentNode.removeChild(node);
  }
});

// Industry-standard contenteditable patterns applied here:
//   - Always keep at least one <p><br></p> so the cursor has a visible home
//     and deleting all text doesn't collapse the line height (the "jump").
//   - Force defaultParagraphSeparator to <p> on Chrome so Enter produces
//     consistent block elements (instead of mixing <p> and <div>).
//   - Reduce default <p> margins so Enter feels like a single line break.
//   - CSS placeholder via body.is-empty p:first-child::before, so the hint
//     is a pseudo-element (no real content the user has to delete).
// Legacy eBay templates with their own <style> block still win on
// specificity / source order, so existing description rendering is unchanged.
const BASE_STYLE_ID = "__sse_editor_base";
const EMPTY_BODY_HTML = "<p><br></p>";
// Body resets (padding, font, color) are only injected when the seeded
// document has no <style> or <link rel="stylesheet"> of its own — that is,
// for fresh notification/listing bodies the user is composing. Legacy eBay
// templates with their own styles must be left alone, otherwise our
// resets would override the template's intended body styling.
//
// Spacing rules (p / h / list / blockquote margins) are scoped to *direct*
// children of body so paragraphs nested in a template's <div>/<table>
// keep their original spacing.
const buildBaseStyles = (placeholder, includeBodyDefaults) => `
  ${includeBodyDefaults ? `body { margin: 0; padding: 0.75rem; font-family: system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; line-height: 1.4; color: #1f2937; }` : ""}
  body:focus { outline: none; }
  /* Tight paragraph spacing modelled on Word's Normal style (~8pt after at
     11pt font ≈ 0.25em). Pressing Enter feels like a single line break, not
     a double-spaced gap. */
  body > p { margin: 0 0 0.25em 0; }
  body > p:last-child { margin-bottom: 0; }
  body > h1, body > h2, body > h3 { margin: 0.6em 0 0.3em 0; line-height: 1.25; font-weight: 700; }
  body > h1 { font-size: 1.875em; }
  body > h2 { font-size: 1.5em; }
  body > h3 { font-size: 1.25em; font-weight: 600; }
  body > ul { margin: 0 0 0.5em 0; padding-left: 1.5em; list-style: disc outside; }
  body > ol { margin: 0 0 0.5em 0; padding-left: 1.5em; list-style: decimal outside; }
  body > ul li, body > ol li { margin: 0.15em 0; }
  body > blockquote { margin: 0.5em 0; padding-left: 0.8em; border-left: 3px solid #d1d5db; color: #4b5563; }
  body.is-empty > p:first-child { position: relative; }
  body.is-empty > p:first-child::before {
    content: ${JSON.stringify(placeholder || "")};
    position: absolute;
    left: 0;
    top: 0;
    color: #9ca3af;
    pointer-events: none;
    user-select: none;
  }
`;
// Hover-grid table picker. Rendered inside the More popover. The user hovers
// over the grid; cells from (0,0) to (hover-r, hover-c) light up; clicking
// commits the chosen dimensions back to the parent via onPick(rows, cols).
const TableGridPicker = ({ onPick }) => {
  const ROWS = 6;
  const COLS = 8;
  const [hover, setHover] = useState({ r: -1, c: -1 });
  return (
    <div onMouseLeave={() => setHover({ r: -1, c: -1 })}>
      <div
        className="grid gap-px"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {Array.from({ length: ROWS * COLS }).map((_, i) => {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          const active = r <= hover.r && c <= hover.c;
          return (
            <div
              key={i}
              onMouseEnter={() => setHover({ r, c })}
              onMouseDown={(e) => {
                e.preventDefault();
                onPick(r + 1, c + 1);
              }}
              className={`w-5 h-5 border cursor-pointer transition-colors ${
                active
                  ? "bg-[#02784050] border-[#027840]"
                  : "bg-white border-gray-300 hover:border-[#027840]"
              }`}
            />
          );
        })}
      </div>
      <div className="text-xs text-gray-500 mt-2 text-center min-h-[18px]">
        {hover.r >= 0 ? `${hover.r + 1} × ${hover.c + 1} table` : "Hover to size"}
      </div>
    </div>
  );
};

// Strip editor-only injections before emitting HTML upward so they don't
// get persisted into the row's body or sent to eBay's listing endpoint.
// Three scaffolds to remove:
//   - the injected <style id="__sse_editor_base"> base styles
//   - the body's `is-empty` class (added when the placeholder is showing)
//   - any `contenteditable` attribute (set to "true" on body so the user
//     can type, set to "false" on video wrappers to keep them atomic).
//     The editor re-applies these on load via handleIframeLoad and
//     normalizeVideoWrappers, so stripping them on emit doesn't break
//     anything inside the editor — but it does mean downstream consumers
//     (eBay <Description>, email body, saved record) get clean HTML.
const stripEditorArtifacts = (html) =>
  String(html || "")
    .replace(
      new RegExp(`<style id="${BASE_STYLE_ID}"[^>]*>[\\s\\S]*?</style>`),
      ""
    )
    .replace(/\sclass="is-empty"/g, "")
    .replace(/\scontenteditable="(?:true|false|inherit)"/gi, "");

// Sanitize description HTML before injecting into the iframe's srcdoc.
// WHOLE_DOCUMENT preserves <html>/<head>/<body> structure so legacy eBay
// templates with <link rel="stylesheet">, <style>, and schema.org microdata
// render correctly. DOMPurify strips <script>, inline event handlers,
// javascript:/data: URIs, and other XSS vectors — required because the
// iframe's sandbox includes allow-scripts (without sanitization, content
// scripts would have parent privileges via allow-same-origin).
const sanitizeForIframe = (html) =>
  DOMPurify.sanitize(html || "", {
    WHOLE_DOCUMENT: true,
    ADD_TAGS: ["link", "style", "iframe"],
    ADD_ATTR: [
      "target",
      "vocab",
      "typeof",
      "property",
      // iframe attrs needed for video embeds. The src is independently
      // restricted by the global uponSanitizeElement hook above.
      "allow",
      "allowfullscreen",
      "frameborder",
      "scrolling",
      "loading",
      "referrerpolicy",
      // Required to mark embedded media wrappers as atomic (cursor can't
      // enter and Enter can't split them). Without this DOMPurify strips
      // the attribute and the wrapper becomes editable again.
      "contenteditable",
    ],
    ALLOW_DATA_ATTR: true,
  });

// Toolbar icons — inlined SVGs so we don't pull another icon lib in.
const IconSource = (props) => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="5 7 3 9 5 11" />
    <polyline points="13 7 15 9 13 11" />
    <line x1="10" x2="8" y1="5" y2="13" />
  </svg>
);
const IconPreview = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconBackToEditor = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const HtmlEditor = ({
  value,
  onChange,
  label = "Description",
  height = 400,
  containerClassName = "rounded-lg mb-20",
  placeholder = "Start typing...",
}) => {
  // "edit"    = default — iframe + contenteditable body + full toolbar
  // "html"    = textarea with raw HTML source; return-to-editor chip on top
  // "preview" = iframe, contenteditable=false; return-to-editor chip on top
  const [mode, setMode] = useState("edit");
  // Iframe element in state (not a plain useRef) so effects re-run when it
  // mounts/unmounts — how we detect a fresh mount that needs a content reseed.
  const [iframeNode, setIframeNode] = useState(null);
  const refCallback = useCallback((node) => setIframeNode(node), []);

  // What's currently inside the iframe DOM — compared against `value` prop to
  // tell external updates apart from our own typing.
  const iframeContentRef = useRef("");
  // True when the last onChange we fired came from typing inside this iframe.
  // Prevents the reload-on-value-prop-change that would wipe the user's cursor.
  const ownChangeRef = useRef(false);
  // Which iframe DOM node we last wrote srcdoc into. Changing identity means
  // the iframe unmounted/remounted (e.g. Edit→HTML→Edit) and needs reseeding.
  const syncedNodeRef = useRef(null);
  // Last cursor/selection range observed inside the iframe document. Saved on
  // every selectionchange so toolbar controls that have to take focus from
  // the iframe (native <select>, color picker, etc.) can restore the user's
  // selection before running execCommand.
  const savedRangeRef = useRef(null);
  // Live map of which inline / block formats apply to the current selection.
  // Updated on every selectionchange via queryCommandState/Value so toolbar
  // buttons can highlight when the cursor is inside formatted text.
  const [activeStates, setActiveStates] = useState({});
  // Which secondary popover (if any) is open: "more" or "table".
  const [openPopover, setOpenPopover] = useState(null);

  // Legacy eBay-imported descriptions were stored JSON-encoded (json.dumps) in
  // the DB. A small fraction got encoded twice. Unwrap up to 3 levels in a
  // single pass so the user sees plain HTML on first render rather than after
  // multiple re-render round-trips.
  useEffect(() => {
    if (typeof value !== "string" || !value) return;
    let current = value;
    for (let i = 0; i < 3; i++) {
      if (!(current.startsWith('"') && current.endsWith('"'))) break;
      try {
        const parsed = JSON.parse(current);
        if (typeof parsed !== "string" || parsed === current) break;
        current = parsed;
      } catch {
        break;
      }
    }
    if (current !== value) onChange(current);
  }, [value, onChange]);

  // Content sync: fresh mount or external value change. Intentionally not
  // keyed on `mode` — switching edit ↔ preview on the same iframe must NOT
  // reload, or unsaved edits are wiped.
  useEffect(() => {
    // Skip when iframe is not in the document. This handles the rare race
    // where a value-prop change is committed in the same render as a
    // mode→"html" change: the iframe element is detached but iframeNode
    // state may not have flushed to null yet.
    if (!iframeNode || !iframeNode.isConnected) return;

    const isFreshMount = syncedNodeRef.current !== iframeNode;
    if (isFreshMount) {
      iframeContentRef.current = value || "";
      iframeNode.srcdoc = sanitizeForIframe(value || EMPTY_BODY_HTML);
      syncedNodeRef.current = iframeNode;
      ownChangeRef.current = false;
      // Drop any saved range that pointed into the previous iframe doc; the
      // nodes it referenced no longer exist after the reload.
      savedRangeRef.current = null;
      return;
    }

    if (ownChangeRef.current) {
      ownChangeRef.current = false;
      iframeContentRef.current = value || "";
      return;
    }

    if ((value || "") !== iframeContentRef.current) {
      iframeContentRef.current = value || "";
      iframeNode.srcdoc = sanitizeForIframe(value || EMPTY_BODY_HTML);
    }
  }, [iframeNode, value]);

  // Toggle contenteditable on mode change without reloading.
  useEffect(() => {
    if (!iframeNode || mode === "html") return;
    const body = iframeNode.contentDocument?.body;
    if (!body) return;
    body.contentEditable = mode === "edit" ? "true" : "false";
  }, [iframeNode, mode]);

  // Runs on every iframe load.
  const handleIframeLoad = useCallback(() => {
    if (!iframeNode?.contentDocument) return;
    const doc = iframeNode.contentDocument;
    if (!doc.body) return;
    doc.body.contentEditable = mode === "edit" ? "true" : "false";

    // Inject (or refresh) base styles. textContent is rewritten on every
    // load so a placeholder prop change takes effect on the next reload.
    // If the loaded document already has its own <style>/<link>, we treat
    // it as a legacy template and skip body-level resets.
    let styleEl = doc.getElementById(BASE_STYLE_ID);
    const hasTemplateStyles = !!doc.querySelector(
      `style:not(#${BASE_STYLE_ID}), link[rel="stylesheet"]`
    );
    if (!styleEl) {
      styleEl = doc.createElement("style");
      styleEl.id = BASE_STYLE_ID;
      (doc.head || doc.documentElement).appendChild(styleEl);
    }
    styleEl.textContent = buildBaseStyles(placeholder, !hasTemplateStyles);

    // Force <p> as the default block on Chrome / Edge so Enter produces
    // consistent paragraphs instead of mixing <p> and <div>.
    try { doc.execCommand("defaultParagraphSeparator", false, "p"); } catch {}

    // Ensure body has at least one <p><br></p> so the cursor has a stable
    // home and the empty state still has visible line height.
    const ensureEmptyParagraph = () => {
      const body = doc.body;
      if (body.children.length === 0) {
        const p = doc.createElement("p");
        p.appendChild(doc.createElement("br"));
        body.appendChild(p);
        return true;
      }
      const first = body.firstElementChild;
      if (first.tagName === "P" && first.childNodes.length === 0) {
        first.appendChild(doc.createElement("br"));
        return true;
      }
      return false;
    };

    const placeCursorAtStart = () => {
      const target = doc.body.firstElementChild || doc.body;
      const range = doc.createRange();
      range.setStart(target, 0);
      range.collapse(true);
      const sel = doc.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    };

    // Treat as visually empty when there's no text and no embedded media.
    const isVisuallyEmpty = () => {
      const body = doc.body;
      if (body.querySelector("img, video, iframe, table, hr")) return false;
      return (body.textContent || "").trim() === "";
    };

    const refreshEmptyClass = () => {
      doc.body.classList.toggle("is-empty", isVisuallyEmpty());
    };

    // Recover from past Enter-splitting damage on video wrappers, lock every
    // video wrapper down so the bug can't recur, and guarantee an editable
    // paragraph adjacent on each side so the cursor always has somewhere to
    // land. Without the adjacent-paragraph guarantee, a video at the very
    // top or bottom of the editor traps the cursor on one side. This is the
    // pattern Notion / TipTap / ProseMirror use for atomic blocks.
    const VIDEO_WRAPPER_SIG = "padding-bottom:56.25%";
    const isAtomicBlock = (el) =>
      el && el.getAttribute && el.getAttribute("contenteditable") === "false";
    const insertEditableLineBefore = (target) => {
      const p = doc.createElement("p");
      p.appendChild(doc.createElement("br"));
      target.parentNode.insertBefore(p, target);
    };
    const insertEditableLineAfter = (target) => {
      const p = doc.createElement("p");
      p.appendChild(doc.createElement("br"));
      if (target.nextSibling) {
        target.parentNode.insertBefore(p, target.nextSibling);
      } else {
        target.parentNode.appendChild(p);
      }
    };
    const normalizeVideoWrappers = () => {
      const divs = Array.from(doc.body.querySelectorAll("div[style]"));
      for (const div of divs) {
        const style = (div.getAttribute("style") || "").replace(/\s+/g, "");
        if (!style.includes(VIDEO_WRAPPER_SIG)) continue;
        const iframe = div.querySelector("iframe");
        if (!iframe) {
          div.parentNode && div.parentNode.removeChild(div);
          continue;
        }
        if (div.getAttribute("contenteditable") !== "false") {
          div.setAttribute("contenteditable", "false");
        }
        // Editable padding: a <p><br></p> on either side. Missing prev means
        // the wrapper is at body start (cursor can never get above it); a
        // contenteditable=false prev means two atomic blocks butt up against
        // each other (cursor can never get between them).
        if (!div.previousSibling || isAtomicBlock(div.previousElementSibling)) {
          insertEditableLineBefore(div);
        }
        if (!div.nextSibling || isAtomicBlock(div.nextElementSibling)) {
          insertEditableLineAfter(div);
        }
      }
    };

    // Unwrap inline format wrappers (<strong>, <em>, <span style=...> etc.)
    // that have no text content. After deleting bold/italic text the browser
    // leaves an empty wrapper around the cursor, and the next character typed
    // inherits the format. This matches the cleanup pattern used by Quill,
    // TipTap, and other production editors.
    const unwrapEmptyInlineFormatters = () => {
      const SEL =
        "strong, b, em, i, u, s, strike, sub, sup, span, font, mark, big, small";
      const candidates = Array.from(doc.body.querySelectorAll(SEL));
      for (const el of candidates) {
        if ((el.textContent || "").length > 0) continue;
        const parent = el.parentNode;
        if (!parent) continue;
        // Move any inner nodes (e.g. <br>) out so block height is preserved,
        // then drop the empty wrapper.
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        el.remove();
      }
    };

    // Track the user's selection inside the iframe so toolbar controls that
    // steal focus (native <select>, color picker, etc.) can restore it
    // before running execCommand. Also refresh which inline / block formats
    // are active so the toolbar can highlight matching buttons.
    const refreshActiveStates = () => {
      const next = {};
      const inlineCmds = [
        "bold",
        "italic",
        "underline",
        "strikeThrough",
        "subscript",
        "superscript",
        "insertUnorderedList",
        "insertOrderedList",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
      ];
      for (const cmd of inlineCmds) {
        try {
          next[cmd] = doc.queryCommandState(cmd);
        } catch {
          next[cmd] = false;
        }
      }
      try {
        // formatBlock returns the current block tag (e.g. "h1", "blockquote",
        // "pre", "p"). Lower-cased and stripped of angle brackets across
        // browsers — normalize to a bare tag name.
        const block = String(doc.queryCommandValue("formatBlock") || "")
          .toLowerCase()
          .replace(/[<>]/g, "");
        next.block = block;
      } catch {
        next.block = "";
      }
      setActiveStates(next);
    };

    const captureSelection = () => {
      const sel = doc.getSelection();
      if (sel && sel.rangeCount > 0) {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      }
      refreshActiveStates();
    };
    doc.addEventListener("selectionchange", captureSelection);

    normalizeVideoWrappers();
    ensureEmptyParagraph();
    refreshEmptyClass();
    refreshActiveStates();

    const emit = () => {
      const reseeded = ensureEmptyParagraph();
      if (reseeded) placeCursorAtStart();
      unwrapEmptyInlineFormatters();
      normalizeVideoWrappers();
      refreshEmptyClass();
      refreshActiveStates();
      // When the user has cleared the editor, emit "" so callers don't store
      // our scaffolding (<p><br></p>) as if it were real content.
      const html = isVisuallyEmpty()
        ? ""
        : stripEditorArtifacts(doc.documentElement.outerHTML);
      iframeContentRef.current = html;
      ownChangeRef.current = true;
      onChange(html);
    };
    doc.body.addEventListener("input", emit);
  }, [iframeNode, mode, onChange, placeholder]);

  // Commit any uncommitted iframe content before leaving edit/preview for HTML.
  const switchMode = (newMode) => {
    if (mode !== "html" && newMode === "html" && iframeNode?.contentDocument) {
      const html = stripEditorArtifacts(
        iframeNode.contentDocument.documentElement.outerHTML
      );
      if (html && html !== iframeContentRef.current) {
        iframeContentRef.current = html;
        onChange(html);
      }
    }
    setMode(newMode);
  };

  // Runs a browser execCommand on the iframe's document and propagates the
  // resulting HTML to parent state. We focus the iframe first because some
  // commands (bold, italic, list) silently no-op without an active selection
  // in the target document. We also read and emit outerHTML manually because
  // execCommand doesn't reliably fire the body's `input` event across browsers.
  const exec = useCallback(
    (cmd, arg) => {
      if (!iframeNode?.contentDocument) return;
      iframeNode.contentWindow.focus();
      // Restore the last known iframe selection in case the toolbar control
      // that triggered this exec stole focus (native <select>, color picker).
      const doc = iframeNode.contentDocument;
      if (savedRangeRef.current) {
        try {
          const sel = doc.getSelection();
          sel.removeAllRanges();
          sel.addRange(savedRangeRef.current);
        } catch {}
      }
      doc.execCommand(cmd, false, arg);
      // Route through the same handler the typing path uses, so toolbar
      // actions also run normalize / refresh is-empty class / unwrap empty
      // inline wrappers / strip artifacts / emit. One code path for every
      // mutation. (execCommand doesn't fire `input` reliably across browsers,
      // so we dispatch it ourselves.)
      doc.body.dispatchEvent(new Event("input", { bubbles: true }));
    },
    [iframeNode]
  );

  const execBlock = (tag) => exec("formatBlock", `<${tag}>`);
  const promptAnd = (label, cmd) => {
    const v = window.prompt(label);
    if (v) exec(cmd, v);
  };

  // Build a clean HTML <table> at the cursor position. Inline styles ensure
  // borders/padding survive into the email/notification render where Tailwind
  // classes from the parent app aren't present.
  const insertTable = useCallback(
    (rows, cols) => {
      const headerCell =
        '<th style="border:1px solid #d1d5db; padding:6px 10px; background:#f9fafb; text-align:left;">&nbsp;</th>';
      const bodyCell =
        '<td style="border:1px solid #d1d5db; padding:6px 10px;">&nbsp;</td>';
      const headerRow = `<tr>${headerCell.repeat(cols)}</tr>`;
      const bodyRow = `<tr>${bodyCell.repeat(cols)}</tr>`;
      const bodyRows = bodyRow.repeat(Math.max(0, rows - 1));
      const html = `<table style="border-collapse:collapse; width:100%; margin:0.5em 0;"><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table><p><br></p>`;
      exec("insertHTML", html);
    },
    [exec]
  );

  // Prompt for a YouTube / Vimeo URL, parse it to a canonical embed URL, and
  // insert a responsive 16:9 iframe. The DOMPurify hook independently
  // enforces the host allowlist on every load, so even pasted/legacy iframes
  // can't slip through.
  const insertVideo = useCallback(() => {
    const url = window.prompt("Paste a YouTube or Vimeo URL:");
    if (!url) return;
    const parsed = parseVideoUrl(url);
    if (!parsed) {
      window.alert(
        "Couldn't recognize that URL. Paste a YouTube or Vimeo link."
      );
      return;
    }
    // contenteditable="false" makes the wrapper atomic. Without it, pressing
    // Enter inside or right after the wrapper makes the browser SPLIT the
    // <div>, copying the 56.25% padding-bottom into empty siblings — each
    // looks like a giant blank rectangle. With it, the cursor can only sit
    // before or after the embed; Enter never splits it.
    const html =
      '<div contenteditable="false" style="position:relative; padding-bottom:56.25%; height:0; margin:0.75em 0; max-width:100%;">' +
      `<iframe src="${parsed.embedUrl}" ` +
      'style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
      "allowfullscreen></iframe>" +
      "</div><p><br></p>";
    exec("insertHTML", html);
  }, [exec]);

  // Close any open popover when the user clicks outside the toolbar.
  useEffect(() => {
    if (!openPopover) return;
    const onDown = (e) => {
      if (!e.target.closest("[data-html-editor-toolbar]")) {
        setOpenPopover(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openPopover]);

  // === CODE BLOCK FEATURE ===========================================
  // Self-contained. To remove: delete this block AND the button labelled
  // `</>` in the More popover. No other code touches it.
  const insertCodeBlock = useCallback(() => {
    const doc = iframeNode?.contentDocument;
    const selectionText = doc?.getSelection()?.toString() || "";
    const escaped = selectionText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const html =
      '<pre style="background:#f3f4f6; padding:0.75em 1em; border-radius:6px; ' +
      "font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:0.9em; " +
      'overflow:auto; margin:0.5em 0; white-space:pre-wrap;"><code>' +
      escaped +
      "</code></pre><p><br></p>";
    exec("insertHTML", html);
  }, [exec, iframeNode]);
  // === END CODE BLOCK FEATURE =======================================

  // Toolbar button for formatting commands. `onMouseDown preventDefault` stops
  // the button from stealing focus from the iframe, which would collapse the
  // user's text selection before the onClick handler can run execCommand.
  // Without it, "select text → click Bold" bolds nothing.
  const tbBtn = (label, onClick, title, extraClass = "", active = false) => (
    <button
      type="button"
      title={title || label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`min-w-[36px] h-9 sm:min-w-[28px] sm:h-7 px-2 text-sm sm:text-xs border rounded flex items-center justify-center transition-colors ${
        active
          ? "bg-[#02784015] border-[#027840] text-[#027840]"
          : "border-gray-200 bg-white hover:bg-gray-100"
      } ${extraClass}`}
    >
      {label}
    </button>
  );

  // Mode-toggle button — an icon button in the toolbar. Does NOT preserve
  // iframe focus because we're switching out of the editor anyway.
  const modeIconBtn = (icon, onClick, title, active = false) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`min-w-[36px] h-9 sm:min-w-[28px] sm:h-7 px-2 border rounded flex items-center justify-center transition-colors ${
        active
          ? "bg-[#089451] text-white border-[#089451]"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
      }`}
    >
      {icon}
    </button>
  );

  // Fixed-height vertical separator. `h-5` (20px) keeps it visually consistent
  // even when the toolbar wraps to multiple rows on narrow screens — the
  // previous `self-stretch` made dividers grow to row height, which produced
  // awkward floating bars at row ends after wrapping.
  const sep = (
    <span className="hidden sm:block w-px h-5 bg-gray-300 mx-1 self-center" />
  );

  // Header bar shown in HTML and Preview modes — just a title + back link.
  const nonEditHeader = (title) => (
    <div className="flex items-center justify-between px-3 py-1.5 border border-gray-300 border-b-0 rounded-t bg-gray-50 text-xs text-gray-600">
      <span className="font-medium">{title}</span>
      <button
        type="button"
        onClick={() => switchMode("edit")}
        className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 text-gray-700"
        title="Back to editor"
      >
        <IconBackToEditor />
        <span>Back to editor</span>
      </button>
    </div>
  );

  return (
    <div>
      {label && (
        <label htmlFor="description" className="font-semibold block mb-1">
          {label}
        </label>
      )}
      <div className={containerClassName}>
        {mode === "edit" && (
          <>
            <div
              data-html-editor-toolbar
              className="relative flex flex-wrap items-center gap-1.5 sm:gap-1 p-2 border border-gray-300 border-b-0 rounded-t bg-gray-50"
            >
              {tbBtn("B", () => exec("bold"), "Bold", "font-bold", activeStates.bold)}
              {tbBtn("I", () => exec("italic"), "Italic", "italic", activeStates.italic)}
              {tbBtn("U", () => exec("underline"), "Underline", "underline", activeStates.underline)}
              {tbBtn("S", () => exec("strikeThrough"), "Strikethrough", "line-through", activeStates.strikeThrough)}
              {sep}
              {tbBtn("H1", () => execBlock("h1"), "Heading 1", "", activeStates.block === "h1")}
              {tbBtn("H2", () => execBlock("h2"), "Heading 2", "", activeStates.block === "h2")}
              {tbBtn("H3", () => execBlock("h3"), "Heading 3", "", activeStates.block === "h3")}
              {tbBtn("¶", () => execBlock("p"), "Paragraph", "", activeStates.block === "p")}
              {sep}
              {tbBtn("•", () => exec("insertUnorderedList"), "Bulleted list", "", activeStates.insertUnorderedList)}
              {tbBtn("1.", () => exec("insertOrderedList"), "Numbered list", "", activeStates.insertOrderedList)}
              {tbBtn("❝", () => execBlock("blockquote"), "Blockquote", "", activeStates.block === "blockquote")}
              {tbBtn("→|", () => exec("indent"), "Increase indent")}
              {tbBtn("|←", () => exec("outdent"), "Decrease indent")}
              {sep}
              {tbBtn("⇤", () => exec("justifyLeft"), "Align left", "", activeStates.justifyLeft)}
              {tbBtn("⇔", () => exec("justifyCenter"), "Align center", "", activeStates.justifyCenter)}
              {tbBtn("⇥", () => exec("justifyRight"), "Align right", "", activeStates.justifyRight)}
              {tbBtn("≡", () => exec("justifyFull"), "Justify", "", activeStates.justifyFull)}
              {sep}
              <label
                className="flex items-center gap-1 text-sm sm:text-xs cursor-pointer h-9 sm:h-7"
                title="Text color"
                onMouseDown={(e) => e.preventDefault()}
              >
                <span className="text-gray-600">A</span>
                <input
                  type="color"
                  onChange={(e) => exec("foreColor", e.target.value)}
                  className="w-7 h-7 sm:w-6 sm:h-6 cursor-pointer border border-gray-200 rounded"
                />
              </label>
              <label
                className="flex items-center gap-1 text-sm sm:text-xs cursor-pointer h-9 sm:h-7"
                title="Highlight"
                onMouseDown={(e) => e.preventDefault()}
              >
                <span className="text-gray-600">▮</span>
                <input
                  type="color"
                  onChange={(e) => exec("hiliteColor", e.target.value)}
                  className="w-7 h-7 sm:w-6 sm:h-6 cursor-pointer border border-gray-200 rounded"
                />
              </label>
              <select
                onChange={(e) => {
                  const v = e.target.value;
                  if (v) exec("fontSize", v);
                  e.target.value = "";
                }}
                defaultValue=""
                className="h-9 sm:h-7 px-2 sm:px-1 text-sm sm:text-xs border border-gray-200 bg-white rounded"
                title="Font size"
              >
                <option value="" disabled>
                  Size
                </option>
                <option value="1">Smallest</option>
                <option value="2">Small</option>
                <option value="3">Normal</option>
                <option value="4">Large</option>
                <option value="5">Larger</option>
                <option value="6">X-Large</option>
                <option value="7">Huge</option>
              </select>
              {sep}
              {tbBtn("🔗", () => promptAnd("Link URL:", "createLink"), "Insert link")}
              {tbBtn("⛓", () => exec("unlink"), "Remove link")}
              {tbBtn("🖼", () => promptAnd("Image URL:", "insertImage"), "Insert image")}
              {tbBtn("―", () => exec("insertHorizontalRule"), "Horizontal rule")}
              {sep}
              {tbBtn("↶", () => exec("undo"), "Undo")}
              {tbBtn("↷", () => exec("redo"), "Redo")}
              {tbBtn("✕", () => exec("removeFormat"), "Clear formatting")}
              {sep}
              {/* More tools popover — secondary commands kept off the main row. */}
              <div className="relative">
                {tbBtn(
                  "⋯",
                  () =>
                    setOpenPopover(openPopover === "more" ? null : "more"),
                  "More tools",
                  "",
                  openPopover === "more"
                )}
                {openPopover === "more" && (
                  <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[260px]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      Format
                    </p>
                    <div className="flex gap-1 mb-3">
                      {tbBtn(
                        "X²",
                        () => {
                          exec("superscript");
                          setOpenPopover(null);
                        },
                        "Superscript",
                        "",
                        activeStates.superscript
                      )}
                      {tbBtn(
                        "X₂",
                        () => {
                          exec("subscript");
                          setOpenPopover(null);
                        },
                        "Subscript",
                        "",
                        activeStates.subscript
                      )}
                      {/* CODE BLOCK button — paired with insertCodeBlock above. */}
                      {tbBtn(
                        "</>",
                        () => {
                          insertCodeBlock();
                          setOpenPopover(null);
                        },
                        "Code block"
                      )}
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      Embed
                    </p>
                    <div className="flex gap-1 mb-3">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          insertVideo();
                          setOpenPopover(null);
                        }}
                        className="flex items-center gap-2 px-3 h-9 sm:h-7 text-sm sm:text-xs border border-gray-200 bg-white hover:bg-gray-100 rounded"
                        title="Insert video (YouTube or Vimeo)"
                      >
                        <span aria-hidden>▶</span>
                        <span>Video</span>
                      </button>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      Insert table
                    </p>
                    <TableGridPicker
                      onPick={(rows, cols) => {
                        insertTable(rows, cols);
                        setOpenPopover(null);
                      }}
                    />
                  </div>
                )}
              </div>
              {sep}
              {/* Mode toggles — sit at the end of the toolbar; on desktop the
                  flex-1 spacer right-aligns them, on mobile they wrap with the
                  rest of the buttons rather than orphan onto their own row. */}
              <span className="hidden sm:block flex-1" />
              {modeIconBtn(<IconSource />, () => switchMode("html"), "View / edit HTML source")}
              {modeIconBtn(<IconPreview />, () => switchMode("preview"), "Preview")}
            </div>
            <iframe
              ref={refCallback}
              title="HTML editor"
              onLoad={handleIframeLoad}
              style={{ height }}
              className="w-full border border-gray-300 bg-white rounded-b border-t-0"
              sandbox="allow-same-origin allow-scripts"
            />
          </>
        )}

        {mode === "html" && (
          <>
            {nonEditHeader("HTML source")}
            <textarea
              value={value || ""}
              onChange={(e) => {
                iframeContentRef.current = e.target.value;
                onChange(e.target.value);
              }}
              style={{ height }}
              className="w-full border border-gray-300 border-t-0 rounded-b p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="<p>HTML here...</p>"
              spellCheck={false}
            />
          </>
        )}

        {mode === "preview" && (
          <>
            {nonEditHeader("Preview")}
            <iframe
              ref={refCallback}
              title="HTML preview"
              onLoad={handleIframeLoad}
              style={{ height }}
              className="w-full border border-gray-300 border-t-0 bg-white rounded-b"
              sandbox="allow-same-origin allow-scripts"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default HtmlEditor;
