import React, { useEffect, useMemo, useState } from "react";
import { GoPlus } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs"; // Horizontal dots
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import EditVendorData from "./EditVendorData";
import VendorRequestDrawer from "./VendorRequestDrawer";
import { clearVendorData } from "../redux/newVendor";

const ITEMS_PER_PAGE = 5;

const AddNewVendor2 = () => {
  const dispatch = useDispatch();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [enforceFilter, setEnforceFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");

  const handleCreateNewVendor = () => {
    dispatch(clearVendorData());
    localStorage.setItem("creatingNewAdminVendor", "true");
  };

  useEffect(() => {
    const fetchRequestedVendors = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get(
          "https://service.swiftsuite.app/api/v2/vendor-admin/?search=requested",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVendors(res.data?.results || []);
      } catch (err) {
        console.error("Error fetching vendor requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestedVendors();
  }, [token]);

  /* =====================
     Filtering
  ===================== */
  const filteredVendors = useMemo(() => {
    if (enforceFilter === "all") return vendors;

    return vendors.filter((v) =>
      enforceFilter === "yes"
        ? v.request_type === "force"
        : v.request_type !== "force"
    );
  }, [vendors, enforceFilter]);

  /* =====================
     Pagination
  ===================== */
  const totalPages = Math.ceil(filteredVendors.length / ITEMS_PER_PAGE);

  const paginatedVendors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVendors.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVendors, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [enforceFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFilterLabel = () => {
    if (enforceFilter === "all") return "All";
    if (enforceFilter === "yes") return "Yes";
    if (enforceFilter === "no") return "No";
    return "All";
  };

  return (
    <div className="mt-10 pb-10 flex flex-col gap-10">
      {/* Add Vendor */}
      <section>
        <div className="lg:w-2/6 w-full">
          <h1 className="font-semibold text-[15px]">Add Vendors</h1>
          <p className="my-2">Add new vendors to SwiftSuite app</p>

          <Link to="/admin_layout/newvendor" onClick={handleCreateNewVendor}>
            <div className="flex flex-col justify-center items-center rounded-[8px] text-center bg-white shadow gap-4 h-[171px] cursor-pointer hover:bg-gray-50 transition duration-200">
              <h1 className="font-semibold w-[229px] mb-2 text-[15px]">
                Create New Vendor
              </h1>
              <GoPlus className="text-4xl text-[#027840]" />
              <p className="w-2/3 text-sm text-gray-600">
                Set up a new vendor on SwiftSuite App by inputting vendor details.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Current Vendors */}
      <section>
        <h1 className="font-semibold text-[15px]">Current Vendors</h1>
        <p className="my-2">
          Edit vendor credentials of already existing vendors on SwiftSuite App
        </p>
        <EditVendorData />
      </section>

      {/* Vendor Requests */}
      <section>
        <div className="mb-6">
          <h1 className="font-semibold text-[15px]">Vendor Requests</h1>
          <p className="my-1 text-sm text-gray-600">
            Users requesting access to additional vendors
          </p>

          {/* Custom Dropdown - Below title & description */}
          <div className="dropdown-container relative inline-block text-left mt-4">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex justify-between items-center w-64 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#027840] transition"
            >
              <span>Enforce Vendor: {getFilterLabel()}</span>
              <svg
                className={`ml-2 h-5 w-5 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="origin-top-left absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {[
                    { value: "all", label: "All" },
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setEnforceFilter(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition ${
                        enforceFilter === option.value
                          ? "bg-[#027840] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-[13px] overflow-hidden border border-gray-300 font-semibold table-fixed">
            <thead className="bg-[#027840] text-white">
              <tr>
                <th className="px-4 py-3 text-left w-1/5">ID</th>
                <th className="px-4 py-3 text-left w-1/5">Name</th>
                <th className="px-4 py-3 text-center w-1/5">Logo</th>
                <th className="px-4 py-3 text-center w-1/5">Enforce Vendor</th>
                <th className="px-4 py-3 text-center w-1/5">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-800">
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    Loading vendor requests...
                  </td>
                </tr>
              )}

              {!loading && paginatedVendors.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    No vendor requests found
                  </td>
                </tr>
              )}

              {!loading &&
                paginatedVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 transition">
                    <td className="border-b px-4 py-3 truncate">{vendor.id}</td>
                    <td className="border-b px-4 py-3 truncate">
                      {vendor.name || `Vendor #${vendor.id}`}
                    </td>
                    <td className="border-b px-4 py-3">
                      <div className="flex justify-center">
                        {vendor.logo ? (
                          <img
                            src={vendor.logo}
                            alt="Vendor logo"
                            className="w-10 h-10 rounded object-cover border"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs font-medium text-gray-500">
                            N/A
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="border-b px-4 py-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          vendor.request_type === "force"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {vendor.request_type === "force" ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="border-b px-4 py-3">
                      <div className="flex justify-center">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition"
                          aria-label="More options"
                        >
                          <BsThreeDots className="text-xl text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-md border transition ${
                  currentPage === i + 1
                    ? "bg-[#027840] text-white border-[#027840]"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Drawer */}
      {selectedVendor && (
        <VendorRequestDrawer
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
        />
      )}
    </div>
  );
};

export default AddNewVendor2;