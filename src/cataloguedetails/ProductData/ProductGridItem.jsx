import React from "react";
import { IoIosCart } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Image } from "@heroui/react";
import { IoPricetagOutline } from "react-icons/io5";

const ProductGridItem = ({
  item = {},
  activeProductId,
  handleListing = () => {},
  setSelectedItem = () => {},
  setShowModal = () => {},
}) => {
  const {
    id,
    image,
    brand,
    brandName,
    manufacturer,
    manufacturer_name,
    model,
    productName,
    title,
    desc1,
    sku,
    itemnumber,
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
  } = item || {};

  return (
    <div
      onClick={() => handleListing(item)}
      className={`relative cursor-pointer rounded-xl mb-5 pb-3 ${
        activeProductId === id ? "shadow-lg border-2 border-[#D9E8E1] bg-white" : "bg-white shadow-sm"
      }`}
    >
      <div className="flex justify-between items-center px-4 pt-3">
        <div className="text-[#089451] text-xl hover:text-red-600">
          <RiDeleteBin5Line
            onClick={(e) => {
              setSelectedItem(item);
              setShowModal(true);
              e.stopPropagation();
            }}
          />
        </div>
        <p className="bg-[#027840] text-sm shadow-4xl whitespace-nowrap w-[6rem] text-white rounded-tr-xl rounded-l-[10px] text-center py-2">
          {brand || brandName || manufacturer || manufacturer_name}
        </p>
      </div>

      <div className="flex justify-center items-center w-full mt-6 mb-4">
        <div className="h-40 w-40 flex justify-center items-center border border-gray-200 rounded-md z-0">
          <Image
            isZoomed
            src={image}
            alt={title || ""}
            className="object-cover min-w-[140px] max-w-[140px] h-[140px] rounded-md"
          />
        </div>
      </div>

      <div className="text-center mb-4 px-2">
        <h3 className="text-sm font-medium text-gray-900 leading-tight">
          {model || productName || title || desc1 ? `${(model || title || productName || desc1).toLowerCase()}` : ""}
        </h3>
      </div>

      <div className="w-full space-y-2 mb-4">
        <div className="bg-[#BB823233] rounded px-3 py-1.5 text-xs break-words max-w-[200px] mx-auto text-center flex justify-center items-center">
          <span className="text-gray-600">SKU: </span>
          <span className="text-gray-800 font-medium">
            <p>{sku || itemnumber || 0}</p>
          </span>
        </div>

        <div className="bg-[#00000033] rounded px-3 py-1.5 text-xs break-words max-w-[200px] mx-auto text-center flex justify-center items-center">
          <span className="text-gray-600">Brand: </span>
          <span className="text-gray-800 font-medium">
            {brand || brandName || manufacturer || manufacturer_name || "N/A"}
          </span>
        </div>
      </div>

      <div className="w-full space-y-1 text-sm text-center pb-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center text-sm text-teal-600 font-medium mb-1 gap-1">
            <IoIosCart size={16} />
            <p>Quantity</p>
          </div>
          <div className="bg-[#005D6833] rounded-lg p-3 min-w-[60px] flex items-center justify-center">
            <span className="text-sm font-bold text-gray-800">
              {inventory_on_hand || quantity || quantity_available_to_ship_combined || minimumorderquantity || quantityAvailable || 0}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center text-sm text-teal-600 font-medium mb-1 gap-1">
            <IoPricetagOutline size={16} />
            <p>Price</p>
          </div>
          <div className="bg-green-600 text-white rounded-lg px-4 py-3 min-w-[60px] flex items-center justify-center">
            <span className="text-sm font-bold">
              ${price || dealer_price || total_product_cost || wholesalePriceUSD || price1 || wholesale || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductGridItem;