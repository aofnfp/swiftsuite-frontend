/**
 * DescriptionSection — product description editor.
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

const DEFAULT_PLACEHOLDER =
  "<p style='color:#888;font-family:system-ui;padding:1rem;'>No description yet.</p>";

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
    ADD_TAGS: ["link", "style"],
    ADD_ATTR: ["target", "vocab", "typeof", "property"],
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

const DescriptionSection = ({ value, onChange }) => {
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
      iframeNode.srcdoc = sanitizeForIframe(value || DEFAULT_PLACEHOLDER);
      syncedNodeRef.current = iframeNode;
      ownChangeRef.current = false;
      return;
    }

    if (ownChangeRef.current) {
      ownChangeRef.current = false;
      iframeContentRef.current = value || "";
      return;
    }

    if ((value || "") !== iframeContentRef.current) {
      iframeContentRef.current = value || "";
      iframeNode.srcdoc = sanitizeForIframe(value || DEFAULT_PLACEHOLDER);
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
    const emit = () => {
      const html = doc.documentElement.outerHTML;
      iframeContentRef.current = html;
      ownChangeRef.current = true;
      onChange(html);
    };
    doc.body.addEventListener("input", emit);
  }, [iframeNode, mode, onChange]);

  // Commit any uncommitted iframe content before leaving edit/preview for HTML.
  const switchMode = (newMode) => {
    if (mode !== "html" && newMode === "html" && iframeNode?.contentDocument) {
      const html = iframeNode.contentDocument.documentElement.outerHTML;
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
      iframeNode.contentDocument.execCommand(cmd, false, arg);
      const html = iframeNode.contentDocument.documentElement.outerHTML;
      iframeContentRef.current = html;
      ownChangeRef.current = true;
      onChange(html);
    },
    [iframeNode, onChange]
  );

  const execBlock = (tag) => exec("formatBlock", `<${tag}>`);
  const promptAnd = (label, cmd) => {
    const v = window.prompt(label);
    if (v) exec(cmd, v);
  };

  // Toolbar button for formatting commands. `onMouseDown preventDefault` stops
  // the button from stealing focus from the iframe, which would collapse the
  // user's text selection before the onClick handler can run execCommand.
  // Without it, "select text → click Bold" bolds nothing.
  const tbBtn = (label, onClick, title, extraClass = "") => (
    <button
      type="button"
      title={title || label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`min-w-[28px] h-7 px-2 text-xs border border-gray-200 bg-white hover:bg-gray-100 rounded flex items-center justify-center ${extraClass}`}
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
      className={`min-w-[28px] h-7 px-2 border rounded flex items-center justify-center transition-colors ${
        active
          ? "bg-[#089451] text-white border-[#089451]"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
      }`}
    >
      {icon}
    </button>
  );

  const sep = <span className="self-stretch w-px bg-gray-300 mx-1" />;

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
      <label htmlFor="description" className="font-semibold block mb-1">
        Description
      </label>
      <div className="rounded-lg mb-20">
        {mode === "edit" && (
          <>
            <div className="flex flex-wrap items-center gap-1 p-2 border border-gray-300 border-b-0 rounded-t bg-gray-50">
              {tbBtn("B", () => exec("bold"), "Bold", "font-bold")}
              {tbBtn("I", () => exec("italic"), "Italic", "italic")}
              {tbBtn("U", () => exec("underline"), "Underline", "underline")}
              {tbBtn("S", () => exec("strikeThrough"), "Strikethrough", "line-through")}
              {sep}
              {tbBtn("H1", () => execBlock("h1"), "Heading 1")}
              {tbBtn("H2", () => execBlock("h2"), "Heading 2")}
              {tbBtn("H3", () => execBlock("h3"), "Heading 3")}
              {tbBtn("¶", () => execBlock("p"), "Paragraph")}
              {sep}
              {tbBtn("•", () => exec("insertUnorderedList"), "Bulleted list")}
              {tbBtn("1.", () => exec("insertOrderedList"), "Numbered list")}
              {tbBtn("❝", () => execBlock("blockquote"), "Blockquote")}
              {sep}
              {tbBtn("⇤", () => exec("justifyLeft"), "Align left")}
              {tbBtn("⇔", () => exec("justifyCenter"), "Align center")}
              {tbBtn("⇥", () => exec("justifyRight"), "Align right")}
              {sep}
              <label
                className="flex items-center gap-1 text-xs cursor-pointer"
                title="Text color"
                onMouseDown={(e) => e.preventDefault()}
              >
                <span className="text-gray-600">A</span>
                <input
                  type="color"
                  onChange={(e) => exec("foreColor", e.target.value)}
                  className="w-6 h-6 cursor-pointer border border-gray-200 rounded"
                />
              </label>
              <label
                className="flex items-center gap-1 text-xs cursor-pointer"
                title="Highlight"
                onMouseDown={(e) => e.preventDefault()}
              >
                <span className="text-gray-600">▮</span>
                <input
                  type="color"
                  onChange={(e) => exec("hiliteColor", e.target.value)}
                  className="w-6 h-6 cursor-pointer border border-gray-200 rounded"
                />
              </label>
              <select
                onMouseDown={(e) => e.preventDefault()}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v) exec("fontSize", v);
                  e.target.value = "";
                }}
                defaultValue=""
                className="h-7 px-1 text-xs border border-gray-200 bg-white rounded"
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
              {modeIconBtn(<IconSource />, () => switchMode("html"), "View / edit HTML source")}
              {modeIconBtn(<IconPreview />, () => switchMode("preview"), "Preview")}
            </div>
            <iframe
              ref={refCallback}
              title="Description editor"
              onLoad={handleIframeLoad}
              className="w-full h-[400px] border border-gray-300 bg-white rounded-b border-t-0"
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
              className="w-full h-[400px] border border-gray-300 border-t-0 rounded-b p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
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
              title="Description preview"
              onLoad={handleIframeLoad}
              className="w-full h-[400px] border border-gray-300 border-t-0 bg-white rounded-b"
              sandbox="allow-same-origin allow-scripts"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DescriptionSection;
