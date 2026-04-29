import React from "react";
import { X } from "lucide-react";

const MaxTemplateModal = ({ plan, limit, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl px-8 py-10 text-center shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <X size={22} />
        </button>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center text-white text-2xl font-bold">
              !
            </div>
            <span className="absolute -top-2 -left-3 w-5 h-5 rounded-full bg-orange-300" />
            <span className="absolute top-5 -left-5 w-5 h-5 rounded-full bg-orange-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-black">
          Activation Limit Reached
        </h2>

        <p className="text-gray-500 text-base mt-6 leading-relaxed">
          You've activated {limit} of {limit} templates on your{" "}
          <span className="font-bold text-[#BB8232] capitalize">
            {plan} Plan.
          </span>
          <br />
          Deactivate a template or upgrade to activate more.
        </p>

        <button className="w-full h-14 bg-[#027840] text-white rounded-xl text-lg font-bold mt-8">
          Upgrade Plan
        </button>

        <button
          onClick={onClose}
          className="w-full h-14 border border-gray-300 text-gray-400 rounded-xl text-lg font-bold mt-5"
        >
          Manage Active Templates
        </button>

        <div className="flex justify-center gap-14 mt-7 text-base font-bold">
          <div>
            <p className="text-[#BB8232]">Starter</p>
            <p className="text-[#BB8232] mt-1">2</p>
          </div>

          <div>
            <p className="text-[#005D68]">Growth</p>
            <p className="text-[#005D68] mt-1">5</p>
          </div>

          <div>
            <p className="text-black">Enterprise</p>
            <p className="text-black mt-1">10</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaxTemplateModal;