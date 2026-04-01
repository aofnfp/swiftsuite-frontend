import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { ThreeDots } from "react-loader-spinner";
import { setVendorForEdit } from "../redux/newVendor";

const EditVendorData = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const [allVendors, setAllVendors] = useState([]);
  const [loadingVendorId, setLoadingVendorId] = useState(null);
  const [togglingVendorId, setTogglingVendorId] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const formatVendorName = (name) => {
    if (!name || typeof name !== "string") return "Unknown Vendor";

    const upper = ["rsr", "cwr", "ssi"];
    const lower = name.toLowerCase();

    return upper.includes(lower)
      ? lower.toUpperCase()
      : lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const normalizeApiDetailsForForm = (value) => {
    if (value === undefined || value === null) return null;

    if (Array.isArray(value)) return JSON.stringify(value);

    if (typeof value === "string") {
      const t = value.trim();
      if (!t) return null;
      try {
        const parsed = JSON.parse(t);
        return JSON.stringify(parsed);
      } catch {
        return null;
      }
    }

    try {
      return JSON.stringify(value);
    } catch {
      return null;
    }
  };

  const urlToFile = async (url, filename = "logo") => {
    const res = await fetch(url);
    const blob = await res.blob();
    const type = blob.type || "application/octet-stream";
    const ext =
      type.includes("png") ? "png" : type.includes("jpeg") ? "jpg" : "bin";
    return new File([blob], `${filename}.${ext}`, { type });
  };

  const fetchVendorAdminDetail = useCallback(
    async (vendorId) => {
      const res = await axios.get(
        `https://service.swiftsuite.app/api/v2/vendor-admin/${vendorId}/`,
        { headers }
      );
      return res.data;
    },
    [token]
  );

  const buildVendorAdminFormData = async (vendor, nextAvailable) => {
    const formData = new FormData();

    const keys = [
      "name",
      "address_street1",
      "address_street2",
      "city",
      "state",
      "zip_code",
      "country",
      "description",
      "api_access_id",
      "api_access_key",
      "username",
      "pos",
      "password",
      "ftp_username",
      "ftp_password",
      "host",
      "integration_type",
      "request_type",
      "requested_by",
    ];

    keys.forEach((k) => {
      const v = vendor?.[k];
      if (v !== undefined && v !== null && v !== "") formData.append(k, v);
    });

    formData.append("available", String(nextAvailable));
    formData.append("has_data", String(!!vendor?.has_data));

    const apiDetails = normalizeApiDetailsForForm(vendor?.api_details);
    if (apiDetails) formData.append("api_details", apiDetails);

    if (vendor?.logo instanceof File) {
      formData.append("logo", vendor.logo);
    } else if (typeof vendor?.logo === "string" && vendor.logo.trim()) {
      const file = await urlToFile(vendor.logo.trim(), "logo");
      formData.append("logo", file);
    }

    return formData;
  };

  const handleVendorSelection = useCallback(
    async (vendorId) => {
      setLoadingVendorId(vendorId);

      try {
        const data = await fetchVendorAdminDetail(vendorId);
        localStorage.setItem("creatingNewAdminVendor", "false");
        dispatch(setVendorForEdit(data));
        navigate(`/admin_layout/newvendor/`);
      } catch (err) {
        console.error(err);
        toast.error("Vendor is unavailable. Please try again.");
      } finally {
        setLoadingVendorId(null);
      }
    },
    [dispatch, navigate, fetchVendorAdminDetail]
  );

  const toggleVendorAvailability = useCallback(
    async (vendorId) => {
      if (!vendorId) return;

      setTogglingVendorId(vendorId);

      try {
        const vendor = await fetchVendorAdminDetail(vendorId);
        const nextAvailable = !vendor?.available;

        if (!vendor?.logo) {
          toast.error("Vendor logo is required by backend.");
          return;
        }

        const formData = await buildVendorAdminFormData(vendor, nextAvailable);

        await axios.put(
          `https://service.swiftsuite.app/api/v2/vendor-admin/${vendorId}/`,
          formData,
          { headers }
        );

        setAllVendors((prev) =>
          prev.map((v) =>
            v?.id === vendorId ? { ...v, available: nextAvailable } : v
          )
        );

        toast.success(
          `Vendor marked as ${nextAvailable ? "available" : "not available"}`
        );
      } catch (err) {
        console.error(err?.response?.data || err);

        const d = err?.response?.data;
        const msg =
          d?.detail ||
          (d?.logo && d.logo[0]) ||
          (d?.api_details && d.api_details[0]) ||
          "Failed to update availability.";

        toast.error(msg);
      } finally {
        setTogglingVendorId(null);
      }
    },
    [fetchVendorAdminDetail, token]
  );

  const runWithConcurrency = async (items, limit, worker) => {
    const results = new Array(items.length);
    let idx = 0;

    const runners = Array.from({ length: Math.min(limit, items.length) }).map(
      async () => {
        while (idx < items.length) {
          const current = idx++;
          try {
            results[current] = await worker(items[current], current);
          } catch (e) {
            results[current] = null;
          }
        }
      }
    );

    await Promise.all(runners);
    return results;
  };

  useEffect(() => {
    const fetchVendorsAndAvailability = async () => {
      try {
        const res = await axios.get(
         "https://service.swiftsuite.app/api/v2/vendor/",
          { headers }
        );

        const base = Array.isArray(res.data) ? res.data : [];
        setAllVendors(base);

        const details = await runWithConcurrency(base, 6, async (v) => {
          if (!v?.id) return null;
          const d = await fetchVendorAdminDetail(v.id);
          return { id: v.id, available: !!d?.available };
        });

        const availabilityMap = new Map();
        details.forEach((d) => {
          if (d?.id !== undefined && d?.id !== null) {
            availabilityMap.set(d.id, d.available);
          }
        });

        setAllVendors((prev) =>
          prev.map((v) => {
            if (!v?.id) return v;
            if (!availabilityMap.has(v.id)) return v;
            return { ...v, available: availabilityMap.get(v.id) };
          })
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load vendors.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorsAndAvailability();
  }, [token]);

  const VendorCard = ({ item }) => {
    const isLoading = loadingVendorId === item?.id;
    const isToggling = togglingVendorId === item?.id;

    return (
      <div className="bg-white shadow border text-sm rounded-[16px] p-5 flex flex-col justify-between h-full">
        <div className="flex items-center gap-3 mb-3 h-[50px]">
          <img
            src={item?.logo || "/fallback-logo.png"}
            width={50}
            className="object-contain h-full"
            alt={item?.name}
            onError={(e) => (e.target.src = "/fallback-logo.png")}
          />

          <div className="flex flex-col">
            <p className="font-semibold">{formatVendorName(item?.name)}</p>
            <p
              className={`text-[12px] ${
                item?.available ? "text-green-700" : "text-red-600"
              }`}
            >
              {item?.available ? "Available" : "Not available"}
            </p>
          </div>
        </div>

        <div className="text-[13px] p-2 flex-1 overflow-hidden">
          {item?.description || "No description available."}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => handleVendorSelection(item?.id)}
            disabled={isLoading}
            className="py-2 px-4 w-fit rounded-[8px] font-semibold border border-[rgba(2,120,64,0.4)] hover:bg-[rgba(2,120,64,0.05)] flex items-center"
          >
            {isLoading ? (
              <ThreeDots
                height="20"
                width="20"
                color="#027840"
                radius="9"
                ariaLabel="loading"
              />
            ) : (
              "Edit Vendor Details"
            )}
          </button>

          <button
            onClick={() => toggleVendorAvailability(item?.id)}
            disabled={isToggling}
            className="py-2 px-4 w-fit rounded-[8px] font-semibold border border-gray-200 hover:bg-gray-50 flex items-center"
          >
            {isToggling ? (
              <ThreeDots
                height="20"
                width="20"
                color="#111827"
                radius="9"
                ariaLabel="loading"
              />
            ) : item?.available ? (
              "Set Not Available"
            ) : (
              "Set Available"
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-10 mx-auto">
      <Toaster position="top-right" />
      {loading ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border rounded-[16px] p-7 animate-pulse"
            >
              <div className="h-12 w-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-36 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {allVendors.map((item) => (
            <VendorCard key={item?.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EditVendorData;
