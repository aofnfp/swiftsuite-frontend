import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const DescriptionSection = ({ value, onChange, modules }) => {
  return (
    <div>
      <label htmlFor="description" className="font-semibold block">
        Description
      </label>
      <div className="rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-20">
        <ReactQuill
          value={value}
          onChange={onChange}
          theme="snow"
          placeholder="Enter detailed description..."
          modules={modules}
          className="h-[400px]"
        />
      </div>
    </div>
  );
};

export default DescriptionSection;
