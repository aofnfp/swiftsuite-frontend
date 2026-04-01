import React, { useEffect, useRef, useState } from "react";
import { FileDown, ShoppingBag } from "lucide-react";
import { Button, DatePicker } from "@heroui/react";
import { now, getLocalTimeZone, today } from "@internationalized/date";
import { HiChevronLeft } from "react-icons/hi";
import DailyInventoryReport from "./InventoryReport/DailyInventoryReport";
import WeeklyInventoryReport from "./InventoryReport/WeeklyInventoryReport";
import MonthlyInventoryReport from "./InventoryReport/MonthlyInventoryReport";
import { MdOutlineKeyboardArrowDown  } from "react-icons/md";

const InventoryReport = ({ onBack }) => {
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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-4 my-14">
      <div>
        <div className="flex flex-row items-center space-x-2">
          <Button
            onPress={onBack}
            variant="bordered"
            radius="full"
            isIconOnly
            size="sm"
          >
            <HiChevronLeft size="20" />
          </Button>
          <h3 className="text-lg font-semibold">Back</h3>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 text-white p-2 rounded">
              <ShoppingBag size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "daily" && (
              <div className="flex flex-col">
                <DatePicker
                  color="success"
                  selected={fromDate}
                  aria-label="From Date"
                  value={fromDate}
                  onChange={setFromDate}
                  selectsStart
                  defaultValue={now(getLocalTimeZone())}
                  className="px-3 border rounded bg-white mt-6"
                />
              </div>
            )}

            {activeTab === "weekly" && (
              <>
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">From</label>
                    <DatePicker
                      color="success"
                      selected={fromDate}
                      aria-label="From Date"
                      value={fromDate}
                      onChange={setFromDate}
                      selectsStart
                      defaultValue={now(getLocalTimeZone())}
                      className="px-3 border rounded bg-white"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm mb-1">To</label>
                    <DatePicker
                      color="success"
                      selected={fromDate}
                      aria-label="From Date"
                      value={toDate}
                      onChange={setToDate}
                      selectsStart
                      defaultValue={now(getLocalTimeZone())}
                      className="px-3 border rounded bg-white"
                    />
                  </div>
                </div>
              </>
            )}
            {activeTab === "monthly" && (
              <>
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">From</label>
                    <DatePicker
                      color="success"
                      selected={fromDate}
                      aria-label="From Date"
                      value={fromDate}
                      onChange={setFromDate}
                      selectsStart
                      defaultValue={now(getLocalTimeZone())}
                      className="px-3 border rounded bg-white"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm mb-1">To</label>
                    <DatePicker
                      color="success"
                      selected={fromDate}
                      aria-label="From Date"
                      value={toDate}
                      onChange={setToDate}
                      selectsStart
                      defaultValue={now(getLocalTimeZone())}
                      className="px-3 border rounded bg-white"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="relative" ref={dropdownRef}>
              <div className="relative inline-block">
                <button
                  onClick={() => setOpen(!open)}
                  className="w-32 px-4 py-2 bg-green-600 text-white rounded flex justify-between items-center hover:bg-green-700 mt-6"
                >
                  {selected}
                  <span className=""><MdOutlineKeyboardArrowDown size={20} /></span>
                </button>

                {open && (
                  <ul className="absolute left-0 right-0 mt-1 bg-white border rounded shadow-lg z-10">
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
        </div>
        <div className="flex gap-6 mb-6 border-b border-gray-200">
          <button onClick={() => setActiveTab("daily")} className={`pb-2 px-1 font-medium ${activeTab === "daily" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500"}`}>Daily</button>
          <button onClick={() => setActiveTab("weekly")} className={`pb-2 px-1 font-medium ${activeTab === "weekly" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500"}`}>Weekly</button>
          <button onClick={() => setActiveTab("monthly")} className={`pb-2 px-1 font-medium ${activeTab === "monthly" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500"}`}>Monthly</button>  
        </div>
        {activeTab === "daily" && (
          <DailyInventoryReport activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {activeTab === "weekly" && (
          <WeeklyInventoryReport activeTab={activeTab} setActiveTab={setActiveTab}/>
        )}
        {activeTab === "monthly" && (
          <MonthlyInventoryReport activeTab={activeTab} setActiveTab={setActiveTab}/>
        )}
      </div>
    </div>
  );
};

export default InventoryReport;
