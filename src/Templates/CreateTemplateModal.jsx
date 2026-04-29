import React, { useMemo, useState } from "react";
import { ArrowLeft, FileText, Save, Star, ChevronDown } from "lucide-react";
import Editor from "@monaco-editor/react";

const CreateTemplateModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("html");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editorOpen, setEditorOpen] = useState(true);

  const previewCode = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              background: white;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            ${css}
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
  }, [html, css]);

  const handleSaveTemplate = () => {
    const payload = {
      name: "My Listing Template",
      html,
      css,
      status: "completed",
    };

    console.log("Template payload:", payload);

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSaveDraft = () => {
    const payload = {
      name: "My Listing Template",
      html,
      css,
      status: "draft",
    };

    console.log("Draft payload:", payload);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header - Responsive */}
      <div className="bg-[#f5f5f5] px-4 sm:px-6 pt-4 sm:pt-6 pb-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          Create Template
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Use HTML and CSS to create listing templates
        </p>
      </div>

      {/* Action Bar - Responsive */}
      <div className="bg-white border-y border-gray-200 px-4 sm:px-6 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 font-semibold text-black text-sm sm:text-base hover:text-gray-600 transition"
        >
          <ArrowLeft size={18} className="sm:size-5" />
          Back
        </button>

        {/* Mobile: Stack buttons vertically */}
        <div className="hidden sm:flex items-center gap-3 lg:gap-4">
          <button className="flex items-center gap-2 text-gray-500 text-xs lg:text-sm hover:text-gray-700 transition">
            <Star size={16} className="lg:size-5" />
            <span className="hidden lg:inline">Add to favorites</span>
            <span className="lg:hidden">Favorite</span>
          </button>

          <button
            onClick={handleSaveDraft}
            className="h-10 px-4 lg:px-5 rounded-lg border border-gray-300 flex items-center gap-2 text-xs lg:text-sm font-semibold hover:bg-gray-50 transition"
          >
            <FileText size={15} className="lg:size-4" />
            <span className="hidden lg:inline">Save to complete later</span>
            <span className="lg:hidden">Save Draft</span>
          </button>

          <button
            onClick={handleSaveTemplate}
            disabled={loading}
            className="h-10 px-4 lg:px-5 rounded-lg bg-[#027840] text-white flex items-center gap-2 text-xs lg:text-sm font-semibold hover:bg-[#026634] transition disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
              </span>
            ) : (
              <>
                <Save size={15} className="lg:size-4" />
                <span className="hidden lg:inline">Save Template</span>
                <span className="lg:hidden">Save</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile: Compact button row */}
        <div className="sm:hidden flex items-center gap-2 w-full">
          <button
            onClick={handleSaveDraft}
            className="flex-1 h-9 px-3 rounded-lg border border-gray-300 flex items-center justify-center gap-1 text-xs font-semibold hover:bg-gray-50 transition"
          >
            <FileText size={14} />
            Draft
          </button>

          <button
            onClick={handleSaveTemplate}
            disabled={loading}
            className="flex-1 h-9 px-3 rounded-lg bg-[#027840] text-white flex items-center justify-center gap-1 text-xs font-semibold hover:bg-[#026634] transition disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
              </span>
            ) : (
              <>
                <Save size={14} />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-180px)] gap-0">
        {/* Editor Panel */}
        <div className="bg-black flex flex-col order-2 lg:order-1">
          <div className="h-12 bg-[#1f1f1f] flex items-center border-b border-gray-700">
            <button
              onClick={() => setActiveTab("html")}
              className={`h-full px-4 sm:px-5 text-xs sm:text-sm transition ${
                activeTab === "html"
                  ? "bg-[#2c2c2c] text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              HTML
            </button>

            <button
              onClick={() => setActiveTab("css")}
              className={`h-full px-4 sm:px-5 text-xs sm:text-sm transition ${
                activeTab === "css"
                  ? "bg-[#2c2c2c] text-[#BB8232] border-b-2 border-[#BB8232]"
                  : "text-[#BB8232]/50 hover:text-[#BB8232]/75"
              }`}
            >
              CSS
            </button>

            {/* Mobile: Preview toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="sm:hidden ml-auto h-full px-4 flex items-center gap-1 text-gray-400 hover:text-gray-200 transition text-xs"
            >
              Preview
              <ChevronDown
                size={16}
                className={`transition ${showPreview ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={activeTab === "html" ? "html" : "css"}
              value={activeTab === "html" ? html : css}
              onChange={(value) => {
                if (activeTab === "html") {
                  setHtml(value || "");
                } else {
                  setCss(value || "");
                }
              }}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                sm: { fontSize: 13 },
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: "on",
              }}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div
          className={`bg-white flex flex-col order-1 lg:order-2 border-t lg:border-t-0 lg:border-l border-gray-200 ${
            showPreview ? "block" : "hidden sm:flex"
          }`}
        >
          <div className="h-12 border-b border-gray-200 flex items-center px-4 sm:px-5 text-xs sm:text-sm font-medium text-gray-600">
            Live Preview
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            <iframe
              title="template-preview"
              srcDoc={previewCode}
              sandbox="allow-same-origin"
              className="w-full h-full bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateModal;