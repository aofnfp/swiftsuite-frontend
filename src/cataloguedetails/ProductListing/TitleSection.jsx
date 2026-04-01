import React from "react";

const TitleSection = ({ title, maxLength, onChange }) => {
  const color = (() => {
    if (title.length > maxLength) return "text-red-500";
    if (title.length >= 70) return "text-gray-500";
    return "text-green-600";
  })();

  return (
    <div>
      <label htmlFor="title" className="font-semibold block">
        Title
      </label>
      <textarea
        name="title"
        id="title"
        value={title}
        onChange={onChange}
        placeholder="Enter your title..."
        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <div className={`text-sm mt-1 ${color}`}>
        {title.length} of {maxLength} characters
        {title.length > maxLength ? ` (Exceeded by ${title.length - maxLength})` : ""}
      </div>
    </div>
  );
};

export default TitleSection;
