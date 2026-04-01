import { Image } from "@heroui/react";
import React from "react";

const OrderItem = ({ orderItem = [] }) => {

  return (
    <div>
      {" "}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row items-start gap-4 md:items-center md:justify-between">
            <div className="w-full md:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 self-center md:self-auto">
              <Image
                isZoomed
                src={orderItem?.image}
                alt="Product"
                className="object-cover w-full h-full -z-1"
              />
            </div>
            <div className="flex-1 w-full">
              {orderItem.title && (
              <h2 className="text-lg font-bold text-[#005D68] mb-2">
                {orderItem?.title}
              </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                {orderItem?.orderId && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[#005D68] font-bold">
                    Order ID:
                  </span>
                  <span className="font-medium text-[#005D68]">{orderItem.orderId}</span>
                </div>
                )}
                {orderItem?.quantity && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[#005D68] font-bold">Unit:</span>
                  <span className="font-medium text-[#005D68]">
                    {orderItem?.quantity}
                  </span>
                </div>
                )}
                {orderItem?.sku && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[#005D68] font-bold">SKU:</span>
                  <span className="font-medium text-[#005D68]">
                    {orderItem?.sku}
                  </span>
                </div>
                )}
                {orderItem?.lineItemCost?.value && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[#005D68] font-bold">Price:</span>
                  <span className="font-medium text-[#005D68]">
                    ${orderItem?.lineItemCost?.value}
                  </span>
                </div>
                )}
                {orderItem?.localizeAspects?.color && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[#005D68] font-bold">Color:</span>
                  <span className="font-medium text-[#005D68]">
                    {orderItem?.localizeAspects?.color}
                  </span>
                </div>
                )}
                {orderItem?.lineItemCost?.value && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[#005D68] font-bold">Total:</span>
                  <span className="font-medium text-[#005D68]">
                    ${orderItem?.lineItemCost?.value}
                  </span>
                </div>
                )}
                {orderItem?.localizeAspects?.upc && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[#005D68] font-bold">UPC:</span>
                  <span className="font-medium text-[#005D68]">
                    {orderItem?.localizeAspects?.upc}
                  </span>
                </div>
                )}
                {orderItem?.localizeAspects?.brand && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[#005D68] font-bold">Brand:</span>
                  <span className="font-medium text-[#005D68]">
                    {orderItem?.localizeAspects?.brand}
                  </span>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
