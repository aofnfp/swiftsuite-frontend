import React from "react";
import { IoIosCart } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Image } from "antd";
import { IoPricetagOutline } from "react-icons/io5";

const ProductGridItem = ({
  item = {},
  activeProductId,
  handleListing = () => { },
  setSelectedItem = () => { },
  setShowModal = () => { },
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

  // ✅ helper
  const getValue = (...values) =>
    values.find((v) => v !== null && v !== undefined && v !== "");

  // ✅ derived values
  const brandValue = getValue(
    brand,
    brandName,
    manufacturer,
    manufacturer_name
  );
  const titleValue = getValue(model, productName, title, desc1);
  const skuValue = getValue(sku, itemnumber);
  const quantityValue = getValue(
    inventory_on_hand,
    quantity,
    quantity_available_to_ship_combined,
    minimumorderquantity,
    quantityAvailable
  );
  const priceValue = getValue(
    price,
    dealer_price,
    total_product_cost,
    wholesalePriceUSD,
    price1,
    wholesale
  );

  const stopCardClick = (e) => e.stopPropagation();

  return (
    <div
      onClick={() => handleListing(item)}
      className={`relative cursor-pointer rounded-xl mb-5 pb-3 ${activeProductId === id
          ? "shadow-lg border-2 border-[#D9E8E1] bg-white"
          : "bg-white shadow-sm"
        }`}
    >
      {/* ✅ Top section */}
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

        {brandValue && (
          <p className="bg-[#027840] text-sm whitespace-nowrap w-[6rem] text-white rounded-tr-xl rounded-l-[10px] text-center py-2">
            {brandValue}
          </p>
        )}
      </div>

      {/* ✅ Image */}
      <div className="flex justify-center items-center w-full mt-6 mb-4">
        <div className="h-40 w-40 flex justify-center items-center border border-gray-200 rounded-md" onClick={stopCardClick}
          onMouseDown={stopCardClick}>
          {image ? (
            <Image
              width={140}
              height={140}
              src={image}
              alt={titleValue || ""}
              className="object-cover rounded-md"
              preview={{
                mask: (
                  <div className="flex items-center justify-center w-full h-full text-white font-medium">
                    View
                  </div>
                ),
              }}
            />
          ) : (
            <div className="w-[140px] h-[140px] flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>
      </div>

      {/* ✅ Title */}
      {titleValue && (
        <div className="text-center mb-4 px-2">
          <h3 className="text-sm font-medium text-gray-900 leading-tight">
            {titleValue.toLowerCase()}
          </h3>
        </div>
      )}

      {/* ✅ SKU + Brand */}
      <div className="w-full space-y-2 mb-4">
        {skuValue && (
          <div className="bg-[#BB823233] rounded px-3 py-1.5 text-xs break-words max-w-[200px] mx-auto text-center flex justify-center items-center">
            <span className="text-gray-600">SKU: </span>
            <span className="text-gray-800 font-medium ml-1">
              {skuValue}
            </span>
          </div>
        )}

        {brandValue && (
          <div className="bg-[#00000033] rounded px-3 py-1.5 text-xs break-words max-w-[200px] mx-auto text-center flex justify-center items-center">
            <span className="text-gray-600">Brand: </span>
            <span className="text-gray-800 font-medium ml-1">
              {brandValue}
            </span>
          </div>
        )}
      </div>

      {/* ✅ Quantity + Price */}
      <div className="w-full space-y-1 text-sm text-center pb-4">
        {quantityValue && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center text-sm text-teal-600 font-medium mb-1 gap-1">
              <IoIosCart size={16} />
              <p>Quantity</p>
            </div>
            <div className="bg-[#005D6833] rounded-lg p-3 min-w-[60px] flex items-center justify-center">
              <span className="text-sm font-bold text-gray-800">
                {quantityValue}
              </span>
            </div>
          </div>
        )}

        {priceValue && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center text-sm text-teal-600 font-medium mb-1 gap-1">
              <IoPricetagOutline size={16} />
              <p>Price</p>
            </div>
            <div className="bg-green-600 text-white rounded-lg px-4 py-3 min-w-[60px] flex items-center justify-center">
              <span className="text-sm font-bold">
                ${priceValue}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGridItem;