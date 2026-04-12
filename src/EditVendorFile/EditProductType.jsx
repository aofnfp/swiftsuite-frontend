import React, { useEffect, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import { IoChevronDown } from 'react-icons/io5';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'sonner';
import { MdInfo } from 'react-icons/md';
import { ThreeDots } from 'react-loader-spinner';
import ResponsiveTooltip from '../Vendorenrolment/ResponsiveTooltip';
import { updateEnrolment } from '../api/authApi';
import { useEditVendorStore } from '../stores/editVendorStore';
import { cleanObject, restrictToIntegers, restrictToNumbersAndDecimals } from '../utils/utils';

const EditProductType = () => {
  const setCurrentStep = useEditVendorStore((state) => state.setCurrentStep);
  const vendor_name = useEditVendorStore((state) => state.editingVendorName);
  const connection = useEditVendorStore((state) => state.matchedVendor);
  const editingIdentifier = useEditVendorStore((state) => state.editingIdentifier);

  const [checkBoxesProduct, setCheckBoxesProduct] = useState([]);
  const [checkBoxesManufacturer, setCheckBoxesManufacturer] = useState([]);
  const [myLoader, setMyLoader] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [manufacturerOpen, setIsManufacturerOpen] = useState(false);
  const [option, setOption] = useState(new Set());
  const [selectedOptions, setSelectedOptions] = useState(new Set());
  const [myIdentifier, setIsMyIdentifier] = useState('');
  const [myEditDetails, setMyEditDetails] = useState([]);
  const [heading, setHeading] = useState('');
  const [heading2, setHeading2] = useState('');
  const [truck, setTruck] = useState(false);
  const [oversized, setOversized] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [check, setCheck] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [order, setOrder] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [third_party_marketplaces, setThirdPartyMarketplaces] = useState(false);
  const [returnable, setReturnable] = useState(false);
  const [shippable, setShippable] = useState(false)
  const [productChecked, setProductChecked] = useState([]);
  const [manufacturerChecked, setManufacturerChecked] = useState([]);
  const [myForm, setMyForm] = useState('');

  useEffect(() => {
    if (connection) {
      const enrolment = connection.enrollment || {};

      if (connection.product_filter) {
        setCheckBoxesProduct(connection.product_filter);
        setHeading2('Select Product');
      } else if (connection.product_category) {
        setCheckBoxesProduct(connection.product_category);
        setHeading2('Category');
      }

      if (connection.manufacturer) {
        setCheckBoxesManufacturer(connection.manufacturer);
        setHeading('Manufacturer');
      } else if (connection.brand) {
        setCheckBoxesManufacturer(connection.brand);
        setHeading('Brand');
      }
      // Initialize selected options (Product Type / Category)
      if (Array.isArray(enrolment.product_filter) && enrolment.product_filter.length > 0) {
        setSelectedOptions(new Set(enrolment.product_filter));
      } else if (Array.isArray(enrolment.product_category) && enrolment.product_category.length > 0) {
        setSelectedOptions(new Set(enrolment.product_category));
      } else if (Array.isArray(enrolment.product_type) && enrolment.product_type.length > 0) {
        setSelectedOptions(new Set(enrolment.product_type));
      }

      // Initialize selected options (Manufacturer / Brand)
      if (Array.isArray(enrolment.manufacturer) && enrolment.manufacturer.length > 0) {
        setOption(new Set(enrolment.manufacturer));
      } else if (Array.isArray(enrolment.brand) && enrolment.brand.length > 0) {
        setOption(new Set(enrolment.brand));
      }

      if (enrolment.identifier) {
        setIsMyIdentifier(enrolment.identifier);
      }

      setMyEditDetails(connection);
    }
  }, [connection]);

  // Remove the old mount-only useEffect that was incorrectly initializing states

  const Schema = yup.object().shape({
    percentage_markup: yup
      .string()
      .matches(/^\d*\.?\d*$/, 'Must be a valid number')
      .nullable(),
    fixed_markup: yup
      .string()
      .matches(/^\d*\.?\d*$/, 'Must be a valid number')
      .nullable(),
    shipping_cost: yup
      .string()
      .matches(/^\d*\.?\d*$/, 'Must be a valid number')
      .nullable(),
    stock_minimum: yup
      .string()
      .matches(/^\d*\.?\d*$/, 'Must be a valid number')
      .nullable(),
    stock_maximum: yup
      .string()
      .matches(/^\d*\.?\d*$/, 'Must be a valid number')
      .nullable(),
    costaverage: yup.string().nullable(),
    inventory: yup.string().nullable(),
    send_orders: yup.string().nullable(),
    update_tracking: yup.string().nullable(),
    update_inventory: yup.string().nullable(),
    cost_average: yup.string().nullable(),
    truck_freight: yup.boolean().nullable(),
    oversized: yup.boolean().nullable(),
    returnable: yup.boolean().nullable(),
    third_party_marketplaces: yup.boolean().nullable(),
    serialized: yup.boolean().nullable(),
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(Schema),
  });

  useEffect(() => {
    if (connection) {
      try {
        const myFormData = connection;
        const enrolment = myFormData?.enrollment || {};
        setMyForm(enrolment);
        setTruck(enrolment?.truck_freight || false);
        setOversized(enrolment?.oversized || false);
        setReturnable(enrolment?.returnable || false);
        setInventory(enrolment?.update_inventory || false);
        setOrder(enrolment?.send_orders || false);
        setTracking(enrolment?.update_tracking || false);
        setThirdPartyMarketplaces(enrolment?.third_party_marketplaces || false);
        setCheck(enrolment?.serialized || false);
        const shippableValue = enrolment?.shippable || [];
        const allowsBoth = Array.isArray(shippableValue) &&
          shippableValue.includes("Y") &&
          shippableValue.includes("N");
        setShippable(allowsBoth);

        setValue("vendor_identifier", enrolment?.identifier || "");
        setValue("fixed_markup", enrolment?.fixed_markup || "");
        setValue("percentage_markup", enrolment?.percentage_markup || "");
        setValue("shipping_cost", enrolment?.shipping_cost || "");
        setValue("stock_minimum", enrolment?.stock_minimum || "");
        setValue("stock_maximum", enrolment?.stock_maximum || "");
        setValue("truck_freight", enrolment?.truck_freight || false);
        setValue("oversized", enrolment?.oversized || false);
        setValue("returnable", enrolment?.returnable || false);
        setValue("update_inventory", enrolment?.update_inventory || false);
        setValue("send_orders", enrolment?.send_orders || false);
        setValue("update_tracking", enrolment?.update_tracking || false);
        setValue("third_party_marketplaces", enrolment?.third_party_marketplaces || false);
        setValue("serialized", enrolment?.serialized || false);
        setValue("shippable", allowsBoth);
      } catch (error) {
        console.error("Error setting form values from connection:", error);
      }
    }
  }, [setValue, connection]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const manufacturerDropdown = () => {
    setIsManufacturerOpen(!manufacturerOpen);
  };

  const handlePrevious = () => {
    setCurrentStep(0);
  };

  const onSubmit = async (data) => {
    setMyLoader(true);
    const userId = JSON.parse(localStorage.getItem('userId'));
    const enrollmentData = connection?.enrollment || {};

    const rawPayload = {
      ...data,
      identifier: editingIdentifier,
      id: enrollmentData.id,
      vendor: enrollmentData.vendor,
      user: userId,
      third_party_marketplaces: third_party_marketplaces,
      update_inventory: inventory,
      send_orders: order,
      update_tracking: tracking,
      serialized: check,
      truck_freight: truck,
      oversized: oversized,
      returnable: returnable,
      shippable: shippable ? ["Y", "N"] : ["Y"],
      
      // Map selections correctly based on what's available
      ...(connection.product_filter && { product_filter: Array.from(selectedOptions) }),
      ...(connection.product_category && { product_category: Array.from(selectedOptions) }),
      ...(connection.manufacturer && { manufacturer: Array.from(option) }),
      ...(connection.brand && { brand: Array.from(option) }),
      
      // Keep product_type and manufacturer for backward compatibility/generic models
      product_type: Array.from(selectedOptions),
      manufacturer: Array.from(option),

      // Handle numeric fields that might be empty strings
      stock_minimum: data.stock_minimum === "" ? null : data.stock_minimum,
      stock_maximum: data.stock_maximum === "" ? null : data.stock_maximum,
      shipping_cost: data.shipping_cost === "" ? null : data.shipping_cost,
      fixed_markup: data.fixed_markup === "" ? null : data.fixed_markup,
      percentage_markup: data.percentage_markup === "" ? null : data.percentage_markup,
    };
    const payload = cleanObject(rawPayload);
    try {
      const res = await updateEnrolment(editingIdentifier, payload);
      if (res.status === 200) {
        toast.success('Vendor Updated Successfully');
        setCurrentStep(2);
      } else {
        toast.error('Failed to update vendor. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'An error occurred. Please try again later.';
      toast.error(errorMessage);
    } finally {
      setMyLoader(false);
    }
  };

  const selectallProducts = () => {
    setSelectedOptions(new Set(checkBoxesProduct));
    setProductChecked(checkBoxesProduct);
  };

  const deselectallProducts = () => {
    setSelectedOptions(new Set());
  };

  const handleCheckBoxProduct = (product) => {
    setSelectedOptions((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(product)) {
        newSelection.delete(product);
      } else {
        newSelection.add(product);
      }
      return newSelection;
    });
  };

  const selectAllManufacturers = () => {
    setOption(new Set(checkBoxesManufacturer));
    setManufacturerChecked(checkBoxesManufacturer);
  };

  const deselectAllManufacturers = () => {
    setOption(new Set());
  };

  const handleCheckBoxManufacturer = (id) => {
    setOption((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleCheckboxChange = (setState, fieldName) => (e) => {
    const checked = e.target.checked;
    setState(checked);
    setValue(fieldName, checked);
  };  

  const hasProductSection = connection.product_filter || connection.product_category;
  const hasManufacturerSection = connection.manufacturer || connection.brand;

  return (
    <>
      <section className="mb-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full bg-white py-6 shadow-xl rounded-xl">
            <div className={vendor_name === 'Zanders' ? 'grid grid-cols-12 mt-5 h-10 px-5' : 'hidden'}>
              <h3 className="text-sm font-semibold col-span-6">Serialized:</h3>
              <div className="flex gap-2 h-[20px] col-span-6">
                <input
                  {...register("serialized")}
                  type="checkbox"
                  onChange={handleCheckboxChange(setCheck, "serialized")}
                  checked={check}
                  className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                />
                <ResponsiveTooltip title="Lorem ipsum dolor sit amet.">
                  <MdInfo />
                </ResponsiveTooltip>
              </div>
            </div>
            <div>
              <div className={!hasProductSection && !hasManufacturerSection ? 'hidden' : 'block pb-5'}>
                <h1 className="ms-5 lg:text-xl text-sm font-bold">Product Type</h1>
                <div className="px-5 mt-5">
                  <div className="flex flex-col md:flex-row gap-4">
                    {hasProductSection && (
                      <div className={!connection.product_filter && !connection.product_category ? 'hidden' : 'w-full md:w-1/2'}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {heading2}:
                        </label>
                        <div className="relative border md:z-[0] z-[10000] border-gray-500 rounded-md px-3 py-2 cursor-pointer max-w-[300px]">
                          <div className="flex items-center justify-between" onClick={toggleDropdown}>
                            <span className="text-gray-500">{heading2}</span>
                            {isOpen ? <IoIosArrowUp size={14} /> : <IoChevronDown size={14} />}
                          </div>
                          {isOpen && (
                            <div className="absolute mt-[9px] -ms-3 bg-white scrollbar-thin scrollbar-thumb-white scrollbar-track-white scrollbar-shorter shadow-lg  rounded-md w-full max-h-60 overflow-auto py-2 border">
                              <div className="flex justify-between gap-2 px-2 mb-2">
                                <button type="button" className="text-xs border border-green-600 text-green-600 font-medium py-1 px-2 rounded" onClick={selectallProducts}>
                                  Select All
                                </button>
                                <button type="button" className="text-xs border border-green-600 text-green-600 font-medium py-1 px-2 rounded" onClick={deselectallProducts}>
                                  Deselect All
                                </button>
                              </div>
                              <div className="px-2">
                                {checkBoxesProduct.map((product, index) => (
                                  <div className="flex items-center justify-between py-1" key={index}>
                                    <span className="text-sm">{product}</span>
                                    <input
                                      className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                                      type="checkbox"
                                      checked={selectedOptions.has(product)}
                                      onChange={() => handleCheckBoxProduct(product)}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {hasManufacturerSection && (
                      <div className={
                        (!connection.brand || connection.brand.length === 0) &&
                          (!connection.manufacturer || connection.manufacturer.length === 0)
                          ? 'hidden'
                          : 'w-full md:w-1/2'
                      }>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {heading}:
                        </label>
                        <div className="relative border border-gray-500 rounded-md px-3 py-2 cursor-pointer max-w-[300px]">
                          <div className="flex items-center justify-between gap-2" onClick={manufacturerDropdown}>
                            <span className="text-gray-500">{heading}</span>
                            {manufacturerOpen ? <IoIosArrowUp size={14} /> : <IoChevronDown size={14} />}
                          </div>
                          {manufacturerOpen && (
                            <div className="absolute mt-[9px] -ms-3 bg-white shadow-lg z-[8] rounded-md w-full max-h-60 overflow-auto py-2 border scrollbar-thin scrollbar-thumb-white scrollbar-track-white scrollbar-shorter">
                              <div className="flex justify-between gap-2 px-2 mb-2">
                                <button type="button" className="text-xs border border-green-600 text-green-600 font-medium py-1 px-2 rounded" onClick={selectAllManufacturers}>
                                  Select All
                                </button>
                                <button type="button" className="text-xs border border-green-600 text-green-600 font-medium py-1 px-2 rounded" onClick={deselectAllManufacturers}>
                                  Deselect All
                                </button>
                              </div>
                              <div className="px-2">
                                {checkBoxesManufacturer.map((checkbox, index) => (
                                  <div className="flex items-center justify-between py-1" key={index}>
                                    <span className="text-sm">{checkbox}</span>
                                    <input
                                      type="checkbox"
                                      className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                                      checked={option.has(checkbox)}
                                      onChange={() => handleCheckBoxManufacturer(checkbox)}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={vendor_name === "CWR" ? 'grid grid-cols-12 mt-5 h-10 px-5' : 'hidden'}>
                <h3 className="text-sm font-semibold col-span-6">Truck Freight:</h3>
                <div className="flex gap-2 h-[20px] col-span-6">
                  <input
                    {...register("truck_freight")}
                    type="checkbox"
                    onChange={handleCheckboxChange(setTruck, "truck_freight")}
                    checked={truck}
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="Include Truck Freight Only Products in Catalogue.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>
              <div className={vendor_name === "RSR" ? 'grid grid-cols-12 mt-5 h-10 px-5' : 'hidden'}>
                <h3 className="text-sm font-semibold col-span-6">Blocked from dropship for pricing automation:</h3>
                <div className="flex gap-2 h-[20px] col-span-6">
                  <input
                    type="checkbox"
                    onChange={handleCheckboxChange(setShippable, "shippable")}
                    checked={shippable}
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="Only allow dropshippable products.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>
              <div className={vendor_name === "RSR" ? 'grid grid-cols-12 mt-5 h-10 px-5' : 'hidden'}>
                <h3 className="text-sm font-semibold col-span-6">Adult Sig Required:</h3>
                <div className="flex gap-2 h-[20px] col-span-6">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="$5 cost is added to any product with adult signature required.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>
              <div className={vendor_name === "CWR" ? 'grid grid-cols-12 mt-5 h-10 px-5' : 'hidden'}>
                <h3 className="text-sm font-semibold col-span-6">Oversized:</h3>
                <div className="flex gap-2 h-[20px] col-span-6">
                  <input
                    {...register("oversized")}
                    type="checkbox"
                    onChange={handleCheckboxChange(setOversized, "oversized")}
                    checked={oversized}
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="Include Oversized Products in Catalogue.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>
              <div className={vendor_name === "CWR" ? 'grid grid-cols-12 mt-5 h-10 px-5' : 'hidden'}>
                <h3 className="text-sm font-semibold col-span-6">3rd Party Marketplace:</h3>
                <div className="flex gap-2 h-[20px] col-span-6">
                  <input
                    {...register("third_party_marketplaces")}
                    type="checkbox"
                    onChange={handleCheckboxChange(setThirdPartyMarketplaces, "third_party_marketplaces")}
                    checked={third_party_marketplaces}
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="Include products not allowed on 3rd party marketplaces.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>
              <div className={vendor_name === "CWR" ? 'grid grid-cols-12 mt-5 h-10 px-5' : 'hidden'}>
                <h3 className="text-sm font-semibold col-span-6">Non-Returnable:</h3>
                <div className="flex gap-2 h-[20px] col-span-6">
                  <input
                    {...register("returnable")}
                    type="checkbox"
                    onChange={handleCheckboxChange(setReturnable, "returnable")}
                    checked={returnable}
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="Include Non-Returnable Products.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>

              <div className="px-6 mb-6">
                <h1 className="text-lg font-bold mb-4 text-green-700 border-b-1 border-gray-300">Pricing Option</h1>
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
                    <p className="mt-1 text-sm text-red-600 ms-[50%]">
                      {errors.percentage_markup && <span>{errors.percentage_markup.message}</span>}
                    </p>
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
                    <p className="mt-1 text-sm text-red-600 ms-[50%]">
                      {errors.fixed_markup && <span>{errors.fixed_markup.message}</span>}
                    </p>
                  </div>

                  <div>
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
                    </div>
                    <p className="mt-1 text-sm text-red-600 ms-[50%]">
                      {errors.shipping_cost && <span>{errors.shipping_cost.message}</span>}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 mb-6">
                <h1 className="text-lg font-bold mb-4 text-green-700 border-b-1 border-gray-300">Inventory</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
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
                    </div>
                    <p className="mt-1 text-sm text-red-600 ms-[50%]">
                      {errors.stock_minimum && <span>{errors.stock_minimum.message}</span>}
                    </p>
                  </div>

                  <div>
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
                    </div>
                    <p className="mt-1 text-sm text-red-600 ms-[50%]">
                      {errors.stock_maximum && <span>{errors.stock_maximum.message}</span>}
                    </p>
                  </div>
                </div>
              </div>

              <h1 className="ms-5 lg:text-xl font-bold mt-5 text-green-700 border-b-1 border-gray-300">Integration Settings</h1>
              <div className="grid grid-cols-12 mt-5 h-10 px-5">
                <h3 className="text-sm font-semibold col-span-6">Update Inventory:</h3>
                <div className="flex gap-2 h-[20px] col-span-6">
                  <input
                    type="checkbox"
                    {...register("update_inventory")}
                    onChange={handleCheckboxChange(setInventory, "update_inventory")}
                    checked={inventory}
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="Swift Suite will start updating inventory on marketplace for synced products.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>
              <div className="grid grid-cols-12 mt-5 h-10 px-5">
                <h3 className="text-sm font-semibold col-span-6">Send Orders:</h3>
                <div className="flex gap-2 h-[20px] col-span-6">
                  <input
                    type="checkbox"
                    {...register("send_orders")}
                    onChange={handleCheckboxChange(setOrder, "send_orders")}
                    checked={order}
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="Check to allow orders to be sent to supplier for fulfillment.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>
              <div className="grid grid-cols-12 mt-5 h-10 px-5">
                <h3 className="text-sm font-semibold col-span-6">Update Tracking:</h3>
                <div className="flex gap-2 h-[20px] col-span-6">
                  <input
                    type="checkbox"
                    {...register("update_tracking")}
                    onChange={handleCheckboxChange(setTracking, "update_tracking")}
                    checked={tracking}
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                  />
                  <ResponsiveTooltip title="Start updating order tracking information.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>

              <div className="mt-10 flex justify-center items-center gap-10">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="border border-[#027840] text-[#027840] w-[100px] hover:bg-[#027840] hover:text-white font-semibold py-2 rounded-[8px] transition"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="bg-[#027840] text-white border border-[#027840] font-semibold py-2 px-4 rounded-[8px] transition-all flex justify-center items-center w-[200px] gap-2"
                >
                  {myLoader ? (
                    <ThreeDots height="20" width="20" ariaLabel="loading" />
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
      <Toaster position="top-right" />
    </>
  );
};

export default EditProductType;