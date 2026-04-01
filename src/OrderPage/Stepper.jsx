import React from "react";
import { formatDeliveryDate } from "../utils/utils";

const Stepper = ({ orderItem }) => {
  const {
    delivered_at,
    shipped_at,
    hold_reason,
    error_message,
    reference_id,
    status,
  } = orderItem?.vendor_orders || {};

  const dateCreated = orderItem?.creationDate;

  const steps = [
    { key: "created", label: "Created", date: dateCreated },
    { key: "processing", label: "Processing", date: dateCreated },
    { key: "shipped", label: "Shipped", date: shipped_at },
    { key: "completed", label: "Completed", date: delivered_at },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === status);

  const progressWidth = currentStepIndex >= 0 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : "0%"; 

  return (
    <div className="w-full">
      <div className="relative flex justify-between items-start mb-10">
        <div className="absolute top-6 left-0 w-full h-1 bg-gray-200" />
        <div className="absolute top-6 left-0 h-1 bg-[#B8860B] transition-all duration-500" style={{ width: progressWidth }} />
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center text-center w-1/4">
              <div className={`flex items-center justify-center rounded-full border-2 transition-all duration-300 ${isActive ? "w-10 h-10 bg-white border-[#B8860B]" : isCompleted ? "w-10 h-10 bg-[#B8860B] border-[#B8860B]" : "w-10 h-10 bg-white border-gray-300"}`}>
                <svg className={`${isActive ? "w-10 h-10 text-[#B8860B]" : isCompleted ? "w-5 h-5 text-white" : "w-5 h-5 text-gray-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>      
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={`mt-2 text-sm font-semibold ${isActive || isCompleted ? "text-[#B8860B]" : "text-gray-400"}`}>   
                {step.label}
              </span>
              {step.date && (
                <span className={`mt-1 text-xs ${isActive || isCompleted ? "text-[#B8860B]" : "text-gray-400"}`}>
                  {formatDeliveryDate(step.date)}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {reference_id && (
        <div className="mb-3 text-sm text-gray-600">
          <span className="font-semibold">Reference ID:</span>{" "}
          {reference_id}
        </div>
      )}
      {hold_reason && (
        <div className="mb-3 text-sm">
          <span className="font-semibold text-red-600">
            Hold Reason:
          </span>{" "}
          <span className="text-red-500">{hold_reason}</span>
        </div>
      )}
      {error_message && (
        <div className="text-sm">
          <span className="font-semibold text-red-600">
            Message:
          </span>{" "}
          <span className="text-red-500">{error_message}</span>
        </div>
      )}
    </div>
  );
};

export default Stepper;