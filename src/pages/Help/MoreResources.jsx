import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const MoreResources = () => {
  const [openIndex, setOpenIndex] = useState([0, 1, 2, 3]);

  const toggleSection = (index) => {
    setOpenIndex((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const topics = [
    {
      title: "Video tutorials",
      content: [
        "Learn via step-by-step walkthroughs.",
        "Verify your email address.",
        "Connect your online store (Shopify, WooCommerce, or other supported platforms).",
      ],
    },
    {
      title: "Knowledge base",
      content: [
        "Search articles by keyword.",
      ],
    },
    {
      title: "Blog",
      content: [
        "Explore industry insights and platform updates.",
      ],
    },
    {
      title: "Managing Orders",
      content: [
        "Access all orders under Orders → Dashboard.",
        "Swift Suite will automatically assign suppliers based on availability and cost.",
        "Track fulfillment status and shipment updates in real time.",
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {topics.map((topic, index) => {
        const isOpen = openIndex.includes(index);
        return (
          <div key={index} className="p-4 rounded-lg transition-all">
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
              <ol className="list-decimal list-inside border bg-white p-3 border-gray-300 text-gray-700 mt-3 space-y-1">
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

export default MoreResources;
