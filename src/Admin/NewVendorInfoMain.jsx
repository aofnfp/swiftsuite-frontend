import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsCheckCircleFill } from "react-icons/bs";
import NewVendorInfo1 from "./NewVendorInfo1";
import NewVendorInfo2 from "./NewVendorInfo2";
import NewVendorInfo3 from "./NewVendorInfo3";
import { setCurrentStep } from "../redux/newVendor";

const NewVendorInfoMain = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector(
    (state) => state.newVendor.addNewVendor.currentStep
  );

  const steps = ["Vendor Information", "FTP Details", "API Details"];

  return (
    <section className="bg-[#E7F2ED] mb-16">
      <div className="flex items-center justify-center gap-6 py-2">
        {steps.map((label, index) => {
          const completed = currentStep > index;
          const current = currentStep === index;

          return (
            <div
              key={index}
              onClick={() =>
                index <= currentStep && dispatch(setCurrentStep(index))
              }
              className={`flex items-center gap-2 ${
                index <= currentStep
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  completed || current ? "bg-[#027840]" : "bg-gray-300"
                }`}
              >
                {completed ? <BsCheckCircleFill /> : index + 1}
              </div>

              <span
                className={`hidden md:block text-sm font-medium ${
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

      <div className="flex justify-center">
        <div className="w-full max-w-4xl px-4">
          {currentStep === 0 && <NewVendorInfo1 />}
          {currentStep === 1 && <NewVendorInfo2 />}
          {currentStep === 2 && <NewVendorInfo3 />}
        </div>
      </div>
    </section>
  );
};

export default NewVendorInfoMain;
