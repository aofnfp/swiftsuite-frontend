import React from "react";
import { IoIosCart } from "react-icons/io";

import { RiDeleteBin5Line } from "react-icons/ri";
import { Image } from "@heroui/react";
import { IoPricetagOutline } from "react-icons/io5";
import { formatTimeAgo } from "../../utils/utils";

const ProductListItem = ({
  product = {},
  handleListing = () => { },
  stripTags = (s) => s,
  setSelectedItem = () => { },
  setShowModal = () => { },
}) => {
  const {
    image,
    title,
    desc1,
    model,
    productName,
    sku,
    upc,
    upccode,
    upc_code,
    type,
    category_name,
    category,
    brand,
    manufacturer,
    brandName,
    manufacturer_name,
    gender,
    inventory_on_hand,
    quantity,
    quantity_available_to_ship_combined,
    minimumorderquantity,
    quantityAvailable,
    price,
    dealer_price,
    total_product_cost,
    wholesalePriceUSD,
    price1,
    wholesale,
    created_at,
  } = product || {};

  return (
    <div
      onClick={() => handleListing(product)}
      className="flex flex-col sm:flex-row cursor-pointer justify-between p-4 gap-4 items-start w-full bg-white rounded-lg relative mb-5 hover:shadow-lg"
    >
      <div className="flex gap-4 relative">
        <div className="absolute -top-3 left-0 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
          Added {formatTimeAgo(created_at)}
        </div>
        <div className="min-w-[120px] mt-5 max-w-[170px] h-[180px] flex items-center justify-center rounded overflow-hidden bg-white border border-gray-100 p-3 z-0 relative">
          <Image
            isZoomed
            src={image}
            alt={title || ""}
            className="object-cover min-w-[140px] max-w-[140px] h-[180px]"
          />
        </div>

        <div className="flex flex-col justify-start gap-2 text-sm flex-1">
          <p className="text-base font-semibold text-gray-900 line-clamp-2">
            {desc1 || model || title || productName || ""}
          </p>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 font-bold">SKU:</span>
              <span className="bg-gray-200 text-xs px-2 py-1 rounded md:ms-6">
                {sku}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600">UPC:</span>
              <span className="bg-green-100 text-xs px-2 py-1 rounded md:ms-6">
                {upc || upccode || upc_code || 0}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-600">Category:</span>
              <span className="bg-blue-100 text-xs px-2 py-1 rounded">
                {type || category_name || category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-600">Brand:</span>
              <span className="bg-yellow-100 text-xs px-2 py-1 rounded md:ms-4">
                {brand || manufacturer || brandName || manufacturer_name}
              </span>
            </div>

            {gender && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600">Gender:</span>
                <span className="bg-purple-100 text-xs px-2 py-1 rounded md:ms-3">
                  {gender}
                </span>
              </div>
            )}
          </div>

          <p className="text-gray-500 text-sm line-clamp-2">
            {stripTags(
              title ||
              model ||
              productName ||
              desc1 ||
              product?.description ||
              product?.description1 ||
              product?.full_description ||
              product?.detailed_description ||
              ""
            )}
          </p>
        </div>
      </div>

      <div className="w-1/4 md:mt-10 md:ms-0 ms-40 p-3 text-center text-sm flex gap-5">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center text-sm text-teal-600 font-medium mb-1 gap-1">
            <IoIosCart size={16} />
            <p>Quantity</p>
          </div>
          <div className="bg-[#005D6833] rounded-lg p-3 min-w-[60px] flex items-center justify-center">
            <span className="text-xl font-bold text-gray-800">
              {inventory_on_hand ||
                quantity ||
                quantity_available_to_ship_combined ||
                minimumorderquantity ||
                quantityAvailable ||
                0}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center text-sm text-teal-600 font-medium mb-1 gap-1">
            <IoPricetagOutline size={16} />
            <p>Price</p>
          </div>
          <div className="bg-green-600 text-white rounded-lg px-4 py-3 min-w-[60px] flex items-center justify-center">
            <span className="text-xl font-bold">
              $
              {price ||
                dealer_price ||
                total_product_cost ||
                wholesalePriceUSD ||
                price1 ||
                wholesale ||
                0}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-2 text-[#089451] cursor-pointer text-xl hover:text-red-600">
        <RiDeleteBin5Line
          onClick={(e) => {
            setSelectedItem(product);
            setShowModal(true);
            e.stopPropagation();
          }}
        />
      </div>
    </div>
  );
}

export default ProductListItem;