import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handlePreviousStep } from "../redux/customVendorSlice";
import { Toaster, toast } from "sonner";

const CustomSuccessStep = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.customVendor);

  const vendor = formData?.customVendorInformation || {};
  const ftp = formData?.customFtpCredentials || {};
  const apiPairs = formData?.customApi?.apiPairs || [];

  
  const logoFile = vendor.logoFile || null;     
  const logoPreview = vendor.logo || null;    

  const [loading, setLoading] = useState(false);
  const [vendorId, setVendorId] = useState(null);

  const maskedPassword = (pwd) => {
    if (!pwd) return "N/A";
    if (pwd.length <= 2) return "••";
    const first = pwd[0];
    const last = pwd[pwd.length - 1];
    const stars = "•".repeat(Math.max(3, pwd.length - 2));
    return `${first}${stars}${last}`;
  };

  
  const nullify = (value) => {
    if (value === undefined || value === "" || value === " ") return null;
    return value;
  };

  const dataURLtoFile = (dataurl, filename = "vendor-logo.jpg") => {
  if (!dataurl || typeof dataurl !== "string") return null;

  try {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  } catch (e) {
    console.error("Error converting base64 to File:", e);
    return null;
  }
};

const buildFinalData = () => {
  const apiDetails = {};
  apiPairs.forEach((pair) => {
    if (pair.key) apiDetails[pair.key] = pair.value || null;
  });

  const formData = new FormData();

  formData.append("name", nullify(vendor.vendor_name) || "");
  formData.append("address_street1", nullify(vendor.vendor_address1) || "");
  formData.append("address_street2", nullify(vendor.vendor_address2) || "");
  formData.append("city", nullify(vendor.city) || "");
  formData.append("state", nullify(vendor.state) || "");
  formData.append("zip_code", nullify(vendor.zip_code) || "");
  formData.append("country", nullify(vendor.country) || "");
  formData.append("description", nullify(vendor.vendor_description) || "");
  formData.append("ftp_username", nullify(ftp.ftp_username) || "");
  formData.append("ftp_password", nullify(ftp.ftp_password) || "");
  formData.append("host", nullify(ftp.ftp_host) || "");
  formData.append("request_type", "force");

  if (Object.keys(apiDetails).length > 0) {
    formData.append("api_details", JSON.stringify(apiDetails));
  }

  
  if (logoPreview && logoPreview.startsWith("data:image")) {
    const file = dataURLtoFile(logoPreview);
    if (file) {
      formData.append("logo", file);
    }
  }

  return formData;
};


  // Submit Vendor Data
  const handleSubmitFinalData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No auth token found.");
      return;
    }

    if (!vendor.vendor_name) {
      toast.error("Vendor name is required.");
      return;
    }

    const dataToSend = buildFinalData();

    try {
      setLoading(true);
      const response = await fetch("https://service.swiftsuite.app/api/v2/vendor-request/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const result = await response.json();
      console.log("Full Vendor Request Response:", result);

      if (response.ok) {
        const id =
          result?.data?.id ||
          result?.id ||
          result?.data?.data?.id ||
          result?.vendor_id ||
          result?.vendor?.id;

        if (id) {
          setVendorId(id);
          toast.success("✅ Vendor request submitted successfully!");
        } else {
          toast.warning("Vendor submitted, but no ID found in response.");
        }
      } else {
        toast.error(result?.message || result?.detail || "Failed to submit vendor request.");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  // Payment Initiation
  const handleProceedToPayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No auth token found.");
      return;
    }

    if (!vendorId) {
      toast.error("Vendor ID missing. Please submit the form first.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://service.swiftsuite.app/api/v2/init-payment/${vendorId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );

      const result = await response.json();
      console.log("Payment Initiation Response:", result);

      if (response.ok) {
        const checkoutUrl =
          result?.data?.checkout_url ||
          result?.checkout_url ||
          result?.data?.data?.checkout_url;

        if (checkoutUrl) {
          toast.success("✅ Redirecting to payment...");
          setTimeout(() => {
            window.location.href = checkoutUrl;
          }, 1000);
        } else {
          toast.error("Checkout URL missing in response.");
        }
      } else {
        toast.error(result?.message || "Payment initiation failed.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Network error while processing payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-8">
      <Toaster position="top-right" richColors closeButton />

      {/* Vendor Info */}
      <div className="w-full max-w-3xl bg-white rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#027840] mb-4 text-left border-b border-[#027840]">
          Vendor Information
        </h3>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex-1">
            <p className="text-gray-700">
              <span className="font-medium">Vendor Name:</span>{" "}
              <span className="ml-2">{vendor.vendor_name || "N/A"}</span>
            </p>
            <p className="text-gray-700 mt-1">
              <span className="font-medium">Address:</span>{" "}
              <span className="ml-2">
                {vendor.vendor_address1 || "N/A"}{" "}
                {vendor.vendor_address2 ? `, ${vendor.vendor_address2}` : ""}
              </span>
            </p>
          </div>

          <div className="flex-shrink-0">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Vendor Logo"
                className="h-16 w-auto object-contain border rounded-md"
              />
            ) : (
              <div className="h-16 w-16 border border-gray-300 rounded-md flex items-center justify-center text-gray-400">
                No Logo
              </div>
            )}
          </div>
        </div>

        {vendor.vendor_description && (
          <div className="mt-3">
            <p className="text-gray-700">
              <span className="font-medium">Description:</span>{" "}
              <span className="ml-2">{vendor.vendor_description}</span>
            </p>
          </div>
        )}
      </div>

      {/* FTP Credentials */}
      <div className="w-full max-w-3xl bg-white rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#027840] mb-4 text-left border-b border-[#027840]">
          FTP Credentials
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-left">
          <div className="text-gray-700">
            <span className="font-medium">FTP Host:</span>
            <div className="ml-0 mt-1">{ftp.ftp_host || "N/A"}</div>
          </div>

          <div className="text-gray-700">
            <span className="font-medium">FTP Username:</span>
            <div className="ml-0 mt-1">{ftp.ftp_username || "N/A"}</div>
          </div>

          <div className="text-gray-700">
            <span className="font-medium">FTP Password:</span>
            <div className="ml-0 mt-1">
              {ftp.ftp_password ? maskedPassword(ftp.ftp_password) : "N/A"}
            </div>
          </div>

          <div className="text-gray-700">
            <span className="font-medium">FTP Port:</span>
            <div className="ml-0 mt-1">{ftp.ftp_port || "N/A"}</div>
          </div>
        </div>
      </div>

      {/* Custom API */}
      <div className="w-full max-w-3xl bg-white rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#027840] mb-4 text-left border-b border-[#027840]">
          Custom API
        </h3>

        {Array.isArray(apiPairs) && apiPairs.length > 0 ? (
          <div className="space-y-2">
            {apiPairs.map((pair, idx) => (
              <div key={idx} className="flex justify-between border-gray-100 py-2">
                <span className="font-medium text-gray-700">{pair.key || "—"}</span>
                <span className="text-gray-700">{pair.value || "—"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No API credentials added.</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-6 pt-4">
        <button
          onClick={() => dispatch(handlePreviousStep())}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Go Back
        </button>

        {!vendorId ? (
          <button
            onClick={handleSubmitFinalData}
            disabled={loading}
            className={`${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#027840] hover:bg-green-700"
            } text-white px-6 py-2 rounded-lg transition`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <button
            onClick={handleProceedToPayment}
            disabled={loading}
            className={`${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#027840] hover:bg-green-700"
            } text-white px-6 py-2 rounded-lg transition`}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomSuccessStep;