import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  handleNextStep,
  handlePreviousStep,
  updateFormData,
} from "../redux/customVendorSlice";
import { Plus, Trash2 } from "lucide-react";

const CustomApi = () => {
  const dispatch = useDispatch();
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      apiPairs: [{ key: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "apiPairs",
  });

  const onSubmit = (data) => {
    // ✅ Save API data in the correct place
    console.log(data);
    
    dispatch(updateFormData({ step: "customApi", data }));
    dispatch(handleNextStep());
    reset({ apiPairs: [{ key: "", value: "" }] });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-white p-6 rounded-xl"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => append({ key: "", value: "" })}
          className="flex items-center text-[#027840] gap-2 bg-[#DBD9D9] p-3 rounded-full transition"
        >
          <Plus size={16} />
        </button>
        <h2 className="text-lg font-semibold text-[#027840]">
          Click here to add
        </h2>
      </div>

      <div className="space-y-5">
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
          >
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key {index === 0 ? <span className="text-red-500">*</span> : ""}
              </label>
              <input
                {...register(`apiPairs.${index}.key`, {
                  required: index === 0 ? "Key is required" : false,
                })}
                placeholder="Enter key"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none"
              />
              {errors.apiPairs?.[index]?.key && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apiPairs[index].key.message}
                </p>
              )}
            </div>

            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value {index === 0 ? <span className="text-red-500">*</span> : ""}
              </label>
              <input
                {...register(`apiPairs.${index}.value`, {
                  required: {
                    value: index === 0 || fields[index]?.key !== "",
                    message: "Value is required"
                  }
                })}
                placeholder="Enter value"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none"
              />
              {errors.apiPairs?.[index]?.value && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apiPairs[index].value.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="button"
                disabled={fields.length === 1}
                onClick={() => fields.length > 1 && remove(index)}
                className={`flex items-center gap-1 px-3 py-2 mt-6 rounded-lg transition ${
                  fields.length === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-500 hover:text-red-700"
                }`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <button
          type="button"
          onClick={() => dispatch(handlePreviousStep())}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100"
        >
          Previous
        </button>
        <button
          type="submit"
          className="bg-[#027840] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default CustomApi;