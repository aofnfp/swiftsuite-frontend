import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const Billing = () => {
  const [openIndex, setOpenIndex] = useState([0, 1, 2, 3]);

  const toggleSection = (index) => {
    setOpenIndex((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const topics = [
    {
      title: "Viewing your plan",
      content: [
        "Navigate to Settings → Billing to view or upgrade your plan.",
        "Plans are billed monthly or annually.",
      ],
    },
    {
      title: "Updating Payment Method",
      content: [
        "Click Update Payment Method under the Billing section.",
        "Securely enter your new card details.",
      ],
    },
    {
      title: "Refund Policy",
      content: [
        "Swift Suite does not offer refunds for subscription payments, except where required by law. You may cancel anytime to prevent future billing.",
      ],
    },
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
              <ol className="list-decimal list-inside border p-3 border-gray-300 text-gray-700 mt-3 bg-white space-y-1">
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

export default Billing;
