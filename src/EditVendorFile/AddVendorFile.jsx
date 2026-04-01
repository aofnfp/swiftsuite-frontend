import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { ThreeDots } from "react-loader-spinner";
import { useQuery } from "@tanstack/react-query";
import { fetchAllVendors, vendorSelection } from "../api/authApi";
import SubscriptionModal from "../pages/SubscriptionModal";
import { useVendorStore } from "../stores/VendorStore";

const AddVendorFile = ({ vendorNames = [], searchTerm = "" }) => {
  const navigate = useNavigate();
  const { subscribed } = useSelector((state) => state.permission);
  const [showModal, setShowModal] = useState(false);
  const [loadingVendorId, setLoadingVendorId] = useState(null);
  const setVendorContext = useVendorStore((state) => state.setVendorContext);

  useEffect(() => {
    if (!subscribed) setShowModal(true);
  }, [subscribed]);

  const {
    data: vendors = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["vendors"],
    queryFn: fetchAllVendors,
    staleTime: 0,
    retry: false,
    onError: () =>
      toast.error("Failed to load vendors. Please try again.", {
        toastId: "load-vendors-error",
      }),
  });

  const filteredItems = useMemo(() => {
    if (!searchTerm) return vendors;
    return vendors.filter((vendor) =>
      vendor.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vendors, searchTerm]);

  const handleVendorSelection = async (vendorId, vendorName) => {
    if (!subscribed) {
      setShowModal(true);
      return;
    }

    setLoadingVendorId(vendorId);
    try {
      const response = await vendorSelection(vendorId);
      const vendorsToUpperCase = ["rsr", "cwr", "ssi"];
      const formattedVendorName = vendorsToUpperCase.includes(
        vendorName.toLowerCase()
      )
        ? vendorName.toUpperCase()
        : vendorName.charAt(0).toUpperCase() +
          vendorName.slice(1).toLowerCase();

      setVendorContext({
        newAccount: response.length === 0,
        vendorId: vendorId,
        vendorName: formattedVendorName,
        fromVendor: true,
      });

      await refetch();
      navigate(`/layout/enrolment?vendor=${formattedVendorName}`);
    } catch {
      toast.error("Vendor is unavailable. Please try again.", {
        toastId: "vendor-unavailable",
      });
    } finally {
      setLoadingVendorId(null);
    }
  };

  const VendorCard = ({ item }) => {
    const isEnrolled = vendorNames.some(
      (name) => name.toLowerCase() === item.name?.toLowerCase()
    );
    const isAvailable = item.available !== false;
    const isLoadingVendor = loadingVendorId === item.id;

    return (
      <div className="bg-white shadow border text-sm rounded-[16px] p-5 flex flex-col h-full">
        <div className="flex items-center justify-between gap-3 mb-3 min-h-[50px]">
          <div className="flex items-center gap-3">
            <img
              src={item.logo}
              width={50}
              className="object-contain h-[40px]"
              alt={item.name || "Vendor logo"}
              onError={(e) => (e.target.src = "/fallback-logo.png")}
            />
            <p className="font-semibold">
              {["cwr", "rsr", "ssi"].includes(item.name?.toLowerCase())
                ? item.name.toUpperCase()
                : item.name?.charAt(0).toUpperCase() +
                  item.name?.slice(1).toLowerCase()}
            </p>
          </div>

          <span
            className={`text-white text-xs px-2 py-1 rounded-[8px] ${
              isEnrolled ? "bg-[#005D68]" : "bg-[#BB8232]"
            }`}
          >
            {isEnrolled ? "Enrolled" : "New"}
          </span>
        </div>

        <div className="text-[13px] text-gray-600 rounded-md p-2 flex-1 overflow-hidden">
          {item.description || "No description available."}
        </div>

        <div className="mt-4">
          <button
            onClick={() =>
              isAvailable && handleVendorSelection(item.id, item.name)
            }
            disabled={!isAvailable || isLoadingVendor}
            className={`py-2 w-[150px] rounded-[8px] font-semibold h-[40px] border flex items-center justify-center ${
              isAvailable
                ? "border-[rgba(2,120,64,0.4)] hover:bg-[rgba(2,120,64,0.05)]"
                : "border-gray-300 bg-gray-200 cursor-not-allowed text-gray-500"
            }`}
          >
            {isLoadingVendor ? (
              <ThreeDots height="20" width="20" color="#027840" />
            ) : isAvailable ? (
              "Add Vendor"
            ) : (
              "Not Available"
            )}
          </button>
        </div>
      </div>
    );
  };

  const RequestCard = () => (
    <div className="bg-white shadow border text-sm rounded-[16px] p-[20px] flex flex-col justify-between">
      <div className="mt-6">
        <h3 className="font-semibold text-[16px] mb-2">
          Custom Supplier Integration
        </h3>
        <p className="text-[13px] text-gray-600 mb-6">
          Can’t find your supplier? Just send us a request! We’ll integrate them
          as soon as possible so you can keep all your orders and data in one
          place.
        </p>
      </div>
      <button
        onClick={() => {
          if (!subscribed) {
            setShowModal(true);
            return;
          }
          navigate("/layout/custom_vendor_integration");
        }}
        className="py-2 w-[150px] rounded-[8px] bg-[#027840] text-white font-semibold h-[40px] border border-[rgba(2,120,64,0.4)] hover:bg-[rgba(2,120,64,0.05)] hover:text-black"
      >
        Send Request
      </button>
    </div>
  );

  return (
    <div className="mb-5 mx-auto">
      <Toaster richColors position="top-right" />
      <SubscriptionModal
        isOpen={!subscribed ? true : showModal}
        onClose={() => {
          if (subscribed) setShowModal(false);
        }}
      />

      {isLoading ? (
        <div className="animate-pulse grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-7 flex flex-col items-center"
            >
              <div className="h-24 w-36 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 w-36 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {filteredItems.length ? (
            <>
              {filteredItems.map((item) => (
                <VendorCard key={item.id} item={item} />
              ))}
              <RequestCard />
            </>
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No vendors found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddVendorFile;