import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { Toaster, toast } from "sonner";
import Faqs from "./Faqs";

const PricingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loadingTier, setLoadingTier] = useState(null);
  const [activePlan, setActivePlan] = useState(location.state?.plan || null);
  const [selectedAddOns, setSelectedAddOns] = useState({});

  useEffect(() => {
    if (!activePlan) {
      const storedPlan = localStorage.getItem("selectedPlan");
      if (storedPlan) setActivePlan(JSON.parse(storedPlan));
    }
  }, [activePlan]);

  useEffect(() => {
    if (activePlan) {
      localStorage.setItem("selectedPlan", JSON.stringify(activePlan));
    }
  }, [activePlan]);

  const chooseMyPlan = async (tier) => {
    setLoadingTier(tier);
    try {
      const endpoint = `https://service.swiftsuite.app/accounts/tier-subscription/`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ tier }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Unexpected server response. Please try again.");
      }

      if (response.status === 401 || response.status === 403) {
        toast.error("Redirecting to sign in...");
        localStorage.setItem("selectedPlan", JSON.stringify(activePlan));
        localStorage.setItem("redirectAfterLogin", location.pathname);
        setTimeout(() => navigate("/signin"), 2000);
        return;
      }

      const result = await response.json();
      if (response.ok) {
        localStorage.removeItem("selectedPlan");
        window.open(result.checkout_url, "_blank");
      } else {
        toast.error(result.detail || "Failed to select plan.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Unable to connect. Please check your internet and try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  if (!activePlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#E7F2ED] px-4 py-8">
        <div className="bg-white rounded-lg p-6 sm:p-8 text-center max-w-sm w-full">
          <p className="text-base sm:text-lg text-gray-600 mb-6">
            No plan details available.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-1 mx-auto bg-[#E7F2ED] rounded-lg min-h-screen">
      <div className="mt-2 py-5 bg-white">
        <h1 className="text-2xl sm:text-3xl text-center font-semibold px-4">Pricing Plans</h1>
        <p className="text-center text-sm sm:text-base px-4 mt-2">
          Here, you have an elaborate view of the plans you want to go with <br className="hidden sm:block" />
          and the top features, broken down <br className="hidden sm:block" /> and explained
        </p>
      </div>

      <div className="bg-white">
        <div className="flex flex-col lg:flex-row pt-6 sm:pt-10 mt-3 justify-center items-stretch bg-white px-4 sm:px-6 md:px-8 w-full lg:max-w-[50%] mx-auto gap-0 lg:gap-0">
          <div className="grid grid-rows-2 flex-1 min-w-full lg:min-w-[50%] mb-6 lg:mb-0">
            <div className="flex bg-[#F2F2F2] font-semibold text-xl sm:text-2xl p-6 sm:p-8">
              <p className="break-words">
                Choose your <br /> plan
              </p>
            </div>
            <div className="flex flex-col border border-t-0 border-gray-200">
              <p className="font-semibold h-10 sm:h-[40px] flex items-center text-base sm:text-[17px] px-4 sm:px-6">
                Top Features
              </p>
              <ul className="flex-1 flex flex-col">
                {activePlan.include?.map((item) => {
                  let cleanedText = item.text
                    .replace(/inventory sync/gi, "")
                    .replace(/Orders \/ Month/gi, "Orders")
                    .replace(/Vendors/gi, "Vendor Integrations")
                    .replace(/,/g, "")
                    .replace(/[0-9]/g, "")
                    .replace(/\bstore(s)?\b/gi, "Marketplace Integrations")
                    .replace(/\s+/g, " ")
                    .trim();

                  return cleanedText ? (
                    <li key={item.id} className="border-b flex items-center h-12 sm:h-[60px] px-4 sm:px-6">
                      <span className="text-gray-700 text-sm sm:text-base">{cleanedText}</span>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          </div>

          <div className="grid grid-rows-2 w-full lg:w-[50%] shadow-[0_2px_30px_0_rgba(0,0,0,0.25)]">
            <div className="border flex flex-col items-center justify-center text-center py-6 sm:py-8 px-4">
              <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: activePlan.color }}>
                {activePlan.name}
              </h2>
              <div className="font-bold mb-2 text-2xl sm:text-[2rem]" style={{ color: activePlan.color }}>
                {parseFloat(activePlan.price) === 0 ? (
                  <span>Custom</span>
                ) : (
                  <>
                    ${parseFloat(activePlan.price).toLocaleString()}
                    <span className="text-sm sm:text-[1rem] text-gray-500 block">/month</span>
                  </>
                )}
              </div>

              <p className="mb-6 font-semibold text-gray-500 text-sm sm:text-base">
                billed <br /> monthly
              </p>

              <button
                onClick={() => chooseMyPlan(activePlan.id)}
                className="border w-full sm:w-[170px] h-10 sm:h-[40px] px-4 rounded-[10px] bg-[#027840] text-white inline-flex items-center justify-center gap-2 mt-3 hover:bg-[#026634] transition disabled:opacity-70 font-semibold text-sm sm:text-base"
                disabled={loadingTier === activePlan.id}
                aria-busy={loadingTier === activePlan.id}
              >
                {loadingTier === activePlan.id ? (
                  <span className="flex items-center justify-center">
                    <ThreeDots height="20" width="20" color="white" ariaLabel="loading" />
                  </span>
                ) : (
                  <span className="whitespace-nowrap">Proceed to Payment</span>
                )}
              </button>
            </div>

            <div className="border border-t-0">
              <p className="font-semibold h-10 sm:h-[40px] flex items-center text-base sm:text-[17px] px-4 sm:px-6"></p>
              <ul className="flex-1 flex flex-col">
                <li className="border-b flex flex-col items-center justify-center h-14 sm:h-[60px] px-4 sm:px-6">
                  <span className="font-semibold text-sm sm:text-base">{activePlan.included_orders} Orders/month</span>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    (extra order cost ${parseFloat(activePlan.extra_order_cost).toFixed(2)})
                  </span>
                </li>
                <li className="border-b flex flex-col items-center justify-center h-14 sm:h-[60px] px-4 sm:px-6">
                  <span className="font-semibold text-sm sm:text-base">{activePlan.included_stores} Marketplace Integrations</span>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    (extra store cost: ${parseFloat(activePlan.extra_store_cost).toFixed(2)})
                  </span>
                </li>
                <li className="border-b flex flex-col items-center justify-center h-14 sm:h-[60px] px-4 sm:px-6">
                  <span className="font-semibold text-sm sm:text-base">{activePlan.included_vendors} Vendor Integrations</span>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    (extra vendor cost: ${parseFloat(activePlan.extra_vendor_cost).toFixed(2)})
                  </span>
                </li>
                <li className="border-b flex flex-col items-center justify-center h-14 sm:h-[60px] px-4 sm:px-6">
                  <span className="font-semibold text-sm sm:text-base">{activePlan.max_subaccounts} Subaccounts</span>
                  <span className="text-gray-500 text-xs sm:text-sm">(Included in plan)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-white mx-auto">
        <Faqs />
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default PricingDetails;