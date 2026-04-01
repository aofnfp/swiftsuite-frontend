import React, { useEffect, useState } from "react";
import {
  IoClose,
  IoLocationOutline,
  IoStorefrontOutline,
  IoGlobeOutline,
  IoMapOutline,
  IoHomeOutline,
  IoCodeSlashOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircleOutline,
  IoServerOutline,
  IoEarthOutline,
  IoFlagOutline,
  IoBusinessOutline,
  IoTextOutline
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const VendorRequestDrawer = ({ vendor, onClose, logo }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setOpen(true), 10);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 300);
  };

  const statusColors = {
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    inactive: "bg-rose-100 text-rose-800 border-rose-200"
  };

  const getStatusColor = () => {
    if (vendor.available && vendor.has_data) return "active";
    if (vendor.available || vendor.has_data) return "pending";
    return "inactive";
  };

  const status = getStatusColor();
  const displayLogo = logo || vendor.profile_image || vendor.logo;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute inset-y-0 right-0 w-full sm:w-[480px] flex flex-col"
        >
          <div className="bg-[#027840] p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {displayLogo ? (
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm overflow-hidden border border-white/30">
                    <img 
                      src={displayLogo} 
                      alt="Vendor Logo" 
                      className="w-10 h-10 object-contain p-1"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <IoStorefrontOutline className="text-2xl text-white" />
                  </div>
                )}
                
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {vendor.name || `Vendor #${vendor.id}`}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status]}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    <span className="text-white/90 text-sm">ID: {vendor.id}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <IoClose className="text-2xl text-white" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#027840]/10 p-3 rounded-xl border border-[#027840]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <IoCheckmarkCircleOutline className="text-[#027840]" />
                    <span className="text-xs font-semibold text-gray-700">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {vendor.available ? (
                      <>
                        <div className="w-2 h-2 bg-[#027840] rounded-full"></div>
                        <span className="font-medium text-gray-900">Yes</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">No</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-[#027840]/10 p-3 rounded-xl border border-[#027840]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <IoServerOutline className="text-[#027840]" />
                    <span className="text-xs font-semibold text-gray-700">Has Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {vendor.has_data ? (
                      <>
                        <div className="w-2 h-2 bg-[#027840] rounded-full"></div>
                        <span className="font-medium text-gray-900">Yes</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">No</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {vendor.description && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <IoTextOutline className="text-[#027840]" />
                    <h3 className="font-semibold text-gray-800">Description</h3>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{vendor.description}</p>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <IoEarthOutline className="text-[#027840]" />
                  <h3 className="font-semibold text-gray-800">Location</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <DetailItem label="Country" value={vendor.country} />
                  <DetailItem label="State" value={vendor.state} />
                  <DetailItem label="City" value={vendor.city} />
                  <DetailItem label="Zip Code" value={vendor.zip_code} />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <IoHomeOutline className="text-[#027840]" />
                  <h3 className="font-semibold text-gray-800">Address</h3>
                </div>
                <div className="space-y-2">
                  <DetailItem label="Street 1" value={vendor.address_street1} fullWidth />
                  <DetailItem label="Street 2" value={vendor.address_street2} fullWidth />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <IoCodeSlashOutline className="text-[#027840]" />
                  <h3 className="font-semibold text-gray-800">Integration</h3>
                </div>
                <div className="space-y-2">
                  <DetailItem label="Integration Type" value={vendor.integration_type} fullWidth />
                  <DetailItem label="Request Type" value={vendor.request_type} fullWidth />
                </div>
              </div>

              {displayLogo && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <IoBusinessOutline className="text-[#027840]" />
                    <h3 className="font-semibold text-gray-800">Vendor Logo</h3>
                  </div>
                  <div className="flex justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <img 
                      src={displayLogo} 
                      alt="Vendor Logo" 
                      className="max-w-full max-h-32 object-contain"
                    />
                  </div>
                </div>
              )}

              {vendor.api_details && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <IoServerOutline className="text-[#027840]" />
                    <h3 className="font-semibold text-gray-800">API Details</h3>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                      {JSON.stringify(vendor.api_details, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const DetailItem = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? "col-span-2" : ""}>
    <div className="p-2.5 rounded-lg border border-gray-200 hover:border-[#027840]/30 transition-colors">
      <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
      <div className={`font-normal ${value ? 'text-gray-900' : 'text-gray-400'}`}>
        {value || "Not specified"}
      </div>
    </div>
  </div>
);

export default VendorRequestDrawer; 