import React, { useEffect } from 'react';
import { BsCheckCircleFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { useEditVendorStore } from '../stores/editVendorStore';

import EditProductType from './EditProductType';
import EditIdentifier from './EditIdentifier';


const VendorEdit = () => {
  const navigate = useNavigate();
  const currentIndex = useEditVendorStore((state) => state.currentStep);
  const setCurrentStep = useEditVendorStore((state) => state.setCurrentStep);
  const vendorData = useEditVendorStore((state) => state.matchedVendor);

  useEffect(() => {
    if (!vendorData) {
      navigate('/');
    }
    return () => {
      setCurrentStep(0);
    };
  }, [navigate, vendorData, setCurrentStep]);

  if (!vendorData) {
    return (
      <div className="text-center text-xl font-semibold mt-20">
        Loading...
      </div>
    );
  }

  const steps = ['Edit Identifier', 'Product Type'];

  const handleStepChange = (step) => {
    dispatch(handleNextStep({ currentStep: step }));
  };

  return (
    <section className="bg-[#E7F2ED]  my-16">
      {currentIndex !== 2 && (
        <div className="flex items-center justify-center gap-6 py-6">
          {steps.map((label, index) => {
            const completed = currentIndex > index;
            const current = currentIndex === index;

            return (
              <div
                key={index}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleStepChange(index)}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm transition-colors duration-200 ${
                    completed
                      ? 'bg-[#027840]'
                      : current
                      ? 'bg-[#027840]'
                      : 'bg-gray-300'
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
                    current ? 'text-green-800' : 'text-gray-600'
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
      )}
      <div className="flex flex-col items-center">
        <div className="rounded-xl w-full max-w-3xl min-h-[300px] mb-10 py-2">
          {currentIndex === 0 && <EditIdentifier vendorData={vendorData} />}
          {currentIndex === 1 && <EditProductType vendorData={vendorData} />}
        </div>
      </div>
    </section>
  );
};

export default VendorEdit;
