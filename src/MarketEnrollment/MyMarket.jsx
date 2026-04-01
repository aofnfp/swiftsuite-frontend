import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import MarketList from "./MarketList";
import UpdateMarket from "./UpdateMarket";
import SubscriptionModal from "../pages/SubscriptionModal";

const MyMarket = () => {
  const { subscribed } = useSelector((state) => state.permission);
  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState([
    {
      id: 1,
      name: "MarketPlace A",
      logo: "/marketplace-a-logo.png",
      accounts: [
        { id: 101, name: "Account 1", enrollments: [{ id: 1001, created_at: "2025-01-01T12:00:00Z" }] },
        { id: 102, name: "Account 2", enrollments: [{ id: 1002, created_at: "2025-02-01T12:00:00Z" }] },
      ],
    },
    {
      id: 2,
      name: "MarketPlace B",
      logo: "/marketplace-b-logo.png",
      accounts: [{ id: 201, name: "Account 1", enrollments: [] }],
    },
  ]);

  const [loader, setLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(
    () => Number(localStorage.getItem("marketPerPage")) || 10
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("marketplaces");

  useEffect(() => {
    if (!subscribed) setShowModal(true);
  }, [subscribed]);

  const handleSearchChange = useCallback((e) => {
    const sanitizedValue = e.target.value.replace(/[<>]/g, "");
    setSearchTerm(sanitizedValue);
    setCurrentPage(1);
  }, []);

  const handleEntriesChange = useCallback((e) => {
    const value = Number(e.target.value);
    setEntriesPerPage(value);
    localStorage.setItem("marketPerPage", value);
    setCurrentPage(1);
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  }, [currentPage]);

  const handleViewChange = useCallback(
    (newView) => {
      if (!subscribed) {
        setShowModal(true);
        return;
      }
      setView(newView);
      setCurrentPage(1);
    },
    [subscribed]
  );

  const filteredData = useMemo(() => {
    return data.filter((marketplace) =>
      marketplace?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const indexOfLastMarketplace = currentPage * entriesPerPage;
  const indexOfFirstMarketplace = indexOfLastMarketplace - entriesPerPage;
  const currentMarketplaces = filteredData.slice(
    indexOfFirstMarketplace,
    indexOfLastMarketplace
  );
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const renderPagination = () => {
    const maxButtons = 5;
    const halfButtons = Math.floor(maxButtons / 2);
    let startPage = Math.max(1, currentPage - halfButtons);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - maxButtons + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center gap-3">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "text-green-700"
          }`}
        >
          <IoIosArrowDropleft />
          <span>Previous</span>
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 ${
              currentPage === page ? "border" : "text-black"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "text-green-700"
          }`}
        >
          <span>Next</span>
          <IoIosArrowDropright />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white p-5 md:mt-20 mt-16 min-h-screen">
      <SubscriptionModal
        isOpen={!subscribed ? true : showModal}
        onClose={() => {
          if (subscribed) setShowModal(false);
        }}
      />

      <div className="flex lg:flex-row md:flex-row flex-col justify-between mb-4 items-center">
        <div className="flex gap-2 mb-2 md:mb-0">
          <button
            className={
              view === "marketplaces"
                ? "bg-[#027840] text-white px-2 py-1 rounded flex items-center gap-2"
                : "text-black px-2 rounded border flex items-center gap-2"
            }
            onClick={() => handleViewChange("marketplaces")}
          >
            <span>
              <FaCartShopping />
            </span>
            Marketplaces
          </button>

          <button
            className={
              view === "edit"
                ? "bg-[#BB8232] text-white px-2 py-1 rounded flex items-center gap-2"
                : "text-black px-2 rounded border flex items-center gap-2"
            }
            onClick={() => handleViewChange("edit")}
          >
            <span>
              <CiEdit />
            </span>
            Edit Marketplaces
          </button>
        </div>

        <div className="relative">
          <label htmlFor="search" className="mr-2">
            Search:
          </label>

          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border px-2 py-1 text-black outline-none"
            placeholder="Search marketplaces"
            disabled={view !== "edit"}
          />

          {searchTerm && view === "edit" && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <span>X</span>
            </button>
          )}
        </div>
      </div>

      {loader ? (
        <div className="animate-pulse">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mt-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-[8px] p-7 flex flex-col"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-36 bg-gray-200 rounded"></div>
                  <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
                </div>
                <div className="h-20"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-5 mb-10 bg-white">
          {view === "marketplaces" && (
            <div className="space-y-4">
              <MarketList />
            </div>
          )}

          {view === "edit" && (
            <div className="space-y-4">
              <UpdateMarket
                marketplaces={currentMarketplaces}
                searchTerm={searchTerm}
              />
            </div>
          )}
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default MyMarket;