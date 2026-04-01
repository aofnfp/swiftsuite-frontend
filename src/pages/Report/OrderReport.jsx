import React, { useEffect, useRef, useState } from "react";
import { FileDown, ShoppingBag } from "lucide-react";
import { Button, DatePicker } from "@heroui/react";
import { now, getLocalTimeZone, today } from "@internationalized/date";
import { HiChevronLeft } from "react-icons/hi";
import DailyOrderReport from "./DailyOrder/DailyOrderReport";
import WeeklyOrderReport from "./WeeklyOrder/WeeklyOrderReport";
import MonthlyOrderReport from "./MonthlyOrder/MonthlyOrderReport";
import { MdOutlineKeyboardArrowDown  } from "react-icons/md";

const OrderReport = ({ onBack }) => {
  const dropdownRef = useRef(null);
  const vendorDropdownRef = useRef(null);
  const [activeTab, setActiveTab] = useState("daily");
  const [fromDate, setFromDate] = useState(today(getLocalTimeZone()));
  const [toDate, setToDate] = useState(today(getLocalTimeZone()));
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Export PDF");
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [isVendorOpen, setIsVendorOpen] = useState(false);

  const options = [
    { value: "export", label: "Export PDF" },
    { value: "pdf", label: "PDF" },
    { value: "word", label: "Word" },
  ];

  const vendors = [
    { value: "all", label: "All" },
    { value: "cwr", label: "CWR" },
    { value: "rsr", label: "RSR" },
    { value: "zanders", label: "Zanders" },
    { value: "fragrancex", label: "FragranceX" },
    { value: "lipsey", label: "Lipsey" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
      if (vendorDropdownRef.current && !vendorDropdownRef.current.contains(e.target))
        setIsVendorOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-4 my-8 md:my-14">
      <div className="flex flex-row items-center space-x-2 mb-6">
        <Button onPress={onBack} variant="bordered" radius="full" isIconOnly size="sm">
          <HiChevronLeft size="20" />
        </Button>
        <h3 className="text-base md:text-lg font-semibold">Back</h3>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 text-white p-2 rounded">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Order</h1>
        </div>
        <div
          className="flex flex-wrap items-center gap-3 w-full lg:w-auto min-h-[70px]"
          style={{ transition: "all 0.2s ease" }}
        >
          <div className="relative" ref={vendorDropdownRef}>
            <button
              onClick={() => setIsVendorOpen(!isVendorOpen)}
              className="min-w-[120px] px-4 py-2 bg-green-600 text-white rounded flex justify-between items-center hover:bg-green-700"
            >
              <span className="truncate">{selectedVendor}</span>
              <span className=""><MdOutlineKeyboardArrowDown size={20} /></span>
            </button>
            {isVendorOpen && (
              <ul className="absolute left-0 right-0 mt-1 bg-white border rounded shadow-lg z-20">
                {vendors.map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() => {
                      setSelectedVendor(opt.label);
                      setIsVendorOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-green-500 hover:text-white"
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-end gap-3 min-h-[58px] -mt-5">
            {(activeTab === "weekly" || activeTab === "monthly") ? (
              <>
                <div className="flex flex-col">
                  <label className="text-sm mb-1 text-gray-600">From</label>
                  <DatePicker
                    color="success"
                    aria-label="From Date"
                    value={fromDate}
                    onChange={setFromDate}
                    defaultValue={now(getLocalTimeZone())}
                    className="px-3 border rounded bg-white min-w-[150px]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm mb-1 text-gray-600">To</label>
                  <DatePicker
                    color="success"
                    aria-label="To Date"
                    value={toDate}
                    onChange={setToDate}
                    defaultValue={now(getLocalTimeZone())}
                    className="px-3 border rounded bg-white min-w-[150px]"
                  />
                </div>
              </>
            ) : (
              <DatePicker
                color="success"
                aria-label="Date"
                value={fromDate}
                onChange={setFromDate}
                defaultValue={now(getLocalTimeZone())}
                className="px-3 border rounded bg-white min-w-[150px]"
              />
            )}
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="min-w-[120px] px-4 py-2 bg-green-600 text-white rounded flex justify-between items-center hover:bg-green-700"
            >
              <span className="truncate">{selected}</span>
              <span className="ml-2"><MdOutlineKeyboardArrowDown size={20} /></span>
            </button>
            {open && (
              <ul className="absolute left-0 right-0 mt-1 bg-white border rounded shadow-lg z-20">
                {options.map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() => {
                      setSelected(opt.label);
                      setOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-green-500 hover:text-white"
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-4 md:gap-6 mb-6 border-b border-gray-200 overflow-x-auto">
        {["daily", "weekly", "monthly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-1 font-medium whitespace-nowrap ${
              activeTab === tab
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
        {activeTab === "daily" && (
          <DailyOrderReport activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {activeTab === "weekly" && (
          <WeeklyOrderReport activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {activeTab === "monthly" && (
          <MonthlyOrderReport activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </div>
  );
};

export default OrderReport;