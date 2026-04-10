import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast, Toaster } from "sonner";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import FixedCustomPagination from "../cataloguedetails/FixedCustomPagination";
import { orderProduct } from "../api/authApi";
import OrderTable from "./OrderTable";
import OrderFilters from "./OrderFilters";
import Loader from "./Loader";
import { fixJSON } from "../utils/utils";
import { MdOutlineCancel } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import SubscriptionModal from "../pages/SubscriptionModal";
import { useOrderStore } from "../stores/orderStore";

const Order = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const store = useSelector((state) => state.vendor.order);
  const dispatch = useDispatch();

  const { subscribed } = useSelector((state) => state.permission);

  const setSearch = useOrderStore((state) => state.setSearchQuery);
  const search = useOrderStore((state) => state.searchQuery);
  const setDebouncedSearch = useOrderStore((state) => state.setDebouncedQuery);
  const debouncedSearch = useOrderStore((state) => state.debouncedQuery);
  const setPage = useOrderStore((state) => state.setPage);
  const page = useOrderStore((state) => state.page);
  const selectedOrderPerPage = useOrderStore((state) => state.selectedOrderPerPage);
  const setSelectedOrderPerPage = useOrderStore((state) => state.setSelectedOrderPerPage);
  const sortConfig = useOrderStore((state) => state.sortConfig);
  const setSortConfig = useOrderStore((state) => state.setSortConfig);
  

  // sortConfig now from store
  const [orders, setOrders] = useState([]);
  const [loader, setLoader] = useState(false);
  const [totalItems, setTotalItems] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vendor_status, setVendor_status] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [formFilters, setFormFilters] = useState({
    minquantity: "",
    quantity: "",
    price_min: "",
    price_max: "",
    creationDate__gte: "",
    creationDate__lte: "",
    vendor_name: "",
    market_name: "",
  });

  useEffect(() => {
    if (!subscribed) setShowModal(true);
  }, [subscribed]);

  useEffect(() => {
    fetchOrders();
  }, [selectedOrderPerPage, page, activeFilters, debouncedSearch, sortConfig]);

  const handleOrderPerPageChange = async (e) => {
    const value = Number(e.target.value);
    setSelectedOrderPerPage(value);
    localStorage.setItem("orderPerPage", value);
    setPage(1);
  };

  const handleRefresh = () => {
    fetchOrders();
    setActiveFilters({});
    setVendor_status("all");
  };

  const fetchOrders = async () => {
    setLoader(true);
    try {
      const res = await orderProduct(selectedOrderPerPage, page, debouncedSearch, activeFilters, sortConfig);
      const rawOrders = res.results || [];
      const orders = rawOrders.map((order) => {
        return {
          ...order,
          image: fixJSON(order.image),
          paymentSummary: fixJSON(order.paymentSummary),
          pricingSummary: fixJSON(order.pricingSummary),
          cancelStatus: fixJSON(order.cancelStatus),
          fulfillmentStartInstructions: fixJSON(
            order.fulfillmentStartInstructions,
          ),
          itemLocation: fixJSON(order.itemLocation),
          lineItemCost: fixJSON(order.lineItemCost),
          additionalImages: fixJSON(order.additionalImages),
          buyer: fixJSON(order.buyer),
          vendor_orders: order?.vendor_orders[0]?.status,
          quantity: Number(order.quantity) || 0,
        };
      });
      setOrders(orders);
      setTotalItems(res.count || 0);
      setTotalPages(Math.ceil(res.count / selectedOrderPerPage));
      setHasNextPage(page * selectedOrderPerPage < (res.count || 0));
      setHasPreviousPage(page > 1);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setError("Something went wrong, please try again later");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const SORT_OPTIONS = [
    { key: "creationDate", label: "Date" },
  ];

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  
  const handleOrderStatus = (status) => {
    setVendor_status(status);
    setPage(1);
    if(status === "all"){
      setActiveFilters({});
    }else{
      setActiveFilters({ vendor_status: status });
    }
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFormFilters({
      minquantity: "",
      maxquantity: "",
      minprice: "",
      maxprice: "",
      startDate: "",
      endDate: "",
      vendor: "",
    });
    setActiveFilters({});
    setPage(1);
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setFilterLoading(true);
    setActiveFilters({ ...formFilters });
    setPage(1);
    setShowFilterPanel(false);
    setFilterLoading(false);
  };

  // handleSort moved to dropdown onSelectionChange, using store setSortConfig

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const sortedUsers = [...orders].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = getNestedValue(a, sortConfig.key);
    const bValue = getNestedValue(b, sortConfig.key);

    // Handle null/undefined values: put them at the end
    if (aValue == null && bValue != null) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    if (bValue == null && aValue != null) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue == null && bValue == null) return 0;

    let comparison = 0;
    if (typeof aValue === "number" && typeof bValue === "number") {
      comparison = aValue - bValue;
    } else {
      // Treat as strings, case-insensitive
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      if (aStr < bStr) comparison = -1;
      else if (aStr > bStr) comparison = 1;
    }

    return sortConfig.direction === "ascending" ? comparison : -comparison;
  });

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleRowClick = (order) => {
    navigate(`/layout/orderdetails/${order._id}`);
  };

  return (
    <div className="bg-[#E7F2ED] p-5 md:mt-20 mt-10">
      <Toaster position="top-right" />
      <SubscriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      {loader ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto p-4 md:p-5 rounded-lg shadow-lg mb-10 bg-white mx-2 md:mx-5">
              <h2 className="text-2xl font-semibold text-gray-800 whitespace-nowrap mb-5">
                Order History
              </h2>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="text-center flex flex-wrap gap-2 justify-center sm:justify-start">
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'failed'].map(
                  (status) => {
                    const normalized = status.charAt(0).toUpperCase() + status.slice(1);
                    const isActive = vendor_status === status;
                    return (
                      <Button
                        key={status}
                        className={`text-sm font-semibold px-4 py-2 rounded-full transition ${
                          isActive
                            ? 'bg-[#E7F2ED] text-[#005D68] border border-[#8ed7c3] shadow-sm'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-green-50'
                        }`}
                        onPress={() => handleOrderStatus(status)}
                        variant="bordered"
                        size="lg"
                      >
                        {normalized}
                      </Button>
                    );
                  },
                )}
              </div>
              <div className="flex-grow">
                <div className="flex rounded-md border border-gray-300 bg-gray-100 overflow-hidden w-96">
                  <input
                    className="flex-grow px-3 py-2 bg-transparent outline-none text-sm w-100"
                    type="text"
                    placeholder="Search for orders by ID, Customer Name, marketplace name..."
                    value={search}
                    onChange={handleSearchChange}
                  />
                  {search.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="text-black hover:text-red-600 px-2"
                    >
                      <MdOutlineCancel size={20} />
                    </button>
                  )}
                  <button type="submit" className="bg-black text-white px-4">
                    <BsSearch />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center relative">
              <button
                type="button"
                disabled={orders.length === 0}
                onClick={() => setShowFilterPanel((prev) => !prev)}
                className="flex items-center justify-center rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:border-green-200"
              >
                <FiFilter className="mr-2" /> Filter
              </button>

              {showFilterPanel && (
                <div className="absolute top-full right-0 mt-2 w-[340px] z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                  <OrderFilters
                    formFilters={formFilters}
                    handleFormInputChange={handleFormInputChange}
                    handleSubmit={handleApplyFilters}
                    clearFilters={clearFilters}
                    filterLoading={filterLoading}
                  />
                </div>
              )}

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="capitalize text-black font-semibold -z-1"
                    variant="bordered"
                    disabled={orders.length === 0}
                  >
                    {sortConfig?.key
                      ? `${
                          SORT_OPTIONS.find((opt) => opt.key === sortConfig.key)
                            ?.label
                        } (${sortConfig.direction === "ascending" ? "Asc" : "Desc"})`
                      : "Sort By"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Sort selection"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={new Set([sortConfig.key])}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    if (selectedKey === 'creationDate') {
                      const currentDir = sortConfig?.direction === 'descending' ? 'ascending' : 'descending';
                      setSortConfig({ key: selectedKey, direction: currentDir });
                    }
                  }}
                >
                  {SORT_OPTIONS.map((option) => (
                    <DropdownItem key={option.key}>{option.label}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="capitalize text-black font-semibold -z-1"
                    variant="bordered"
                    disabled={orders.length === 0}
                  >
                    {selectedOrderPerPage} per page
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Per page selection"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={new Set([String(selectedOrderPerPage)])}
                  onSelectionChange={(keys) => {
                    const selectedValue = Array.from(keys)[0];
                    handleOrderPerPageChange({
                      target: { value: selectedValue },
                    });
                  }}
                >
                  {[10, 20, 40, 60, 80, 100].map((num) => (
                    <DropdownItem
                      key={String(num)}
                      textValue={`${num} items per page`}
                    >
                      {num} per page
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <OrderTable
            filteredUsers={sortedUsers}
            handleRefresh={handleRefresh}
            error={error}
            loader={loader}
            handleRowClick={handleRowClick}
          />
          {!loader && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 w-full overflow-x-auto">
              <div className="text-sm text-[#005D68]">
                Showing {(page - 1) * selectedOrderPerPage + 1} to{" "}
                {Math.min(page * selectedOrderPerPage, totalItems)} of{" "}
                {totalItems}
              </div>
              <div className="flex items-center gap-x-2 flex-wrap">
                <FixedCustomPagination
                  pageCount={Math.ceil(totalItems / selectedOrderPerPage)}
                  onPageChange={(selectedPage) => setPage(selectedPage)}
                  currentPage={page}
                  itemsPerPage={selectedOrderPerPage}
                  totalItems={totalItems}
                  handleFirstPage={() => setPage(1)}
                  handleLastPage={() =>
                    setPage(Math.ceil(totalItems / selectedOrderPerPage))
                  }
                  handleNextPage={handleNextPage}
                  handlePreviousPage={handlePreviousPage}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Order;
