import React, { useState, useEffect } from "react";
import { handleNextStep, handlePreviousStep } from "../redux/vendor";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useVendorStore } from "../stores/VendorStore";

const Identifier = () => {
  const store = useSelector((state) => state.vendor.vendorData);
  const nextStep = useVendorStore((state) => state.nextStep);
  const setCurrentStep = useVendorStore((state) => state.setCurrentStep);
  const newAccount = useVendorStore((state) => state.newAccount);

  const Schema = yup.object().shape({
    identifier: yup
      .string()
      .required("This field is required")
      .matches(/^\S*$/, "Spaces are not allowed"),
    description: yup.string(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(Schema),
  });

  const dispatch = useDispatch();
  const onSubmit = (data) => {
    let form = { ...store, ...data };
    dispatch(handleNextStep(form));
    nextStep();
  };

  const handlePrevious = () => {
    if (newAccount) {
      dispatch(handlePreviousStep());
      setCurrentStep(1);
    } else {
      dispatch(handlePreviousStep());
      dispatch(handlePreviousStep());
      setCurrentStep(0);
    }
  };

  const restrictNoSpaces = async (e) => {
    const value = e.target.value;
    if (/\s/.test(value)) {
      e.target.value = value.replace(/\s/g, "");
      await trigger("identifier");
    }
  };

  useEffect(() => {
    if (store) {
      setValue("identifier", store.identifier);
      setValue("description", store.description);
    }
  }, [store, setValue]);

  return (
    <section className="h-screen">
      <div className="bg-white py-3 shadow-lg">
        <h1 className="lg:ps-16 ps-5 py-2 border-b border-gray-500 font-bold text-xl">
          Identifier Page
        </h1>
        <form
          action=""
          className="lg:mx-20 mx-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <div className="flex justify-between my-2">
              <h3 className="font-semibold">Identifier:</h3>
              <input
                {...register("identifier", { required: true })}
                type="text"
                placeholder="Enter Identifier"
                className={`border border-black focus:outline-none py-1 rounded h-[35px] w-[60%] p-3 lg:w-[50%] ${errors.identifier?.message && "error"}`}
                onInput={restrictNoSpaces}
              />
            </div>
            <small className="text-red-600 ms-[42%] lg:ms-[53%]">
              {errors.identifier?.message}
            </small>
          </div>
          <div>
            <div className="flex justify-between my-2">
              <h3 className="font-semibold">Description:</h3>
              <input
                {...register("description", { required: true })}
                type="text"
                placeholder="Enter Description"
                className={`border border-black focus:outline-none py-1 rounded h-[35px] w-[60%] p-3 lg:w-[50%] ${errors.description?.message && "error"}`}
              />
            </div>
            <small className="text-red-600 ms-[42%] lg:ms-[55%]">
              {errors.description?.message}
            </small>
          </div>
          <div className="mt-10 flex justify-center items-center gap-10">
            <button
              onClick={handlePrevious}
              type="button"
              className="border border-[#089451] text-[#089451] w-[100px] hover:bg-[#089451] hover:text-white font-semibold py-2 rounded-[8px] transition"
            >
              Back
            </button>

            <button
              type="submit"
              className="bg-[#027840] text-white hover:bg-white hover:text-[#089451] border border-[#089451] font-semibold py-2 px-4 rounded-[8px] transition-all flex justify-center items-center w-[200px] gap-2"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Identifier;