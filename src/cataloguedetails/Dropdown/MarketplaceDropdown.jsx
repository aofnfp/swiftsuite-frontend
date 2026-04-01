import { useState, useRef, useEffect } from "react";
import { IoIosCheckmark } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";

const MarketplaceDropdown = ({
  selected,
  onChange,
  open,
  setOpen,
  catalogue = [],
  isLoading,
}) => {
    
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        disabled={isLoading}
        className="capitalize bg-white border-2 border-[#089451] text-[#089451] font-semibold hover:bg-[#089451] 
        hover:text-white transition-colors duration-200 min-w-[120px] px-4 py-2 flex items-center justify-between gap-2 w-full rounded-lg"
      >
        <span>{selected || "Select Marketplace"}</span>
        <IoChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded shadow-md z-10">
          {catalogue && catalogue.length > 0 ? (
            catalogue.map((marketplace) => {
              const isSelected = selected === marketplace?.endpointName;
              return (
                <button
                  key={marketplace.endpointName || marketplace.name}
                  onClick={() => {
                    onChange(marketplace);
                    setOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 transition-colors ${
                    isSelected
                      ? "hover:bg-gray-200 text-green-700 font-semibold hover:text-black"
                      : "hover:bg-gray-200 text-green-500 hover:text-black"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p>{marketplace.endpointName}</p>
                    {isSelected && (
                      <IoIosCheckmark className="text-green-700" size={20} />
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              No marketplaces available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketplaceDropdown;
