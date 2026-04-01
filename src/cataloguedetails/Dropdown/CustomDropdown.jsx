import { useState, useRef, useEffect } from "react";
import { IoIosCheckmark } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";

const CustomDropdown = ({ selected, onChange, open, setOpen }) => {
  const dropdownRef = useRef(null);

  const options = [20, 40, 60, 80, 100];

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
        className="capitalize bg-white border-2 border-[#089451] text-[#089451] font-semibold hover:bg-[#089451] hover:text-white transition-colors duration-200 min-w-[140px] px-2 py-2 rounded-lg flex items-center justify-between gap-2"
      >
        <span>{selected} per page</span>
        <IoChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded shadow-md z-10">
          {options.map((num) => (
            <button
              key={num}
              onClick={() => {
                onChange(num);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 text-green-700 hover:text-black ${
                num === selected ? "bg-gray-200 text-black" : "text-gray-700"
              }`}
            >
              <div className="flex items-center gap-1">
              <p>{num} per page</p>
              <p>{selected === num ?  <IoIosCheckmark className="text-base" size={20} /> : ""}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
