import React, { useCallback, useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { LayoutTemplate, Search } from "lucide-react";
import MarketList from "./MarketList";
import UpdateMarket from "./UpdateMarket";
import SubscriptionModal from "../pages/SubscriptionModal";
import { useMarketplaceStore } from "../stores/marketplaceStore";
import MarketplaceTemplates from "./MarketplaceTemplates";

const MyMarket = () => {
  const { subscribed } = useSelector((state) => state.permission);
  const showModal = useMarketplaceStore((state) => state.modal2Open);
  const setShowModal = useMarketplaceStore((state) => state.setModal2Open);

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const [data] = useState([
    {
      id: 1,
      name: "MarketPlace A",
      logo: "/marketplace-a-logo.png",
      accounts: [
        {
          id: 101,
          name: "Account 1",
          enrollments: [{ id: 1001, created_at: "2025-01-01T12:00:00Z" }],
        },
        {
          id: 102,
          name: "Account 2",
          enrollments: [{ id: 1002, created_at: "2025-02-01T12:00:00Z" }],
        },
      ],
    },
    {
      id: 2,
      name: "MarketPlace B",
      logo: "/marketplace-b-logo.png",
      accounts: [{ id: 201, name: "Account 1", enrollments: [] }],
    },
  ]);

  const [loader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const entriesPerPage = useMarketplaceStore((state) => state.marketPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("marketplaces");

  useEffect(() => {
    if (!subscribed) setShowModal(true);
  }, [subscribed, setShowModal]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setAnalyticsLoading(false);
          return;
        }

        const response = await axios.get(
          "https://service.swiftsuite.app/accounts/dashboard-analytics/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAnalytics(response.data);
      } catch (error) {
        console.log("Failed to fetch analytics", error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const tier = analytics?.tier || "Starter";

  const handleSearchChange = useCallback((e) => {
    const sanitizedValue = e.target.value.replace(/[<>]/g, "");
    setSearchTerm(sanitizedValue);
    setCurrentPage(1);
  }, []);

  const handleViewChange = useCallback(
    (newView) => {
      if (!subscribed) {
        setShowModal(true);
        return;
      }

      setView(newView);
      setCurrentPage(1);
    },
    [subscribed, setShowModal]
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

  const renderTabClass = (tab) =>
    view === tab
      ? "bg-[#027840] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold"
      : "bg-white text-gray-500 px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2 text-sm font-semibold";

  return (
    <div className="bg-white p-5 md:mt-20 mt-16 min-h-screen">
      <SubscriptionModal
        isOpen={!subscribed ? true : showModal}
        onClose={() => {
          if (subscribed) setShowModal(false);
        }}
      />

      <h1 className="text-xl font-bold text-black mb-5">Marketplaces</h1>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div className="flex flex-wrap gap-3">
          <button
            className={renderTabClass("marketplaces")}
            onClick={() => handleViewChange("marketplaces")}
          >
            <FaCartShopping />
            Marketplaces
          </button>

          <button
            className={renderTabClass("edit")}
            onClick={() => handleViewChange("edit")}
          >
            <CiEdit />
            Enrolled marketplaces
          </button>

          <button
            className={renderTabClass("templates")}
            onClick={() => handleViewChange("templates")}
          >
            <LayoutTemplate size={18} />
            Templates
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-[340px]">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search for Vendors"
              className="w-full h-11 rounded-lg bg-white border border-gray-200 pl-11 pr-4 outline-none text-sm"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg px-5 py-3 text-sm">
            Current Plan:{" "}
            <span className="font-bold text-[#BB8232]">
              {analyticsLoading ? "Loading..." : tier}
            </span>
          </div>
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
                  <div className="h-8 w-36 bg-gray-200 rounded" />
                  <div className="h-8 w-3/4 bg-gray-200 rounded" />
                </div>
                <div className="h-20" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-2 mb-10">
          {view === "marketplaces" && <MarketList />}

          {view === "edit" && (
            <UpdateMarket
              marketplaces={currentMarketplaces}
              searchTerm={searchTerm}
            />
          )}

          {view === "templates" && <MarketplaceTemplates />}
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default MyMarket;