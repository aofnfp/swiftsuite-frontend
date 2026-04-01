import React, { useState, useEffect, useRef } from "react";
import { Input } from "@heroui/react";
import { Search, X } from "react-feather";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { IoMdCheckmark } from "react-icons/io";

const WooCategorySelect = ({
  wooCategories = [],
  loadingWooCategories,
  selectedCategories,
  setSelectedCategories,
  productListing,
}) => {
  
  const [filterValue, setFilterValue] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loadingWooCategories) return null;

  const filteredOptions = wooCategories.filter((cat) =>
    cat?.name?.toLowerCase().includes(filterValue.toLowerCase())
  );

  const toggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = (value) => {
    setSelectedCategories([value]);
    setIsOpen(false);
    setFilterValue("");
    setCustomValue("");
  };

  const closeSearch = () => {
    setFilterValue("");
    setCustomValue("");
  };

  return (
    <div className="mt-3 relative">
      <h4 className="font-semibold text-gray-700 mb-2">WooCommerce Categories</h4>
      <div className="flex items-center justify-between px-4 py-2 border rounded-lg bg-white cursor-pointer" onClick={toggle}>
        <span className="text-sm text-gray-700 truncate">
          {selectedCategories[0] || "Select category"}
        </span>
        {isOpen ? (
          <BiChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <BiChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div className="sticky top-0 bg-white p-2 border-b flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              size="sm"
              className="flex-1"
              placeholder="Search category..."
              value={filterValue}
              onChange={(e) => {
                setFilterValue(e.target.value);
                setCustomValue(e.target.value);
              }}
            />
            <button
              onClick={closeSearch}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Options */}
          <div className="max-h-[300px] overflow-y-auto">
            {filteredOptions.map((cat) => (
              <div
                key={cat.name}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
                onClick={() => handleSelect(cat.name)}
              >
                <span>{cat.name}</span>
                {selectedCategories.includes(cat.name) && (
                  <IoMdCheckmark className="text-black" />
                )}
              </div>
            ))}

            {customValue &&
              !wooCategories.some(
                (c) => c.name.toLowerCase() === customValue.toLowerCase()
              ) && (
                <div
                  className="px-4 py-2 bg-gray-100 cursor-pointer text-sm font-medium"
                  onClick={() => handleSelect(customValue)}
                >
                  {customValue} (Custom)
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WooCategorySelect;
