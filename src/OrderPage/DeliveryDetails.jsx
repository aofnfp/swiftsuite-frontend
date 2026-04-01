import { useState } from "react";
import { toast } from "sonner";
import MarketLogos from "../inventory/MarketLogos";
import VendorLogo from "../inventory/VendorLogos";
import usps from "../../public/image/usps.png";
import fedex from "../../public/image/fedex.png";

const DeliveryDetails = ({ orderItem = {} }) => {

  const o = orderItem;
  const fulfillmentStatus = o.orderFulfillmentStatus === "NOT_STARTED" ? "Not Started" : o.orderFulfillmentStatus;
  const cartStatus = o.vendor_orders?.status ? o.vendor_orders.status.charAt(0).toUpperCase() + o.vendor_orders.status.slice(1) : "Pending";

  const supplier = o.vendor_name?.toUpperCase();

  const buyerAddress = o.buyer?.buyerRegistrationAddress || {};
  const contactAddress = o.buyer?.buyerRegistrationAddress?.contactAddress || {};
  const taxAddress = o.buyer?.taxAddress || {};
  const sender = {
    name: o.buyer?.username,
    city: taxAddress.city,
    countryCode: taxAddress.countryCode,
    province: taxAddress.stateOrProvince,
    postalCode: taxAddress.postalCode,
  };

  const receiver = {
    name: buyerAddress?.fullName,
    address: contactAddress?.addressLine1,
    city: contactAddress?.city,
    countryCode: contactAddress?.countryCode,
    province: contactAddress?.stateOrProvince,
    postalCode: contactAddress?.postalCode,
    email: buyerAddress.email,
    phone: buyerAddress?.primaryPhone?.phoneNumber,
  };

  const marketplaceId = o.purchaseMarketplaceId || o.listingMarketplaceId || "";
  const isEbay = marketplaceId.toUpperCase().includes("EBAY") || o.market_name?.toLowerCase() === "ebay";

  const trackingNumber = o.vendor_orders?.tracking_number;

  const shippingMethod = o.vendor_orders?.carrier?.toLowerCase();
  const marketPlace = o.market_name;
  const orderTotal = o.vendor_orders?.price_summary?.total;
  const quantity = o.quantity;
  const categoryId = o.categoryId;

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Delivery Info */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="text-sm font-bold text-[#005D68] mb-4">Delivery Information</div>

          {/* Sender Row */}
          <div className="border border-dashed border-[#005D68]/30 rounded-xl p-4 mb-3 hover:border-[#005D68]/60 transition-colors">
            <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-3">Sender</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {sender?.city && (
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">City</div>
                  <div className="text-sm text-gray-600">{sender.city}</div>
                </div>
              )}
              {sender?.province && (
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">Province</div>
                  <div className="text-sm text-gray-800">{sender.province}</div>
                </div>
              )}
              {sender?.postalCode && (
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">Postal Code</div>
                  <div className="text-sm text-gray-800">{sender.postalCode}</div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              {sender?.name && (
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">Name</div>
                  <div className="text-sm text-gray-800">{sender.name}</div>
                </div>
              )}
              {sender?.countryCode && (
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">Country Code</div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">🇺🇸</span>
                    <span className="text-sm text-gray-800">{sender.countryCode}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Receiver Row */}
          <div className="border border-dashed border-[#005D68]/30 rounded-xl p-4 mb-3 hover:border-[#005D68]/60 transition-colors">
            <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-3">Receiver</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {receiver?.address && (
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">Address</div>
                  <div className="text-sm text-gray-600">{receiver.address}</div>
                </div>
              )}
              {receiver?.countryCode && (
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">Country Code</div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">🇺🇸</span>
                    <span className="text-sm text-gray-800">{receiver.countryCode}</span>
                  </div>
                </div>
              )}
              {receiver?.phone && (
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">Phone</div>
                  <div className="text-sm text-gray-800">{receiver.phone}</div>
                </div>
              )}
            </div>
            {receiver?.city && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">City</div>
                  <div className="text-sm text-gray-600">{receiver.city}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">Province</div>
                  <div className="text-sm text-gray-800">{receiver.province}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">Postal Code</div>
                  <div className="text-sm text-gray-800">{receiver.postalCode}</div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              {receiver?.name && (
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">Name</div>
                  <div className="text-sm text-gray-800">{receiver.name}</div>
                </div>
              )}
              {receiver?.email && (
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">Email</div>
                  <div className="text-sm text-gray-600 truncate">{receiver.email}</div>
                </div>
              )}
            </div>
          </div>

          {/* Tracking info row */}
          {(trackingNumber) && (
            <div className="border border-dashed border-[#005D68]/30 rounded-xl p-4 hover:border-[#005D68]/60 transition-colors">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">Order ID</div>
                  <div className="text-sm font-semibold text-gray-800">{o.orderId}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">SKU</div>
                  <div className="text-sm text-gray-800">{o.sku}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1.5">Tracking Number</div>
                  {trackingNumber ? (
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#005D68] text-sm truncate">{trackingNumber}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(trackingNumber)}
                          className="text-gray-400 hover:text-[#005D68] transition-colors"
                          title="Copy"
                        >
                          <svg onClick={(e) => {
                            e.stopPropagation(); navigator.clipboard.writeText(trackingNumber); toast.success("Tracking Number copied!");
                          }} xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic">Not yet assigned</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* {Shipping Info} */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="text-sm font-bold text-[#005D68] mb-4">Shipping Information</div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            {shippingMethod && (
              <div>
                <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-2">Shipped via</div>
                <div className="flex items-center gap-2">
                  {shippingMethod === "usps" ? <img src={usps} alt="USPS" className="w-20 h-10" /> :
                    shippingMethod === "fedex" ? <img src={fedex} alt="FedEx" className="w-20 h-10" /> : <span className="text-sm text-gray-800">{shippingMethod}</span>}
                </div>
              </div>
            )}
            {shippingMethod && (
              <div>
                <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-2">Shipping Method</div>
                <div className="text-sm text-gray-800 font-medium leading-snug"> {shippingMethod === "usps" ? <img src={usps} alt="USPS" className="w-20 h-10" /> :
                  shippingMethod === "fedex" ? <img src={fedex} alt="FedEx" className="w-20 h-10" /> : <span className="text-sm text-gray-800">{shippingMethod}</span>}</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            {supplier && (
              <div>
                <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-2">Supplier</div>
                <div className="-ms-3">
                  <VendorLogo vendor={supplier} />
                </div>
              </div>
            )}
            {marketPlace && (
              <div>
                <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-2">Marketplace</div>
                <MarketLogos marketName={marketPlace} />
                {/* {isEbay ? (
                  <div className="flex items-center">
                    <span className="font-black text-[#E53238] text-xl leading-none">e</span>
                    <span className="font-black text-[#0064D2] text-xl leading-none">b</span>
                    <span className="font-black text-[#F5AF02] text-xl leading-none">a</span>
                    <span className="font-black text-[#86B817] text-xl leading-none">y</span>
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-gray-800">{marketPlace}</div>
                )} */}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            {orderTotal && (
              <div>
                <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1">Order Total</div>
                <div className="text-base font-bold text-gray-800">
                  ${orderTotal}
                </div>
              </div>
            )}
            {cartStatus && (
              <div>
                <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1">Cart Status</div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
                  </svg>
                  <span className="text-sm font-semibold text-orange-500">{cartStatus}</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            {quantity && (
              <div>
                <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1">Quantity</div>
                <div className="text-base font-bold text-gray-800">{quantity}</div>
              </div>
            )}
            {categoryId && (
              <div>
                <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1">Category ID</div>
                <div className="text-sm text-gray-600">{categoryId}</div>
              </div>
            )}
          </div>
          {fulfillmentStatus && (
            <div className="pt-4 border-t border-gray-100">
              <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-2">Fulfillment Status</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-red-500">{fulfillmentStatus}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;