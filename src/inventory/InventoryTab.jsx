import React from "react";
import {
  Truck,
  Shield,
} from "lucide-react";
import { useInventoryPrefsStore } from "../stores/inventoryPrefs";

const InventoryTab = ({ inventoryDetail, parsedItemSpecific }) => {
  const activeTab = useInventoryPrefsStore((s) => s.inventoryDetailActiveTab);
  const setActiveTab = useInventoryPrefsStore((s) => s.setInventoryDetailActiveTab);
  
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="border-b">
        <nav className="flex space-x-8 px-6">
          {["details", "specifications", "shipping"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-8">
        {activeTab === "details" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Description
            </h3>
            <p
              className="text-gray-700 leading-relaxed mb-6"
              dangerouslySetInnerHTML={{
                __html: inventoryDetail.description,
              }}
            ></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="px-5">
                <h4 className="text-gray-900 mb-3 text-lg font-semibold">
                  Business Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost Price:</span>
                    <span className="font-medium">
                      ${inventoryDetail.total_product_cost}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Price:</span>
                    <span className="font-medium">
                      ${inventoryDetail.start_price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Offer:</span>
                    <span
                      className={`font-medium ${
                        inventoryDetail.bestOfferEnabled
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {inventoryDetail.bestOfferEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category ID:</span>
                    <span className="font-medium">
                      {inventoryDetail.category_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Postal Code:</span>
                    <span className="font-medium">
                      {inventoryDetail.postal_code}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Marketplace & Profiles
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listing Type:</span>
                    <span className="font-medium">
                      {inventoryDetail.listingType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Profile:</span>
                    <span className="font-medium">
                      {inventoryDetail.payment_profileName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return Profile:</span>
                    <span className="font-medium">
                      {inventoryDetail.return_profileName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Profile:</span>
                    <span className="font-medium">
                      {inventoryDetail.shipping_profileName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "specifications" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {parsedItemSpecific &&
                Object.entries(parsedItemSpecific).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-3 border-b border-gray-100 px-5"
                  >
                    <span className="text-gray-600 font-medium">{key}:</span>
                    <span className="text-gray-900">
                      {value !== "Null" ? value : ""}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Shipping Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Free Standard Shipping
                    </p>
                    <p className="text-sm text-gray-600">5-7 business days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Buyer Protection
                    </p>
                    <p className="text-sm text-gray-600">
                      Full refund if not received
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Shipping Details
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Ships from:</span>
                    <span>{inventoryDetail.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Profile:</span>
                    <span>{inventoryDetail.shipping_profileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Return Policy:</span>
                    <span>{inventoryDetail.return_profileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Policy:</span>
                    <span>{inventoryDetail.payment_profileName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryTab;
