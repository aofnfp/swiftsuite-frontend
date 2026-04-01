
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineCalendarViewMonth } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import MarketLogos from "./MarketLogos";
import VendorLogo from "./VendorLogos";
import { Image } from "@heroui/react";
import { Tooltip } from "antd";
import { formatInventoryDate } from "../utils/utils";

const InventoryListItem = ({ item, handleEditInventory, deleteLoader, setSelectedItemId, setShowModal, showCheckboxes, checkedItems, onToggleItem, handleInventoryDetail }) => {

  const handleLoadUrl = () => {
    if (item?.market_item_url) {
      window.open(item?.market_item_url, "_blank");
    }
  }

  const status = item?.ends_status;
  // Treat missing or explicit "Null" as no status
  const hasStatus = status && status !== "Null" && status !== "null";
  const isActive = hasStatus && status.toLowerCase() === "active";

  return (
    <div className="relative flex flex-col md:flex-row rounded-xl overflow-hidden bg-white shadow-sm">
      {showCheckboxes && (
        <div className="flex items-center justify-center pl-4">
          <input
            type="checkbox"
            checked={checkedItems.includes(item.id)}
            onChange={() => onToggleItem(item.id)}
            className={`w-4 h-4 appearance-none border-1 border-[#089451] rounded ${checkedItems.includes(item?.id) ? "bg-[#089451] border-[#089451]" : ""}`}
          />
        </div>
      )}
      <div className="md:w-[20%] flex flex-col items-center gap-3 border-r relative p-4">
        <p>
          {hasStatus ? (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          ) : ""}
        </p>
        <div className="flex items-center justify-center w-full mt-6">
          <Image
            isZoomed
            src={item?.picture_detail || "NoImage"}
            alt={item?.title || ""}
            className="w-24 h-24 object-cover rounded-md shadow-sm -z-1"
          />
        </div>
      </div>

      <div className="w-full md:w-[22%] bg-[#e6f0eb] p-3 flex flex-col justify-center">
        <div className="mb-3">
          <h3 className="text-center font-medium text-sm">Title</h3>
          <p className="text-center text-sm">
            {item?.title !== "Null" ? item?.title : ""}
          </p>
        </div>

        <div className="mb-3">
          <h3 className="text-center font-medium text-sm">
            Minimum Profit Margin
          </h3>
          <p className="text-center text-sm">
            {item?.min_profit_mergin !== "Null" ? item?.min_profit_mergin : ""}
          </p>
        </div>
      </div>
      <div className="w-full md:w-[58%] p-3">
        <h3 className="font-medium text-base mb-2">
          {item?.title !== "Null" ? item?.title : ""}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm">
          <div className="flex">
            <p className="font-medium w-20">UPC:</p>
            <p>{item?.upc !== "Null" ? item?.upc : ""}</p>
          </div>
          <div className="flex">
            <p className="font-medium w-28">Fixed Markup:</p>
            <p>{item?.fixed_markup !== "Null" ? item?.fixed_markup : ""}</p>
          </div>
          <div className="flex">
            <p className="font-medium w-20">SKU:</p>
            <p>{item?.sku !== "Null" ? item?.sku : ""}</p>
          </div>

          <div className="flex">
            <p className="font-medium w-28">Price:</p>
            <p className="text-[#e6967a]">
              {item?.start_price !== "Null" ? `$${item?.start_price}` : ""}
            </p>
          </div>
          <div className="flex">
            <p className="font-medium w-20">Brand:</p>
            <p>{item?.brand !== "Null" ? item?.brand : ""}</p>
          </div>
          <div className="flex">
            <p className="font-medium w-28">Quantity:</p>
            <span>
              {item?.quantity !== "Null" ? item?.quantity : ""}
            </span>
          </div>
          <div className="flex">
            <p className="font-medium w-24">Date Created:</p>
            <p className="text-gray-600">
              {item?.date_created}
            </p>
          </div>
          <div className="flex">
            <p className="font-medium w-28">Last Updated:</p>
            <p className="text-gray-600">
              {formatInventoryDate(item?.last_updated)}
            </p>
          </div>
          <div className="flex col-span-1 sm:col-span-2">
          </div>
        </div>
        <div className="flex mt-2 w-full items-center">
          <div
            role="link"
            tabIndex={0}
            onClick={handleLoadUrl}
            onKeyPress={(e) => { if (e.key === 'Enter') handleLoadUrl(); }}
            aria-label={item?.market_item_url ? `Open ${item.market_name} listing` : 'No external link'}
            className="relative group flex items-center cursor-pointer"
          >
            <MarketLogos
              marketLogos={item.marketLogos}
              marketName={item.market_name}
              marketItemUrl={item.market_item_url}
            />
            {
              item?.market_item_url &&
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-150">
                <span className="inline-flex items-center bg-green-600 text-white text-xs px-2 py-1 rounded shadow">
                  <FiExternalLink className="w-3 h-3 mr-1" />
                  Open
                </span>
              </div>
            }
          </div>

          <div className="ml-auto flex space-x-2 mt-2 lg:me-[-130px]">
            <VendorLogo vendor={item.vendor_name} />
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-3 px-5">
        <CiEdit
          onClick={() => handleEditInventory(item.id)}
          className="text-[#089451] text-xl cursor-pointer"
        />
        {deleteLoader[item.id] ? (
          <img src="/loading.gif" alt="loading" className="w-5 h-5" />
        ) : (
          <RiDeleteBin5Line
            onClick={() => {
              setSelectedItemId(item.id);
              setShowModal(true);
            }}
            className="text-[#089451] text-xl cursor-pointer hover:text-red-600"
          />
        )}
        <Tooltip title="View Inventory Details">
          <MdOutlineCalendarViewMonth
            className="text-[#089451] text-xl cursor-pointer"
            onClick={() => handleInventoryDetail(item)}
          />
        </Tooltip>
      </div>
    </div>
  );
}

export default InventoryListItem;