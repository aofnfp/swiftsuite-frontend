import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import VendorPage from "./VendorPage";
import { useVendorStore } from "../stores/VendorStore";

const Vendorenrolment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storeVendorName = useVendorStore((state) => state.vendorName);
  const storeFromVendor = useVendorStore((state) => state.fromVendor);
  const setCurrentStep = useVendorStore((state) => state.setCurrentStep);

  useEffect(() => {
    setCurrentStep(0);
  }, [setCurrentStep]);

  // Get vendor name from query param, store, or localStorage fallback
  const vendorName =
    new URLSearchParams(location.search).get("vendor") ||
    storeVendorName ||
    localStorage.getItem("vendor_name") ||
    "";

  const checkVendor = storeFromVendor || localStorage.getItem("fromVendor") === "true";

  const handleVendorPageClose = () => {
    if (checkVendor === "true") {
      navigate("/layout/editenrollment");
    } else {
      navigate("/layout/home");
    }
  };

  return (
    <section className="bg-white  rounded-[10px]">
      <VendorPage
        vendorName={vendorName}
        onClose={handleVendorPageClose}
        navigate={navigate}
      />
    </section>
  );
};

export default Vendorenrolment;
