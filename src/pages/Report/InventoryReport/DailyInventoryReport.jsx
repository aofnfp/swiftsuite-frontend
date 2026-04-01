import {
  ImageDown,
  Trash2,
  AlignHorizontalDistributeCenter,
} from "lucide-react";
import DailyInventoryChart from "./DailyInventoryChart";
import MarketplacePerformances from "./MarketplacePerformances";

const DailyInventoryReport = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          {
            icon: (
              <AlignHorizontalDistributeCenter
                className="text-green-600 mt-2"
                size={50}
              />
            ),
            label: "Total Listed Products",
            value: "$23",
          },
          {
            icon: <ImageDown className="text-green-600 mt-2" size={50} />,
            label: "Total Saved Listings",
            value: "$20.73",
          },
          {
            icon: <Trash2 className="text-green-600 mt-2" size={50} />,
            label: "Deleted Listings",
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
      <DailyInventoryChart />
      <div className="grid grid-cols-1 gap-6">
        <div className="p-5">
          <div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Top Performing Products
              </h1>
              <p className="text-xl text-gray-600 mb-5">
                See how your listed products are performing on their listed
                marketplaces
              </p>
            </div>
            <div className="flex flex-col gap-5 overflow-x-auto">
              <div className="min-w-[800px] flex bg-white items-center justify-center py-4 sm:py-6 rounded-[8px] font-semibold text-gray-700 text-base sm:text-xl">
                <p className="basis-[5%] text-left px-2">Rank</p>
                <p className="basis-[30%] text-left px-2">Product Name</p>
                <p className="basis-[10%] text-left px-2">SKU</p>
                <p className="basis-[10%] text-center px-2">Qty Listed</p>
                <p className="basis-[10%] text-center px-2">Qty Sold</p>
                <p className="basis-[10%] text-center px-2">Unit Price</p>
                <p className="basis-[10%] text-right px-2">Total Value</p>
              </div>
              <div className="min-w-[800px] flex bg-white items-center py-4 sm:py-6 rounded-[8px] text-[#005D68] text-sm sm:text-lg justify-center">
                <p className="basis-[5%] text-left px-2">1</p>
                <p className="basis-[30%] text-left px-2">
                  Gucci Hand Bag Size 39 for women Italian Model Red
                </p>
                <p className="basis-[10%] text-left px-2">45623</p>
                <p className="basis-[10%] text-center px-2">300</p>
                <p className="basis-[10%] text-center px-2">211</p>
                <p className="basis-[10%] text-center px-2">$23</p>
                <p className="basis-[10%] text-right px-2">$4853</p>
              </div>
              <div className="min-w-[800px] flex bg-white items-center py-4 sm:py-6 rounded-[8px] text-[#005D68] text-sm sm:text-lg justify-center">
                <p className="basis-[5%] text-left px-2">2</p>
                <p className="basis-[30%] text-left px-2">
                  Gucci Hand Bag Size 39 for women Italian Model Red
                </p>
                <p className="basis-[10%] text-left px-2">45623</p>
                <p className="basis-[10%] text-center px-2">300</p>
                <p className="basis-[10%] text-center px-2">211</p>
                <p className="basis-[10%] text-center px-2">$23</p>
                <p className="basis-[10%] text-right px-2">$2140</p>
              </div>
              <div className="min-w-[800px] flex bg-white items-center py-4 sm:py-6 rounded-[8px] text-[#005D68] text-sm sm:text-lg justify-center">
                <p className="basis-[5%] text-left px-2">3</p>
                <p className="basis-[30%] text-left px-2">
                  Gucci Hand Bag Size 39 for women Italian Model Red
                </p>
                <p className="basis-[10%] text-left px-2">45623</p>
                <p className="basis-[10%] text-center px-2">300</p>
                <p className="basis-[10%] text-center px-2">211</p>
                <p className="basis-[10%] text-center px-2">$23</p>
                <p className="basis-[10%] text-right px-2">$1190</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MarketplacePerformances />
    </div>
  );
};

export default DailyInventoryReport;
