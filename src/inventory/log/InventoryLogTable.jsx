import React from "react";
import { serverTimeFormat } from "../../utils/utils";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import MarketLogos from "../MarketLogos";
import VendorLogo from "../VendorLogos";
import { useNavigate } from "react-router-dom";

const InventoryLogTable = ({ filteredUsers, dropdownRef }) => {

  const navigate = useNavigate();

   const handleInventoryDetail = (item) => {
    navigate(`/layout/inventory/${item.inventory_id}`);
  };
  
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {["Updated SKU", "Market Name", "Description", "Vendor Name", "Last Updated", "Actions"].map((text) => (
              <th
                key={text}
                className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap"
              >
                {text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody ref={dropdownRef} className="divide-y divide-gray-100">
          {filteredUsers.map((user) => (
            <tr
              key={user?.id}
              className="hover:bg-gray-50 transition-colors duration-150 group"
            >
              <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                {user?.updated_sku !== "Null" ? user?.updated_sku : "—"}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                <MarketLogos marketName={user?.market_name} className="h-5 w-5" />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                <span className="block truncate">
                  {user?.log_description !== "Null" ? user?.log_description : "—"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800 whitespace-nowrap">
                <VendorLogo vendor={user?.vendor_name} className="h-10 w-10" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-gray-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" d="M12 6v6l4 2" />
                  </svg>
                  <span className="text-sm text-gray-500">
                    {serverTimeFormat(user?.last_updated)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <Popover placement="bottom-end" showArrow={false}>
                  <PopoverTrigger>
                    <button className="inline-flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150">
                      <BsThreeDotsVertical size={15} className="md:-ms-20 ms-0"/>
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="z-50 p-1 bg-white border border-gray-200 rounded-xl shadow-lg w-40">
                    <div className="flex flex-col">
                      <button
                        onClick={() => handleInventoryDetail(user)}
                        className="text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryLogTable;