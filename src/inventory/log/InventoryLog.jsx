import React, { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import EmptyState from "../ListingTable/SavedListingData.jsx/EmptyState";
import {
  getMarketplaceActivitiesLog,
  getQuantityUpdateLog,
} from "../../api/authApi";
import InventoryLogHeader from "./InventoryLogHeader";
import InventoryLogTable from "./InventoryLogTable";
import FixedCustomPagination from "../../cataloguedetails/FixedCustomPagination";
import Loader from "../../OrderPage/Loader";
import { Switch } from "@nextui-org/react";
import { useInventoryPrefsStore } from "../../stores/inventoryPrefs";

const InventoryLog = () => {
  const userId = localStorage.getItem("userId");
  const entriesPerPage = useInventoryPrefsStore((s) => s.inventoryLogSavedProductPerPage);
  const setInventoryLogSavedProductPerPage = useInventoryPrefsStore((s) => s.setInventoryLogSavedProductPerPage);

  const searchTerm = useInventoryPrefsStore((s) => s.inventoryLogSearchTerm);
  const setInventoryLogSearchTerm = useInventoryPrefsStore((s) => s.setInventoryLogSearchTerm);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [totalItems, setTotalItems] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [inventoryLogChange, setInventoryLogChange] = useState(false);

  useEffect(() => {
    if (inventoryLogChange) {
      handleQuantityUpdateLog();
    } else {
      handleMarketplaceLog();
    }
  }, [inventoryLogChange, currentPage, entriesPerPage]);

  const handleMarketplaceLog = async () => {
    setLoader(true);
    try {
      const response = await getMarketplaceActivitiesLog(currentPage, entriesPerPage);
      setInventoryItems(response.log || []);
      setTotalItems(response.Total_count || 0);
      setTotalPages(Math.ceil(response.Total_pages / entriesPerPage));
      setHasNextPage(currentPage * entriesPerPage < response.Total_count);
      setHasPreviousPage(currentPage > 1);
      setLoader(false);
    } catch (error) {
      toast.error( error.response?.data?.detail || error.response.data || "An error occurred");
      setInventoryItems([]);
      setLoader(false);
    }
  };

  const handleQuantityUpdateLog = async () => {
    setLoader(true);
    try {
      const response = await getQuantityUpdateLog(currentPage, entriesPerPage);
      setInventoryItems(response.log || []);
      setTotalItems(response.Total_count || 0);
      setTotalPages(Math.ceil(response.Total_pages / entriesPerPage));
      setHasNextPage(currentPage * entriesPerPage < response.Total_count);
      setHasPreviousPage(currentPage > 1);
      setLoader(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || error.response.data || "An error occurred");
      setInventoryItems([]);
      setLoader(false);
    }
  };

  const handleSearchChange = (e) => {
    setInventoryLogSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setInventoryLogSearchTerm("");
  };

  const handleEntriesChange = (e) => {
    const value = Number(e.target.value);
    setInventoryLogSavedProductPerPage(value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    const last = Math.max(1, Math.ceil((totalItems || 0) / (entriesPerPage || 1)));
    setCurrentPage(last);
  };

  const filteredUsers = inventoryItems.filter((item) =>
    item.updated_sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="pb-20">
      <Toaster position="top-right" />
      <div className="overflow-x-auto p-6 mt-20 rounded-lg shadow-md bg-white mx-4 md:mx-10">
        {loader ? (
          <Loader />
        ) : inventoryItems.length > 0 ? (
          <>
            <InventoryLogHeader
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              handleClearSearch={handleClearSearch}
              entriesPerPage={entriesPerPage}
              handleEntriesChange={handleEntriesChange}
              inventoryLogChange={inventoryLogChange}
              setInventoryLogChange={setInventoryLogChange}
            />
            <InventoryLogTable
              filteredUsers={filteredUsers}
              deleteLoader={deleteLoader}
            />
            {!loader && (
              <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 w-full overflow-x-auto">
                <div className="text-sm text-[#005D68]">
                  Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
                  {Math.min(currentPage * entriesPerPage, totalItems)} of{" "}
                  {totalItems}
                </div>
                <div className="flex items-center gap-x-2 flex-wrap">
                  <FixedCustomPagination
                    pageCount={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    itemsPerPage={entriesPerPage}
                    totalItems={totalItems}
                    handleNextPage={handleNextPage}
                    handlePreviousPage={handlePreviousPage}
                    handleFirstPage={handleFirstPage}
                    handleLastPage={handleLastPage}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default InventoryLog;
