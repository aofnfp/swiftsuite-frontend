import React, { useEffect, useRef, useState } from "react";
import Loader from "../../hooks/Loader";
import InventoryModal from "./InventoryModal";
import { useDisclosure } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { deleteProductFromInventory, getSavedInventoryProducts } from "../../api/authApi";
import { toast, Toaster } from "sonner";
import InventoryHeader from "./SavedListingData.jsx/InventoryHeader";
import InventoryTable from "./SavedListingData.jsx/InventoryTable";
import EmptyState from "./SavedListingData.jsx/EmptyState";
import InventoryDataPagination from "./SavedListingData.jsx/InventoryDataPagination";
import { useInventoryPrefsStore } from "../../stores/inventoryPrefs";

const InventoryData = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const entriesPerPage = useInventoryPrefsStore((s) => s.inventorySavedProductPerPage);
  const setInventorySavedProductPerPage = useInventoryPrefsStore((s) => s.setInventorySavedProductPerPage);

  const searchTerm = useInventoryPrefsStore((s) => s.inventorySavedSearchTerm);
  const setInventorySavedSearchTerm = useInventoryPrefsStore((s) => s.setInventorySavedSearchTerm);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [actionDropdown, setActionDropdown] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [onSubmitLoader, setOnSubmitLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [checkedItems, setCheckedItems] = useState([]);
  const [viewItem, setViewItem] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [totalItems, setTotalItems] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState({});
  const [totalPages, setTotalPages] = useState(0);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActionDropdown(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    getSavedInventory();
  }, [currentPage, entriesPerPage]);

  const getSavedInventory = async () => {
    setLoader(true);
    try {
      const response = await getSavedInventoryProducts(userId, currentPage, entriesPerPage);
      const items = response?.saved_items || [];
      const parsedItems = items.map((item) => {
        if (item) {
          try {
            const itemSpecific = JSON.parse(item.item_specific_fields || "{}");
            const marketLogos = JSON.parse(item.market_logos || "{}");
            const brand = itemSpecific?.Brand || "Unknown";
            return {
              ...item,
              parsedItemSpecific: itemSpecific,
              marketLogos,
              brand,
            };
          } catch (error) {
            return {
              ...item,
              parsedItemSpecific: {},
              marketLogos: {},
              brand: "Unknown",
            };
          }
        }
        return item;
      });
      setInventoryItems(parsedItems);
      setTotalItems(response.Total_count || 0);
      setTotalPages(Math.ceil(response.Total_count / entriesPerPage));
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
    setInventorySavedSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setInventorySavedSearchTerm("");
  };

  const handleEntriesChange = (e) => {
    const value = Number(e.target.value);
    setInventorySavedProductPerPage(value);
    setCurrentPage(1);
  };

  const sortedUsers = [...inventoryItems].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const handleDelete = async (id) => {
    setDeleteLoader((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await deleteProductFromInventory(id);
      const deletedItem = inventoryItems.filter((item) => item.id !== id);
      setInventoryItems(deletedItem);
      setDeleteLoader((prev) => ({ ...prev, [id]: false }));
      toast.success("Item removed successfully");
    } catch (err) {
      setDeleteLoader((prev) => ({ ...prev, [id]: false }));
      toast.error("Failed to remove item");
    }
  };

  const filteredUsers = sortedUsers.filter((user) =>
    user.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const indexOfLastUser = currentPage * entriesPerPage;
  // const indexOfFirstUser = indexOfLastUser - entriesPerPage;
  // const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // const totalItems = Math.ceil(filteredUsers.length / entriesPerPage);

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

  const handleActionClick = (id) => {
    setActionDropdown(actionDropdown === id ? null : id);
  };

  const handleActionSelect = (userId) => {
    const selectedItem = inventoryItems.filter((item) => item.id === userId);
    setViewItem(selectedItem[0]);
    onOpen(inventoryItems);
    setActionDropdown(null);
  };

  const handleListing = (savedListingId) => {
    navigate(`/layout/listing/${savedListingId}`, {
      state: { isFromEdit: true },
    });
  };

  return (
    <div className="pb-20">
      <Toaster position="top-right" />

      <div className="overflow-x-auto p-6 mt-8 rounded-lg shadow-md bg-white mx-4 md:mx-10">
        {loader ? (
          <Loader />
        ) : inventoryItems.length > 0 ? (
          <>
            <InventoryHeader
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              handleClearSearch={handleClearSearch}
              entriesPerPage={entriesPerPage}
              handleEntriesChange={handleEntriesChange}
            />
            <InventoryTable
              filteredUsers={filteredUsers}
              actionDropdown={actionDropdown}
              dropdownRef={dropdownRef}
              handleActionClick={handleActionClick}
              handleActionSelect={handleActionSelect}
              handleListing={handleListing}
              handleDelete={handleDelete}
              deleteLoader={deleteLoader}
            />
            <InventoryDataPagination
              currentPage={currentPage}
              itemsPerPage={entriesPerPage}
              totalPages={totalPages}
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
              listingDetail={filteredUsers}
            />
          </>
        ) : (
          <EmptyState />
        )}
        <InventoryModal
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          onClose={onClose}
          viewItem={viewItem}
        />
      </div>
    </div>
  );
};

export default InventoryData;
