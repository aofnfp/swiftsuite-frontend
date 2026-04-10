import React, { useEffect, useMemo, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { Tooltip } from "antd";
import InventoryData from "./ListingTable/InventoryData";
import { RiLayoutGridFill } from "react-icons/ri";
import { MdOutlineCancel, MdOutlineDelete } from "react-icons/md";
import { useDisclosure, Switch } from "@nextui-org/react";
import EditInventoryModal from "./EditInventoryModal";
import gif from "../Images/gif.gif";
import { Toaster, toast } from "sonner";
import InventoryPagination from "./InventoryPagination";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../cataloguedetails/Dropdown/CustomDropdown";
import { deleteProduct, fetchVendorEnrolled, getInventoryProducts, searchInventoryProducts, getUnmappedInventoryProducts, mapInventoryItems, enrolledMarketplaces, searchUnmappedInventoryProducts, getVendorEnrolledIdentifeir } from "../api/authApi";
import { FiShoppingBag } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import InventoryListView from "./InventoryListView";
import InventoryGridView from "./InventoryGridView";
import DeleteModal from "./DeleteModal";
import LoaderCard from "./LoaderCard";
import NoItems from "./NoItems";
import InventoryDetailModal from "./InventoryDetailModal";
import MarketplaceDropdown from "../cataloguedetails/Dropdown/MarketplaceDropdown";
import VendorlistDropdown from "../cataloguedetails/Dropdown/VendorlistDropdown";
import { safeParseItemSpecific } from "../utils/utils";
import MapModal from "./MapModal";
import SubscriptionModal from "../pages/SubscriptionModal";
import { useSelector } from "react-redux";
import {
  Button,
  Skeleton,
} from "@heroui/react";
import InventorySorting from "./InventorySorting";
import { useInventoryPrefsStore } from "../stores/inventoryPrefs";

const Inventory = () => {
  const { subscribed } = useSelector((state) => state.permission);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  console.log(userId)

  const inventoryRef = useRef();
  const activeRequestRef = useRef(0);

  const navigate = useNavigate();

  const search_query = useInventoryPrefsStore((state) => state.inventorySearchQuery);
  const setSearch_query = useInventoryPrefsStore((state) => state.setInventorySearchQuery);
  const setInventorySearchQuery = useInventoryPrefsStore((state) => state.setInventorySearchQuery);
  const viewMode = useInventoryPrefsStore((state) => state.viewMode);
  const setViewMode = useInventoryPrefsStore((state) => state.setViewMode);
  const selectedProductPerPage = useInventoryPrefsStore((state) => state.inventoryProductPerPage);
  const setInventoryProductPerPage = useInventoryPrefsStore((state) => state.setInventoryProductPerPage);
  const multiSelect = useInventoryPrefsStore((state) => state.multiSelect);
  const setMultiSelect = useInventoryPrefsStore((state) => state.setMultiSelect);

  const [listingDetail, setlistingDetail] = useState([]);
  const [loader, setLoader] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [inventoryEdit, setInventoryEdit] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [count, setCount] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [openVendor, setOpenVendor] = useState(false);
  const [marketplacesEnrolled, setMarketplacesEnrolled] = useState([]);
  const [openMarketplacePlatform, setOpenMarketplacePlatform] = useState(false);
  const [selectedMarketplacePlatform, setSelectedMarketplacePlatform] = useState(null);
  const [enrolledVendors, setEnrolledVendors] = useState([]);
  const [viewItem, setViewItem] = useState(null);
  const [isInventoryDetailOpen, setIsInventoryDetailOpen] = useState(false);
  const [error, setError] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [failedMapModalOpen, setFailedMapModalOpen] = useState(false);
  const sortConfig = useInventoryPrefsStore((state) => state.inventorySortConfig);
  const setSortConfig = useInventoryPrefsStore((state) => state.setInventorySortConfig);
  const [failedMapItems, setFailedMapItems] = useState([]);
  const [showModals, setShowModals] = useState(false);

  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    if (!subscribed) setShowModals(true);
  }, [subscribed]);

  useEffect(() => {
    getVendorEnrolled();
  }, []);

  useEffect(() => {
    getMarketplacesEnrolled();
  }, []);

  useEffect(() => {
    vendorIdentifiers();
  }, []);

  const getVendorEnrolled = async () => {
    try {
      const response = await fetchVendorEnrolled(userId);
      setEnrolledVendors(response.vendors || []);
    } catch (err) {
      setError("Failed to fetch enrolled vendors");
    }
  };

  const getMarketplacesEnrolled = async () => {
    try {
      const response = await enrolledMarketplaces(userId);
      const marketplaces = response.enrollment_detail || [];
      // Transform marketplace array of strings into objects with endpointName
      const transformedMarketplaces = marketplaces.map((marketplace) => ({
        endpointName: marketplace,
        name: marketplace.toLowerCase(),
      }));
      setMarketplacesEnrolled(transformedMarketplaces);
    } catch (err) {
      setError("Failed to fetch enrolled marketplaces");
    }
  };

  const vendorIdentifiers = async () => {
    try {
      const response = await getVendorEnrolledIdentifeir(userId);
      setVendorList(response.vendor_list);
    } catch (err) {
      toast.error("Error fetching vendor identifiers:", err);
    }
  };

  const getSortedListing = () => {
    const list = [...listingDetail];
    if (!sortConfig.key) return list;
    return list.sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";
      if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  };

  const filterProduct = useMemo(() => [
    ...enrolledVendors.map((vendor, index) => {
      const isSpecialVendor = ["cwr", "rsr", "ssi"].includes(
        vendor.toLowerCase()
      );
      return {
        id: index + 2,
        endpoint: `${baseURL}/api/v2/catalogue-${vendor.toLowerCase()}/${userId}/?page=${page}`,
        name: vendor.toLowerCase(),
        endpointName: isSpecialVendor ? vendor.toUpperCase() : vendor.charAt(0).toUpperCase() + vendor.slice(1),
      };
    }),
  ],
    [enrolledVendors, userId, page]
  );

  useEffect(() => {
    if (multiSelect) {
      getUnmappedInventory();
    } else {
      getInventory();
    }
  }, [page, selectedProductPerPage, search_query, multiSelect]);

  const getUnmappedInventory = async () => {
    const requestId = ++activeRequestRef.current;
    setLoader(true);
    try {
      let response;
      if (search_query && search_query.length > 0) {
        response = await searchUnmappedInventoryProducts(userId, page, selectedProductPerPage, search_query);
      } else {
        response = await getUnmappedInventoryProducts(userId, page, selectedProductPerPage);
      }
      if (requestId !== activeRequestRef.current) return;
      const items = response?.Inventory_items || response?.inventory_items || [];
      const parsedItems = items.map((item) => {
        if (!item) return item;
        let itemSpecific = [];
        let marketLogos = {};
        let brand = "Unknown";
        let upc = item.upc || "";
        try {
          const rawField = item.item_specific_fields || "{}";
          const parsed = JSON.parse(
            rawField.replace(/'/g, '"')
          );
          itemSpecific = Object.entries(parsed).map(([key, value]) => ({
            name: key,
            value: value,
          }));
          const brandField = itemSpecific.find((f) => f.name.toLowerCase() === "brand");
          // override only if item_specific contains brand
          if (brandField?.value) {
            brand = brandField?.value || "Unknown";
          }
          const upcField = itemSpecific.find((f) => f.name.toLowerCase() === "upc");
          // override only if item_specific contains UPC
          if (upcField?.value) {
            upc = upcField?.value || "N/A";
          }
          try {
            marketLogos = JSON.parse(item.market_logos || "{}");
          } catch (error) { }
          return {
            ...item, parsedItemSpecific: itemSpecific, marketLogos, brand, upc,
          };
        } catch (err) { }
        return {
          ...item,
          parsedItemSpecific: itemSpecific,
          marketLogos,
          brand,
          upc,
        };
      });

      setlistingDetail(parsedItems);
      setCount(response.Total_count || 0);
      setPageCount(Math.ceil(response.Total_pages / selectedProductPerPage));
      setHasNextPage(page * selectedProductPerPage < (response.Total_count || 0));
      setHasPreviousPage(page > 1);
      setLoader(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || err.response.data || "Failed to fetch unmapped inventory");
      setLoader(false);
    }
  };

  const getInventory = async () => {
    const requestId = ++activeRequestRef.current;
    setLoader(true);
    try {
      let response;
      if (search_query && search_query.length > 0) {
        response = await searchInventoryProducts(userId, page, selectedProductPerPage, search_query);
      } else {
        response = await getInventoryProducts(userId, page, selectedProductPerPage);
      }
      if (requestId !== activeRequestRef.current) return;
      const items = response?.Inventory_items || [];
      const parsedItems = items.map((item) => {
        if (!item) return item;
        let itemSpecific = [];
        let marketLogos = {};
        let brand = "Unknown";
        let upc = item.upc || "";

        try {
          const rawField = item.item_specific_fields || "{}";
          const parsed = safeParseItemSpecific(rawField);
          itemSpecific = Object.entries(parsed).map(([key, value]) => ({
            name: key,
            value: value,
          }));
          const brandField = itemSpecific.find((f) => f.name.toLowerCase() === "brand");
          if (brandField?.value) {
            brand = brandField?.value || "Unknown";
          }
          const upcField = itemSpecific.find((f) => f.name.toLowerCase() === "upc");
          if (upcField?.value) {
            upc = upcField?.value || "N/A";
          }
          try {
            marketLogos = JSON.parse(item.market_logos || "{}");
          } catch (error) { }
          return {
            ...item, parsedItemSpecific: itemSpecific, marketLogos, brand, upc,
          };
        } catch (err) { }
        return {
          ...item,
          parsedItemSpecific: itemSpecific,
          marketLogos,
          brand,
          upc,
        };
      });
      setlistingDetail(parsedItems);
      setCount(response.Total_count || 0);
      setPageCount(Math.ceil(response.Total_pages / selectedProductPerPage));
      setHasNextPage(page * selectedProductPerPage < (response.Total_count || 0));
      setHasPreviousPage(page > 1);
      setLoader(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || error.response.data || "An error occurred");
      setLoader(false);
    }
  }

  const handleSearch = (e) => {
    setInventorySearchQuery(e.target.value);
    setPage(1);
  };

  const handleProductPerPageChange = async (value) => {
    const num = Number(value);
    setInventoryProductPerPage(num);
    setPage(1);
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handleLastPage = () => {
    const last = Math.max(1, Math.ceil((count || 0) / (selectedProductPerPage || 1)));
    setPage(last);
  };
  const handleFirstPage = () => {
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleDelete = async (id, endOnEbay = false) => {
    setShowModal(false);
    setDeleteLoader((prev) => ({ ...prev, [id]: true }));
    try {
      await deleteProduct(userId, id, endOnEbay);
      setDeleteLoader((prev) => ({ ...prev, [id]: false }));
      setlistingDetail(listingDetail.filter((item) => item.id !== id));
      if (isInventoryDetailOpen && viewItem?.id === id) {
        setIsInventoryDetailOpen(false);
        setViewItem(null);
      }
      toast.success("Item deleted successfully");
    } catch (err) {
      setDeleteLoader((prev) => ({ ...prev, [id]: false }));
      toast.error("Failed to delete item");
    }
  };

  const handleEditInventory = (inventoryId) => {
    navigate(`/layout/listing/${inventoryId}`, { state: { isFromUpdate: true }, });
  };

  const handleInventoryDetail = (item) => {
    navigate(`/layout/inventory/${item.id}`);
  };

  const handleMapProducts = async () => {
    if (!selectedVendor) {
      toast.error("Please select a vendor first");
      return;
    }
    if (checkedItems.length === 0) {
      toast.error("Please select products to map");
      return;
    };
    if (!selectedMarketplacePlatform) {
      toast.error("Please select a marketplace platform");
      return;
    };
    setLoader(true);
    try {
      const selectedProducts = listingDetail.filter((item) => checkedItems.includes(item.id));
      const payload = {
        vendor_name: selectedVendor,
        product_objects: selectedProducts.map((p) => ({
          id: p.id,
          mpn: p.mpn || "",
          sku: p.sku || "",
          upc: p.upc || "",
        })),
      };
      const res = await mapInventoryItems(userId, selectedMarketplacePlatform.endpointName, payload);
      const failedItems = res.Failed_to_map_items || [];
      const mappedWithCaution = res.Mapped_with_caution || [];
      if (failedItems.length > 0) {
        setFailedMapItems(failedItems);
        setFailedMapModalOpen(true);
        return;
      }
      if (mappedWithCaution.length > 0) {
        setFailedMapItems(mappedWithCaution);
        setFailedMapModalOpen(true);
        return;
      }
      toast.success("Products mapped successfully");
      setCheckedItems([]);
    } catch (err) {
      toast.error(err.response?.data?.detail || err.response.data || "Failed to map products");
    } finally {
      setLoader(false);
    }
  };

  const selectAllProducts = (products) => {
    const allIds = products.map((product) => product.id);
    const areAllSelected = allIds.every((id) => checkedItems.includes(id));
    setCheckedItems(areAllSelected ? [] : allIds);
  };

  const filteredItems = listingDetail.filter((item) => item.active === true);

  return (
    <div className="bg-[#E7F2ED] px-4">
      <Toaster position="top-right" />
      <SubscriptionModal
        isOpen={showModals}
        onClose={() => setShowModals(false)}
      />
      <section id="headerSection" className="sticky grid rounded mx-auto px-4 sm:px-6 z-10 md:h-[20%] top-14 bg-white py-3 mt-5">
        <motion.h1 initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }} className="text-xl sm:text-2xl font-bold text-green-700 mb-3">
          Inventory
        </motion.h1>
        <div className="flex flex-col gap-4 w-full">

          {/* 🔹 ROW 1 */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">

            {/* LEFT SIDE */}
            <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">

              {/* Pagination */}
              {loader ? (
                <Skeleton className="h-10 w-64 rounded-lg" />
              ) : (
                <InventoryPagination
                  handleNextPage={handleNextPage}
                  handlePreviousPage={handlePreviousPage}
                  handleFirstPage={handleFirstPage}
                  handleLastPage={handleLastPage}
                  listingDetail={filteredItems}
                  currentPage={page}
                  pageCount={pageCount}
                  totalItems={count}
                  itemsPerPage={selectedProductPerPage}
                />
              )}

              {/* Dropdown */}
              <div className="w-auto min-w-[140px]">
                <CustomDropdown
                  selected={selectedProductPerPage}
                  onChange={handleProductPerPageChange}
                  open={open}
                  setOpen={setOpen}
                />
              </div>

              {/* Sort */}
              <InventorySorting
                listingDetail={filteredItems}
                setSortConfig={setSortConfig}
                sortConfig={sortConfig}
              />
            </div>

            {/* SEARCH (center, expands) */}
            <div className="flex-1 min-w-[300px]">
              <div className="flex rounded-md border border-gray-300 bg-gray-100 overflow-hidden">
                <input
                  className="flex-grow px-3 py-2 bg-transparent outline-none text-sm"
                  type="text"
                  placeholder="Search for products by keyword, SKU, UPC, MPN..."
                  value={search_query}
                  onChange={handleSearch}
                />
                {search_query.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSearch_query("")}
                    className="text-[#089451] hover:text-red-600 px-2"
                  >
                    <MdOutlineCancel size={20} />
                  </button>
                )}
                <button className="bg-[#089451] text-white px-4">
                  <BsSearch />
                </button>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-shrink-0">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-3 whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <p className="text-sm">List</p>
                  <Tooltip title="List View">
                    <button
                      className={`p-2 rounded ${viewMode === "list"
                          ? "bg-white text-green-600 shadow-sm"
                          : "text-gray-600"
                        }`}
                      onClick={() => setViewMode("list")}
                    >
                      <FaThList size={16} />
                    </button>
                  </Tooltip>
                </div>

                <div className="flex items-center gap-1">
                  <p className="text-sm">Grid</p>
                  <Tooltip title="Grid View">
                    <button
                      className={`p-2 rounded ${viewMode === "grid"
                          ? "bg-white text-green-600 shadow-sm"
                          : "text-gray-600"
                        }`}
                      onClick={() => setViewMode("grid")}
                    >
                      <RiLayoutGridFill size={16} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            <div className="flex items-center">
              <Switch
                className="md:mb-0 mb-2"
                color="success"
                size="sm"
                isSelected={multiSelect}
                onValueChange={(value) => setMultiSelect(value)}
              >
                Unmapped
              </Switch>
            </div>

            {multiSelect && (
              <div className="flex flex-col md:flex-row items-center gap-4 p-2 bg-white rounded-lg border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                  <input
                    type="checkbox"
                    disabled={!multiSelect || loader || filteredItems.length === 0}
                    onClick={() => selectAllProducts(filteredItems)}
                    className={`${!multiSelect ? "cursor-not-allowed disabled border border-gray-200" : "border border-green-700"
                      } w-4 h-4 appearance-none rounded checked:bg-green-700 focus:outline-none focus:ring-green-300`}
                  />
                  <label className="text-gray-700 font-medium">
                    Select All
                  </label>
                </div>
                <VendorlistDropdown
                  selected={selectedVendor || "Select Vendor"}
                  onChange={(v) => setSelectedVendor(v)}
                  open={openVendor}
                  setOpen={setOpenVendor}
                  catalogue={vendorList}
                />

                <MarketplaceDropdown
                  selected={selectedMarketplacePlatform?.endpointName || "Select Marketplace"}
                  onChange={(v) => {
                    setSelectedMarketplacePlatform(v)
                    setSearch_query(v.endpointName);
                    setPage(1);
                  }}
                  open={openMarketplacePlatform}
                  setOpen={setOpenMarketplacePlatform}
                  catalogue={marketplacesEnrolled}
                />
                <div className="flex items-center gap-2">
                  <button
                    disabled={loader}
                    onClick={handleMapProducts}
                    className={`flex items-center gap-2 px-4 py-2 rounded bg-green-700 text-white font-medium shadow-sm hover:bg-green-800 hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${checkedItems.length === 0 ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {loader ? (
                      <img src={gif} className="w-5 h-5" alt="loading" />
                    ) : (
                      <>
                        <FiShoppingBag />
                        <span>Map</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setCheckedItems([])}
                    disabled={checkedItems.length === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-all active:scale-95 ${checkedItems.length === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#BB8232] text-white hover:bg-[#a77226] shadow-sm hover:shadow-md"
                      }`}
                  >
                    <MdOutlineDelete />
                    <span>Deselect</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Button
              onClick={() =>
                inventoryRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="capitalize text-green-700 font-semibold"
              variant="bordered"
              color="success"
            >
              View Saved Listings
            </Button>
          </div>
        </div>
      </section>
      <div className="mt-12">
        {loader ? (
          <LoaderCard />
        ) : filteredItems && filteredItems.length > 0 ? (
          <>
            {viewMode === "list" && (
              <InventoryListView
                data={getSortedListing()}
                handleEditInventory={handleEditInventory}
                deleteLoader={deleteLoader}
                setSelectedItemId={setSelectedItemId}
                setShowModal={setShowModal}
                handleInventoryDetail={handleInventoryDetail}
                showCheckboxes={multiSelect}
                checkedItems={checkedItems}
                onToggleItem={(id) => {
                  setCheckedItems((prev) =>
                    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
                  );
                }}
              />
            )}
            {viewMode === "grid" && (
              <InventoryGridView
                data={getSortedListing()}
                handleEditInventory={handleEditInventory}
                deleteLoader={deleteLoader}
                setSelectedItemId={setSelectedItemId}
                setShowModal={setShowModal}
                handleInventoryDetail={handleInventoryDetail}
                showCheckboxes={multiSelect}
                checkedItems={checkedItems}
                onToggleItem={(id) => {
                  setCheckedItems((prev) =>
                    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
                  );
                }}
              />
            )}
            {showModal && (
              <DeleteModal
                onConfirm={handleDelete}
                selectedItemId={selectedItemId}
                onClose={() => setShowModal(false)}
              />
            )}
          </>
        ) : (
          <NoItems />
        )}
      </div>
      <EditInventoryModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        useDisclosure={useDisclosure}
        onClose={onClose}
        inventoryEdit={inventoryEdit}
        setInventoryEdit={setInventoryEdit}
        token={token}
        userId={userId}
      />
      <InventoryDetailModal isInventoryDetailOpen={isInventoryDetailOpen} setIsInventoryDetailOpen={setIsInventoryDetailOpen} viewItem={viewItem}
        handleEditInventory={handleEditInventory} deleteLoader={deleteLoader} setSelectedItemId={setSelectedItemId} setShowModal={setShowModal} catalogue={filterProduct} />
      <MapModal setFailedMapModalOpen={setFailedMapModalOpen} failedMapItems={failedMapItems} setFailedMapItems={setFailedMapItems} failedMapModalOpen={failedMapModalOpen} />
      <div ref={inventoryRef} style={{ scrollMarginTop: "120px" }}>
        <InventoryData />
      </div>
    </div>
  );
};

export default Inventory;
