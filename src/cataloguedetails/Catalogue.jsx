import React, { useEffect, useMemo, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import CustomPagination from "../cataloguedetails/CustomPagination";
import { toast, Toaster } from "sonner";
import { FaThList } from "react-icons/fa";
import { RiLayoutGridFill } from "react-icons/ri";
import { Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setProduct, setProductId } from "../redux/vendor";
import Productmodal from "../cataloguedetails/Productmodal";
import Enrolmentmodal from "../cataloguedetails/Enrolmentmodal";
import Displaycatalogue from "./Displaycatalogue";
import AdvanceSearch from "./filterpage/AdvanceSearch";
import { IoIosArrowDown } from "react-icons/io";
import { FiShoppingBag } from "react-icons/fi";
import { MdOutlineCancel, MdOutlineDelete } from "react-icons/md";
import gif from "../Images/gif.gif";
import FixedCustomPagination from "./FixedCustomPagination";
import { useGetVendorProducts } from "./CatalogueFetch";
import { useFetchPageData } from "../hooks/useFetchPageData";
import { Switch } from 'antd';
import { motion } from "framer-motion";
import CustomDropdown from "./Dropdown/CustomDropdown";
import VendorDropdown from "./Dropdown/VendorDropdown";
import IdentifierDropdown from "./Dropdown/IdentifierDropdown";
import { addAllProducts, fetchVendorEnrolled, productClickRequest, productUpdateRequest } from "../api/authApi";
import axiosInstance from "../utils/axiosInstance";
import { IoChevronDown } from "react-icons/io5";
import SubscriptionModal from "../pages/SubscriptionModal";
import { useCatalogueStore } from "../stores/catalogueStore";

const Catalogue = () => {
  const queryClient = useQueryClient();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const store = useSelector((state) => state?.vendor?.productId);
  const { subscribed } = useSelector((state) => state.permission);
  const handleCatalogue = useSelector((state) => state?.vendor?.catalogueVendor);

  const viewMode = useCatalogueStore((state) => state.viewMode);
  const setViewMode = useCatalogueStore((state) => state.setViewMode);
  const selectedProductPerPage = useCatalogueStore((state) => state.selectedProductPerPage);
  const setSelectedProductPerPage = useCatalogueStore((state) => state.setSelectedProductPerPage);
  const searchQuery = useCatalogueStore((state) => state.searchQuery);
  const setSearchQuery = useCatalogueStore((state) => state.setSearchQuery);
  const debouncedQuery = useCatalogueStore((state) => state.debouncedQuery);
  const setDebouncedQuery = useCatalogueStore((state) => state.setDebouncedQuery);
  // const page = useCatalogueStore((state) => state.page);
  // const setPage = useCatalogueStore((state) => state.setPage);
  const paginationContext = useCatalogueStore((state) => state.paginationContext);
  const setPaginationContext = useCatalogueStore((state) => state.setPaginationContext);
  const productChange = useCatalogueStore((state) => state.productChange);
  const setProductChange = useCatalogueStore((state) => state.setProductChange);
  const filterApplied = useCatalogueStore((state) => state.filterApplied);
  const setFilterApplied = useCatalogueStore((state) => state.setFilterApplied);
  const selectedVendorIdentifier = useCatalogueStore((state) => state.selectedVendorIdentifier);
  const setSelectedVendorIdentifier = useCatalogueStore((state) => state.setSelectedVendorIdentifier);
  const selectedVendor = useCatalogueStore((state) => state.selectedVendor);
  const setSelectedVendor = useCatalogueStore((state) => state.setSelectedVendor);

  const multiSelect = useCatalogueStore((state) => state.multiSelect);
  const setMultiSelect = useCatalogueStore((state) => state.setMultiSelect);
  const showActionsLg = useCatalogueStore((state) => state.showActionsLg);
  const setShowActionsLg = useCatalogueStore((state) => state.setShowActionsLg);
  const checkedItems = useCatalogueStore((state) => state.selectedProductIds);
  const setCheckedItems = useCatalogueStore((state) => state.setSelectedProductIds);

  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const advanceSearchButtonRef = useRef(null);

  const [endpoint, setEndpoint] = useState("");
  // selectedVendor and selectedVendorIdentifier are managed by the persisted
  // Zustand store — do not redeclare them as local state here.
  const [filter, setFilter] = useState(false);
  const [error, setError] = useState(null);
  const [currentItems, setCurrentItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [editableValue, setEditableValue] = useState("");
  const [allIdentifiers, setAllIdentifiers] = useState([]);
  const [selectedProductCatalogue, setSelectedProductCatalogue] = useState(
    () => selectedVendorIdentifier?.vendor_identifier ?? null
  );
  const [closeDetail, setCloseDetail] = useState(false);
  const [selectProductcontd, setSelectProductcontd] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  // const [checkedItems, setCheckedItems] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [enrolledVendors, setEnrolledVendors] = useState([]);
  const [open, setOpen] = useState(false);
  const [openVendor, setOpenVendor] = useState(false);
  const [openIdentifier, setOpenIdentifier] = useState(false);
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [selectProduct, setSelectProduct] = useState({
    category: "",
    brand: "",
    price: "",
    model: "",
    title: "",
    quantity: "",
    mpn: "",
    msrp: "",
    user: "",
    sku: "",
    upc: "",
    detailed_description: "",
    shipping_width: "",
    shipping_height: "",
    shipping_weight: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [currentModal, setCurrentModal] = useState(null);
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
  // const [selectedVendor, setSelectedVendor] = useState(null);
  const [toggling, setToggling] = useState(false);
  // const [multiSelect, setMultiSelect] = useState(false);
  // const [showActionsLg, setShowActionsLg] = useState(false);
  const [showModals, setShowModals] = useState(false);

  const baseURL = axiosInstance.defaults.baseURL;

  const catalogue = useMemo(
    () => [
      {
        id: 1,
        endpoint: `${baseURL}/api/v2/catalogue-all/${userId}/?page=${page}`,
        name: "all",
        endpointName: "All",
      },
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

  useEffect(() => {
    if (!subscribed) setShowModals(true);
  }, [subscribed]);

  useEffect(() => {
    if (selectedVendor) {
      setProductChange(selectedVendor.name);
    }
  }, [selectedVendor]);

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
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setFilterOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    getVendorEnrolled();
  }, []);

  useEffect(() => {
    // Ensure productChange is valid when catalogue or enrolledVendors update
    if (catalogue.length > 1 && productChange !== "all") {
      const isValid = catalogue.some((item) => item.name === productChange);
      if (!isValid) {
        setProductChange("all");
      }
    }
  }, [catalogue, productChange, setProductChange]);

  const getVendorEnrolled = async () => {
    try {
      const response = await fetchVendorEnrolled();
      setEnrolledVendors(response.vendors || []);
    } catch (err) {
      setError("Failed to fetch enrolled vendors");
    }
  };

  const { data, isLoading, isSuccess, isError } = useGetVendorProducts({
    userId,
    productChange,
    catalogue,
    page,
    token,
    selectedProductPerPage,
    paginationContext,
    formFilters: filterApplied ? formFilters : {},
    searchQuery: debouncedQuery,
    selectedIdentifier: selectedProductCatalogue,
    filter,
  });

  const catalogueProduct = data?.products || [];
  const catalogueIdentifiers = data?.identifiers || [];
  const count = data?.count || 0;
  const hasNextPage = page * selectedProductPerPage < count;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (!isSuccess || productChange === "all" || catalogueIdentifiers.length === 0) return;
    const identifierExists = catalogueIdentifiers.some(
      (id) => id.vendor_identifier === selectedProductCatalogue
    );
    if (!identifierExists) {
      const firstIdentifier = catalogueIdentifiers[0];
      setSelectedProductCatalogue(firstIdentifier.vendor_identifier);
      dispatch(setProduct(firstIdentifier.vendor_identifier));
      setSelectedVendorIdentifier(firstIdentifier);
      setPaginationContext("identifier");
      setPage(1);
    } else {
      const matched = catalogueIdentifiers.find(
        (id) => id.vendor_identifier === selectedProductCatalogue
      );
      if (matched) {
        setSelectedVendorIdentifier(matched);
      }
    }
  }, [
    isSuccess,
    catalogueIdentifiers,
    productChange,
    selectedProductCatalogue,
    dispatch,
  ]);

  // Sync selectedVendor when catalogue becomes available (e.g. after enrolled
  // vendors load on page refresh) or when productChange changes.
  // Guard against running before enrolledVendors has populated catalogue.
  useEffect(() => {
    if (!productChange || productChange === "all") {
      // "all" vendor — clear the vendor selection
      if (selectedVendor !== null) setSelectedVendor(null);
      return;
    }
    if (catalogue.length <= 1) return;
    const matchedVendor = catalogue.find((item) => item.name === productChange);
    if (matchedVendor && matchedVendor.id !== selectedVendor?.id) {
      setSelectedVendor(matchedVendor);
    }
  }, [productChange, catalogue]);

  useEffect(() => {
    if (isSuccess && data) {
      setFilter(true);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  useFetchPageData({
    isSuccess,
    hasNextPage,
    userId,
    productChange,
    page,
    token,
    selectedProductPerPage,
    catalogue,
    formFilters,
    searchQuery: debouncedQuery,
    paginationContext,
  });

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setPaginationContext("search");
    setPage(1);
  };

  const handleProductPerPageChange = (value) => {
    const num = Number(value);
    setSelectedProductPerPage(num);
    setPage(1);
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleFirstPage = () => {
    setPage(1);
  };

  const handleLastPage = () => {
    const last = Math.max(1, Math.ceil((count || 0) / (selectedProductPerPage || 1)));
    setPage(last);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaginationContext("filter");
    setFilterLoading(true);
    try {
      if (Object.values(formFilters).every((value) => value === "")) {
        toast.error("Please enter a value for at least one filter");
        return;
      }
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
      if (minquantity && maxquantity && toNum(minquantity) > toNum(maxquantity)
      ) {
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
      setFilterApplied(true);
      setFilter(true);
      toast.success("Filters applied");
      setFilterOpen(false);
    } catch (error) {
      toast.error("Failed to apply filters");
    } finally {
      setFilterLoading(false);
    }
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
    toast.success("Filters cleared");
    setPage(1);
    setFilterApplied(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const handleProductClick = async (product) => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      navigator.clipboard.writeText(selection.toString());
      return;
    }
    if (!selectedProductCatalogue) {
      toast.error("Please select a product identifier");
      return;
    }
    const productId = product.id;
    dispatch(setProductId(productId));
    setSelectedProductId(productId);
    try {
      setLoader(true);
      const response = await productClickRequest(
        userId,
        productId,
        productChange,
        token
      );
      const jsonArray = response.features
        ? JSON.parse(response.features)
        : response;
      setSelectProduct(jsonArray);
      setSelectProductcontd(response);
      setEditingUser(response);
      setEditableValue(response.model);
      setCloseDetail(true);
      openModal("product");
    } catch (err) {
      if (!err.code && !err.response) {
        toast.error("Request failed, select identifier and try again");
      }
    } finally {
      setLoader(false);
    }
  };

  const handleUpdateProduct = async () => {
    const updatedProduct = selectProduct;
    if (updatedProduct) {
      try {
        const response = await productUpdateRequest(
          userId,
          store,
          handleCatalogue,
          selectedProductCatalogue,
          token
        );
        setSelectProduct(response);
        toast.success("Product edited successfully");
      } catch (error) {
        if (!error.code && !error.response) {
          toast.error("Request failed, try again");
        }
      }
    }
  };

  const openModal = (modalType) => {
    setCurrentModal(modalType);
  };

  const closePopup = () => {
    setCloseDetail((prev) => !prev);
  };

  const closeModal = () => {
    setCurrentModal(null);
  };

  const toggleFilter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggling || productChange === "all") return;
    setToggling(true);
    setFilterOpen((prev) => !prev);
    setTimeout(() => setToggling(false), 300);
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "list" ? "grid" : "list"));
  };

  const productsToRender = useMemo(
    () => catalogueProduct.map((item) => item.product),
    [catalogueProduct]
  );

  const selectAllProducts = (products) => {
    const allIds = products.map((product) => product.id);
    const areAllSelected = allIds.every((id) => checkedItems.includes(id));
    setCheckedItems(areAllSelected ? [] : allIds);
  };

  const addAllToProduct = async () => {
    if (checkedItems.length === 0) {
      toast.error("Please select at least one product");
      return;
    }
    if (!selectedProductCatalogue) {
      toast.error("Please select a product identifier");
      return;
    }
    setLoading(true);
    try {
      const promises = checkedItems.map(async (productId) => {
        try {
          const productResponse = await addAllProducts(
            userId,
            productId,
            productChange
          );
          const productData = productResponse;
          const features = productData.features
            ? JSON.parse(productData.features)
            : [];
          const getFeatureValue = (name) => {
            const feature = features.find((item) => item.Name === name);
            return feature?.Value || "";
          };
          const updatedProduct = {
            user: parseInt(userId) || 0,
            Brand: productData?.brand || getFeatureValue("Manufacturer") || "",
            Category: productData?.category || getFeatureValue("Type") || "",
            Description: productData?.detailed_description || "",
            Model: productData?.model || getFeatureValue("Model") || "",
            MPN: getFeatureValue("MPN") || "",
            Price: parseFloat(productData?.price) || 0,
            Quantity: parseInt(productData?.quantity) || 0,
            Shipping_height:
              parseFloat(
                productData?.height || getFeatureValue("ItemHeight")
              ) || 0,
            Shipping_weight:
              parseFloat(
                productData?.weight || getFeatureValue("ItemWeight")
              ) || 0,
            Shipping_width:
              parseFloat(productData?.width || getFeatureValue("ItemWidth")) ||
              0,
            Sku: productData?.sku || "",
            Title: productData?.title || "",
            msrp: selectProductcontd?.msrp || 0,
            map: selectProductcontd?.map || 0,
            Upc: productData?.upc || "",
            total_product_cost: productData?.total_product_cost || 0,
          };

          const apiUrl = `${baseURL}/api/v2/add-to-product/${userId}/${productId}/${productChange}/${selectedProductCatalogue}/`;
          const response = await axios.put(apiUrl, updatedProduct, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });
          return { productId, success: true, response };
        } catch (err) {
          return {
            productId,
            success: false,
            error: err.response?.data || err.message,
          };
        }
      });

      const results = await Promise.all(promises);
      const failedProducts = results.filter((result) => !result.success);

      if (failedProducts.length > 0) {
        toast.error(`Failed to add ${failedProducts.length} product(s).`);
      } else {
        toast.success("All selected products added successfully");
        setCheckedItems([]);
        queryClient.invalidateQueries([
          "vendorProducts",
          userId,
          productChange,
          catalogue,
          page,
        ]);
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isAdvanceSearchDisabled = isLoading || productChange === "all";

  return (
    <div className="h-screen lg:mx-5 min-h-screen">
      <SubscriptionModal
        isOpen={showModals}
        onClose={() => setShowModals(false)}
      />
      <Toaster position="top-right" />
      <div
        className={
          error || isLoading
            ? "bg-[#E7F2ED] mx-auto w-full max-w-full"
            : "bg-[#E7F2ED] mx-auto w-full max-w-full"
        }
      >
        <section className="sticky top-12 z-[1]">
          <div className="bg-white rounded-t-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center gap-4 justify-between">
                <motion.h1
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                  className="text-2xl font-bold text-green-700 mb-3"
                >
                  Catalog
                </motion.h1>

                <div>
                  <button
                    onClick={() => setShowActionsLg(!showActionsLg)}
                    className="capitalize bg-white border-2 border-[#089451] text-[#089451] font-semibold hover:bg-[#089451]  hover:text-white transition-colors duration-200 min-w-[120px] px-4 py-2 flex items-center justify-between gap-2 w-full rounded-lg"
                  >
                    <span>{showActionsLg ? "Hide Actions" : "Show Actions"}</span>
                    <IoChevronDown className={`transition-transform ${showActionsLg ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>

              <section>
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
                      catalogue={catalogue}
                      isLoading={isLoading}
                    />
                    {productChange !== "all" && (
                      <IdentifierDropdown
                        // setSelectedProductCatalogue={identifier?.vendor_identifier}
                        selected={
                          selectedVendorIdentifier?.vendor_identifier ||
                          "Select identifier"
                        }
                        onChange={(identifier) => {
                          setSelectedVendorIdentifier(identifier);
                          setSelectedProductCatalogue(
                            identifier?.vendor_identifier
                          );
                        }}
                        open={openIdentifier}
                        setOpen={setOpenIdentifier}
                        catalogueIdentifiers={catalogueIdentifiers}
                        isLoading={isLoading}
                      />
                    )}
                  </div>

                  <div className="flex w-full lg:flex-1 rounded-md border border-gray-300 bg-gray-100 overflow-hidden">
                    <input
                      className="flex-grow px-3 py-2 bg-transparent outline-none"
                      type="text"
                      disabled={productChange === "all"}
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
                  {/* {showActionsLg && ( */}
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

                      {filterOpen && productChange !== "all" && (
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
                            selectedProductPerPage={selectedProductPerPage}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* )} */}
                </div>
              </section>
            </div>
          </div>
          {showActionsLg && (
            <section className="">
              {!isLoading && catalogueProduct.length !== 0 && (
                <div
                  className={`${showActionsLg
                    ? "bg-gray-50 border-x border-gray-200 px-6 py-4"
                    : "lg:hidden"
                    }`}
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                      {activeFilters?.length > 0 ? (
                        <>
                          {activeFilters.map((filter, index) => (
                            <div
                              key={index}
                              className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                            >
                              <span className="font-medium">{filter.name}</span>
                              {[
                                "minprice",
                                "maxprice",
                                "minquantity",
                                "maxquantity",
                              ].includes(filter.name) && (
                                  <span className="text-green-600">
                                    {filter.name === "minprice" &&
                                      `≥ $${filter.value}`}
                                    {filter.name === "maxprice" &&
                                      `≤ $${filter.value}`}
                                    {filter.name === "minquantity" &&
                                      `≥ ${filter.value}`}
                                    {filter.name === "maxquantity" &&
                                      `≤ ${filter.value}`}
                                  </span>
                                )}
                              <button
                                className="text-green-600 hover:text-red-600 font-bold text-sm w-4 h-4 flex items-center justify-center"
                                onClick={() => removeFilter(filter.name)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            className="text-red-600 hover:text-red-700 font-medium text-sm px-2 py-1 rounded hover:bg-red-50"
                            onClick={clearFilters}
                          >
                            Clear All
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-500 text-sm mt-2">
                          No filters applied
                        </span>
                      )}
                    </div>
                    {!isLoading && productsToRender.length > 0 && (
                      <div className="flex justify-between items-center space-x-10">
                        <CustomPagination
                          pageCount={Math.ceil(count / selectedProductPerPage)}
                          onPageChange={(selectedPage) => setPage(selectedPage)}
                          currentPage={page}
                          itemsPerPage={selectedProductPerPage}
                          totalItems={count}
                          handleNextPage={handleNextPage}
                          handlePreviousPage={handlePreviousPage}
                        />
                        {!isLoading && (
                          <div className="flex items-center gap-2">
                            <CustomDropdown
                              selected={selectedProductPerPage}
                              onChange={handleProductPerPageChange}
                              open={open}
                              setOpen={setOpen}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {!isLoading && catalogueProduct.length !== 0 && (
                    <div className="flex flex-wrap items-center justify-between mt-4 md:px-2 px-0 py-3 bg-[#E7F2ED] rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700 md:mb-0 mb-2">
                          <input
                            type="checkbox"
                            disabled={
                              !multiSelect ||
                              isLoading ||
                              catalogueProduct.length === 0
                            }
                            checked={
                              productsToRender.length > 0 &&
                              productsToRender.every((product) =>
                                checkedItems.includes(product.id)
                              )
                            }
                            onClick={() => selectAllProducts(productsToRender)}
                            className={`${!multiSelect
                              ? "cursor-not-allowed disabled border border-gray-200"
                              : "border border-green-700"
                              } w-4 h-4 appearance-none rounded checked:bg-green-700 focus:outline-none focus:ring-green-300`}
                          />
                          <label
                            htmlFor="selectAllCheckbox"
                            className={`text-sm ${!multiSelect ? "text-gray-400" : "text-gray-700"
                              }`}
                          >
                            Select all products on this page
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center  bg-gray-100 px-4 py-3 rounded-xl">
                        <Switch
                          checked={multiSelect}
                          onChange={(checked) => setMultiSelect(checked)}
                          className="bg-gray-300"
                          style={{
                            backgroundColor: multiSelect ? "#22c55e" : "#d1d5db",
                          }}
                          thumbStyle={{
                            backgroundColor: multiSelect ? "#ffffff" : "#ffffff",
                          }}
                        />
                        <span className="ml-2 text-sm font-medium text-gray-600">
                          MultiSelect
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <div className="flex items-center gap-2 px-3 py-2 rounded bg-green-700 text-white font-medium md:min-w-[14rem] justify-center">
                          {loading ? (
                            <img src={gif} alt="Loading..." className="w-5 h-5" />
                          ) : (
                            <>
                              <FiShoppingBag />
                              <button
                                onClick={addAllToProduct}
                                disabled={checkedItems.length === 0}
                                className={`${checkedItems.length === 0
                                  ? "cursor-not-allowed opacity-50"
                                  : "cursor-pointer"
                                  }`}
                              >
                                Add Selected to Product
                              </button>
                            </>
                          )}
                        </div>
                        <div
                          className={`flex items-center gap-2 px-3 py-2 rounded font-medium ${checkedItems.length === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                            : "bg-[#BB8232] text-white cursor-pointer"
                            }`}
                        >
                          <MdOutlineDelete />
                          <button
                            onClick={() => setCheckedItems([])}
                            disabled={checkedItems.length === 0}
                            className={`${checkedItems.length === 0
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                              }`}
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </section>

        <Enrolmentmodal
          isOpen={currentModal === "vendor"}
          onOpen={() => openModal("vendor")}
          onOpenChange={(isOpen) =>
            isOpen ? openModal("vendor") : closeModal()
          }
          onClose={closeModal}
          setAllIdentifiers={setAllIdentifiers}
          allIdentifiers={allIdentifiers}
          token={token}
        />
        <Productmodal
          isOpen={currentModal === "product"}
          onClose={closeModal}
          selectedProduct={selectedProduct}
          selectProduct={selectProduct}
          selectProductcontd={selectProductcontd}
          handleChange={handleChange}
          handleUpdateProduct={handleUpdateProduct}
          handleProductClick={handleProductClick}
          closePopup={closePopup}
          closeDetail={closeDetail}
          selectedProductId={selectedProductId}
          userId={userId}
          productChange={productChange}
          handleCatalogue={handleCatalogue}
          selectedProductCatalogue={selectedProductCatalogue}
          catalogue={catalogue}
          page={page}
        />
        <Displaycatalogue
          isLoading={isLoading}
          error={error}
          multiSelect={multiSelect}
          token={token}
          productsToRender={productsToRender}
          currentItems={currentItems}
          handleProductClick={handleProductClick}
          viewMode={viewMode}
          filterOpen={filterOpen}
          toggleViewMode={toggleViewMode}
          store={store}
          userId={userId}
          loader={loader}
          handleCatalogue={handleCatalogue}
          productChange={productChange}
          selectedProductCatalogue={selectedProductCatalogue}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
        />
        <div className="h-[60px]"></div>
        <div>
          {!isLoading && productsToRender.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 shadow-lg py-2 flex justify-center items-center">
              <FixedCustomPagination
                pageCount={Math.ceil(count / selectedProductPerPage)}
                onPageChange={(selectedPage) => setPage(selectedPage)}
                currentPage={page}
                itemsPerPage={selectedProductPerPage}
                totalItems={count}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                handleFirstPage={handleFirstPage}
                handleLastPage={handleLastPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
