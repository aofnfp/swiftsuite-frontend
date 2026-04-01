import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import img from "../Images/success.png";
import { clearVendorData } from "../redux/newVendor";

const AdminVendorSuccess = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.newVendor.addNewVendor);

  let vendorName = "this vendor";
  const storedVendor = store?.name;

  if (storedVendor) {
    try {
      const parsed = JSON.parse(storedVendor);

      if (parsed && typeof parsed === "object") {
        vendorName = parsed.name || vendorName;
      } else if (typeof parsed === "string") {
        vendorName = parsed;
      }
    } catch {
      vendorName = storedVendor;
    }
  }

  const handleBack = () => {
    dispatch(clearVendorData());
  };

  return (
    <div className="bg-white h-screen flex flex-col justify-center items-center text-center space-y-4 px-4">
      <img src={img} width={150} alt="success" className="mb-2" />

      <h2 className="text-2xl font-semibold text-gray-800">
        Vendor Creation <br /> Successful
      </h2>

      <p className="text-gray-600 max-w-md text-lg">
        You’ve successfully added <strong>{vendorName}</strong>
      </p>

      <Link
        to="/admin_layout"
        onClick={handleBack}
        className="text-[#027840] border border-[#027840] px-6 py-2 rounded-lg hover:bg-green-700 hover:text-white transition"
      >
        Back to Admin
      </Link>
    </div>
  );
};

export default AdminVendorSuccess;
