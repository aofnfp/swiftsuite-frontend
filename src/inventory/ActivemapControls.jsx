import { useState } from "react";
import VendorlistDropdown from "../cataloguedetails/Dropdown/VendorlistDropdown";
import { Share2 } from "lucide-react";

const ActiveRemapControls = ({ selectedVendor, setSelectedVendor, openVendor, setOpenVendor, handleMapProducts, isMapLoading, vendorList }) => {
  const [showRemapControls, setShowRemapControls] = useState(false);

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      {!showRemapControls ? (
        <button
          onClick={() => setShowRemapControls(true)}
          className="bg-green-600 hover:bg-green-700 active:scale-95 text-white py-2 px-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
        >
          Remap
        </button>
      ) : (
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-72">
            <VendorlistDropdown
              selected={selectedVendor || "Select Vendor"}
              onChange={(v) => setSelectedVendor(v)}
              open={openVendor}
              setOpen={setOpenVendor}
              catalogue={vendorList}
            />
          </div>
          <button
            onClick={() => handleMapProducts()}
            disabled={!selectedVendor || isMapLoading}
            className={`inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-all ${
              !selectedVendor
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 active:scale-95 shadow-md hover:shadow-lg"
            }`}
          >
            {isMapLoading ? (
              <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Map Product</span>
              </>
            )}
          </button>
          <button
            onClick={() => {setShowRemapControls(false); setSelectedVendor(null);}}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveRemapControls;