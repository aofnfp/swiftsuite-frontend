import React, { useState } from "react";
import { LiaDollarSignSolid } from "react-icons/lia";

const OrderFilters = ({
  formFilters,
  handleFormInputChange,
  handleSubmit,
  clearFilters,
  filterLoading,
}) => {
  const [activeTab, setActiveTab] = useState("date");

  const tabClasses = (tab) => `px-4 py-2 rounded-full text-sm font-semibold transition ${activeTab === tab ? "bg-[#e8faf1] text-[#005D68] border border-[#8ed7c3]"
        : "bg-white text-gray-600 border border-gray-200 hover:bg-green-50"}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-xl font-bold">Filter</p>
      <p className="text-sm text-gray-500">Filter by</p>

      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2">
        {[
          { id: "date", label: "Date" },
          { id: "vendor", label: "Vendor" },
          { id: "amount", label: "Amount" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            className={tabClasses(item.id)}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {activeTab === "date" && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Start date</label>
              <input
                type="date"
                name="creationDate__gte"
                value={formFilters.creationDate__gte || ""}
                onChange={handleFormInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#089451] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">End date</label>
              <input
                type="date"
                name="creationDate__lte"
                value={formFilters.creationDate__lte || ""}
                onChange={handleFormInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#089451] focus:outline-none"
              />
            </div>
          </>
        )}

        {activeTab === "vendor" && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Vendor</label>
            <input
              type="text"
              name="vendor_name"
              placeholder="Vendor name"
              value={formFilters.vendor_name || ""}
              onChange={handleFormInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#089451] focus:outline-none"
            />
            <label className="block text-xs font-semibold text-gray-500 mb-1 mt-3">Market name</label>
            <input
              type="text"
              name="market_name"
              placeholder="Market name"
              value={formFilters.market_name || ""}
              onChange={handleFormInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#089451] focus:outline-none"
            />
          </div>
        )}

        {activeTab === "amount" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Min Amount</label>
              <div className="flex rounded-lg border border-gray-300">
                <span className="inline-flex items-center px-3 text-[#089451] border-r border-gray-200">
                  <LiaDollarSignSolid />
                </span>
                <input
                  type="number"
                  name="price_min"
                  placeholder="Min"
                  value={formFilters.price_min || ""}
                  onChange={handleFormInputChange}
                  className="w-full px-2 py-2 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Max Amount</label>
              <div className="flex rounded-lg border border-gray-300">
                <span className="inline-flex items-center px-3 text-[#089451] border-r border-gray-200">
                  <LiaDollarSignSolid />
                </span>
                <input
                  type="number"
                  name="price_max"
                  placeholder="Max"
                  value={formFilters.	price_max || ""}
                  onChange={handleFormInputChange}
                  className="w-full px-2 py-2 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center gap-3">
        <button
          type="button"
          onClick={clearFilters}
          className="w-1/2 rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Clear
        </button>
        <button
          type="submit"
          className="w-1/2 rounded-lg bg-[#089451] px-4 py-2 text-sm font-semibold text-white hover:bg-[#087f3d]"
        >
          {filterLoading ? (
            <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
          ) : (
            "Apply Filter"
          )}
        </button>
      </div>
    </form>
  );
};

export default OrderFilters;
