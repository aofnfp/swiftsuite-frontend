import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const GettingStarted = () => {
  const [openIndex, setOpenIndex] = useState([0, 1, 2, 3]); 

  const toggleSection = (index) => {
    setOpenIndex((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const topics = [
    {
      title: "Setting up your account",
      content: [
        "Visit swiftsuite.app and click Sign Up.",
        "Verify your email address.",
        "Connect your online store (Shopify, WooCommerce, or other supported platforms).",
      ],
    },
    {
      title: "Connecting your Suppliers",
      content: [
        "Navigate to Integrations → Add Supplier.",
        "Select from the list of supported suppliers or add a custom integration using API keys.",
        "Once connected, your inventory will automatically sync.",
      ],
    },
    {
      title: "Importing Products",
      content: [
        "Go to Products → Import.",
        "Browse your supplier’s catalog and import desired items.",
        "Edit product titles, descriptions, and pricing before publishing.",
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
          <div
            key={index}
            className="p-4 rounded-lg  transition-all duration-300"
          >
            <div
              className="flex justify-between items-center cursor-pointer bg-white p-2"
              onClick={() => toggleSection(index)}
            >
              <h3 className="text-lg font-semibold text-green-700">
                {topic.title}
              </h3>
              {isOpen ? (
                <FaTimes />
              ) : (
                <FaPlus />
              )}
            </div>

            {isOpen && (
              <ol className="list-decimal list-inside border p-2 border-gray-300 text-gray-700 mt-3 space-y-1 transition-all duration-300 bg-white">
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

export default GettingStarted;
