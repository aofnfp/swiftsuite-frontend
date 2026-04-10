import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Vendorenrolment from "./Vendorenrolment";
import Fpicredential from "./Fpicredential";
import Fpioption from "./Fpioption";
import Lipsey from "./Lipsey";
import Fragrancex from "./Fragrancex";
import Zanders from "./Zanders";
import Cwr from "./Cwr";
import Ssi from "./Ssi";
import Rsr from "./Rsr";
import Identifier from "./Identifier";
import Thank from "../EditVendorFile/Thank";

import { BsCheckCircleFill } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { useVendorStore } from "../stores/VendorStore";

import lipsey from "../Images/vendorEnrol/lipseyImage.png"
import fragrancex from "../Images/vendorEnrol/fragrancexImage.png";
import zanders from "../Images/vendorEnrol/zandersImage.png";
import cwr from "../Images/vendorEnrol/cwrImage.png";
import ssi from "../Images/vendorEnrol/ssiImage.png";
import rsr from "../Images/vendorEnrol/rsrImage.png";

const Enrolment = () => {
  const vendorName = useVendorStore((state) => state.vendorName);
  const currentStep = useVendorStore((state) => state.currentStep);
  const setVendorContext = useVendorStore((state) => state.setVendorContext);
  const location = useLocation();

  useEffect(() => {
    const urlVendor = new URLSearchParams(location.search).get("vendor");
    if (urlVendor && (!vendorName || vendorName !== urlVendor)) {
      setVendorContext({ vendorName: urlVendor });
    }
  }, [location.search, vendorName, setVendorContext]);

  const steps = [
    "Vendor Enrolment",
    "FTP Credentials",
    "Vendor Options",
    "Product Type",
  ];

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <Vendorenrolment />;
      case 1:
        return <Fpicredential />;
      case 2:
        return <Identifier />;
      case 3:
        switch (vendorName) {
          case "Lipsey":
            return <Lipsey />;
          case "Fragrancex":
            return <Fragrancex />;
          case "Zanders":
            return <Zanders />;
          case "CWR":
            return <Cwr />;
          case "SSI":
            return <Ssi />;
          case "RSR":
            return <Rsr />;
          default:
            return <Fpioption />;
        }
      case 4:
        return <Thank />;
      default:
        return <Vendorenrolment />;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
      <div className="flex items-center mt-10 pt-10 justify-between w-full max-w-3xl">
        <div>
          <h1 className="text-xl font-bold py-3">
            Enrol Vendor
          </h1>
        </div>
        <div>
          {vendorName === "Lipsey" ? (
            <img src={lipsey} alt="lipsey" className="h-16 md:h-20 object-contain" />
          ) : vendorName === "Fragrancex" ? (             
            <img src={fragrancex} alt="fragrancex" className="h-10 md:h-10 object-contain" />
          ) : vendorName === "Zanders" ? (  
            <img src={zanders} alt="zanders" className="h-10 md:h-10 object-contain" />
          ) : vendorName === "CWR" ? (  
            <img src={cwr} alt="cwr" className="h-10 md:h-10 object-contain" />
          ) : vendorName === "SSI" ? (  
            <img src={ssi} alt="ssi" className="h-10 md:h-10 object-contain" />
          ) : vendorName === "RSR" ? (    
            <img src={rsr} alt="rsr" className="h-10 md:h-10 object-contain" />
          ) : (
            null
          )}
        </div>
      </div>
        <div className="flex items-center justify-center gap-6 py-2">
          {steps.map((label, index) => {
            const completed = currentStep > index;
            const current = currentStep === index;

            return (
              <div
                  key={index}
                  className="flex items-center gap-2"
                >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm ${
                    completed
                      ? "bg-[#027840]"
                      : current
                      ? "bg-[#027840]"
                      : "bg-gray-300"
                  }`}
                >
                  {completed ? (
                    <BsCheckCircleFill className="text-white" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-sm hidden md:block font-medium ${
                    current ? "text-green-800" : "text-gray-600"
                  }`}
                >
                  {label}
                </span>
                {index !== steps.length - 1 && (
                  <div className="w-6 h-px bg-gray-400" />
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-xl w-full max-w-3xl min-h-[300px] mb-10 py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Enrolment;
