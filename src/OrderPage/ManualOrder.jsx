import { useState } from "react";
import { ShoppingCart, MapPin, Send, Loader2 } from "lucide-react";
import { placeOrder, pushTrackingToEbay, trackOrder } from "../api/authApi";
import { toast } from "sonner";
import { Toaster } from "sonner";

const ManualOrder = ({ orderItem = {} }) => {
  const [isPlaceOrderLoading, setIsPlaceOrderLoading] = useState(false);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [isTrackingEbayLoading, setIsTrackingEbayLoading] = useState(false);

  const vendorName = orderItem?.vendor_name;    
  const marketplacePlatform = orderItem?.market_name;
  const orderId = orderItem?.orderId;

  const handlePlaceOrder = async () => {
  try {
    setIsPlaceOrderLoading(true);

    const res = await placeOrder(marketplacePlatform, orderId);

    toast.success(res?.data?.message || "Order placed successfully.");
  } catch (error) {
    if (error?.response?.status === 403) {
      toast.error(
        error?.response?.data?.detail || "Something went wrong."
      );
    } else {
      toast.error(
        error?.response?.data?.message || "Failed to place order."
      );
      setError("Something went wrong, please try again later");
    }
  } finally {
    setIsPlaceOrderLoading(false);
  }
};

const handleTrackingOrder = async () => {
  try {
    setIsTrackingLoading(true);

    const res = await trackOrder(orderId);

    toast.success(res?.message || "Tracking info retrieved successfully!");
  } catch (error) {
    if (error?.response?.status === 403) {
      toast.error(
        error?.response?.data?.detail || "Something went wrong."
      );
    } else {
      toast.error(
        error?.response?.data?.message ||
          "Failed to retrieve tracking info."
      );
      setError("Something went wrong, please try again later");
    }
  } finally {
    setIsTrackingLoading(false);
  }
};

const handleTrackingEbay = async () => {
  try {
    setIsTrackingEbayLoading(true);

    const res = await pushTrackingToEbay(orderId);

    toast.success(res?.message || "Tracking pushed to eBay successfully!");
  } catch (error) {
    if (error?.response?.status === 403) {
      toast.error(
        error?.response?.data?.detail || "Something went wrong."
      );
    } else {
      toast.error(
        error?.response?.data?.message ||
          "Failed to push tracking to eBay."
      );
      setError("Something went wrong, please try again later");
    }
  } finally {
    setIsTrackingEbayLoading(false);
  }
};


  const actions = [
    {
      icon: ShoppingCart,
      title: "Place Order",
      description: "Choose this option to place an order manually",
      buttonLabel: "Place order manually",
      onClick: handlePlaceOrder,
      isLoading: isPlaceOrderLoading,
    },
    {
      icon: MapPin,
      title: "Track Order",
      description: "Choose this option to track the shipment status",
      buttonLabel: "Track order",
      onClick: handleTrackingOrder,
      isLoading: isTrackingLoading,
    },
    {
      icon: Send,
      title: "Push Order",
      description: "Choose this option to push this order to Ebay",
      buttonLabel: "Push order",
      onClick: handleTrackingEbay,
      isLoading: isTrackingEbayLoading,
    },
  ];

  return (
    <div className="w-full bg-white border-t-4 border-[#005D68] rounded-b-xl shadow-sm p-4">
    <Toaster position="top-right" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map(({ icon: Icon, title, description, buttonLabel, onClick, isLoading }) => (
          <div
            key={title}
            className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col gap-3 hover:border-[#005D68]/40 hover:shadow-sm transition-all"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={15} className="text-[#005D68]" />
                <div className="text-sm font-bold text-gray-800">{title}</div>
              </div>
              <div className="text-xs text-gray-500 leading-relaxed">{description}</div>
            </div>
            <button
              onClick={onClick}
              disabled={isLoading}
              className="self-start flex items-center gap-1.5 text-xs font-semibold text-[#005D68] border border-[#005D68] rounded-lg px-3 py-1.5 hover:bg-[#005D68] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 size={11} className="animate-spin" />}
              {buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManualOrder;