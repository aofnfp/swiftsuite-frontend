import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineCalendarViewMonth } from "react-icons/md";
import { Tooltip, Image } from "antd";
import MarketLogos from "./MarketLogos";
import VendorLogo from "./VendorLogos";
import { formatInventoryDate, fmtMarkup } from "../utils/utils";

export default function InventoryGridItem({
  item,
  handleEditInventory,
  deleteLoader,
  setSelectedItemId,
  setShowModal,
  handleInventoryDetail,
  showCheckboxes,
  checkedItems,
  onToggleItem,
}) {
  const handleLoadUrl = () => {
    if (item?.market_item_url) {
      window.open(item?.market_item_url, "_blank");
    }
  };

    const status = item?.ends_status;
  const hasStatus = status && status !== "Null" && status !== "null";
  const isActive = hasStatus && status.toLowerCase() === "active";

  return (
    <div className="relative flex flex-col bg-[#f3f8f6] rounded-lg overflow-hidden">
      {showCheckboxes && (
        <div className="absolute top-2 right-2 z-10">
          <input
            type="checkbox"
            checked={checkedItems.includes(item.id)}
            onChange={() => onToggleItem(item.id)}
            className={`w-4 h-4 appearance-none border-1 border-[#089451] rounded ${checkedItems.includes(item?.id)
              ? "bg-[#089451] border-[#089451]"
              : ""
              }`}
          />
        </div>
      )}
    
      <div className=" bg-white p-4 flex justify-between">
        <p>
          {hasStatus ? (
            <span className={`inline-flex items-center rounded-full text-xs px-2 font-medium ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          ) : ""}
        </p>
        <div className="bg-[#e6f0eb] px-2 py-0.5 rounded text-xs">
          {item?.sku && item?.sku !== "Null" ? item?.sku : ""}
        </div>
      </div>
      <div className="flex items-center justify-center p-5 w-full bg-white">
        <Image
          width={140}
          height={140}
          src={item?.picture_detail || "NoImage"}
          alt={item?.title}
          className="object-cover rounded-md"
          preview={{
            mask: (
              <div className="flex items-center justify-center w-full h-full backdrop-blur-sm bg-black/40 text-white font-medium">
                View
              </div>
            ),
          }}
        />
      </div>
      <div className="p-2 bg-white">
        <h3 className="text-sm font-medium mb-1">
          {item?.title && item?.title !== "Null" ? item?.title : ""}
        </h3>

        <div className="text-xs mb-1">
          <p className="font-bold mb-0.5">SKU</p>
          <p className="text-gray-600">{item?.sku && item?.sku !== "Null" ? item?.sku : ""}</p>
        </div>

        <div className="text-xs mb-1">
          <p className="font-bold mb-0.5">Brand</p>
          <p className="text-gray-600">{item?.brand && item?.brand !== "Null" ? item?.brand : ""}</p>
        </div>
        <div className="text-xs mb-1">
          <p className="font-bold mb-0.5">Date Created</p>
          <p className="text-gray-600">
            {item?.date_created}
          </p>
        </div>
        <div className="text-xs mb-1">
          <p className="font-bold mb-0.5">Last Updated</p>
          <p className="text-gray-600">
            {formatInventoryDate(item?.last_updated)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 text-xs bg-[#e6f0eb] p-2">
        <div className="text-center">
          <p className="font-medium mb-0.5">Fixed Markup</p>
          <p>{fmtMarkup(item?.fixed_markup)}</p>
        </div>

        <div className="text-center">
          <p className="font-medium mb-0.5">Minimum Profit Margin</p>
          <p>{fmtMarkup(item?.min_profit_mergin)}</p>
        </div>

        <div className="text-center mt-1">
          <p className="font-medium mb-0.5">MAP</p>
          <p>{item?.map && item?.map !== "Null" ? item?.map : ""}</p>
        </div>

        <div className="text-center mt-1">
          <p className="font-medium mb-0.5">Price</p>
          <p className="text-[#e6967a]">
            {item?.start_price && item?.start_price !== "Null" ? `$${item?.start_price}` : ""}
          </p>
        </div>
      </div>
      <div className="p-2 bg-white">
        <div className="flex justify-center space-x-3 mb-2">
          <div className="text-[#089451] text-xl cursor-pointer">
            <Tooltip placement="top" title="View Inventory Details">
              <MdOutlineCalendarViewMonth
                onClick={() => handleInventoryDetail(item)}
              />
            </Tooltip>
          </div>
          <div
            className="text-[#089451] text-xl cursor-pointer"
            onClick={() => handleEditInventory(item.id)}
          >
            <CiEdit />
          </div>
          <div
            className="text-[#089451] text-xl cursor-pointer"
            onClick={() => {
              setSelectedItemId(item.id);
              setShowModal(true);
            }}
          >
            {deleteLoader[item.id] ? (
              <img src="/loading.gif" alt="Loading..." className="w-5 h-5" />
            ) : (
              <RiDeleteBin5Line />
            )}
          </div>
        </div>

        <div className="flex mt-2 w-full" onClick={handleLoadUrl}>
          <MarketLogos
            marketLogos={item.marketLogos}
            marketName={item.market_name}
          />
          <div className="ml-auto flex space-x-2 mt-2">
            <VendorLogo vendor={item.vendor_name} />
          </div>
        </div>
      </div>
    </div>
  );
}
