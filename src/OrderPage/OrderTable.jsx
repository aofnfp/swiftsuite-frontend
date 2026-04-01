import React, { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { format } from "date-fns";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  checkRsrOrder,
  placeOrder,
  pushTrackingToEbay,
  trackOrder,
} from "../api/authApi";
import { getStatusStyles } from "../utils/utils";

const OrderTable = ({ filteredUsers, handleRefresh, error, handleRowClick }) => {

  const [isPlaceOrderLoading, setIsPlaceOrderLoading] = useState(false);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [isTrackingEbayLoading, setIsTrackingEbayLoading] = useState(false);

  const handlePlaceOrder = async (marketplacePlatform, orderId) => {
    try {
      setIsPlaceOrderLoading(true);
      const res = await placeOrder(marketplacePlatform, orderId);
      toast.success( res?.data?.message || "Order placed successfully.");
      setIsPlaceOrderLoading(false);
    } catch (error) {
      setIsPlaceOrderLoading(false);
      toast.error(
        error?.response?.data?.message || "Failed to place order.",
      );
    }
  };

  const handleTrackingOrder = async (orderId) => {
    try {
      setIsTrackingLoading(true);
      const res = await trackOrder(orderId);
      toast.success(res?.message || "Tracking info retrieved successfully!");
      setIsTrackingLoading(false);
    } catch (error) {
      setIsTrackingLoading(false);
      toast.error(
        error?.response?.data?.message || "Failed to retrieve tracking info.",
      );
    }
  };

  const handleTrackingEbay = async (orderId) => {
    try {
      setIsTrackingEbayLoading(true);
      const res = await pushTrackingToEbay(orderId);
      toast.success(res?.message || "Tracking info retrieved successfully!");
      setIsTrackingEbayLoading(false);
    } catch (error) {
      setIsTrackingEbayLoading(false);
      toast.error(
        error?.response?.data?.message || "Failed to retrieve tracking info.",
      );
    }
  };

  return (
    <div>
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-[800px] w-full table-auto bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50 whitespace-nowrap">
            <tr>
              {[
                "Order ID",
                "Customer",
                "Time Stamp",
                "Marketplace Name",
                "Marketplace Status",
                "Vendor Name",
                "Vendor Status",
                "Unit",
                "Total",
                "Action",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          {filteredUsers.length > 0 ? (
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredUsers.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150 hover:shadow-sm"
                >
                  <td
                    className="px-6 py-4 font-medium text-[#005D68] relative group max-w-[150px] truncate"
                    onClick={() => handleRowClick(order)}
                  >
                    #{order.orderId}
                    <IoCopyOutline
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-[#005D68]"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(order?.orderId);
                        toast.success("Order ID copied!");
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-medium relative group max-w-[180px] truncate">
                    {order?.buyer?.buyerRegistrationAddress?.fullName || "N/A"}
                    <IoCopyOutline
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-[#005D68]"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(
                          order?.buyer?.buyerRegistrationAddress?.fullName,
                        );
                        toast.success("Customer name copied!");
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(order?.creationDate ?? ""), "dd.MM.yy")}{" "}
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs ml-2">
                      {format(
                        new Date(order?.creationDate),
                        "h:mm a",
                      ).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.market_name || ""}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${order.orderFulfillmentStatus?.toLowerCase() ===
                          "delivered" ||
                          order.orderFulfillmentStatus === "FULFILLED"
                          ? "bg-green-100 text-green-800"
                          : order.orderFulfillmentStatus === "Shipped"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.orderFulfillmentStatus === "Canceled"
                              ? "bg-red-100 text-red-800"
                              : order.orderFulfillmentStatus === "Completed"
                                ? "bg-teal-100 text-teal-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {order?.orderFulfillmentStatus ?? ""}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 relative group max-w-[160px] truncate">
                    {order?.vendor_name || ""}
                    <IoCopyOutline
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-[#005D68]"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(order.vendor_name);
                        toast.success("Vendor name copied!");
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 relative group max-w-[160px] truncate">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${order?.vendor_orders ? getStatusStyles(order?.vendor_orders) : getStatusStyles("pending")}`}>
                      {order?.vendor_orders ? order?.vendor_orders : "pending"}
                    </span>
                    <IoCopyOutline
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-[#005D68]"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(order?.vendor_orders);
                        toast.success("Vendor status copied!");
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order?.quantity || ""}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800 relative group">
                    ${order?.lineItemCost.value || ""}
                    <IoCopyOutline
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-[#005D68]"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(
                          order?.lineItemCost?.value,
                        );
                        toast.success("Total copied!");
                      }}
                    />
                  </td>
                  <td>
                    <Popover placement="bottom" showArrow={true}>
                      <PopoverTrigger className="ms-10 duration-200 rounded-[100%] -z-1 cursor-pointer text-[#089451]">
                        <button>
                          <BsThreeDotsVertical size={20} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <button
                          onClick={() => handleRowClick(order)}
                          className="mt-2 px-4 py-1 text-sm hover:bg-gray-200 rounded-md"
                        >
                          View Order details
                        </button>
                          <div className="flex flex-col gap-2">
                            <button onClick={() => handlePlaceOrder(order.market_name, order.orderId)}
                              className="mt-1 px-4 py-1 text-sm hover:bg-gray-200 rounded-md"
                            >
                              {isPlaceOrderLoading ? (
                                <div className="flex items-center gap-2 py-1 rounded-md">
                                  <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  <span>Loading...</span>
                                </div>
                              ) : (
                                "Place order"
                              )}
                            </button>
                            <button onClick={() => handleTrackingOrder(order.orderId)} className="px-4 py-1 text-sm hover:bg-gray-200 rounded-md">
                              {isTrackingLoading ? (
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  <span>Loading...</span>
                                </div>
                              ) : (
                                "Track order"
                              )}
                            </button>
                          </div>
                        {order.vendor_orders && ['delivered', 'shipped'].includes(order.vendor_orders.toLowerCase()) && (
                            <button
                              onClick={() => handleTrackingEbay(order.orderId)}
                              className="mt-2 px-4 py-1 rounded-md text-sm hover:bg-gray-200"
                            >
                              {isTrackingEbayLoading ? (
                                <div className="flex items-center gap-2 my-2">
                                  <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  <span>Loading...</span>
                                </div>
                              ) : (
                                "Push Tracking to Ebay"
                              )}
                            </button>
                          )}
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="7" className="px-6 py-12">
                  <div className="text-center md:ms-80 ms-0">
                    <div className="inline-block p-6 bg-gray-50 rounded-lg shadow-sm">
                      <svg
                        className="w-12 h-12 mx-auto mb-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-red-600 text-lg font-semibold mb-2">
                        {error || "No Orders Found"}
                      </p>
                      <p className="text-gray-500 text-sm mb-4">
                        {error
                          ? "There was an error loading your orders."
                          : "Try adjusting your search or filters."}
                      </p>
                      <button
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-150 shadow-sm hover:shadow"
                        onClick={handleRefresh}
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Try Again
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
