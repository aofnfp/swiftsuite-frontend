import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {
  clearVendorData,
  handleNextStep,
  handlePreviousStep,
} from "../redux/vendor";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { FaCircleCheck } from "react-icons/fa6";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdInfo, MdLightbulb } from "react-icons/md";
import ResponsiveTooltip from "./ResponsiveTooltip";
import { ThreeDots } from "react-loader-spinner";
import { enrolment } from "../api/authApi";
import { useVendorStore } from "../stores/VendorStore";

const Rsr = () => {
  const store = useSelector((state) => state.vendor.vendorData);
  let dispatch = useDispatch();
  const vendorConnection = useVendorStore((state) => state.vendorConnection);
  const setEnrolmentResponse = useVendorStore((state) => state.setEnrolmentResponse);
  const setCurrentStep = useVendorStore((state) => state.setCurrentStep);

  const navigate = useNavigate();
  const categoryDropdownRef = useRef(null);
  const manufacturerDropdownRef = useRef(null);

  const [checkBoxesCategory, setCheckBoxesCategory] = useState([]);
  const [checkBoxesManufacturer, setCheckBoxesManufacturer] = useState([]);
  const [shippable, setShippable] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [order, setOrder] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [adultSignatureChecked, setAdultSignatureChecked] = useState(false);
  const [myLoader, setMyLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [manufacturerOpen, setManufacturerOpen] = useState(false);

  const categoryChecked = useVendorStore((state) => state.vendorCategoryChecked);
  const setVendorCategoryChecked = useVendorStore((state) => state.setVendorCategoryChecked);
  const manufacturerChecked = useVendorStore((state) => state.vendorManufacturerChecked);
  const setVendorManufacturerChecked = useVendorStore((state) => state.setVendorManufacturerChecked);

  useEffect(() => {
    if (vendorConnection?.category) {
      setCheckBoxesCategory(vendorConnection.category);
    }
    if (vendorConnection?.manufacturer) {
      setCheckBoxesManufacturer(vendorConnection.manufacturer);
    }
  }, [vendorConnection]);

  const Schema = yup.object().shape({
    percentage_markup: yup.string().nullable(),
    fixed_markup: yup.string().nullable(),
    shipping_cost: yup.string(),
    stock_minimum: yup.string(),
    stock_maximum: yup.string(),
    cost_average: yup.string(),
    update_inventory: yup.string(),
    send_orders: yup.string(),
    update_tracking: yup.string(),
    oversized: yup.string(),
    returnable: yup.string(),
    third_party_marketplaces: yup.string(),
    adult_sig_required: yup.boolean(),
    adult_sig_threshold: yup.string().nullable(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (manufacturerDropdownRef.current && !manufacturerDropdownRef.current.contains(event.target)) {
        setManufacturerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckBoxCategory = (id) => {
    const updated = checkBoxesCategory.map((c) =>
      c.id === id ? { ...c, checked: !c.checked } : c
    );
    setCheckBoxesCategory(updated);
    const selected = updated.filter((c) => c.checked).map((c) => c.label);
    setVendorCategoryChecked(selected);
  };

  const selectallCategory = (e) => {
    e.preventDefault();
    const updated = checkBoxesCategory.map((c) => ({ ...c, checked: true }));
    setCheckBoxesCategory(updated);
    const selected = updated.filter((c) => c.checked).map((c) => c.label);
    setVendorCategoryChecked(selected);
  };

  const deselectallCategory = (e) => {
    e.preventDefault();
    const updated = checkBoxesCategory.map((c) => ({ ...c, checked: false }));
    setCheckBoxesCategory(updated);
    setVendorCategoryChecked([]);
  };

  const handleCheckBoxManufacturer = (id) => {
    const updated = checkBoxesManufacturer.map((c) =>
      c.id === id ? { ...c, checked: !c.checked } : c
    );
    setCheckBoxesManufacturer(updated);
    const selected = updated.filter((c) => c.checked).map((c) => c.label);
    setVendorManufacturerChecked(selected);
  };

  const selectallManufacturer = (e) => {
    e.preventDefault();
    const updated = checkBoxesManufacturer.map((c) => ({ ...c, checked: true }));
    setCheckBoxesManufacturer(updated);
    const selected = updated.filter((c) => c.checked).map((c) => c.label);
    setVendorManufacturerChecked(selected);
  };

  const deselectallManufacturer = (e) => {
    e.preventDefault();
    const updated = checkBoxesManufacturer.map((c) => ({ ...c, checked: false }));
    setCheckBoxesManufacturer(updated);
    setVendorManufacturerChecked([]);
  };

  const handleAdultSignatureCheck = () => {
    const newValue = !adultSignatureChecked;
    setAdultSignatureChecked(newValue);
    if (!newValue) {
      setValue("adult_sig_threshold", "");
    }
  };

  const cleanObject = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) =>
          v !== null &&
          v !== undefined &&
          v !== "" &&
          !(Array.isArray(v) && v.length === 0)
      )
    );

  const onSubmit = async (data) => {
    const rawFormData = {
      ...store,
      ...data,
      product_category: categoryChecked,
      manufacturer: manufacturerChecked,
      stock_minimum: data.stock_minimum || null,
      stock_maximum: data.stock_maximum || null,
      shipping_cost: data.shipping_cost || null,
      shippable: ["Y", "N"],
      adult_signature: adultSignatureChecked,
      adult_sig_threshold: adultSignatureChecked && data.adult_sig_threshold 
        ? data.adult_sig_threshold 
        : null,
    };

    const formData = cleanObject(rawFormData);

    if (categoryChecked.length === 0) {
      return toast.error("Please select at least one category.");
    }
    if (manufacturerChecked.length === 0) {
      return toast.error("Please select at least one Manufacturer");
    }

    setMyLoader(true);
    try {
      const response = await enrolment(formData);
      if ([200, 201, 202].includes(response.status)) {
        toast.success("Enrolment successful and Processing in the background");
        setEnrolmentResponse(response.data);
        dispatch(clearVendorData());
        navigate("/vendor/success-enrolment");
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400 && data.error) {
          toast.error(data.error || "Invalid data provided.");
        } else if (status === 500) {
          toast.error("An internal server issue has occurred. Please contact support.");
        } else {
          toast.error(`Error ${status}: ${data.message || "Something went wrong."}`);
        }
      } else if (err.request) {
        toast.error("Network error: Please check your internet connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setMyLoader(false);
    }
  };

  const handlePrevious = () => {
    dispatch(handlePreviousStep());
    setCurrentStep(2);
  };

  const restrictToIntegers = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  const restrictToNumbersAndDecimals = (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, "");
    if ((e.target.value.match(/\./g) || []).length > 1) {
      e.target.value = e.target.value.replace(/\.(?=.*\.)/g, "");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <section className="mb-10">
        <h1 className="ms-5 lg:text-xl text-sm font-bold my-3">Product Type</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white p-6 shadow-lg rounded-xl max-w-4xl mx-auto">

            {/* Adult Signature Section */}
            <div className="grid grid-cols-12 h-10  items-center">
              <h3 className="text-sm font-semibold col-span-6">Adult Signature Required:</h3>
              <div className="flex gap-2 col-span-6">
                <input
                  type="checkbox"
                  checked={adultSignatureChecked}
                  onChange={handleAdultSignatureCheck}
                  className="md:w-5 w-6 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5"
                />
                <ResponsiveTooltip title="$5 cost is added to any product with adult signature required.">
                  <MdInfo className="text-gray-600 mt-0.5" />
                </ResponsiveTooltip>
              </div>
            </div>

            <div className={`grid grid-cols-12 px-5 items-center overflow-hidden transition-all duration-500 ease-in-out ${
              adultSignatureChecked ? "max-h-[120px] opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
            }`}>
              <label className="text-sm font-semibold col-span-6">
                Adult Sig Threshold:
              </label>
              <div className="flex flex-col col-span-6 lg:w-3/4">
                <input
                  {...register("adult_sig_threshold")}
                  type="text"
                  placeholder="0.00"
                  onInput={restrictToNumbersAndDecimals}
                  className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5">
                  <MdLightbulb className="text-amber-500" />
                  $5 will be added to the threshold price.
                </div>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="grid grid-cols-12 mt-8">
              <label className="mt-2 text-sm font-semibold h-8 md:col-span-6 col-span-5">
                Category Name:
              </label>
              <div
                className="relative border border-gray-500 rounded p-1 text-sm h-9 md:col-span-6 col-span-7 lg:w-3/4"
                ref={categoryDropdownRef}
              >
                <div
                  className="flex items-center px-3 cursor-pointer justify-between h-full"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className={categoryChecked.length === 0 ? "text-gray-400" : "text-gray-700"}>
                    {categoryChecked.length === 0 ? "Select Categories" : `${categoryChecked.length} selected`}
                  </span>
                  <div className="flex items-center gap-3">
                    {isOpen ? <IoIosArrowUp size={18} /> : <IoChevronDown size={18} />}
                    <div className="-mr-1">
                      {categoryChecked.length === 0 ? (
                        <AiFillCloseCircle className="text-red-600" />
                      ) : (
                        <FaCircleCheck className="text-[#089451]" />
                      )}
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="absolute mt-2 bg-white shadow-lg z-[1000] w-full rounded border max-h-[60vh] overflow-y-auto py-3">
                    <div className="flex justify-between gap-2 mx-3 mb-3">
                      <button
                        className="border border-[#089451] font-semibold py-1 px-4 rounded text-sm hover:bg-[#089451] hover:text-white transition"
                        onClick={selectallCategory}
                      >
                        Select All
                      </button>
                      <button
                        className="border border-[#089451] font-semibold py-1 px-4 rounded text-sm hover:bg-[#089451] hover:text-white transition"
                        onClick={deselectallCategory}
                      >
                        Deselect All
                      </button>
                    </div>
                    <div className="px-3 space-y-2">
                      {checkBoxesCategory.map((checkbox) => (
                        <div key={checkbox.id} className="flex justify-between items-center py-1">
                          <span>{checkbox.label}</span>
                          <input
                            type="checkbox"
                            checked={checkbox.checked}
                            onChange={() => handleCheckBoxCategory(checkbox.id)}
                            className="md:w-5 w-6 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Manufacturer Dropdown */}
            <div className="grid grid-cols-12 mt-8">
              <label className="mt-2 text-sm font-semibold h-8 md:col-span-6 col-span-5">
                Select Manufacturer:
              </label>
              <div
                className="relative border border-gray-500 rounded p-1 text-sm h-9 md:col-span-6 col-span-7 lg:w-3/4"
                ref={manufacturerDropdownRef}
              >
                <div
                  className="flex items-center px-3 cursor-pointer justify-between h-full"
                  onClick={() => setManufacturerOpen(!manufacturerOpen)}
                >
                  <span className={manufacturerChecked.length === 0 ? "text-gray-400" : "text-gray-700"}>
                    {manufacturerChecked.length === 0 ? "Select Manufacturer" : `${manufacturerChecked.length} selected`}
                  </span>
                  <div className="flex items-center gap-3">
                    {manufacturerOpen ? <IoIosArrowUp size={18} /> : <IoChevronDown size={18} />}
                    <div className="-mr-1">
                      {manufacturerChecked.length === 0 ? (
                        <AiFillCloseCircle className="text-red-600" />
                      ) : (
                        <FaCircleCheck className="text-[#089451]" />
                      )}
                    </div>
                  </div>
                </div>

                {manufacturerOpen && (
                  <div className="absolute mt-2 bg-white shadow-lg z-[1000] w-full rounded border max-h-[60vh] overflow-y-auto py-3">
                    <div className="flex justify-between gap-2 mx-3 mb-3">
                      <button
                        className="border border-[#089451] font-semibold py-1 px-4 rounded text-sm hover:bg-[#089451] hover:text-white transition"
                        onClick={selectallManufacturer}
                      >
                        Select All
                      </button>
                      <button
                        className="border border-[#089451] font-semibold py-1 px-4 rounded text-sm hover:bg-[#089451] hover:text-white transition"
                        onClick={deselectallManufacturer}
                      >
                        Deselect All
                      </button>
                    </div>
                    <div className="px-3 space-y-2">
                      {checkBoxesManufacturer.map((checkbox) => (
                        <div key={checkbox.id} className="flex justify-between items-center py-1">
                          <span>{checkbox.label}</span>
                          <input
                            type="checkbox"
                            checked={checkbox.checked}
                            onChange={() => handleCheckBoxManufacturer(checkbox.id)}
                            className="md:w-5 w-6 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Blocked from dropship - Perfectly aligned */}
            <div className="grid grid-cols-12 mt-10 h-10 items-center">
              <h3 className="text-sm font-semibold col-span-6">
                Blocked from dropship for pricing automation
              </h3>
              <div className="flex items-center gap-2 col-span-6">
                <input
                  type="checkbox"
                  {...register("shippable")}
                  checked={shippable}
                  onChange={() => setShippable(!shippable)}
                  className="md:w-5 w-6 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5"
                />
                <ResponsiveTooltip title="Only allow dropshippable products.">
                  <MdInfo className="text-gray-600 mt-0.5" />
                </ResponsiveTooltip>
              </div>
            </div>

            {/* Pricing Option */}
            <div className="mb-8 border-t border-gray-200 pt-6 mt-10">
              <h2 className="text-lg font-semibold mb-4 text-green-700 border-b border-gray-300">
                Pricing Option
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:w-[70%] w-[80%]">
                      Percentage Markup
                    </label>
                    <input
                      {...register("percentage_markup")}
                      type="text"
                      placeholder="6"
                      className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                      onInput={restrictToNumbersAndDecimals}
                    />
                  </div>
                  {errors.percentage_markup && (
                    <p className="mt-1 text-sm text-red-600 ms-[50%]">This field is required</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:w-[50%] w-[80%]">
                      Fixed Markup
                    </label>
                    <input
                      {...register("fixed_markup")}
                      type="text"
                      placeholder="8"
                      className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                      onInput={restrictToNumbersAndDecimals}
                    />
                  </div>
                  {errors.fixed_markup && (
                    <p className="mt-1 text-sm text-red-600 ms-[50%]">This field is required</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center">
                  <label className="block text-sm font-medium mb-1 md:w-[18%] w-[50%]">
                    Shipping cost
                  </label>
                  <input
                    {...register("shipping_cost")}
                    type="text"
                    placeholder="6"
                    className="border md:w-[31%] w-full border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                    onInput={restrictToNumbersAndDecimals}
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="mb-8 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-4 text-green-700 border-b border-gray-300">
                Inventory
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <label className="block text-sm font-medium mb-1 md:w-[70%] w-[80%]">
                    Stock Minimum
                  </label>
                  <input
                    {...register("stock_minimum")}
                    type="text"
                    placeholder="2"
                    className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                    onInput={restrictToIntegers}
                  />
                </div>
                <div className="flex items-center">
                  <label className="block text-sm font-medium mb-1 md:w-[50%] w-[80%]">
                    Stock Maximum
                  </label>
                  <input
                    {...register("stock_maximum")}
                    type="text"
                    placeholder="10"
                    className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                    onInput={restrictToIntegers}
                  />
                </div>
              </div>
            </div>

            {/* Integration Settings */}
            <div className="mb-8 border-t border-gray-200 pt-6">
              <h1 className="lg:text-xl font-bold mt-5 text-green-700 border-b border-gray-300">
                Integration Settings
              </h1>

              <div className="grid grid-cols-12 mt-5 h-10 px-5 items-center">
                <h3 className="text-sm font-semibold col-span-6">Update Inventory:</h3>
                <div className="flex gap-2 col-span-6">
                  <input
                    type="checkbox"
                    {...register("update_inventory")}
                    checked={inventory}
                    onChange={() => setInventory(!inventory)}
                    className="md:w-5 w-6 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="Swift Suite will start updating inventory on marketplace for synced products.">
                    <MdInfo className="text-gray-600 mt-0.5" />
                  </ResponsiveTooltip>
                </div>
              </div>

              <div className="grid grid-cols-12 mt-5 h-10 px-5 items-center">
                <h3 className="text-sm font-semibold col-span-6">Send Orders:</h3>
                <div className="flex gap-2 col-span-6">
                  <input
                    type="checkbox"
                    {...register("send_orders")}
                    checked={order}
                    onChange={() => setOrder(!order)}
                    className="md:w-5 w-6 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="Check to allow order to be sent to supplier for fulfilment.">
                    <MdInfo className="text-gray-600 mt-0.5" />
                  </ResponsiveTooltip>
                </div>
              </div>

              <div className="grid grid-cols-12 mt-5 h-10 px-5 items-center">
                <h3 className="text-sm font-semibold col-span-6">Update Tracking:</h3>
                <div className="flex gap-2 col-span-6">
                  <input
                    type="checkbox"
                    {...register("update_tracking")}
                    checked={tracking}
                    onChange={() => setTracking(!tracking)}
                    className="md:w-5 w-6 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="Start Updating Order Tracking.">
                    <MdInfo className="text-gray-600 mt-0.5" />
                  </ResponsiveTooltip>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center items-center gap-10">
              <button
                onClick={handlePrevious}
                type="button"
                className="border border-[#089451] text-[#089451] w-[100px] hover:bg-[#089451] hover:text-white font-semibold py-2 rounded-[8px] transition"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={myLoader}
                className="bg-[#027840] text-white hover:bg-white hover:text-[#089451] border border-[#089451] font-semibold py-2 px-8 rounded-[8px] transition-all flex justify-center items-center w-[200px] gap-2"
              >
                {myLoader ? <ThreeDots height="20" width="60" color="#fff" /> : "Next"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Rsr;