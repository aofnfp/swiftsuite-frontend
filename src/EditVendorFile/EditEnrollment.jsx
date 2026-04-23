import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { ThreeDots } from "react-loader-spinner";
import { FaTrashAlt, FaTimes } from "react-icons/fa";
import AddVendorFile from "./AddVendorFile";
import { MdAccountBox } from "react-icons/md";
import { CgCalendarDates } from "react-icons/cg";
import { FaCartShopping } from "react-icons/fa6";
import { IoAdd } from "react-icons/io5";
import { LiaTimesSolid } from "react-icons/lia";
import { GrPrevious, GrNext } from "react-icons/gr";

import {
  accountEnrollments,
  deleteEnrollment,
  deleteVendorAccount,
  viewEnrollmentWithIdentifier,
} from "../api/authApi";
import { formatDate, formatVendorName } from "../utils/utils";
import { useVendorStore } from "../stores/VendorStore";
import { useEditVendorStore } from "../stores/editVendorStore";

const EditEnrollment = () => {
  const data = useEditVendorStore((state) => state.enrollmentData);
  const setData = useEditVendorStore((state) => state.setEnrollmentData);
  const loader = useEditVendorStore((state) => state.loader);
  const setLoader = useEditVendorStore((state) => state.setLoader);
  const actionLoading = useEditVendorStore((state) => state.actionLoading);
  const setActionLoading = useEditVendorStore((state) => state.setActionLoading);
  const popoverStates = useEditVendorStore((state) => state.popoverStates);
  const setPopoverStates = useEditVendorStore((state) => state.setPopoverStates);
  const expandedVendors = useEditVendorStore((state) => state.expandedVendors);
  const setExpandedVendors = useEditVendorStore((state) => state.setExpandedVendors);
  const setDataLoaded = useEditVendorStore((state) => state.setDataLoaded);
  const searchTerm = useEditVendorStore((state) => state.searchTerm);
  const setSearchTerm = useEditVendorStore((state) => state.setSearchTerm);
  const entriesPerPage = useEditVendorStore((state) => state.entriesPerPage);
  const currentPage = useEditVendorStore((state) => state.currentPage);
  const setCurrentPage = useEditVendorStore((state) => state.setCurrentPage);
  const view = useEditVendorStore((state) => state.view);
  const setView = useEditVendorStore((state) => state.setView);
  const setEditingVendor = useEditVendorStore((state) => state.setEditingVendor);
  const [fetchError, setFetchError] = useState("");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    title: "",
    message: "",
    actionKey: "",
    onConfirm: null,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isMounted = useRef(true);
  const setVendorContext = useVendorStore((state) => state.setVendorContext);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setExpandedVendors({});
    setPopoverStates({});

    return () => {
      setExpandedVendors({});
      setPopoverStates({});
    };
  }, [setExpandedVendors, setPopoverStates]);

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({
      open: false,
      title: "",
      message: "",
      actionKey: "",
      onConfirm: null,
    });
  }, []);

  const openDeleteModal = useCallback(({ title, message, actionKey, onConfirm }) => {
    setDeleteModal({
      open: true,
      title,
      message,
      actionKey,
      onConfirm,
    });
  }, []);

  const handleApiError = useCallback(
  (error, defaultMessage) => {
    if (!error.response) {
      toast.error("Network error. Please check your connection.", {
        toastId: "network-error",
      });
      return;
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        toast.error("Session expired. Please log in again.", {
          toastId: "unauthorized",
        });
        navigate("/signin");
        break;

      case 403:
        toast.error(data?.detail || "Access denied", {
          toastId: "forbidden",
        });
        break;

      case 404:
        toast.error("Resource not found", { toastId: "not-found" });
        break;

      default:
        toast.error(data?.detail || defaultMessage, {
          toastId: `error-${status}`,
        });
    }
  },
  [navigate]
  );

  const fetchEnrollments = useCallback(
  async (showLoader = true) => {
    if (showLoader) setLoader(true);

    try {
      const response = await accountEnrollments();

      if (!isMounted.current) return;

      setFetchError("");

      if (!Array.isArray(response) || response.length === 0) {
        setData([]);
        return;
      }

      const groupedData = Object.values(
        response.reduce((acc, item) => {
          const vendorId = item.vendor?.id;

          if (!vendorId) return acc;

          const validEnrollments = Array.isArray(item.enrollments)
            ? item.enrollments.filter(
                (enrollment) =>
                  enrollment &&
                  typeof enrollment.identifier === "string" &&
                  enrollment.identifier.trim() !== ""
              )
            : [];

          if (!validEnrollments.length) return acc;

          if (!acc[vendorId]) {
            acc[vendorId] = {
              vendor: item.vendor,
              accounts: [],
            };
          }

          acc[vendorId].accounts.push({
            id: item.id,
            name: item.name || "N/A",
            enrollments: validEnrollments,
          });

          return acc;
        }, {})
      )
        .map((vendorGroup) => ({
          ...vendorGroup,
          accounts: vendorGroup.accounts.filter(
            (account) =>
              Array.isArray(account.enrollments) && account.enrollments.length > 0
          ),
        }))
        .filter(
          (vendorGroup) =>
            Array.isArray(vendorGroup.accounts) && vendorGroup.accounts.length > 0
        );

      setData(groupedData);
    } catch (error) {
      if (!isMounted.current) return;

      if (error?.response?.status === 403) {
        setFetchError(error?.response?.data?.detail || "Access denied");
        setData([]);
      } else {
        setFetchError("");
        handleApiError(error, "Failed to fetch enrollments");
      }
    } finally {
      if (isMounted.current) {
        if (showLoader) {
          setLoader(false);
        }
        setDataLoaded(true);
      }
    }
  },
  [handleApiError, setData, setLoader, setDataLoaded]
  );

  useEffect(() => {
    isMounted.current = true;

    if (!token) {
      toast.error("Please log in to continue", { toastId: "no-token" });
      navigate("/signin");
      return;
    }

    fetchEnrollments(true);

    return () => {
      isMounted.current = false;
    };
  }, [token, navigate, fetchEnrollments]);

  const handleEdit = useCallback(
    async (enrollmentId, enrollmentIdentifier, vendorName) => {
      setActionLoading((prev) => ({ ...prev, [enrollmentId]: "editing" }));

      try {
        const data = await viewEnrollmentWithIdentifier(enrollmentId);

        if (!data) {
          throw new Error("No enrollment data found");
        }

        setEditingVendor(data, vendorName, enrollmentIdentifier, enrollmentId);
        setVendorContext({
          vendorId: data.enrollment?.vendor,
          vendorName: vendorName || "Unknown Vendor",
        });

        setExpandedVendors({});
        setPopoverStates({});
        navigate("/layout/editvendor");
      } catch (error) {
        handleApiError(error, "Failed to fetch enrollment details");
      } finally {
        setActionLoading((prev) => ({ ...prev, [enrollmentId]: undefined }));
      }
    },
    [
      handleApiError,
      navigate,
      setEditingVendor,
      setVendorContext,
      setActionLoading,
      setExpandedVendors,
      setPopoverStates,
    ]
  );

  const handleDelete = useCallback(
    async (identifier) => {
      setActionLoading((prev) => ({ ...prev, [identifier]: "deleting" }));

      try {
        await deleteEnrollment(identifier);
        toast.success("Enrollment deleted successfully", {
          toastId: "delete-success",
        });

        await fetchEnrollments(false);

        setCurrentPage(1);
        setExpandedVendors({});
        setPopoverStates({});
        closeDeleteModal();
      } catch (error) {
        handleApiError(error, "Failed to delete enrollment");
      } finally {
        setActionLoading((prev) => ({ ...prev, [identifier]: undefined }));
      }
    },
    [
      handleApiError,
      setActionLoading,
      fetchEnrollments,
      setCurrentPage,
      setExpandedVendors,
      setPopoverStates,
      closeDeleteModal,
    ]
  );

  const handleAccountDelete = useCallback(
    async (vendorId, accountId) => {
      setActionLoading((prev) => ({
        ...prev,
        [`account-${accountId}`]: "deleting",
      }));

      try {
        await deleteVendorAccount(accountId);
        toast.success("Account deleted successfully", {
          toastId: "account-delete-success",
        });

        await fetchEnrollments(false);

        setCurrentPage(1);
        setExpandedVendors({});
        setPopoverStates({});
        closeDeleteModal();
      } catch (error) {
        handleApiError(error, "Failed to delete account");
      } finally {
        setActionLoading((prev) => ({
          ...prev,
          [`account-${accountId}`]: undefined,
        }));
      }
    },
    [
      handleApiError,
      setActionLoading,
      fetchEnrollments,
      setCurrentPage,
      setExpandedVendors,
      setPopoverStates,
      closeDeleteModal,
    ]
  );

  const togglePopover = useCallback(
    (key) => {
      setPopoverStates((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    },
    [setPopoverStates]
  );

  const toggleVendor = useCallback(
    (vendorId) => {
      setExpandedVendors((prev) => {
        const isCurrentlyOpen = !!prev[vendorId];
        const resetState = Object.keys(prev).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {});
        return {
          ...resetState,
          [vendorId]: !isCurrentlyOpen,
        };
      });
    },
    [setExpandedVendors]
  );

  const handleSearchChange = useCallback(
    (e) => {
      const sanitizedValue = e.target.value.replace(/[<>]/g, "");
      setSearchTerm(sanitizedValue);
      setCurrentPage(1);
      setExpandedVendors({});
    },
    [setSearchTerm, setCurrentPage, setExpandedVendors]
  );

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
    setExpandedVendors({});
  }, [setCurrentPage, setExpandedVendors]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setExpandedVendors({});
    }
  }, [currentPage, setCurrentPage, setExpandedVendors]);

  const handleViewChange = useCallback(
    (newView) => {
      setView(newView);
      setCurrentPage(1);
      setSearchTerm("");
      setExpandedVendors({});
      setPopoverStates({});
      closeDeleteModal();
    },
    [setView, setCurrentPage, setSearchTerm, setExpandedVendors, setPopoverStates, closeDeleteModal]
  );

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter((vendor) =>
        vendor?.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.filter(
      (vendor) =>
        vendor?.accounts?.some(
          (account) =>
            account?.enrollments?.some(
              (enrollment) =>
                enrollment &&
                typeof enrollment.identifier === "string" &&
                enrollment.identifier.trim() !== ""
            )
        )
    );
  }, [data, searchTerm]);

  const indexOfLastVendor = currentPage * entriesPerPage;
  const indexOfFirstVendor = indexOfLastVendor - entriesPerPage;
  const currentVendors = filteredData.slice(indexOfFirstVendor, indexOfLastVendor);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const renderPagination = () => {
    const maxButtons = isMobile ? 3 : 5;
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
      <div className="flex items-center gap-1 md:gap-3 flex-wrap justify-center">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 text-sm md:text-base px-2 py-1 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "text-green-700"
          }`}
          aria-label="Go to previous page"
        >
          <GrPrevious className="mb-[1px]" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => {
              setCurrentPage(page);
              setExpandedVendors({});
            }}
            className={`px-2 py-1 md:px-3 md:py-1 text-sm md:text-base ${
              currentPage === page
                ? "border border-green-700 bg-green-50 text-green-700"
                : "border text-black"
            }`}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`flex items-center gap-1 text-sm md:text-base px-2 py-1 ${
            currentPage === totalPages || totalPages === 0
              ? "opacity-50 cursor-not-allowed"
              : "text-green-700"
          }`}
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <GrNext className="mb-[1px]" />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white p-3 md:p-5 md:mt-20 mt-16 min-h-screen overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-3 items-stretch md:items-center">
        <div className="flex gap-2 mb-2 md:mb-0 flex-wrap">
          <button
            className={
              view === "custom"
                ? "bg-[#027840] text-white px-2 py-1 rounded flex items-center gap-2 text-sm md:text-base"
                : "text-black px-2 py-1 rounded border flex items-center gap-2 text-sm md:text-base"
            }
            onClick={() => handleViewChange("custom")}
          >
            <span>
              <FaCartShopping />
            </span>
            <span className="whitespace-nowrap">Custom Vendors</span>
          </button>
          <button
            className={
              view === "all"
                ? "bg-[#BB8232] text-white px-2 py-1 rounded flex items-center gap-2 text-sm md:text-base"
                : "text-black px-2 py-1 rounded border flex items-center gap-2 text-sm md:text-base"
            }
            onClick={() => handleViewChange("all")}
          >
            <span>
              <CiEdit />
            </span>
            <span className="whitespace-nowrap">Edit Vendors</span>
          </button>
        </div>

        <div className="relative w-full md:w-auto">
          <label htmlFor="search" className="mr-2 text-sm md:text-base">
            Search:
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border px-2 py-1 text-black outline-none w-full md:w-auto"
            placeholder="Search vendors"
            aria-label="Search vendors"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
                setExpandedVendors({});
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {loader ? (
        <div className="animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-[8px] p-4 md:p-7 flex flex-col"
              >
                <div className="flex items-center gap-2">
                  <div className="h-6 md:h-8 w-24 md:w-36 bg-gray-200 rounded"></div>
                  <div className="h-6 md:h-8 w-3/4 bg-gray-200 rounded"></div>
                </div>
                <div className="h-16 md:h-20"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-5 mb-10 bg-white">
          {view === "custom" && (
            <div className="space-y-4">
              <AddVendorFile
                vendorNames={filteredData.map((vendor) => vendor.vendor.name)}
                searchTerm={searchTerm}
              />
            </div>
          )}

          {view === "all" && (
            <div className="space-y-4">
              {currentVendors.length > 0 ? (
                currentVendors.map((vendor) => {
                  const enrollmentDates = vendor.accounts
                    .flatMap((account) =>
                      account.enrollments.map((e) => e.created_at)
                    )
                    .filter((date) => date && typeof date === "string");

                  const earliestDate =
                    enrollmentDates.length > 0 ? enrollmentDates.sort()[0] : null;

                  const formattedDate = earliestDate
                    ? formatDate(earliestDate)
                    : "N/A";

                  return (
                    <div key={vendor.vendor.id} className="w-full">
                      <button
                        onClick={() => toggleVendor(vendor.vendor.id)}
                        className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                        aria-label={`Toggle details for ${vendor.vendor.name}`}
                      >
                        <div className="w-full flex flex-col md:flex-row justify-between gap-2 md:gap-0 items-start md:items-center">
                          <div className="flex items-center w-full md:w-1/4">
                            {vendor.vendor?.logo ? (
                              <div className="rounded-lg overflow-hidden w-12 md:w-[70px] h-6 md:h-8">
                                <img
                                  src={vendor.vendor.logo}
                                  alt={`${vendor.vendor.name} logo`}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.src = "/fallback-logo.png";
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-12 md:w-[100px] h-6 md:h-8 bg-gray-200 rounded-lg" />
                            )}
                            <span className="text-sm font-semibold ml-2 truncate">
                              {formatVendorName(vendor.vendor.name)}
                            </span>
                          </div>

                          <div className="flex justify-start md:justify-center w-full md:w-1/4">
                            <div className="flex gap-1 bg-[#BB823233] py-1 px-2 rounded-[8px] text-[#005D6899] text-xs md:text-sm">
                              <span className="text-black">Enrolled on:</span>
                              <CgCalendarDates className="text-lg md:text-xl text-[#005D6899]" />
                              <span>{formattedDate}</span>
                            </div>
                          </div>

                          <div className="flex justify-start md:justify-center w-full md:w-1/4">
                            <span className="text-xs md:text-sm bg-[#005D6833] py-1 px-2 rounded-[8px] font-semibold">
                              Accounts: ({vendor.accounts.length})
                            </span>
                          </div>

                          <div className="flex justify-end w-full md:w-1/4">
                            {expandedVendors[vendor.vendor.id] ? (
                              <LiaTimesSolid />
                            ) : (
                              <IoAdd className="text-[17px] font-bold" />
                            )}
                          </div>
                        </div>
                      </button>

                      {expandedVendors[vendor.vendor.id] && (
                        <div className="p-2 md:p-4">
                          <div className="rounded-xl">
                            {vendor.accounts.map((account) => (
                              <div key={account.id} className="mb-6">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-1 md:px-3 mb-3 md:mb-5 gap-3">
                                  <div>
                                    <div className="font-semibold text-sm md:text-base">
                                      Account
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#005D6833] p-1 rounded-[8px] font-semibold text-xs md:text-sm">
                                      <MdAccountBox className="text-lg md:text-xl" />
                                      {account.name || "N/A"}
                                    </div>
                                  </div>

                                  <div className="py-1 px-2 rounded-[10px] bg-[#BB823233] flex items-center gap-1 text-[#005D6899] text-xs md:text-sm">
                                    <span className="text-black font-semibold">
                                      Enrolled on:
                                    </span>
                                    <CgCalendarDates className="text-lg md:text-xl text-[#005D6899]" />
                                    <span>
                                      {account.enrollments[0]
                                        ? formatDate(account.enrollments[0].created_at)
                                        : "N/A"}
                                    </span>
                                  </div>

                                  <div className="w-full md:w-[200px] text-left md:text-center">
                                    <button
                                      onClick={() =>
                                        openDeleteModal({
                                          title: "Delete Account",
                                          message: `Are you sure you want to delete ${account.name || "this account"}? This action cannot be undone.`,
                                          actionKey: `account-${account.id}`,
                                          onConfirm: () =>
                                            handleAccountDelete(vendor.vendor.id, account.id),
                                        })
                                      }
                                      className="px-3 py-2 bg-[#A71A1D] text-xs md:text-sm text-white rounded-[8px] flex items-center gap-1 md:mx-auto"
                                      disabled={
                                        actionLoading[`account-${account.id}`] ===
                                        "deleting"
                                      }
                                      aria-label={`Delete account ${
                                        account.name || "N/A"
                                      }`}
                                    >
                                      {actionLoading[`account-${account.id}`] ===
                                      "deleting" ? (
                                        <ThreeDots
                                          height="20"
                                          width="20"
                                          color="#ffffff"
                                          radius="4"
                                          ariaLabel="delete-loading"
                                        />
                                      ) : (
                                        <>
                                          <FaTrashAlt className="mb-[1px]" />
                                          <span>Delete</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>

                                <div className="flex flex-col border p-2 md:p-3 rounded-[16px] md:rounded-[24px] shadow">
                                  <div className="font-semibold text-sm md:text-base mb-2">
                                    Identifiers
                                  </div>

                                  {account.enrollments.map((enrollment) => (
                                    <div
                                      key={enrollment.id}
                                      className="flex flex-col md:flex-row items-start md:items-center justify-between py-2 gap-2 border-b last:border-b-0"
                                    >
                                      <span className="w-full md:w-[200px] mx-0 md:mx-5 text-xs md:text-sm break-all">
                                        {enrollment.identifier || "N/A"}
                                      </span>

                                      <span className="w-full md:w-[200px] flex items-center gap-2 bg-[#BB823233] text-[#005D6899] p-1 px-2 rounded-[8px] text-xs md:text-sm">
                                        <span className="text-black font-semibold">
                                          Enrolled on:
                                        </span>
                                        <CgCalendarDates className="text-lg md:text-xl" />
                                        <span>{formatDate(enrollment.created_at)}</span>
                                      </span>

                                      <div className="w-full md:w-[200px] flex justify-start md:justify-center space-x-2">
                                        <button
                                          onClick={() =>
                                            handleEdit(
                                              enrollment.identifier,
                                              enrollment.identifier,
                                              formatVendorName(vendor.vendor.name)
                                            )
                                          }
                                          className="px-2 py-1 md:px-2 md:py-2 text-xs md:text-sm rounded-[8px] bg-[#027840] w-[60px] text-white flex items-center gap-1"
                                          disabled={
                                            actionLoading[enrollment.identifier] ===
                                            "editing"
                                          }
                                          aria-label={`Edit enrollment ${enrollment.identifier}`}
                                        >
                                          {actionLoading[enrollment.identifier] ===
                                          "editing" ? (
                                            <ThreeDots
                                              height="12"
                                              width="20"
                                              color="#ffffff"
                                              radius="4"
                                              ariaLabel="edit-loading"
                                            />
                                          ) : (
                                            <>
                                              <CiEdit />
                                              <span>Edit</span>
                                            </>
                                          )}
                                        </button>

                                        <button
                                          onClick={() =>
                                            openDeleteModal({
                                              title: "Delete Identifier",
                                              message: `Are you sure you want to delete ${enrollment.identifier}? This action cannot be undone.`,
                                              actionKey: enrollment.identifier,
                                              onConfirm: () =>
                                                handleDelete(enrollment.identifier),
                                            })
                                          }
                                          className="px-2 py-1 md:px-2 md:py-2 bg-[#A71A1D] text-white text-xs md:text-sm rounded-[8px] flex items-center gap-1"
                                          disabled={
                                            actionLoading[enrollment.identifier] ===
                                            "deleting"
                                          }
                                          aria-label={`Delete enrollment ${enrollment.identifier}`}
                                        >
                                          {actionLoading[enrollment.identifier] ===
                                          "deleting" ? (
                                            <ThreeDots
                                              height="20"
                                              width="20"
                                              color="#ffffff"
                                              radius="4"
                                              ariaLabel="delete-loading"
                                            />
                                          ) : (
                                            <>
                                              <FaTrashAlt />
                                              <span>Delete</span>
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className={`text-center py-10 ${fetchError ? "text-red-500" : "text-gray-700"}`}> {fetchError || "No vendors found."} </p>
              )}
            </div>
          )}

          {view === "all" && currentVendors.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between mt-4 items-center gap-3">
              <div
                className={`text-sm md:text-base ${
                  currentPage === 1 ? "text-gray-400" : "text-green-700"
                }`}
              >
                Showing {currentPage} of {totalPages} Vendors
              </div>
              <div className="flex gap-1 md:gap-3 items-center">{renderPagination()}</div>
            </div>
          )}
        </div>
      )}

      {deleteModal.open && (
        <div className="fixed inset-0 z-[1000] bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-[340px] bg-white rounded-[18px] shadow-[0_10px_30px_rgba(0,0,0,0.16)] p-5 relative">
            <button
              onClick={closeDeleteModal}
              className="absolute right-3 top-3 text-[#666666] hover:text-black"
              aria-label="Close delete modal"
            >
              <FaTimes />
            </button>

            <h3 className="text-[16px] font-semibold text-black pr-6">
              {deleteModal.title}
            </h3>
            <p className="text-[13px] text-[#666666] mt-2 leading-6">
              {deleteModal.message}
            </p>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 rounded-[10px] border border-[#D9D9D9] text-sm text-black"
              >
                Cancel
              </button>
              <button
                onClick={deleteModal.onConfirm}
                disabled={
                  actionLoading[deleteModal.actionKey] === "deleting"
                }
                className="px-4 py-2 rounded-[10px] bg-[#A71A1D] text-sm text-white min-w-[90px] flex items-center justify-center"
              >
                {actionLoading[deleteModal.actionKey] === "deleting" ? (
                  <ThreeDots
                    height="16"
                    width="24"
                    color="#ffffff"
                    radius="4"
                    ariaLabel="delete-loading"
                  />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default EditEnrollment;