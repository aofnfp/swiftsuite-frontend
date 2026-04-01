import React from "react";
import woocommerce from "../../../Images/woocommerce.png";
import ebay from "../../../Images/ebay.png";
import amazon from "../../../Images/amazon.png";

const MarketplacePerformances = () => {
  const platforms = [
    {
      name: "WooCommerce",
      logo: woocommerce,
      color: "#7F54B3",
      listed: 100,
      sold: 63,
    },
    {
      name: "Ebay",
      logo: ebay,
      color: "#E53238",
      listed: 83,
      sold: 2,
    },
    {
      name: "Amazon",
      logo: amazon,
      color: "#FF9900",
      listed: 20,
      sold: 0,
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Marketplace Performance
      </h1>
      <div className="bg-gray-50 p-4 sm:p-8 rounded-lg border border-gray-200">
        <div className="flex justify-between mb-6 sm:mb-8 text-sm sm:text-lg font-semibold text-gray-700">
          <div>Products Listed</div>
          <div>Products Sold</div>
        </div>
        <div className="space-y-8 sm:space-y-12">
          {platforms.map((platform, index) => {
            const soldPercentage =
              platform.listed > 0
                ? (platform.sold / platform.listed) * 100
                : 0;
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <img
                    className="w-24 sm:w-32 h-10 sm:h-12 object-contain"
                    src={platform.logo}
                    alt={`${platform.name} logo`}
                  />
                </div>
                <div className="flex items-center justify-between text-sm sm:text-lg font-bold text-gray-800">
                  <div>{platform.listed}</div>
                  <div>{platform.sold}</div>
                </div>
                <div className="relative h-5 sm:h-8 rounded-full overflow-hidden flex">
                  <div
                    className="bg-green-700 h-full transition-all duration-500"
                    style={{ width: `${soldPercentage}%` }}
                  />
                  <div
                    className="bg-gray-300 h-full transition-all duration-500"
                    style={{ width: `${100 - soldPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePerformances;
