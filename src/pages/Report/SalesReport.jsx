import React, { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import DailySalesReport from "./sales/DailySalesReport";
import WeeklySalesReport from "./sales/WeeklySalesReport";
import MonthlySalesReport from "./sales/MonthlySalesReport";
import { Button, DatePicker } from "@heroui/react";
import { now, getLocalTimeZone, today } from "@internationalized/date";
import { HiChevronLeft } from "react-icons/hi";
import { MdOutlineKeyboardArrowDown  } from "react-icons/md";

const SalesReport = ({ onBack }) => {
  const dropdownRef = useRef(null);
  const [activeTab, setActiveTab] = useState("daily");
  const [fromDate, setFromDate] = useState(today(getLocalTimeZone()));
  const [toDate, setToDate] = useState(today(getLocalTimeZone()));
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Export PDF");

  const options = [
    { value: "export", label: "Export PDF" },
    { value: "pdf", label: "PDF" },
    { value: "word", label: "Word" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 my-10 md:my-14">
      <div className="flex items-center gap-2 mb-6">
        <Button
          onPress={onBack}
          variant="bordered"
          radius="full"
          isIconOnly
          size="sm"
        >
          <HiChevronLeft size="20" />
        </Button>
        <h3 className="text-base sm:text-lg font-semibold">Back</h3>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 text-white p-2 rounded">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Sales</h1>
        </div>
        <div
          className="flex flex-wrap items-end gap-3 w-full lg:w-auto min-h-[70px]"
          style={{ transition: "all 0.2s ease" }}
        >
          <div className="flex items-end gap-3 min-h-[58px]">
            {activeTab === "daily" ? (
              <DatePicker
                color="success"
                aria-label="Date"
                value={fromDate}
                onChange={setFromDate}
                defaultValue={now(getLocalTimeZone())}
                className="px-3 border rounded bg-white min-w-[150px]"
              />
            ) : (
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
            )}
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="min-w-[120px] px-4 py-2 bg-green-600 text-white rounded flex justify-between items-center hover:bg-green-700"
            >
              <span className="truncate">{selected}</span>
              <span className=""><MdOutlineKeyboardArrowDown size={20} /></span>
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
            className={`pb-2 px-1 font-medium capitalize whitespace-nowrap ${
              activeTab === tab
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab === "daily" && (
        <DailySalesReport activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      {activeTab === "weekly" && (
        <WeeklySalesReport activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      {activeTab === "monthly" && (
        <MonthlySalesReport activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
};

export default SalesReport;
