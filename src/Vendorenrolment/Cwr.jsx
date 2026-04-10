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
import { MdInfo, MdLightbulb } from "react-icons/md";
import ResponsiveTooltip from "./ResponsiveTooltip";
import { ThreeDots } from "react-loader-spinner";
import { enrolment } from "../api/authApi";
import { useVendorStore } from "../stores/VendorStore";

const Cwr = () => {
  const store = useSelector((state) => state.vendor.vendorData);
  const resetVendor = useVendorStore((state) => state.resetVendor);
  const vendorConnection = useVendorStore((state) => state.vendorConnection);
  const setEnrolmentResponse = useVendorStore((state) => state.setEnrolmentResponse);
  const setCurrentStep = useVendorStore((state) => state.setCurrentStep);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [checkBoxesCategory, setCheckBoxesCategory] = useState([]);
  const [truck, setTruck] = useState(false);
  const [oversized, setOversized] = useState(false);
  const [party, setParty] = useState(false);
  const [returnable, setReturnable] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [order, setOrder] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [adultSignatureChecked, setAdultSignatureChecked] = useState(false);
  const [myLoader, setMyLoader] = useState(false);

  const [categoryChecked, setCategoryChecked] = useState([]);

  useEffect(() => {
    if (vendorConnection?.category) {
      setCheckBoxesCategory(vendorConnection.category);
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
    truck_freight: yup.string(),
    third_party_marketplaces: yup.string(),
    adult_signature: yup.boolean(),
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

  const restrictToIntegers = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  const restrictToNumbersAndDecimals = (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, "");
    if ((e.target.value.match(/\./g) || []).length > 1) {
      e.target.value = e.target.value.replace(/\.(?=.*\.)/g, "");
    }
  };

  const handleCheckBoxCategory = (id) => {
    const updated = checkBoxesCategory.map((c) =>
      c.id === id ? { ...c, checked: !c.checked } : c
    );
    setCheckBoxesCategory(updated);
    const selected = updated.filter((c) => c.checked).map((c) => c.label);
    setCategoryChecked(selected);
  };

  const selectallCategory = (e) => {
    e.preventDefault();
    const updated = checkBoxesCategory.map((c) => ({ ...c, checked: true }));
    setCheckBoxesCategory(updated);
    const selected = updated.filter((c) => c.checked).map((c) => c.label);
    setCategoryChecked(selected);
  };

  const deselectallCategory = (e) => {
    e.preventDefault();
    const updated = checkBoxesCategory.map((c) => ({ ...c, checked: false }));
    setCheckBoxesCategory(updated);
    setCategoryChecked([]);
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
      stock_minimum: data.stock_minimum || null,
      stock_maximum: data.stock_maximum || null,
      shipping_cost: data.shipping_cost || null,
      adult_signature: adultSignatureChecked,
      adult_sig_threshold: adultSignatureChecked && data.adult_sig_threshold 
        ? data.adult_sig_threshold 
        : null,
    };

    const formData = cleanObject(rawFormData);

    setMyLoader(true);
    try {
      const response = await enrolment(formData);
      if ([200, 201, 202].includes(response.status)) {
        toast.success("Enrolment successful");
        setEnrolmentResponse(response.data);
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

  return (
    <>
      <Toaster position="top-right" />
      <section className="mb-10">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">Product Type</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white py-6 px-3 shadow-xl rounded-lg max-w-2xl mx-auto">

            <div className="grid grid-cols-12 h-10 px-3 items-center">
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

            <div className={`grid grid-cols-12 px-3 items-center overflow-hidden transition-all duration-500 ease-in-out ${
              adultSignatureChecked ? "max-h-[120px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
            }`}>
              <label className="text-sm font-semibold col-span-6">
                Adult Sig Threshold:
              </label>
              <div className="flex flex-col col-span-6">
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

            <div className="grid grid-cols-12 mt-8 h-10 px-3 items-center">
              <h3 className="text-sm font-semibold col-span-6">Truck Freight:</h3>
              <div className="flex gap-2 col-span-6">
                <input
                  {...register("truck_freight")}
                  type="checkbox"
                  checked={truck}
                  onChange={() => setTruck(!truck)}
                  className="md:w-5 w-6 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5"
                />
                <ResponsiveTooltip title="Include Truck Freight Only Products in Catalogue.">
                  <MdInfo className="text-gray-600 mt-0.5" />
                </ResponsiveTooltip>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-5 h-10 px-3 items-center">
              <h3 className="text-sm font-semibold col-span-6">Oversized:</h3>
              <div className="flex gap-2 col-span-6">
                <input
                  {...register("oversized")}
                  type="checkbox"
                  checked={oversized}
                  onChange={() => setOversized(!oversized)}
                  className="md:w-5 w-6 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5"
                />
                <ResponsiveTooltip title="Include Oversized Products in Catalogue.">
                  <MdInfo className="text-gray-600 mt-0.5" />
                </ResponsiveTooltip>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-5 h-10 px-3 items-center">
              <h3 className="text-sm font-semibold col-span-6">3rd Party Marketplace:</h3>
              <div className="flex gap-2 col-span-6">
                <input
                  {...register("third_party_marketplaces")}
                  type="checkbox"
                  checked={party}
                  onChange={() => setParty(!party)}
                  className="md:w-5 w-6 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5"
                />
                <ResponsiveTooltip title="Include products not allowed on 3rd party marketplaces.">
                  <MdInfo className="text-gray-600 mt-0.5" />
                </ResponsiveTooltip>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-5 h-10 px-3 items-center">
              <h3 className="text-sm font-semibold col-span-6">Non-Returnable:</h3>
              <div className="flex gap-2 col-span-6">
                <input
                  {...register("returnable")}
                  type="checkbox"
                  checked={returnable}
                  onChange={() => setReturnable(!returnable)}
                  className="md:w-5 w-6 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5"
                />
                <ResponsiveTooltip title="Include Non-Returnable Products.">
                  <MdInfo className="text-gray-600 mt-0.5" />
                </ResponsiveTooltip>
              </div>
            </div>

            <div className="px-2 mb-6 mt-10">
              <h1 className="text-lg font-bold mb-4 text-green-700 border-b border-gray-300">
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
                      onInput={(e) => {
                        restrictToNumbersAndDecimals(e);
                        setValue("percentage_markup", e.target.value, { shouldValidate: true });
                      }}
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
                      onInput={(e) => {
                        restrictToNumbersAndDecimals(e);
                        setValue("fixed_markup", e.target.value, { shouldValidate: true });
                      }}
                    />
                  </div>
                  {errors.fixed_markup && (
                    <p className="mt-1 text-sm text-red-600 ms-[50%]">This field is required</p>
                  )}
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
                    onInput={(e) => {
                      restrictToNumbersAndDecimals(e);
                      setValue("shipping_cost", e.target.value, { shouldValidate: true });
                    }}
                  />
                  {errors.shipping_cost && (
                    <p className="mt-1 text-sm text-red-600">This field is required</p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-2 mb-6">
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
                    onInput={(e) => {
                      restrictToIntegers(e);
                      setValue("stock_minimum", e.target.value, { shouldValidate: true });
                    }}
                  />
                  {errors.stock_minimum && (
                    <p className="mt-1 text-sm text-red-600">This field is required</p>
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
                    onInput={(e) => {
                      restrictToIntegers(e);
                      setValue("stock_maximum", e.target.value, { shouldValidate: true });
                    }}
                  />
                  {errors.stock_maximum && (
                    <p className="mt-1 text-sm text-red-600">This field is required</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8 border-t border-gray-200 pt-6">
              <h1 className="lg:text-xl text-green-700 font-semibold mt-5 border-b border-gray-300">
                Integration Settings
              </h1>

              <div className="grid grid-cols-12 mt-5 h-10 px-3 items-center">
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

              <div className="grid grid-cols-12 mt-5 h-10 px-3 items-center">
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

              <div className="grid grid-cols-12 mt-5 h-10 px-3 items-center">
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

export default Cwr;