import React, { useEffect, useState } from "react";
import { ArrowLeft, User } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrderDetails } from "../api/authApi";
import { toast, Toaster } from "sonner";
import OrderItem from "./OrderItem";
import CustomerDetails from "./CustomerDetails";
import OrderLoader from "./OrderLoader";
import { fixJSON, getStatusStyles, parseDescription } from "../utils/utils";
import RecentOrders from "./RecentOrders";
import ManualOrder from "./ManualOrder";
import SubscriptionModal from "../pages/SubscriptionModal";

const OrderDetails = () => {
  const params = useParams();
  const orderId = params?.orderDetail || "";
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [orderItem, setOrderItem] = useState([]);
  const [loader, setLoader] = useState(false);
  const [trackingSent, setTrackingSent] = useState(false);
  const [shipping, setShipping] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrders(orderId);
    }
  }, [orderId]);


  useEffect(() => {
    if (!orderId) {
      navigate("/layout/orders");
    }
  }, [orderId, navigate]);

  const fetchOrders = async () => {
    setLoader(true);
    try {
      const response = await getOrderDetails(orderId);
      const {
        image,
        buyer,
        paymentSummary,
        pricingSummary,
        itemLocation,
        lineItemCost,
        localizeAspects,
        description,
        additionalImages,
        fulfillmentStartInstructions,
        vendor_orders,
        ...rest
      } = response;

      let parsedBuyer = {};
      try { parsedBuyer = fixJSON(buyer); } catch (_) { }
      let parsedLocalizeAspects = {};
      try {
        parsedLocalizeAspects = Object.fromEntries(
          Object.entries(fixJSON(localizeAspects)).map(([key, value]) => [
            key.toLowerCase(),
            value.toLowerCase(),
          ])
        );
      } catch (_) { }
      let parsedDescription = null;
      try { parsedDescription = parseDescription(description); } catch (_) { }
      let parsedLineItemCost = {};
      try { parsedLineItemCost = fixJSON(lineItemCost); } catch (_) { }

      setOrderItem({
        ...rest,
        image: image,
        buyer: fixJSON(buyer),
        vendor_orders: vendor_orders[0] ?? null,
        localizeAspects: parsedLocalizeAspects,
        description: parseDescription(description),
        lineItemCost: fixJSON(lineItemCost),
      });
      setLoader(false);
      return {
        ...rest,
        buyer: fixJSON(buyer),
        paymentSummary: fixJSON(paymentSummary),
        pricingSummary: fixJSON(pricingSummary),
        itemLocation: fixJSON(itemLocation),
        lineItemCost: fixJSON(lineItemCost),
        localizeAspects: parsedLocalizeAspects,
        additionalImages: fixJSON(additionalImages),
        fulfillmentStartInstructions: fixJSON(fulfillmentStartInstructions),
        description: parseDescription(description),
        vendor_orders: vendor_orders,
      };
    } catch (err) {
      setError("Something went wrong, please try again later");
    } finally {
      setLoader(false);
    }
  };

  const handleTrackingSentChange = (e) => {
    setTrackingSent(e.target.checked);
  };
  const handleShipping = (e) => {
    setShipping(e.target.checked);
  };

  return (
    <div className="flex flex-col h-screen">
      <Toaster position="top-right" />
      <SubscriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      {error ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="bg-white shadow-lg p-8 rounded-lg text-center max-w-md">
            <p className="text-red-600 text-2xl font-bold mb-2">Error</p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-5 rounded-full"
              onClick={fetchOrders}
            >
              {loader ? "Loading..." : "Try Again"}
            </button>
          </div>
        </div>
      ) : loader ? (
        <OrderLoader />
      ) : (
        <div className="p-4">
          <div className="flex items-center gap-4 mb-3">
            <Link
              to="/layout/order"
              className="flex items-center gap-2 hover:text-white mt-12 bg-orange-500 rounded-lg text-white p-2"
            >
              <ArrowLeft size={20} />
              Return
            </Link>
          </div>
          <div>
            <div className="flex items-center justify-between rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                {orderItem?.orderId && (
                  <h1 className="text-2xl font-bold text-[#005D68]">
                    Order #{orderItem?.orderId}
                  </h1>
                )}
                {orderItem?.vendor_orders?.status && (
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyles(orderItem?.vendor_orders?.status)}`}
                  >
                    {orderItem?.vendor_orders?.status}
                  </span>
                )}
                <span className="text-[#005D68] text-sm font-semibold">
                  {new Date(orderItem?.creationDate ?? "").toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-6">
              <div className="lg:col-span-2 space-y-6">
                <OrderItem orderItem={orderItem} />
                <CustomerDetails
                  trackingSent={trackingSent}
                  shipping={shipping}
                  handleTrackingSentChange={handleTrackingSentChange}
                  handleShipping={handleShipping}
                  orderItem={orderItem}
                />
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <ManualOrder orderItem={orderItem} />
                </div>
              </div>
              <div className="space-y-6 bg-white">
                <RecentOrders data={orderItem} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
