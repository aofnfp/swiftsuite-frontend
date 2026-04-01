import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { handleNextStep, handlePreviousStep, updateFormData } from "../redux/customVendorSlice";

const CustomProductType = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    dispatch(updateFormData({ productType: data }));
    dispatch(handleNextStep());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Product Type</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Primary Category</label>
          <input
            type="text"
            {...register("primaryCategory")}
            placeholder="e.g., Electronics, Apparel..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-medium">Sub Category</label>
          <input
            type="text"
            {...register("subCategory")}
            placeholder="e.g., Mobile Accessories, Shoes..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-medium">SKU Prefix</label>
          <input
            type="text"
            {...register("skuPrefix")}
            placeholder="Enter SKU prefix"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-medium">Inventory Type</label>
          <select
            {...register("inventoryType")}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Inventory Type</option>
            <option value="dropship">Dropship</option>
            <option value="warehouse">Warehouse</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => dispatch(handlePreviousStep())}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Previous
        </button>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default CustomProductType;
