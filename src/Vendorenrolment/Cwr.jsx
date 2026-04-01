import React, { useEffect, useState } from "react";
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
import { MdInfo } from "react-icons/md";
import ResponsiveTooltip from "./ResponsiveTooltip";
import { ThreeDots } from "react-loader-spinner";
import { enrolment } from "../api/authApi";


import { useVendorStore } from "../stores/VendorStore";


const Cwr = () => {
  const vendorName = useVendorStore((state) => state.vendorName);
  const vendorConnection = useVendorStore((state) => state.vendorConnection);
  const setEnrolmentResponse = useVendorStore((state) => state.setEnrolmentResponse);
  const setCurrentStep = useVendorStore((state) => state.setCurrentStep);
  const connection = vendorConnection;
  const store = useSelector((state) => state.vendor.vendorData);
  let dispatch = useDispatch();
  const navigate = useNavigate();

  const [checkBoxesCategory, setCheckBoxesCategory] = useState([]);
  const [truck, setTruck] = useState(false);
  const [oversized, setOversized] = useState(false);
  const [party, setParty] = useState(false);
  const [returnable, setReturnable] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [order, setOrder] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [host, setHost] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryChecked, setCategoryChecked] = useState([]);
  const [myLoader, setMyLoader] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    if (connection && connection.category) {
      setCheckBoxesCategory(connection.category);
    }
  }, [connection]);

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
  truck_freight: yup.string(),
  third_party_marketplaces: yup.string(),
});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
  });

  // Reusable function to restrict input to integers only
  const restrictToIntegers = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers (no decimals)
  };

  // Reusable function to restrict input to numbers and decimals
  const restrictToNumbersAndDecimals = (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimals
    if (e.target.value.split(".").length > 2) {
      // Restrict to one decimal point
      e.target.value = e.target.value.replace(/\.(?=.*\.)/g, "");
    }
  };

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
    setCategoryChecked(category);
    setHost(true);
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
    setCategoryChecked(theSelectedCategories);
    setHost(true);
  };

  const deselectallCategory = (e) => {
    e.preventDefault();
    const deselect = checkBoxesCategory.map((checkbox) => ({
      ...checkbox,
      checked: false,
    }));
    setCheckBoxesCategory(deselect);
    setCategoryChecked([]);
    setHost(true);
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
      product_category: [],
      stock_minimum: data.stock_minimum === "" ? null : data.stock_minimum,
      stock_maximum: data.stock_maximum === "" ? null : data.stock_maximum,
      shipping_cost: data.shipping_cost === "" ? null : data.shipping_cost,
    };
    const formData = cleanObject(rawFormData);
    setMyLoader(true);
    try {
      const response = await enrolment(formData)
        if ([200, 201, 202].includes(response.status)) {
          toast.success("Enrolment successful");
          setEnrolmentResponse(response.data);
          // dispatch(handleNextStep(formData));
          dispatch(clearVendorData());
          setTimeout(() => {
          navigate("/vendor/success-enrolment");
          }, 1500);
        }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400 && data.error) {
          toast.error(data.error);
          return;
        }
        for (const field in errors) {
          if (Array.isArray(errors[field])) {
            errors[field].forEach((msg) => {
              toast.error(`${msg}`);
            });
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

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Toaster position="top-right" />
      <section className="mb-10">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">Product Type</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white py-6 px-3 shadow-xl rounded-lg max-w-2xl mx-auto">
            <div className="grid grid-cols-12 mt-5 h-10 px-3">
              <h3 className="text-sm font-semibold col-span-6">
                Truck Freight:
              </h3>
              <div className="flex gap-2 h-[20px] col-span-6">
                <input
                  {...register("truck_freight")}
                  type="checkbox"
                  onChange={() => setTruck(!truck)}
                  checked={truck}
                  className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                />
                <ResponsiveTooltip title="Include Truck Freight Only Products in Catalogue.">
                  <MdInfo />
                </ResponsiveTooltip>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-5 h-10 px-3">
              <h3 className="text-sm font-semibold col-span-6">Oversized:</h3>
              <div className="flex gap-2 h-[20px] col-span-6">
                <input
                  {...register("oversized")}
                  type="checkbox"
                  onChange={() => setOversized(!oversized)}
                  checked={oversized}
                  className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                />
                <ResponsiveTooltip title="Include Oversized Products in Catalogue.">
                  <MdInfo />
                </ResponsiveTooltip>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-5 h-10 px-3">
              <h3 className="text-sm font-semibold col-span-6">
                3rd Party Marketplace:
              </h3>
              <div className="flex gap-2 h-[20px] col-span-6">
                <input
                  {...register("third_party_marketplaces")}
                  type="checkbox"
                  onChange={() => setParty(!party)}
                  checked={party}
                  className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                />
                <ResponsiveTooltip title="Include products not allowed on 3rd party marketplaces.">
                  <MdInfo />
                </ResponsiveTooltip>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-5 h-10 px-3">
              <h3 className="text-sm font-semibold col-span-6">
                Non-Returnable:
              </h3>
              <div className="flex gap-2 h-[20px] col-span-6">
                <input
                  {...register("returnable")}
                  type="checkbox"
                  onChange={() => setReturnable(!returnable)}
                  checked={returnable}
                  className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                />
                <ResponsiveTooltip title="Include Non-Returnable Products.">
                  <MdInfo />
                </ResponsiveTooltip>
              </div>
            </div>

            <div className="hidden">
              <h1 className="ms-5 lg:text-xl text-sm font-bold">
                Product Type
              </h1>
              <div className="flex mt-5 px-3">
                <label
                  className="mt-2 text-sm font-semibold h-8 w-[55%] md:w-[52%] lg:w-[50%]"
                  htmlFor=""
                >
                  Select Category:
                </label>
                <div className="relative border border-gray-500 rounded p-1 text-sm h-8 lg:w-[230px] w-[160px] md:w-[200px]">
                  <div
                    className="flex items-center px-2 cursor-pointer justify-between"
                    onClick={toggleDropdown}
                  >
                    <span className="text-gray-500">Select Category</span>
                    {isOpen ? (
                      <IoIosArrowUp size={20} />
                    ) : (
                      <IoChevronDown size={20} />
                    )}
                  </div>
                  {isOpen && (
                    <div className="max-h-[60vh] overflow-y-auto absolute mt-2 bg-white shadow-lg z-100 lg:w-[250px] md:w-[250px] w-[200px] lg:ms-[-10px] md:ms-[-20%] ms-[-20%] p-3">
                      <div className="flex gap-6 mb-2 p-2">
                        <button
                          className="border border-[#089451] font-semibold py-1 lg:px-4 px-2 rounded hover:bg-green-700 hover:text-white"
                          onClick={selectallCategory}
                        >
                          Select All
                        </button>
                        <button
                          className="border border-[#089451] font-semibold py-1 lg:px-4 px-2 rounded hover:bg-green-700 hover:text-white"
                          onClick={deselectallCategory}
                        >
                          Deselect All
                        </button>
                      </div>
                      <div className="p-2">
                        {checkBoxesCategory.map((checkbox) => (
                          <div
                            className="flex justify-between"
                            key={checkbox.id}
                          >
                            {checkbox.label}
                            <input
                              className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                              type="checkbox"
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

            <div className="px-2 mb-6">
              <h1 className="text-lg font-bold mb-4 text-green-700 border-b-1 border-gray-300">
                Pricing Option
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:w-[90%] w-[80%]">
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
                      This field is required
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-2 mb-6">
              <h1 className="text-lg font-bold mb-4 text-green-700 border-b-1 border-gray-300">
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
                      This field is required
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:w-[60%] w-[80%]">
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
                      This field is required
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8 border-t border-gray-200 pt-6">
              <h1 className="lg:text-xl text-green-700 font-semibold mt-5 border-b-1 border-gray-300">
                Integration Settings
              </h1>
              <div className="grid grid-cols-12 mt-5 h-10 px-3">
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
              <div className="grid grid-cols-12 mt-5 h-10 px-3">
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
              <div className="grid grid-cols-12 mt-5 h-10 px-3">
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

export default Cwr;