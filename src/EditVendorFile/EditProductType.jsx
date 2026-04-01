import React, { useEffect, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import { IoChevronDown } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { handleNextStep, handlePreviousStep } from '../redux/EditVendor';
import { Toaster, toast } from 'sonner';
import { MdInfo } from 'react-icons/md';
import { ThreeDots } from 'react-loader-spinner';
import ResponsiveTooltip from '../Vendorenrolment/ResponsiveTooltip';
import { useNavigate } from 'react-router-dom';
import { updateEnrolment } from '../api/authApi';


const EditProductType = () => {
  const store = useSelector((state) => state.editVendor.enrolmentUpdate);
  let token = localStorage.getItem('token');
  const vendor_name = localStorage.getItem('editingVendorName');
  const connection = JSON.parse(localStorage.getItem('matchedVendor'));
  const navigate = useNavigate()

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
      if (connection.product_filter) {
        setCheckBoxesProduct((prev) =>
          JSON.stringify(prev) !== JSON.stringify(connection.product_filter)
            ? connection.product_filter
            : prev
        );
        setHeading2('Select Product');
      }

      if (connection.manufacturer) {
        setCheckBoxesManufacturer((prev) =>
          JSON.stringify(prev) !== JSON.stringify(connection.manufacturer)
            ? connection.manufacturer
            : prev
        );
        setHeading('Manufacturer');
      }

      if (connection.brand) {
        setCheckBoxesManufacturer((prev) =>
          JSON.stringify(prev) !== JSON.stringify(connection.brand)
            ? connection.brand
            : prev
        );
        setHeading('Brand');
      }

      if (connection.product_category) {
        setCheckBoxesProduct((prev) =>
          JSON.stringify(prev) !== JSON.stringify(connection.product_category)
            ? connection.product_category
            : prev
        );
        setHeading2('Category');
      }

      if (connection.enrollment?.identifier) {
        setIsMyIdentifier((prev) =>
          prev !== connection.enrollment.identifier
            ? connection.enrollment.identifier
            : prev
        );
      }

      setMyEditDetails((prev) =>
        JSON.stringify(prev) !== JSON.stringify(connection) ? connection : prev
      );
    }
  }, [connection]);

  useEffect(() => {
    if (Array.isArray(connection?.product_filter) && connection.product_filter.length) {
      setCheckBoxesProduct(connection.product_filter);
    }

    if (Array.isArray(connection?.manufacturer) && connection.manufacturer.length) {
      setCheckBoxesManufacturer(connection.manufacturer);
    } else if (Array.isArray(connection?.brand) && connection.brand.length) {
      setCheckBoxesManufacturer(connection.brand);
    }

    if (Array.isArray(connection?.enrollment?.product_filter)) {
      setSelectedOptions(new Set(connection.enrollment.product_filter));
    }
    if (Array.isArray(connection?.product_category) && connection.product_category.length) {
      setSelectedOptions(new Set(connection.enrollment.product_category));
    }

    if (Array.isArray(connection?.brand)) {
      setOption(new Set(connection.enrollment.brand));
    } else if (Array.isArray(connection?.manufacturer)) {
      setOption(new Set(connection.enrollment.manufacturer));
    }

    setIsMyIdentifier(connection?.enrollment?.identifier || false);
  }, []);

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
    const matchedVendor = localStorage.getItem('matchedVendor');
    if (matchedVendor) {
      try {
        const myFormData = JSON.parse(matchedVendor);
        const enrolment = myFormData?.enrollment || {};
        setMyForm(enrolment);
        // Set state for checkboxes
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

        // Set form fields
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
        console.error("Error parsing matchedVendor:", error);
      }
    }
  }, [setValue]);

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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const manufacturerDropdown = () => {
    setIsManufacturerOpen(!manufacturerOpen);
  };

  let dispatch = useDispatch();

  const onSubmit = async (data) => {
    const rawFormData = {
      ...store,
      ...data,
      ...(connection.product_filter && { product_filter: [...selectedOptions] }),
      ...(connection.manufacturer && { manufacturer: [...option] }),
      ...(connection.brand && { brand: [...option] }),
      ...(connection.product_category && { product_category: [...selectedOptions] }),
      shippable: shippable ? ["Y", "N"] : ["Y"],
      stock_minimum: data.stock_minimum === "" ? null : data.stock_minimum,
      stock_maximum: data.stock_maximum === "" ? null : data.stock_maximum,
      shipping_cost: data.shipping_cost === "" ? null : data.shipping_cost,
    };
    const formData = cleanObject(rawFormData);
    if (connection.enrollment.vendor !== 4) {
      if (connection.product_filter && selectedOptions.size === 0) {
        toast.error('Please select at least one product');
        return;
      }
      if (option.size === 0 && connection.enrollment.vendor !== 3) {
        toast.error('Please select at least one manufacturer.');
        return;
      }
    }
    try {
      setMyLoader(true);  
      const response = await updateEnrolment(connection.enrollment.identifier, formData);
      console.log(response);
      setMyLoader(false);
      localStorage.setItem("lipsey", JSON.stringify(response.data));
      console.log("response.data:", response.data);
      toast.success('Enrolment successfully updated');
      // dispatch(handleNextStep(formData));
      localStorage.removeItem("editVendor");
      navigate("/vendor/success-file");
    } catch (err) {
      setMyLoader(false);
      console.log("err:", err);
      if (err.response) {
        const { status } = err.response;
        if (status === 500 || status === 404) {
          toast.error("An internal server issue has occurred. Please contact customer service.");
        } else {
          toast.error(`Error ${status}: Something went wrong.`);
        }
      } else if (err.request) {
        toast.error("Network error: Please check your internet connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handlePrevious = () => {
    dispatch(handlePreviousStep());
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
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

  const handleManufacturerChange = (event) => {
    setOption(event.target.value);
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

  // Function to restrict input to integers
  const restrictToIntegers = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  // Function to restrict input to numbers and decimals
  const restrictToNumbersAndDecimals = (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
    if (e.target.value.split('.').length > 2) {
      e.target.value = e.target.value.replace(/\.(?=.*\.)/g, '');
    }
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
                    className="md:w-5 w-8 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative  checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5"
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