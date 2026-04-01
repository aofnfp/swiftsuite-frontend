import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const Troubleshooting = () => {
  const [openIndex, setOpenIndex] = useState([0, 1, 2, 3]);

  const toggleSection = (index) => {
    setOpenIndex((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const topics = [
    {
      title: "Common Issues",
      content: [
        "Inventory Not Syncing: Check your supplier’s API connection and reauthorize access.",
        "Order Not Processing: Ensure your supplier account has sufficient balance and that order routing rules are active.",
        "Product Images Missing: Refresh the product sync or upload manually.",
      ],
    },
    {
      title: "Performance Tips",
      content: [
        "Regularly update supplier credentials.",
        "Use fewer manual overrides to keep automation smooth.",
        "Schedule daily inventory syncs for high-demand stores.",
      ],
    }
  ];

  return (
    <div className="space-y-4">
      {topics.map((topic, index) => {
        const isOpen = openIndex.includes(index);
        return (
          <div key={index} className="p-4 rounded-lg  transition-all">
            <div
              className="flex justify-between items-center cursor-pointer bg-white p-2"
              onClick={() => toggleSection(index)}
            >
              <h3 className="text-lg font-semibold text-green-700">
                {topic.title}
              </h3>
              {isOpen ? <FaTimes /> : <FaPlus />}
            </div>

            {isOpen && (
              <ol className="list-decimal list-inside bg-white border p-3 border-gray-300 text-gray-700 mt-3 space-y-1">
                {topic.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Troubleshooting;
