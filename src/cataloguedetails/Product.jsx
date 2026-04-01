import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { RiLayoutGridFill } from "react-icons/ri";
import { FaThList } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import CustomPagination from "../cataloguedetails/CustomPagination";
import { Tooltip } from "antd";
import { useDeleteProduct, useGetProducts } from "./CatalogueFetch";

import {
  useFetchPageData,
  useFetchProductPageData,
} from "../hooks/useFetchPageData";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import CustomDropdown from "./Dropdown/CustomDropdown";
import { MdOutlineCancel } from "react-icons/md";
import { HiAdjustments } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import VendorDropdown from "./Dropdown/VendorDropdown";
import { fetchVendorEnrolled } from "../api/authApi";
import axiosInstance from "../utils/axiosInstance";
import AdvanceSearch from "./filterpage/AdvanceSearch";
import ProductContentWrapper from "./ProductData/ProductContentWrapper";
import SubscriptionModal from "../pages/SubscriptionModal";
import { useProductStore } from "../stores/productStore";

const Product = () => {
  const navigate = useNavigate();
  const { subscribed } = useSelector((state) => state.permission);
  const dropdownRef = useRef(null);
  const advanceSearchButtonRef = useRef(null);
  const store = useSelector((state) => state.vendor.productId);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const viewMode = useProductStore((state) => state.viewMode);
  const setViewMode = useProductStore((state) => state.setViewMode);
  const selectProductPerPage = useProductStore((state) => state.selectProductPerPage);
  const setSelectProductPerPage = useProductStore((state) => state.setSelectProductPerPage);
  const searchQuery = useProductStore((state) => state.searchQuery);
  const setSearchQuery = useProductStore((state) => state.setSearchQuery);
  const debouncedQuery = useProductStore((state) => state.debouncedQuery);
  const setDebouncedQuery = useProductStore((state) => state.setDebouncedQuery);
  const page = useProductStore((state) => state.page);
  const setPage = useProductStore((state) => state.setPage);
  const productChange = useProductStore((state) => state.productChange);
  const setProductChange = useProductStore((state) => state.setProductChange);
  const isFilterApplied = useProductStore((state) => state.isFilterApplied);
  const setIsFilterApplied = useProductStore((state) => state.setIsFilterApplied);

  const queryClient = useQueryClient();

  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeProductId, setActiveProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [showActionsMobile, setShowActionsMobile] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [openVendor, setOpenVendor] = useState(false);
  const [enrolledVendors, setEnrolledVendors] = useState([]);
  const [vendorsLoaded, setVendorsLoaded] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [showModals, setShowModals] = useState(false);
  const [formFilters, setFormFilters] = useState({
    upc: "",
    msrp: "",
    minmsrp: "",
    maxmsrp: "",
    minquantity: "",
    maxquantity: "",
    minprice: "",
    maxprice: "",
    brandName: "",
    minsize: "",
    maxsize: "",
    sku: "",
    mapprice: "",
    manufacturer: "",
  });
  const [filterLoading, setFilterLoading] = useState(false);
  const [endpoint, setEndpoint] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        advanceSearchButtonRef.current &&
        !advanceSearchButtonRef.current.contains(event.target)
      ) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!subscribed) setShowModals(true);
  }, [subscribed]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setFilterOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({ queryKey: ['getVendorProducts'] });
    };
  }, []);

  const filterProduct = useMemo(
    () => [
      ...enrolledVendors.map((vendor, index) => {
        const isSpecialVendor = ["cwr", "rsr", "ssi"].includes(
          vendor.toLowerCase()
        );
        return {
          id: index + 2,
          endpoint: `${baseURL}/api/v2/catalogue-${vendor.toLowerCase()}/${userId}/?page=${page}`,
          name: vendor.toLowerCase(),
          endpointName: isSpecialVendor
            ? vendor.toUpperCase()
            : vendor.charAt(0).toUpperCase() + vendor.slice(1),
        };
      }),
    ],
    [enrolledVendors, userId, page]
  );

  const { data, isSuccess, isLoading, isError } = useGetProducts({
    userId,
    filterProduct,
    productChange,
    page,
    selectProductPerPage,
    token,
    formFilters: formFilters,
    searchQuery: debouncedQuery,
    enabled: !!debouncedQuery,
    isFilterApplied,
  });

  useEffect(() => {
    if (selectedVendor) {
      setProductChange(selectedVendor.name);
    }
  }, [selectedVendor]);

  useEffect(() => {
    getVendorEnrolled();
  }, []);

  const getVendorEnrolled = async () => {
    try {
      const response = await fetchVendorEnrolled();
      setEnrolledVendors(response.vendors || []);
    } catch (err) {
      setError("Failed to fetch enrolled vendors");
    }
    finally {
      setVendorsLoaded(true);
    }
  };

  const handleDelete = async (item) => {
    try {
      await deleteProduct({ token, userId, productId: item.id });
      setShowModal(false);
      queryClient.invalidateQueries([
        "getVendorProducts",
        userId,
        page,
        selectProductPerPage,
        searchQuery,
      ]);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || error.response.data || "An error occurred");
    }
  };

  const userProduct = data?.results || [];
  const count = data?.count || 0;
  const hasNextPage = page * selectProductPerPage < count;
  const hasPreviousPage = page > 1;

  const effectiveLoading = isLoading || !vendorsLoaded;

  useFetchProductPageData({
    isSuccess,
    hasNextPage,
    userId,
    page,
    token,
    selectProductPerPage,
    searchQuery: debouncedQuery,
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setPage((prev) => prev - 1);
    }
  };

  const handleFirstPage = () => {
    setPage(1);
  };
  
  const handleLastPage = () => {
    const last = Math.max(1, Math.ceil((count || 0) / (selectProductPerPage || 1)));
    setPage(last);
  };

  const handleProductPerPageChange = async (value) => {
    const num = Number(value);
    setSelectProductPerPage(num);
    setPage(1);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleListing = async (product) => {
    setActiveProductId((prevId) => (prevId === product.id ? null : product.id));
    const marketplaceProductId = product.id;
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      navigator.clipboard.writeText(selection.toString());
      return;
    }
    navigate(`/layout/listing/${marketplaceProductId}`);
  };

  const toggleFilter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggling || productChange === "all") return;
    setToggling(true);
    setFilterOpen((prev) => !prev);
    setTimeout(() => setToggling(false), 300);
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormFilters((prev) => ({ ...prev, [name]: value }));
    setActiveFilters((prev) => {
      if (value) {
        const updatedFilters = prev.filter((filter) => filter.name !== name);
        return [...updatedFilters, { name, value }];
      } else {
        return prev.filter((filter) => filter.name !== name);
      }
    });
  };

  const removeFilter = (filterName) => {
    setActiveFilters(
      activeFilters.filter((filter) => filter.name !== filterName)
    );
    setFormFilters((prev) => {
      const updatedFilters = { ...prev, [filterName]: "" };
      return updatedFilters;
    });
  };

  const defaultFilters = {
    minprice: "",
    maxprice: "",
    minquantity: "",
    maxquantity: "",
    minmsrp: "",
    maxmsrp: "",
    minsize: "",
    maxsize: "",
    minweight: "",
    sku: "",
    upc: "",
    brandName: "",
    mapprice: "",
    manufacturer: "",
  };

  const clearFilters = () => {
    setFormFilters(defaultFilters);
    setActiveFilters([]);
    setFilterOpen(false);
    setIsFilterApplied(false);
    toast.success("Filters cleared");
    setPage(1);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFilterLoading(true);
    try {
      if (Object.values(formFilters).every((value) => value === "")) {
        toast.error("Please enter a value for at least one filter");
        return;
      }
      setIsFilterApplied(true);
      const {
        minprice,
        maxprice,
        minquantity,
        maxquantity,
        minmsrp,
        maxmsrp,
        minsize,
        maxsize,
      } = formFilters;
      const toNum = (val) => Number(val) || 0;

      if (minprice && maxprice && toNum(minprice) > toNum(maxprice)) {
        toast.error("Minimum price cannot be greater than maximum price");
        return;
      }
      if (minquantity && maxquantity && toNum(minquantity) > toNum(maxquantity)) {
        toast.error("Minimum quantity cannot be greater than maximum quantity");
        return;
      }
      if (minmsrp && maxmsrp && toNum(minmsrp) > toNum(maxmsrp)) {
        toast.error("Minimum MSRP cannot be greater than maximum MSRP");
        setFormFilters({});
        setActiveFilters([]);
        return;
      }
      if (minsize && maxsize && toNum(minsize) > toNum(maxsize)) {
        toast.error("Minimum size cannot be greater than maximum size");
        return;
      }
      setPage(1);
      // setFilter(true);
      toast.success("Filters applied");
      setFilterOpen(false);
    } catch (error) {
      toast.error("Failed to apply filters");
    } finally {
      setFilterLoading(false);
    }
  };

  const isAdvanceSearchDisabled = isLoading || productChange === "all";

  return (
    <div className="bg-[#E7F2ED] md:mx-5 min-h-screen">
       <SubscriptionModal
        isOpen={showModals}
        onClose={() => setShowModals(false)}
      />
      <section className="h-full ">
        <section className="sticky grid md:h-[30%] top-8 z-[1] mt-4 md:py-5 py-4">
          <div className="bg-white pb-7">
            <div className="px-6 py-4">
              <div className="flex items-center gap-4 justify-between">
                <motion.h1
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                  className="text-2xl font-bold text-green-700 mb-3"
                >
                  Product
                </motion.h1>
                <div className="flex justify-end mb-2 md:hidden">
                  <button
                    className="flex items-center gap-2 text-[#089451] font-semibold border border-[#089451] px-3 py-1 rounded hover:bg-[#089451] hover:text-white transition"
                    onClick={() => setShowActionsMobile(!showActionsMobile)}
                  >
                    <HiAdjustments />
                    {showActionsMobile ? "Hide Actions" : "Show Actions"}
                  </button>
                </div>
              </div>

              <section
                className={`transition-all duration-300 ${!showActionsMobile ? "block" : "hidden"
                  }`}
              >
                <div className="flex justify-between items-center px-1">
                  <motion.h1
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.6, -0.05, 0.01, 0.99],
                    }}
                    className="text-lg font-semibold text-black mb-2 md:block hidden"
                  >
                    Vendors
                  </motion.h1>
                  <motion.h1
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.6, -0.05, 0.01, 0.99],
                    }}
                    className="text-lg font-semibold text-black mb-2 md:block hidden md:me-3"
                  >
                    Custom Filters
                  </motion.h1>
                </div>
                <div className="flex flex-wrap lg:flex-nowrap items-stretch lg:items-center gap-4 w-full">
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <VendorDropdown
                      selected={selectedVendor?.endpointName || "Select Vendor"}
                      onChange={(vendor) => {
                        setSelectedVendor(vendor);
                      }}
                      open={openVendor}
                      setOpen={setOpenVendor}
                      catalogue={filterProduct}
                      isLoading={isLoading}
                    />
                  </div>
                  <div className="flex w-full lg:flex-1 rounded-md border border-gray-300 bg-gray-100 overflow-hidden">
                    <input
                      className="flex-grow px-3 py-2 bg-transparent outline-none"
                      type="text"
                      placeholder="Search for products by keyword, SKU, UPC, MPN..."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                    {searchQuery.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="text-[#089451] hover:text-red-600 px-2"
                      >
                        <MdOutlineCancel size={20} />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-[#089451] text-white px-4"
                    >
                      <BsSearch />
                    </button>
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-2 px-2 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-2 px-2 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="flex items-center gap-1">
                        <p className="text-sm">List</p>
                        <Tooltip title="List View">
                          <button
                            className={`p-2 rounded ${viewMode === "list"
                                ? "bg-white text-green-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                              }`}
                            onClick={() => setViewMode("list")}
                            aria-label="Switch to List View"
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
                                : "text-gray-600 hover:text-gray-800"
                              }`}
                            onClick={() => setViewMode("grid")}
                            aria-label="Switch to Grid View"
                          >
                            <RiLayoutGridFill size={16} />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <CustomDropdown
                      selected={selectProductPerPage}
                      onChange={handleProductPerPageChange}
                      open={open}
                      setOpen={setOpen}
                    />
                  </div>
                  <div className="relative w-full sm:w-auto">
                    <button
                      ref={advanceSearchButtonRef}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium w-full sm:w-auto ${isAdvanceSearchDisabled
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "capitalize bg-white border-2 border-[#089451] text-[#089451] font-semibold hover:bg-[#089451] hover:text-white transition-colors duration-200 min-w-[120px]"
                        }`}
                      onClick={toggleFilter}
                      aria-expanded={filterOpen}
                      aria-controls="advance-search-dropdown"
                      disabled={isAdvanceSearchDisabled}
                    >
                      Adv Search
                      <IoIosArrowDown
                        className={`transition-transform ${filterOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {filterOpen && productChange !== "" && (
                      <div
                        ref={dropdownRef}
                        className="absolute top-full right-0 mt-2 z-[10000] bg-white border border-gray-200 rounded-lg shadow-lg p-6 min-w-[400px]"
                      >
                        <AdvanceSearch
                          clearFilters={clearFilters}
                          userId={userId}
                          endpoint={endpoint}
                          productChange={productChange}
                          token={token}
                          removeFilter={removeFilter}
                          page={page}
                          handleSubmit={handleSubmit}
                          formFilters={formFilters}
                          handleFormInputChange={handleFormInputChange}
                          filterLoading={filterLoading}
                          selectedProductPerPage={selectProductPerPage}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="justify-center pt-5">
                  {error ? (
                    <div>{error}</div>
                  ) : (
                    userProduct.length > 0 && (
                      <CustomPagination
                        pageCount={Math.ceil(count / selectProductPerPage)}
                        onPageChange={(selectedPage) => setPage(selectedPage)}
                        currentPage={page}
                        itemsPerPage={selectProductPerPage}
                        totalItems={count}
                        handleNextPage={handleNextPage}
                        handlePreviousPage={handlePreviousPage}
                      />
                    )
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>
        <ProductContentWrapper
          isLoading={effectiveLoading}
          viewMode={viewMode}
          userProduct={userProduct}
          handleListing={handleListing}
          activeProductId={activeProductId}
          handleDelete={handleDelete}
          showModal={showModal}
          setShowModal={setShowModal}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          count={count}
          page={page}
          setPage={setPage}
          selectProductPerPage={selectProductPerPage}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          handleFirstPage={handleFirstPage}
          handleLastPage={handleLastPage}
        />
      </section>
      <Toaster position="top-right" />
    </div>
  );
};

export default Product;
