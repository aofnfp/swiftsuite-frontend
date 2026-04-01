import React from "react";

const KeyFeatures = () => {
  const features = [
    {
      title: "Automated Inventory Sync",
      description:
        "Ensure your store always reflects real-time stock levels. No more overselling or outdated listings.",
    },
    {
      title: "Smart Order Routing",
      description:
        "Automatically route orders to the best supplier based on price, location, and stock..",
    },
    {
      title: "Multi-Supplier Management",
      description:
        "Connect and manage multiple suppliers under one unified dashboard.",
    },
    {
      title: "Product Data Sync",
      description:
        "Keep product details, images, and pricing aligned across all channels.",
    },
    {
      title: "Performance Dashboard",
      description:
      "Analyze profits, fulfillment speed, and supplier reliability through visual reports.",
    },
  ];

  return (
    <div className="space-y-6">
      {features.map((feature, index) => (
        <div key={index} className="p-4 rounded-lg ">
          <h3 className="text-lg font-semibold text-green-700 mb-2 bg-white p-2">
            {feature.title}
          </h3>
          <p className=" p-3  text-gray-700 bg-white border">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default KeyFeatures;
