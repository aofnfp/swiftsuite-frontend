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
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdInfo } from "react-icons/md";
import ResponsiveTooltip from "./ResponsiveTooltip";
import { m } from "framer-motion";
import { ThreeDots } from "react-loader-spinner";
import { enrolment } from "../api/authApi";

import { useVendorStore } from "../stores/VendorStore";
const Rsr = () => {
  const store = useSelector((state) => state.vendor.vendorData);
  let dispatch = useDispatch();
  const vendorName = useVendorStore((state) => state.vendorName);
  const vendorConnection = useVendorStore((state) => state.vendorConnection);
  const setEnrolmentResponse = useVendorStore((state) => state.setEnrolmentResponse);
  const setCurrentStep = useVendorStore((state) => state.setCurrentStep);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const categoryDropdownRef = useRef(null);
  const manufacturerDropdownRef = useRef(null);

  const [checkBoxesCategory, setCheckBoxesCategory] = useState([]);
  const [checkBoxesManufacturer, setCheckBoxesManufacturer] = useState([]);
  const manufacturerChecked = useVendorStore((state) => state.vendorManufacturerChecked);
  const setVendorManufacturerChecked = useVendorStore((state) => state.setVendorManufacturerChecked);
  const [shippable, setShippable] = useState(false);
  const [truck, setTruck] = useState(false);
  const [oversized, setOversized] = useState(false);
  const [party, setParty] = useState(false);
  const [returnable, setReturnable] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [order, setOrder] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [host, setHost] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [manufacturerOpen, setManufacturerOpen] = useState(false);
  const categoryChecked = useVendorStore((state) => state.vendorCategoryChecked);
  const setVendorCategoryChecked = useVendorStore((state) => state.setVendorCategoryChecked);
  const [myLoader, setMyLoader] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);

  const connectionData = vendorConnection;
  useEffect(() => {
    if (connectionData && connectionData.category) {
      setCheckBoxesCategory(connectionData.category);
    }
    if (connectionData && connectionData.manufacturer) {
      setCheckBoxesManufacturer(connectionData.manufacturer);
    }
  }, [connectionData]);

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
});

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setIsDropdownOpen(null);
      }
      if (
        manufacturerDropdownRef.current &&
        !manufacturerDropdownRef.current.contains(event.target)
      ) {
        setManufacturerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
  });

  const handleCheckBoxCategory = (ids) => {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    const updatedCheckboxes = checkBoxesCategory.map((checkbox) => {
      if (ids.includes(checkbox.id)) {
        return { ...checkbox, checked: !checkbox.checked };
      }
      return checkbox;
    });

    setCheckBoxesCategory(updatedCheckboxes);
    const category = updatedCheckboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label);
    setVendorCategoryChecked(category);
    setHost(true);
  };

  const manufacturerDropdown = () => {
    setManufacturerOpen(!manufacturerOpen);
  };

  const selectallCategory = (e) => {
    e.preventDefault();
    const updatedCheckboxes = checkBoxesCategory.map((checkbox) => ({
      ...checkbox,
      checked: true,
    }));
    setCheckBoxesCategory(updatedCheckboxes);
    const theSelectedCategories = updatedCheckboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label);
    setVendorCategoryChecked(theSelectedCategories);
    setHost(true);
  };

  const deselectallCategory = (e) => {
    e.preventDefault();
    const deselect = checkBoxesCategory.map((checkbox) => ({
      ...checkbox,
      checked: false,
    }));
    setCheckBoxesCategory(deselect);
    setVendorCategoryChecked([]);
    setHost(true);
  };

  const categorySelect = () => {
    setHost(!host);
  };

  const cleanObject = (obj) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        acc[key] =
          typeof value === "object" && !Array.isArray(value)
            ? cleanObject(value)
            : value;
      }
      return acc;
    }, {});
  };

  const onSubmit = async (data) => {
    const rawFormData = {
      ...store,
      ...data,
      product_category: categoryChecked,
      manufacturer: manufacturerChecked,
      stock_minimum: data.stock_minimum === "" ? null : data.stock_minimum,
      stock_maximum: data.stock_maximum === "" ? null : data.stock_maximum,
      shipping_cost: data.shipping_cost === "" ? null : data.shipping_cost,
      shippable: ["Y", "N"],
      // shippable: shippable ? ["Y", "N"] : ["Y"],
    };
    const formData = cleanObject(rawFormData);
    if (categoryChecked.length === 0) {
      return toast.error("Please select at least one category.");
    } else if (manufacturerChecked.length === 0) {
      return toast.error("Please select at least one Manufacturer");
    } else {
      setMyLoader(true);
      try {
        const response = await enrolment(formData);
        if ([200, 201, 202].includes(response.status)) {
          console.log(response);
          
          toast.success(
            "Enrolment successful and Processing in the background"
          );
          setEnrolmentResponse(response.data);
          // dispatch(handleNextStep(formData));
          dispatch(clearVendorData());
          navigate("/vendor/success-enrolment");
        }
      } catch (err) {
            console.log(err);     
            setMyLoader(false);
            if (err.response) {
              const { status, data } = err.response;
              if (status === 400 && data.error) {
                toast.error(data.error || "Invalid data provided.");
              } else if (status === 500) {
                toast.error(
                  "An internal server issue has occurred. Please contact support."
                );
              } else if(status === 400 && err.response.data.identifier){
                toast.error(
                  "Duplicate identifier."
                );
              }else {
                toast.error(
                  `Error ${status}: ${data.message || "Something went wrong."}`
                );
              }
            } else if (err.request) {
              toast.error("Network error: Please check your internet connection.");
            } else {
              toast.error("An unexpected error occurred. Please try again.");
            }
          }
    }
  };

  const handlePrevious = () => {
    dispatch(handlePreviousStep());
    setCurrentStep(2);
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckBoxManufacturer = (ids) => {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    const updatedCheckboxes = checkBoxesManufacturer.map((checkbox) => {
      if (ids.includes(checkbox.id)) {
        return { ...checkbox, checked: !checkbox.checked };
      }
      return checkbox;
    });

    setCheckBoxesManufacturer(updatedCheckboxes);
    const manufacturer = updatedCheckboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label);
    setManufacturerChecked(manufacturer);
  };

  const selectallManufacturer = (e) => {
    e.preventDefault();
    const updatedCheckboxes = checkBoxesManufacturer.map((checkbox) => ({
      ...checkbox,
      checked: true,
    }));
    setCheckBoxesManufacturer(updatedCheckboxes);
    const theSelectedManufacturer = updatedCheckboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label);
    setManufacturerChecked(theSelectedManufacturer);
  };

  const deselectallManufacturer = (e) => {
    e.preventDefault();
    const deselect = checkBoxesManufacturer.map((checkbox) => ({
      ...checkbox,
      checked: false,
    }));
    setCheckBoxesManufacturer(deselect);
    setManufacturerChecked([]);
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
        <h1 className="ms-5 lg:text-xl text-sm font-bold my-3">Product Type</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white p-6 shadow-lg rounded-xl max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="grid grid-cols-12 mt-5">
                <label
                  className="mt-2 text-sm font-semibold h-8 md:col-span-6 col-span-5"
                  htmlFor=""
                >
                  Category Name:
                </label>
                <div
                  className="relative border border-gray-500 rounded p-1 text-sm h-8 md:col-span-6 col-span-7 lg:w-3/4"
                  ref={categoryDropdownRef}
                >
                  <div
                    className="flex items-center px-2 cursor-pointer justify-between gap-2"
                    onClick={toggleDropdown}
                  >
                    <span
                      className={`${
                        categoryChecked.length === 0
                          ? "text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {categoryChecked.length === 0
                        ? "Select Categories"
                        : `${categoryChecked.length} selected`}
                    </span>
                    <div className="flex items-center justify-center relative top-[2.4px]">
                      {isOpen ? (
                        <IoIosArrowUp size={16} className="shrink-0" />
                      ) : (
                        <IoChevronDown size={16} className="shrink-0" />
                      )}
                    </div>
                    <p className="absolute lg:-right-7 md:-right-5 -right-4">
                      {isOpen &&
                        (categoryChecked.length === 0 ? (
                          <span className="text-red-600">
                            <AiOutlineInfoCircle />
                          </span>
                        ) : (
                          <span className="text-[#089451]">
                            <FaCircleCheck />
                          </span>
                        ))}
                    </p>
                  </div>

                  {isOpen && (
                    <div className="max-h-[60vh] p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-white scrollbar-shorter absolute mt-2 bg-white shadow-lg z-[10000] w-full py-3">
                      <div className="flex justify-between gap-2 mb-2">
                        <button
                          className="border border-[#089451] font-semibold py-1 px-1 rounded"
                          onClick={selectallCategory}
                        >
                          Select All
                        </button>
                        <button
                          className="border border-[#089451] font-semibold py-1 px-1 rounded"
                          onClick={deselectallCategory}
                        >
                          Deselect All
                        </button>
                      </div>
                      <div className="p-2">
                        {Array.isArray(checkBoxesCategory) &&
                          checkBoxesCategory.map((checkbox) => (
                            <div
                              className="flex justify-between p-1"
                              key={checkbox.id}
                            >
                              {checkbox.label}
                              <input
                                type="checkbox"
                                className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                                checked={checkbox.checked}
                                onChange={() =>
                                  handleCheckBoxCategory(checkbox.id)
                                }
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-5">
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
                    className={`${
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
                    {manufacturerOpen ? (
                      <IoIosArrowUp size={16} />
                    ) : (
                      <IoChevronDown size={16} />
                    )}
                  </div>
                  <p className="absolute lg:-right-7 md:-right-5 -right-4">
                    {manufacturerOpen &&
                      (manufacturerChecked.length === 0 ? (
                        <span className="text-red-600">
                          <AiOutlineInfoCircle />
                        </span>
                      ) : (
                        <span className="text-[#089451]">
                          <FaCircleCheck />
                        </span>
                      ))}
                  </p>
                </div>
                {manufacturerOpen && (
                  <div className="max-h-[60vh] p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-white scrollbar-shorter absolute mt-2 bg-white shadow-lg w-full py-3 z-[1000]">
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
                          className="flex justify-between p-1"
                          key={checkbox.id}
                        >
                          {checkbox.label}
                          <input
                                className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                            type="checkbox"
                            checked={checkbox.checked}
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

            <div className="space-y-3">
              <div className="grid grid-cols-12 mt-8 h-10">
                <h3 className="text-sm font-semibold col-span-6">
                  Blocked from dropship for pricing automation
                </h3>
                <div className="flex items-center gap-2 h-[20px] col-span-6">
                  <input
                    type="checkbox"
                            className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                    {...register("shippable")}
                    onChange={() => setShippable(!shippable)}
                    checked={shippable}
                  />
                  <ResponsiveTooltip title="Only allow dropshippable products.">
                    <MdInfo className="text-gray-400" />
                  </ResponsiveTooltip>
                </div>
              </div>
              <div className="grid grid-cols-12 mt-8 h-10">
                <h3 className="text-sm font-semibold col-span-6">
                  Adult Sig Required:
                </h3>
                <div className="flex gap-2 h-[20px] col-span-6">
                  <input
                    type="checkbox"
                    {...register("adult_sig_required")}
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="$5 cost is added to any product with adult signature required.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>
            </div>

            <div className="mb-8 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-4 text-green-700 border-b-1 border-gray-300">
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
                  <div>
                    {errors.percentage_markup && (
                      <p className="mt-1 text-sm text-red-600 ms-[50%]">
                        This field is required
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
                        This field is required
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-8 pt-6">
                <div className="flex items-center">
                  <label className="block text-sm font-medium mb-1 md:w-[18%] w-[50%]">
                    Shipping cost
                  </label>
                  <input
                    {...register("shipping_cost")}
                    type="text"
                    placeholder="6"
                    className="border md:w-[31%] w-full border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500"
                    onInput={restrictToNumbersAndDecimals}
                  />
                  {errors.shipping_cost && (
                    <p className="mt-1 text-sm text-red-600">
                      This field is required
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-4 text-green-700 border-b-1 border-gray-300">
                Inventory
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <label className="block text-sm font-medium mb-1 w-[60%]">
                    Stock Minimum
                  </label>
                  <input
                    {...register("stock_minimum")}
                    type="text"
                    placeholder="2"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500"
                    onInput={restrictToIntegers}
                  />
                  {errors.stock_minimum && (
                    <p className="mt-1 text-sm text-red-600">
                      This field is required
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  <label className="block text-sm font-medium mb-1 w-[60%]">
                    Stock Maximum
                  </label>
                  <input
                    {...register("stock_maximum")}
                    type="text"
                    placeholder="10"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500"
                    onInput={restrictToIntegers}
                  />
                  {errors.stock_maximum && (
                    <p className="mt-1 text-sm text-red-600">
                      This field is required
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8 border-t border-gray-200 pt-6">
              <h1 className="ms-5 lg:text-xl font-bold mt-5 text-green-700 border-b-1 border-gray-300">
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
        </form>
      </section>
    </>
  );
};

export default Rsr;
