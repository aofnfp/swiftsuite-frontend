import React, { useMemo, useState } from "react";
import { ArrowLeft, FileText, Save, Star } from "lucide-react";
import Editor from "@monaco-editor/react";

const CreateTemplateModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("html");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-[#f5f5f5] mt-10">
      <div className="bg-[#f5f5f5] px-6 pt-6 pb-3">
        <h1 className="text-3xl font-bold text-black">Create Template</h1>
        <p className="text-gray-500 mt-1">
          Use HTML and CSS to create listing templates
        </p>
      </div>

      <div className="bg-white border-y border-gray-200 h-16 flex items-center justify-between px-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 font-semibold text-black"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-500 text-sm">
            <Star size={17} />
            Add Template to favorites
          </button>

          <button
            onClick={handleSaveDraft}
            className="h-10 px-5 rounded-lg border border-gray-300 flex items-center gap-2 text-sm font-semibold"
          >
            <FileText size={16} />
            Save to complete later
          </button>

          <button
            onClick={handleSaveTemplate}
            disabled={loading}
            className="h-10 px-5 rounded-lg bg-[#027840] text-white flex items-center gap-2 text-sm font-semibold disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
              </span>
            ) : (
              <>
                <Save size={16} />
                Save Template
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-180px)]">
        <div className="bg-black border-r border-gray-300">
          <div className="h-12 bg-[#1f1f1f] flex items-center">
            <button
              onClick={() => setActiveTab("html")}
              className={`h-full px-5 text-sm ${
                activeTab === "html"
                  ? "bg-[#2c2c2c] text-white"
                  : "text-gray-400"
              }`}
            >
              HTML
            </button>

            <button
              onClick={() => setActiveTab("css")}
              className={`h-full px-5 text-sm ${
                activeTab === "css"
                  ? "bg-[#2c2c2c] text-[#BB8232]"
                  : "text-[#BB8232]/50"
              }`}
            >
              CSS
            </button>
          </div>

          <div className="h-[calc(100vh-230px)]">
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
                fontSize: 14,
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

        <div className="bg-white">
          <div className="h-12 border-b border-gray-200 flex items-center px-5 text-sm font-medium text-gray-600">
            Live Preview
          </div>

          <iframe
            title="template-preview"
            srcDoc={previewCode}
            sandbox="allow-same-origin"
            className="w-full h-[calc(100vh-230px)] bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateModal;