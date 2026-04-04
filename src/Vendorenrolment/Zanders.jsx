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
import gif from "../Images/gif.gif";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { FaCircleCheck } from "react-icons/fa6";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdInfo } from "react-icons/md";
import ResponsiveTooltip from "./ResponsiveTooltip";
import { ThreeDots } from "react-loader-spinner";
import { enrolment } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useVendorStore } from "../stores/VendorStore";
import { RiShieldCheckLine } from "react-icons/ri";

const Zanders = () => {
  const store = useSelector((state) => state.vendor.vendorData);
  const resetVendor = useVendorStore((state) => state.resetVendor);
  const vendorName = useVendorStore((state) => state.vendorName);
  const vendorConnection = useVendorStore((state) => state.vendorConnection);
  const setEnrolmentResponse = useVendorStore((state) => state.setEnrolmentResponse);
  const setCurrentStep = useVendorStore((state) => state.setCurrentStep);
  const connection = vendorConnection;
  const token = localStorage.getItem("token");
  const navigate = useNavigate()
  
  const [checkBoxesManufacturer, setCheckBoxesManufacturer] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [order, setOrder] = useState(false);
  const [tracking, setTracking] = useState(false);
  const manufacturerChecked = useVendorStore((state) => state.vendorManufacturerChecked);
  const setVendorManufacturerChecked = useVendorStore((state) => state.setVendorManufacturerChecked);
  const [myLoader, setMyLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const manufacturerDropdownRef = useRef(null);
  
  // Adult Signature States
  const [adultSignatureChecked, setAdultSignatureChecked] = useState(false);
  
  let dispatch = useDispatch();
  
  useEffect(() => {
    const connectionData = connection;
    if (connectionData && connectionData.manufacturer) {
      setCheckBoxesManufacturer(connectionData.manufacturer);
    }
  }, [connection]);

  useEffect(() => {
    const handleInputChange = () => {
      const input = document.querySelector('input[name="adult_sig_threshold"]');
      const feeIndicator = document.getElementById("feeIndicator");
      if (input && feeIndicator && adultSignatureChecked) {
        const price = parseFloat(input.value) || 0;
        const fee = price >= 1000 ? 5 : 0;
        
        if (price > 0) {
          feeIndicator.className = `mt-3 p-3.5 rounded-lg border-l-4 transition-all duration-300 ${
            fee > 0
              ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-l-orange-500'
              : 'bg-gradient-to-br from-green-50 to-emerald-50 border-l-[#027840]'
          }`;
          
          const feeText = feeIndicator.querySelector('p');
          if (feeText) {
            feeText.innerHTML = fee > 0 
              ? `⚠️ Processing Fee: <strong>$${fee.toFixed(2)}</strong> (Total: $${(price + fee).toFixed(2)})`
              : '✓ No additional fee';
          }
        }
      }
    };

    const input = document.querySelector('input[name="adult_sig_threshold"]');
    if (input) {
      input.addEventListener("input", handleInputChange);
      return () => input.removeEventListener("input", handleInputChange);
    }
  }, [adultSignatureChecked]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        manufacturerDropdownRef.current &&
        !manufacturerDropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const manufacturerDropdown = () => {
    setIsOpen(!isOpen);
  };

  const Schema = yup.object().shape({
    percentage_markup: yup.string().nullable(),
    fixed_markup: yup.string().nullable(),
    shipping_cost: yup.string(),
    stock_minimum: yup.string(),
    stock_maximum: yup.string(),
    serialized: yup.string(),
    update_inventory: yup.string(),
    send_orders: yup.string(),
    update_tracking: yup.string(),
    adult_signature: yup.boolean(),
    adult_sig_threshold: yup.string().nullable(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(Schema),
  });

  const updateManufacturerState = (updated) => {
    setCheckBoxesManufacturer(updated);
    setVendorManufacturerChecked(
      updated.filter((c) => c.checked).map((c) => c.label)
    );
  };

  const handleCheckBoxManufacturer = (ids) => {
    const idArr = Array.isArray(ids) ? ids : [ids];
    updateManufacturerState(
      checkBoxesManufacturer.map((c) =>
        idArr.includes(c.id) ? { ...c, checked: !c.checked } : c
      )
    );
  };

  const selectallManufacturer = (e) => {
    e.preventDefault();
    updateManufacturerState(
      checkBoxesManufacturer.map((c) => ({ ...c, checked: true }))
    );
  };

  const deselectallManufacturer = (e) => {
    e.preventDefault();
    updateManufacturerState(
      checkBoxesManufacturer.map((c) => ({ ...c, checked: false }))
    );
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

  const handleAdultSignatureCheck = () => {
    setAdultSignatureChecked(!adultSignatureChecked);
    if (adultSignatureChecked) {
      setValue("adult_sig_threshold", "");
    }
  };

  const onSubmit = async (data) => {
    const rawFormData = {
      ...store,
      ...data,
      manufacturer: manufacturerChecked,
      stock_minimum: data.stock_minimum === "" ? null : data.stock_minimum,
      stock_maximum: data.stock_maximum === "" ? null : data.stock_maximum,
      shipping_cost: data.shipping_cost === "" ? null : data.shipping_cost,
      adult_signature: adultSignatureChecked,
      adult_sig_threshold: adultSignatureChecked && data.adult_sig_threshold 
        ? data.adult_sig_threshold 
        : null,
    };
    const formData = cleanObject(rawFormData);
    console.log("Submitting form data:", formData);
    if (manufacturerChecked.length === 0) {
      toast.error("Please select at least one Manufacturer");
      return;
    }
    setMyLoader(true);
    try {
      const response = await enrolment(formData);
      if ([200, 201, 202].includes(response.status)) {
        toast.success("Enrolment successful");
        setEnrolmentResponse(response.data);
        resetVendor();
        dispatch(clearVendorData());
        navigate("/vendor/success-enrolment");
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400 && data.error) {
          toast.error(data.error || "Invalid data provided.");
        } else if (status === 500) {
          toast.error(
            "An internal server issue has occurred. Please contact support."
          );
        } else if (status === 400 && err.response.data.identifier) {
          toast.error("Duplicate identifier.");
        } else {
          toast.error(
            `Error ${status}: ${data.message || "Something went wrong."}`
          );
        }
        if (data.errors) {
          for (const field in data.errors) {
            if (Array.isArray(data.errors[field])) {
              data.errors[field].forEach((msg) => {
                toast.error(`${field}: ${msg}`);
              });
            }
          }
        }
      } else if (err.request) {
        toast.error("Network error: Please check your internet connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
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
    if (e.target.value.split(".").length > 2) {
      e.target.value = e.target.value.replace(/\.(?=.*\.)/g, "");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <section className="mb-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white py-10">
            {/* Adult Signature Section - At the Top */}
            <div className="px-5 mb-7">
              <div className="bg-gradient-to-br from-[#f9fffe] to-[#f0fef8] border-2 border-[#d4f1e8] rounded-xl p-6 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-4xl text-[#027840] flex-shrink-0 pt-1">
                    <RiShieldCheckLine />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-base font-bold text-gray-900 m-0">Adult Signature Required</p>
                        <p className="text-xs text-gray-600 leading-relaxed mt-1">
                          Enable adult signature requirement for deliveries requiring recipient verification.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={adultSignatureChecked}
                        onChange={handleAdultSignatureCheck}
                        className="w-6 h-6 cursor-pointer accent-[#027840] rounded hover:scale-110 transition-transform duration-300 flex-shrink-0"
                      />
                    </div>

                    {/* Status Badge */}
                    <div className={`text-xs font-semibold px-3 py-1.5 rounded-md inline-block transition-all duration-300 ${
                      adultSignatureChecked 
                        ? 'bg-green-100 text-[#027840] shadow-sm' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {adultSignatureChecked ? '✓ Enabled' : 'Not enabled'}
                    </div>

                    {/* Price Input - Hidden until checkbox is checked */}
                    <div className={`overflow-hidden transition-all duration-300 ${
                      adultSignatureChecked ? 'mt-4 opacity-100 max-h-96' : 'mt-0 opacity-0 max-h-0'
                    }`}>
                      <div className="bg-white rounded-lg border-2 border-[#d4f1e8] p-4 shadow-sm">
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                          Adult Signature Price
                        </label>
                        <div className="relative flex items-center mb-3">
                          <span className="absolute left-3.5 text-lg font-semibold text-[#027840]">$</span>
                          <input
                            {...register("adult_sig_threshold")}
                            type="text"
                            placeholder="0.00"
                            onInput={(e) => {
                              const value = e.target.value.replace(/[^0-9.]/g, "");
                              if (value.split(".").length <= 2) {
                                e.target.value = value;
                              }
                            }}
                            className="w-full pl-9 pr-4 py-3 border-2 border-gray-300 rounded-lg text-base font-medium transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#027840] focus:bg-white focus:ring-4 focus:ring-[#027840]/10"
                          />
                        </div>

                        {/* Fee Indicator */}
                        <div className="mt-3 p-3.5 rounded-lg border-l-4 transition-all duration-300" id="feeIndicator">
                          <p className="text-xs font-semibold text-gray-700 m-0">
                            ✓ No additional fee
                          </p>
                        </div>

                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                          💡 A $5.00 processing fee will be automatically added for orders over $1,000.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-5 h-10 px-5">
              <h3 className="text-sm font-semibold col-span-6">Serialized:</h3>
              <div className="flex gap-2 h-[20px] col-span-6">
                <input
                  {...register("serialized")}
                  type="checkbox"
                  onChange={() => setIsChecked(!isChecked)}
                  checked={isChecked}
                  className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                />
                <ResponsiveTooltip title="Lorem ipsum dolor sit amet.">
                  <MdInfo />
                </ResponsiveTooltip>
              </div>
            </div>
            <div>
              <h1 className="ms-5 lg:text-xl font-bold mt-5">Manufacturer</h1>
              <div className="grid grid-cols-12 mt-5 px-5">
                <label
                  className="mt-2 text-sm font-semibold h-8 md:col-span-6 col-span-5"
                  htmlFor=""
                >
                  Select Manufacturer:
                </label>
                <div
                  className="relative border border-gray-500 rounded p-1 text-sm h-8 md:col-span-6 col-span-7 lg:w-3/4"
                  ref={manufacturerDropdownRef}
                >
                  <div
                    className="flex items-center px-2 cursor-pointer justify-between gap-2"
                    onClick={manufacturerDropdown}
                  >
                     <span
                        className={` ${
                          manufacturerChecked.length === 0
                            ? "text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {manufacturerChecked.length === 0
                          ? "Select Manufacturer"
                          : `${manufacturerChecked.length} selected`}
                      </span>

                    <div className="flex items-center justify-center relative top-[2.4px]">
                      {isOpen ? (
                        <IoIosArrowUp size={16} />
                      ) : (
                        <IoChevronDown size={16} />
                      )}
                    </div>
                    <p className="absolute lg:-right-7 md:-right-5 -right-4">
                      {manufacturerChecked.length === 0 ? (
                        <span className="text-red-600">
                          <AiFillCloseCircle />
                        </span>
                      ) : (
                        <span className="text-[#089451]">
                          <FaCircleCheck />
                        </span>
                      )}
                    </p>
                  </div>
                  {isOpen && (
                    <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-white scrollbar-shorter absolute mt-2 bg-white shadow-lg z-[1000] w-full py-3">
                      <div className="flex justify-between gap-2 mx-1">
                        <button
                          className="border border-[#089451] font-semibold py-1 md:px-2 px-1 rounded"
                          onClick={selectallManufacturer}
                        >
                          Select All
                        </button>
                        <button
                          className="border border-[#089451] font-semibold py-1 md:px-2 px-1 rounded"
                          onClick={deselectallManufacturer}
                        >
                          Deselect All
                        </button>
                      </div>
                      <div className="p-2">
                        {checkBoxesManufacturer.map((checkbox) => (
                          <div
                            className="flex justify-between"
                            key={checkbox.id}
                          >
                            {checkbox.label}
                            <input
                              type="checkbox"
                              checked={checkbox.checked}
                              className="w-5 h-5 mb-1 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                              onChange={() =>
                                handleCheckBoxManufacturer(checkbox.id)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 mb-6">
                <h1 className="text-lg font-bold mb-4 text-green-700 border-b border-gray-300">
                  Pricing Option
                </h1>
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
                    <div>
                      {errors.percentage_markup && (
                        <p className="mt-1 text-sm text-red-600 ms-[50%]">
                          {errors.percentage_markup.message}
                        </p>
                      )}
                    </div>
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
                    <div>
                      {errors.fixed_markup && (
                        <p className="mt-1 text-sm text-red-600 ms-[50%]">
                          {errors.fixed_markup.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:w-[70%] w-[80%]">
                      Shipping Cost
                    </label>
                    <input
                      {...register("shipping_cost")}
                      type="text"
                      placeholder="6"
                      className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                      onInput={restrictToNumbersAndDecimals}
                    />
                    {errors.shipping_cost && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shipping_cost.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 mb-6">
                <h1 className="text-lg font-bold mb-4 text-green-700 border-b border-gray-300">
                  Inventory
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:w-[70%] w-[80%]">
                      Stock Minimum
                    </label>
                    <input
                      {...register("stock_minimum")}
                      type="text"
                      placeholder="2"
                      className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                      onInput={restrictToIntegers}
                    />
                    {errors.stock_minimum && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.stock_minimum.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:w-[50%] w-[80%]">
                      Stock Maximum
                    </label>
                    <input
                      {...register("stock_maximum")}
                      type="text"
                      placeholder="10"
                      className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                      onInput={restrictToIntegers}
                    />
                    {errors.stock_maximum && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.stock_maximum.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <h1 className="ms-5 lg:text-xl font-bold mt-5 text-green-700 border-b border-gray-300">
                Integration Settings
              </h1>
              <div className="grid grid-cols-12 mt-5 h-10 px-5">
                <h3 className="text-sm font-semibold col-span-6">
                  Update Inventory:
                </h3>
                <div className="flex gap-2 h-[20px] col-span-6">
                  <input
                    type="checkbox"
                    {...register("update_inventory")}
                    onChange={() => setInventory(!inventory)}
                    checked={inventory}
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="Swift Suite will start updating inventory on marketplace for synced products.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>
              <div className="grid grid-cols-12 mt-5 h-10 px-5">
                <h3 className="text-sm font-semibold col-span-6">
                  Send Orders:
                </h3>
                <div className="flex gap-2 h-[20px] col-span-6">
                  <input
                    type="checkbox"
                    {...register("send_orders")}
                    onChange={() => setOrder(!order)}
                    checked={order}
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="Check to allow order to be sent to supplier for fulfilment.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>
              <div className="grid grid-cols-12 mt-5 h-10 px-5">
                <h3 className="text-sm font-semibold col-span-6">
                  Update Tracking:
                </h3>
                <div className="flex gap-2 h-[20px] col-span-6">
                  <input
                    type="checkbox"
                    {...register("update_tracking")}
                    onChange={() => setTracking(!tracking)}
                    checked={tracking}
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="Start Updating Order Tracking.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
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
                  disabled={myLoader}
                  className="bg-[#027840] text-white hover:bg-white hover:text-[#089451] border border-[#089451] font-semibold py-2 px-4 rounded-[8px] transition-all flex justify-center items-center w-[200px] gap-2"
                >
                  {myLoader ? (
                    <ThreeDots height="20" width="20" ariaLabel="loading" />
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Zanders;