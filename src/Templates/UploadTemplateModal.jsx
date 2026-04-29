import React, { useState } from "react";
import { Upload, X } from "lucide-react";

const UploadTemplateModal = ({ onClose }) => {
  const [fileName, setFileName] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [category, setCategory] = useState("");

  const handleUpload = () => {
    const payload = {
      templateName,
      category,
      fileName,
    };

    console.log("Upload HTML payload:", payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Upload Template</h2>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="p-6">
          <label className="border border-dashed border-gray-300 rounded-xl min-h-[220px] flex flex-col items-center justify-center cursor-pointer">
            <Upload size={42} className="text-[#8fcdb3]" />

            <p className="text-base font-bold text-black mt-4">
              Drag and drop your HTML file here
            </p>

            <p className="text-sm text-[#8fcdb3] mt-2">
              or click to browse .html files only.
            </p>

            <div className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 bg-white">
              {fileName || "Choose file"}
            </div>

            <input
              type="file"
              accept=".html"
              hidden
              onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
            />
          </label>

          <div className="mt-7">
            <label className="text-xl font-bold text-black">
              Template Name
            </label>
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g My Custom Name"
              className="w-full h-12 mt-4 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#027840] placeholder:text-[#8fcdb3]"
            />
          </div>

          <div className="mt-7">
            <label className="text-xl font-bold text-black">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-12 mt-4 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#027840] text-[#8fcdb3]"
            >
              <option value="">Select Category</option>
              <option value="Fragrance & Beauty">Fragrance & Beauty</option>
              <option value="Sports & Outdoors">Sports & Outdoors</option>
              <option value="Electronics & Tech">Electronics & Tech</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Tools & Hardware">Tools & Hardware</option>
              <option value="Jewelry & Watches">Jewelry & Watches</option>
              <option value="Pet Supplies">Pet Supplies</option>
              <option value="Office Business">Office Business</option>
              <option value="Automotive & Parts">Automotive & Parts</option>
              <option value="Fashion & Apparel">Fashion & Apparel</option>
              <option value="Toys & Collectibles">Toys & Collectibles</option>
              <option value="Health & Wellness">Health & Wellness</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-9">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-500 font-semibold"
            >
              Cancel
            </button>

            <button
              onClick={handleUpload}
              className="px-5 py-2.5 rounded-lg bg-[#027840] text-white font-semibold"
            >
              Upload and Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTemplateModal;