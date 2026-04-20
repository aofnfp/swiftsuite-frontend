import React from "react";
import { formatDeliveryDate, getStatusStyles } from "../utils/utils";
import DeliveryDetails from "./DeliveryDetails";
import Stepper from "./Stepper";
import { toast } from "sonner";
import usps from "../Images/usps.png";
import fedex from "../Images/fedex.png";

const CustomerDetails = ({ orderItem = {} }) => {
  const trackingNumber = orderItem?.vendor_orders?.tracking_number;
  const trackingUrl = orderItem?.vendor_orders?.tracking_url;
  const estimatedDelivery = orderItem?.vendor_orders?.delivered_at
  const status = orderItem?.vendor_orders?.status;
  const carrier = orderItem?.vendor_orders?.carrier?.toLowerCase();

  const priceSummary = orderItem?.vendor_orders?.price_summary;

  return (
    <div className="space-y-5 font-sans">
      <div className="bg-white rounded-xl border border-[#005D68]/20 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6 justify-between">
          <h2 className="text-2xl font-bold text-[#005D68]">Tracking details</h2>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${status ? getStatusStyles(status) : getStatusStyles("pending")}`}>
            Status: {status || "pending"}
          </span>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {trackingNumber && (
                <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                  Tracking Number
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-[#005D68]">{trackingNumber}</div>
          </div>
          {estimatedDelivery && (
            <div className="text-right">
              <div className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-1">
                {estimatedDelivery ? 'Estimated Date of Delivery' : ""}
              </div>
              <div className="text-2xl font-bold text-[#005D68]">{formatDeliveryDate(estimatedDelivery)}</div>
            </div>
          )}
        </div>
        <Stepper orderItem={orderItem} />
        <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-gray-100">
          {trackingUrl && (
            <div>
              <div className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-1">
                Tracking URL
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#005D68] text-sm">{trackingUrl}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(trackingUrl)}
                  className="text-gray-400 hover:text-[#005D68] transition-colors"
                  title="Copy"
                >
                  <svg onClick={(e) => {
                    e.stopPropagation(); navigator.clipboard.writeText(trackingUrl); toast.success("Tracking URL copied!");
                  }} xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          {carrier && (
            <div>
              <div className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-1">
                CARRIER
              </div>
              <div className="flex items-center gap-1">
                <span className="font-black text-[#FF6600] text-xl tracking-tight leading-none">
                  {carrier === "usps" ? <img src={usps} alt="USPS" className="w-20 h-10" /> :
                    carrier === "fedex" ? <img src={fedex} alt="FedEx" className="w-20 h-10" /> : <span className="text-sm text-gray-800">{carrier}</span>}
                  </span> 
              </div>
            </div>
          )}
        </div>
      </div>
      <DeliveryDetails  orderItem={orderItem} />
      <div className="bg-white rounded-xl border border-[#005D68]/20 shadow-sm p-6">
        <h3 className="font-bold text-xl text-[#005D68] mb-4">Vendor Pricing</h3>
        <div className="space-y-3">
            {priceSummary?.subtotal && priceSummary?.subtotal > 0 && (
          <div className="flex justify-between">
            <span className="text-[#005D68]">Subtotal:</span>
            <span className="font-medium text-[#005D68]">${priceSummary?.subtotal}</span>
          </div>
          )}
          {priceSummary?.shipping && priceSummary?.shipping > 0 && (
          <div className="flex justify-between">
            <span className="text-[#005D68]">Delivery (Shipping):</span>
            <span className="font-medium text-[#005D68]">${priceSummary?.shipping}</span>
          </div>
          )}
          {/* <div className="flex justify-between">
            <span className="text-[#005D68]">Tax:</span>
            <span className="font-medium text-[#005D68]">${priceSummary?.ebayCollectAndRemitTaxes?.[0]?.amount?.value}</span>
          </div> */}
          {priceSummary?.total && priceSummary?.total > 0 && (
          <div className="border-t pt-3">
            <div className="flex justify-between font-bold text-lg text-[#005D68] bg-[#BB823233] p-3 rounded-lg">
              <span>Total</span>
              <span>${priceSummary?.total}</span>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;