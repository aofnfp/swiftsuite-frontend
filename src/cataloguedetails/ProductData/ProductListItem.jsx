import React from "react";
import { IoIosCart } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Image } from "antd";
import { IoPricetagOutline } from "react-icons/io5";
import { formatTimeAgo } from "../../utils/utils";

const ProductListItem = ({
  product = {},
  handleListing = () => {},
  stripTags = (s) => s,
  setSelectedItem = () => {},
  setShowModal = () => {},
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

  const stopCardClick = (e) => e.stopPropagation();

  // ✅ Helper to get first valid value
  const getValue = (...values) =>
    values.find((v) => v !== null && v !== undefined && v !== "");

  // ✅ Derived values
  const titleValue = getValue(desc1, model, title, productName);
  const upcValue = getValue(upc, upccode, upc_code);
  const categoryValue = getValue(type, category_name, category);
  const brandValue = getValue(
    brand,
    manufacturer,
    brandName,
    manufacturer_name
  );
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

  return (
    <div
      onClick={() => handleListing(product)}
      className="flex flex-col sm:flex-row cursor-pointer justify-between p-4 gap-4 items-start w-full bg-white rounded-lg relative mb-5 hover:shadow-lg"
    >
      <div className="flex gap-4 relative">
        {created_at && (
          <div className="absolute -top-3 left-0 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
            Added {formatTimeAgo(created_at)}
          </div>
        )}

        {/* ✅ Image */}
        <div
          className="min-w-[120px] mt-5 max-w-[170px] h-[180px] flex items-center justify-center rounded overflow-hidden bg-white border border-gray-100 p-3 relative"
          onClick={stopCardClick}
          onMouseDown={stopCardClick}
        >
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

        {/* ✅ Details */}
        <div className="flex flex-col justify-start gap-2 text-sm flex-1">
          {titleValue && (
            <p className="text-base font-semibold text-gray-900 line-clamp-2">
              {titleValue}
            </p>
          )}

          <div className="space-y-1">
            {sku && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 font-bold">SKU:</span>
                <span className="bg-gray-200 text-xs px-2 py-1 rounded md:ms-6">
                  {sku}
                </span>
              </div>
            )}

            {upcValue && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-600">UPC:</span>
                <span className="bg-green-100 text-xs px-2 py-1 rounded md:ms-6">
                  {upcValue}
                </span>
              </div>
            )}

            {categoryValue && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600">
                  Category:
                </span>
                <span className="bg-blue-100 text-xs px-2 py-1 rounded">
                  {categoryValue}
                </span>
              </div>
            )}

            {brandValue && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600">Brand:</span>
                <span className="bg-yellow-100 text-xs px-2 py-1 rounded md:ms-4">
                  {brandValue}
                </span>
              </div>
            )}

            {gender && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600">Gender:</span>
                <span className="bg-purple-100 text-xs px-2 py-1 rounded md:ms-3">
                  {gender}
                </span>
              </div>
            )}
          </div>

          {/* ✅ Description */}
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

      {/* ✅ Right side */}
      <div className="w-1/4 md:mt-10 md:ms-0 ms-40 p-3 text-center text-sm flex gap-5">
        {quantityValue && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center text-sm text-teal-600 font-medium mb-1 gap-1">
              <IoIosCart size={16} />
              <p>Quantity</p>
            </div>
            <div className="bg-[#005D6833] rounded-lg p-3 min-w-[60px] flex items-center justify-center">
              <span className="text-xl font-bold text-gray-800">
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
              <span className="text-xl font-bold">${priceValue}</span>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Delete */}
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
};

export default ProductListItem;