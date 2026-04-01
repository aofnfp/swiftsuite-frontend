import React from "react";

const OrderLoader = () => {
  return (
    <div>
      <div className="px-10 mt-20">
        <div className="w-full bg-[#E7F2ED] pb-20 px-10 animate-pulse">
          <div className="flex border-b p-6 rounded bg-white mb-4">
            <div className="w-[100px] h-[100px] bg-gray-300 rounded"></div>
            <div className="ml-5 flex-1 space-y-3">
              <div className="w-3/4 h-5 bg-gray-300 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
              <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
              <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="text-right space-y-3">
              <div className="w-24 h-4 bg-gray-300 rounded"></div>
              <div className="w-32 h-4 bg-gray-300 rounded"></div>
              <div className="w-28 h-4 bg-gray-300 rounded"></div>
              <div className="w-20 h-4 bg-gray-300 rounded"></div>
              <div className="w-36 h-5 bg-gray-400 rounded"></div>
            </div>
          </div>
          <div className="flex justify-between space-x-4">
            <div className="w-1/4 h-24 bg-white rounded p-5 space-y-2">
              <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="w-1/4 h-24 bg-white rounded p-5 space-y-2">
              <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="w-1/4 h-24 bg-white rounded p-5 space-y-2">
              <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="mt-5">
            <div className="w-1/4 h-4 bg-gray-300 rounded mb-2"></div>
            <div className="w-full h-20 bg-gray-300 rounded mb-2"></div>
            <div className="w-32 h-10 bg-gray-400 rounded"></div>
          </div>
          <div className="mt-5">
            <div className="w-1/4 h-4 bg-gray-300 rounded mb-2"></div>
            <div className="w-full h-20 bg-gray-300 rounded mb-2"></div>
            <div className="w-32 h-10 bg-gray-400 rounded"></div>
          </div>
          <div className="mt-5">
            <div className="w-1/4 h-4 bg-gray-300 rounded mb-2"></div>
            <div className="w-full h-20 bg-gray-300 rounded mb-2"></div>
            <div className="w-32 h-10 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderLoader;
