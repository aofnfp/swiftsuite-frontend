import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const DescriptionEditor = ({ productListing, setProductListing }) => {
  const [description, setDescription] = useState("");

  const handleDescriptionChange = (value) => {
    console.log(value);

    setDescription(value);
    setProductListing((prev) => ({ ...prev, detailed_description: value }));
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="flex flex-col mb-4">
      <label htmlFor="description" className="mb-1 font-semibold">
        DESCRIPTION
      </label>
      <ReactQuill
        value={productListing?.detailed_description || description}
        onChange={handleDescriptionChange}
        theme="snow"
        placeholder="Enter detailed description..."
        modules={modules}
        className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
};

export default DescriptionEditor;
