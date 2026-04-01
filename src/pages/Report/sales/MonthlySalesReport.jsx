import { ShoppingBag, Package, TrendingUp } from "lucide-react";
import wrist_watch from "../../../Images/wrist_watch.png";
import { Image } from "@heroui/react";
import MonthlyReportChart from "./MonthlyReportChart";

const MonthlySalesReport = () => {
  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="overflow-x-auto">
        <MonthlyReportChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
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
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">
                    Gucci Watch Men Pride II
                  </div>
                  <div className="text-sm text-gray-500">$906</div>
                </div>
                <div className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                  09 Sep 2025
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Performance */}
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            Product Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-700 text-white p-6 rounded-lg text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-2">200</div>
              <div className="text-sm">Products Listed</div>
            </div>

            <div className="bg-green-700 text-white p-6 rounded-lg text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-2">100</div>
              <div className="text-sm">Products Sold</div>
            </div>

            <div className="bg-yellow-600 text-white p-6 rounded-lg text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-2">240</div>
              <div className="text-sm">Products Unsold</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySalesReport;
