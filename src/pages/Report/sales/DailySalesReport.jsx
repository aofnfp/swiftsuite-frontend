import React from "react";
import { ShoppingBag, Package, TrendingUp } from "lucide-react";
import wrist_watch from "../../../Images/wrist_watch.png";
import { Image } from "@heroui/react";
import DailyReportChart from "./DailyReportChart";

const DailySalesReport = () => {
  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          {
            icon: <ShoppingBag className="text-green-600 mt-2" size={50} />,
            label: "Total Sales",
            value: "$23",
          },
          {
            icon: <Package className="text-green-600 mt-2" size={50} />,
            label: "Total Sold Products",
            value: "$20.73",
          },
          {
            icon: <TrendingUp className="text-green-600 mt-2" size={50} />,
            label: "Total Dropshipping Cost",
            value: "$0.73",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white flex items-center sm:items-start gap-6 p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div>{item.icon}</div>
            <div className="mt-1">
              <span className="block text-gray-600 text-base sm:text-lg font-bold">
                {item.label}
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <DailyReportChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Best Selling Products
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded transition"
              >
                <Image
                  isZoomed
                  src={wrist_watch}
                  alt="Gucci Watch"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm sm:text-base">
                    Gucci Watch Men Pride II
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">$56</div>
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  06 Aug 2025
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Product Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { color: "bg-gray-700", value: 15, label: "Products listed" },
              { color: "bg-green-700", value: 1, label: "Product sold" },
              { color: "bg-yellow-600", value: 14, label: "Product unsold" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`${stat.color} text-white p-4 sm:p-6 rounded-lg text-center`}
              >
                <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySalesReport;
