import React from "react";
import img from "../Images/success.png";
import { Link } from "react-router-dom";
import { useVendorStore } from "../stores/VendorStore";

const ThankSuccessPage = () => {
  const storeVendorName = useVendorStore((state) => state.vendorName);
  const vendorName = storeVendorName || "this vendor";

  return (
    <div className="bg-white h-screen flex flex-col justify-center items-center text-center space-y-4 px-4">
      <img src={img} width={150} alt="success" className="mb-2" />

      <h2 className="text-2xl font-semibold text-gray-800">
        Vendor Enrolment <br /> Successful
      </h2>

      <p className="text-gray-600 max-w-md text-lg">
        You’ve successfully enrolled for <strong>{vendorName}</strong>
      </p>

      <Link
        to="/layout/editenrollment"
        className="text-[#027840] border border-[#027840] px-6 py-2 rounded-lg hover:bg-green-700 hover:text-white transition"
      >
        Back to vendor
      </Link>
    </div>
  );
};

export default ThankSuccessPage;
