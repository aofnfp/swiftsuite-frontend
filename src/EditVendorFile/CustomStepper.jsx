import React from "react";

const steps = ["Edit Identifier", "Product Type"];

const CustomStepper = ({ currentStep, onStepChange }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-10 px-4">
      <div className="flex items-center justify-between relative">
        {steps.map((title, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <React.Fragment key={index}>
              <div
                className="flex items-center gap-2 z-10 cursor-pointer"
                onClick={() => onStepChange(index)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    ${
                      isCompleted
                        ? "bg-[#027840] text-white border border-[#027840]"
                        : isActive
                          ? "bg-white text-[#027840] border-2 border-[#027840]"
                          : "bg-white text-gray-400 border-2 border-gray-300"
                    }
                  `}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
                <div className="text-sm text-gray-700 whitespace-nowrap">
                  {title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CustomStepper;
