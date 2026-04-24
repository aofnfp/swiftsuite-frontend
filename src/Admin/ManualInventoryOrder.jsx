import React, { useState } from "react";
import axios from "axios";
import { showSuccess, showApiError, showInfo } from "../utils/toast";
import { Download, Package, ShoppingCart } from "lucide-react";

const ManualInventoryOrder = () => {
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const axiosInstance = axios.create({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const downloadInventory = async () => {
    if (!userId) {
      showInfo("User ID not found. Please log in.");
      return;
    }

    try {
      setInventoryLoading(true);
      const res = await axiosInstance.get(
        `https://service.swiftsuite.app/inventoryApp/manually_download_inventory_items/`
      );

      if (res?.data?.items_fetched === 0) {
        showInfo("No new inventory items found");
      } else {
        showSuccess(res?.data?.message || "Inventory download started successfully");
      }
    } catch (error) {
      showApiError(error?.response?.data, "Failed to download inventory");
    } finally {
      setInventoryLoading(false);
    }
  };

  const downloadOrders = async () => {
    if (!userId) {
      showInfo("User ID not found. Please log in.");
      return;
    }

    try {
      setOrderLoading(true);
      const res = await axiosInstance.get(
        `https://service.swiftsuite.app/orderApp/download_order_manually/`
      );

      if (res?.data?.orders_fetched === 0) {
        showInfo("No new orders found");
      } else {
        showSuccess(res?.data?.message || "Orders download started successfully");
      }
    } catch (error) {
      showApiError(error, "Failed to download orders");
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="p-6 mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-[#027840] text-white rounded-xl flex items-center justify-center">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Manual Sync</h2>
          <p className="text-gray-500 text-sm">Sync inventory and orders instantly</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:border-[#027840]/30">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#027840] text-white rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Inventory</h3>
              <p className="text-xs text-[#027840] font-medium">Stock Items</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Manually download latest inventory items from the server.
          </p>

          <button
            onClick={downloadInventory}
            disabled={inventoryLoading}
            className="w-full py-3 px-5 bg-[#027840] hover:bg-[#025f32] text-white font-medium rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-70 active:scale-[0.985] hover:shadow-sm text-sm"
          >
            {inventoryLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Inventory
              </>
            )}
          </button>
        </div>

        <div className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:border-[#027840]/30">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#027840] text-white rounded-xl flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Orders</h3>
              <p className="text-xs text-[#027840] font-medium">Customer Orders</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Manually pull the latest customer orders into your system.
          </p>

          <button
            onClick={downloadOrders}
            disabled={orderLoading}
            className="w-full py-3 px-5 bg-[#027840] hover:bg-[#025f32] text-white font-medium rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-70 active:scale-[0.985] hover:shadow-sm text-sm"
          >
            {orderLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Orders
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualInventoryOrder;