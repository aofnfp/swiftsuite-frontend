import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import { IoChevronDown } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { clearVendorData, handleNextStep, handlePreviousStep } from '../redux/vendor';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import gif from '../Images/gif.gif';
import axios from 'axios';
import { MdInfo } from 'react-icons/md';
import ResponsiveTooltip from './ResponsiveTooltip';
import { ThreeDots } from "react-loader-spinner";
import { useVendorStore } from "../stores/VendorStore";

const Ssi = () => {
  const store = useSelector(state => state.vendor.vendorData);
  const resetVendor = useVendorStore((state) => state.resetVendor);
  let token = localStorage.getItem('token');
  const vendorName = useVendorStore((state) => state.vendorName);
  const vendorConnection = useVendorStore((state) => state.vendorConnection);
  const setEnrolmentResponse = useVendorStore((state) => state.setEnrolmentResponse);
  const setCurrentStep = useVendorStore((state) => state.setCurrentStep);
  const connection = vendorConnection;
  const navigate = useNavigate();

  const [checkBoxesCategory, setCheckBoxesCategory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [order, setOrder] = useState(false);
  const [tracking, setTracking] = useState(false);
  const categoryChecked = useVendorStore((state) => state.vendorCategoryChecked);
  const setVendorCategoryChecked = useVendorStore((state) => state.setVendorCategoryChecked);
  const [myLoader, setMyLoader] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const categoryDropdownRef = useRef(null); 

  useEffect(() => {
    const connectionData = connection;
    if (connectionData && connectionData.category) {
      setCheckBoxesCategory(connectionData.category);
    }
  }, [connection]);

  useEffect(() => {
    function handleClickOutside(event) {
      // Close Category dropdown if click is outside
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const Schema = yup.object().shape({
    select_markup: yup.string().required('Markup type is required'),
    percentage_markup: yup.string().when('select_markup', {
      is: 'percentage',
      then: schema => schema.required('Percentage markup is required'),
      otherwise: schema => schema.notRequired()
    }),
    fixed_markup: yup.string().when('select_markup', {
      is: 'fixed',
      then: schema => schema.required('Fixed markup is required'),
      otherwise: schema => schema.notRequired()
    }),
    shipping_cost_average: yup.string().required(),
    stock_minimum: yup.string().required(),
    stock_maximum: yup.string().required(),
    cost_average: yup.string(),
    update_inventory: yup.string(),
    send_orders: yup.string(),
    update_tracking: yup.string(),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(Schema)
  });

  const handleCheckBoxCategory = (ids) => {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    const updatedCheckboxes = checkBoxesCategory.map(checkbox => {
      if (ids.includes(checkbox.id)) {
        return { ...checkbox, checked: !checkbox.checked };
      }
      return checkbox;
    });

    setCheckBoxesCategory(updatedCheckboxes);
    const category = updatedCheckboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.label);
    setVendorCategoryChecked(category);
  };

  const selectallCategory = (e) => {
    e.preventDefault();
    const updatedCheckboxes = checkBoxesCategory.map(checkbox => ({ ...checkbox, checked: true }));
    setCheckBoxesCategory(updatedCheckboxes);
    const theSelectedCategories = updatedCheckboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.label);
    setVendorCategoryChecked(theSelectedCategories);
  };

  const deselectallCategory = (e) => {
    e.preventDefault();
    const deselect = checkBoxesCategory.map(checkbox => ({ ...checkbox, checked: false }));
    setCheckBoxesCategory(deselect);
    setVendorCategoryChecked([]);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  let dispatch = useDispatch();
  let endpoint = 'https://service.swiftsuite.app/api/v2/enrollment/';

  const onSubmit = (data) => {
    const formData = {
      ...store,
      ...data,
      product_category: categoryChecked,
      stock_minimum: data.stock_minimum === "" ? null : data.stock_minimum,
      stock_maximum: data.stock_maximum === "" ? null : data.stock_maximum,
      shipping_cost: data.shipping_cost === "" ? null : data.shipping_cost,
    };

    if (categoryChecked.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    setMyLoader(true);
    axios.post(endpoint, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    })
      .then((response) => {
        if ([200, 201, 202].includes(response.status)) {
                toast.success("Enrolment successful");
                setEnrolmentResponse(response.data);
                resetVendor();
                dispatch(clearVendorData());
                navigate("/vendor/success-enrolment");
       }
      })
      .catch((err) => {
        setMyLoader(false);
        if (err.response) {
          const { status, data } = err.response;
          if (status === 400 && data.error) {
            toast.error(data.error || "Duplicate Enrolment.");
          } else if (status === 500) {
            toast.error("An internal server issue has occurred. Please contact customer service.");
          } else {
            toast.error(`Error ${status}: Something went wrong.`);
          }
        } else if (err.request) {
          toast.error("Network error: Please check your internet connection.");
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      });
  };

  const handlePrevious = () => {
    dispatch(handlePreviousStep());
    setCurrentStep(2);
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const restrictToIntegers = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  const restrictToNumbersAndDecimals = (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
    if (e.target.value.split('.').length > 2) {
      e.target.value = e.target.value.replace(/\.(?=.*\.)/g, '');
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <section className='mb-10'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='bg-white py-10'>
            <div>
              <h1 className='ms-5 lg:text-xl text-sm font-bold'>Product Type</h1>
              <div className='flex mt-5 px-5'>
                <label className='mt-2 text-sm font-semibold h-8 w-[55%] md:w-[52%] lg:w-[50%]' htmlFor="">
                  Select Category:
                </label>
                <div className='relative border border-gray-500 rounded p-1 text-sm h-8 lg:w-[230px] w-[160px] md:w-[200px]' ref={categoryDropdownRef}>
                  <div className='flex items-center px-2 cursor-pointer justify-between' onClick={toggleDropdown}>
                    <span className='text-gray-500'>Select Category</span>
                    {isOpen ? <IoIosArrowUp size={20} /> : <IoChevronDown size={20} />}
                  </div>
                  {isOpen && (
                    <div className='max-h-[60vh] overflow-y-auto absolute mt-2 bg-white shadow-lg z-[1000] lg:w-[250px] md:w-[250px] w-[200px] lg:ms-[-10px] md:ms-[-20%] ms-[-20%] p-3'>
                      <div className='flex gap-6 mb-2'>
                        <button className='border border-[#089451] font-semibold py-1 lg:px-4 px-2 rounded' onClick={selectallCategory}>
                          Select All
                        </button>
                        <button className='border border-[#089451] font-semibold py-1 lg:px-4 px-2 rounded' onClick={deselectallCategory}>
                          Deselect All
                        </button>
                      </div>
                      <div className='p-2'>
                        {checkBoxesCategory.map((checkbox) => (
                          <div className='flex justify-between' key={checkbox.id}>
                            {checkbox.label}
                            <input
                              type="checkbox"
                              checked={checkbox.checked}
                              onChange={() => handleCheckBoxCategory(checkbox.id)}
                              className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-[#027840] checked:border-[#027840] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <h1 className='ms-5 lg:text-xl font-bold mt-5'>Pricing Option</h1>
              <div className='flex mt-5 px-5'>
                <h3 className='mt-2 text-sm font-semibold h-[35px] w-[55%] md:w-[52%] lg:w-[50%]'>Select Markup Type</h3>
                <select
                  {...register('select_markup', { required: true })}
                  className='border h-[35px] w-[50%] md:w-[201px] lg:w-[230px] border-gray-500 focus:outline-none p-3 py-1 rounded'
                  onChange={handleSelectChange}
                  value={selectedOption}
                >
                  <option value="">Select Markup Type</option>
                  <option value="fixed">Fixed Markup</option>
                  <option value="percentage">Percentage Markup</option>
                </select>
              </div>
              <small className='text-red-600 ms-[42%] lg:ms-[55%]'>{errors.select_markup && <span>This field is required</span>}</small>

              {selectedOption === 'percentage' && (
                <div>
                  <div className='flex mt-5 px-5'>
                    <h3 className='mt-2 text-sm font-semibold h-[35px] w-[55%] md:w-[52%] lg:w-[50%]'>Percentage Markup:</h3>
                    <input
                      {...register("percentage_markup")}
                      type="text"
                      placeholder="Enter percentage markup"
                      className='border h-[35px] w-[55%] p-3 md:w-[201px] lg:w-[230px] border-gray-500 focus:outline-none py-1 rounded'
                      onInput={restrictToNumbersAndDecimals}
                    />
                  </div>
                  <small className='text-red-600 ms-[42%] lg:ms-[55%]'>{errors.percentage_markup && <span>This field is required</span>}</small>
                </div>
              )}

              {selectedOption === 'fixed' && (
                <div>
                  <div className='flex mt-5 px-5'>
                    <h3 className='mt-2 text-sm font-semibold h-[35px] w-[55%] md:w-[52%] lg:w-[50%]'>Fixed Markup:</h3>
                    <input
                      {...register("fixed_markup")}
                      type="text"
                      placeholder="Enter fixed markup"
                      className='border h-[35px] w-[55%] p-3 lg:w-[230px] md:w-[201px] border-gray-500 focus:outline-none py-1 rounded'
                      onInput={restrictToNumbersAndDecimals}
                    />
                  </div>
                  <small className='text-red-600 ms-[42%] lg:ms-[55%]'>{errors.fixed_markup && <span>This field is required</span>}</small>
                </div>
              )}

              <div>
                <div className='flex mt-5 px-5'>
                  <h3 className='mt-2 text-sm font-semibold h-[35px] md:w-[52%] w-[55%] lg:w-[50%]'>Shipping Cost:</h3>
                  <input
                    {...register("shipping_cost")}
                    type="text"
                    className='border h-[35px] w-[55%] lg:w-[230px] p-3 md:w-[201px] border-gray-500 focus:outline-none py-1 rounded'
                    onInput={restrictToNumbersAndDecimals}
                  />
                </div>
                <small className='text-red-600 ms-[42%] lg:ms-[55%]'>{errors.shipping_cost?.message}</small>
              </div>

              <div className='flex gap-5 lg:gap-2 border-b md:gap-[70px] mt-5 h-10 px-5'>
                <h3 className='text-sm font-semibold'>Use Shipping Cost Average:</h3>
                <div className="flex gap-2 h-[20px]">
                  <input
                    {...register("shipping_cost_average")}
                    type="checkbox"
                    onChange={() => setIsChecked(!isChecked)}
                    checked={isChecked}
                    className='lg:mt-0 mt-2 md:mt-2 border h-[20px] w-[15%] lg:w-[40%] border-gray-500 focus:outline-none py-1 rounded checked:bg-[#027840] checked:border-[#027840]'
                  />
                  <ResponsiveTooltip title="Lorem ipsum dolor sit amet.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>

              <h1 className='ms-5 lg:text-xl font-bold mt-5'>Inventory</h1>
              <div>
                <div className='flex mt-5 px-5'>
                  <h3 className='mt-2 text-sm font-semibold h-[35px] w-[55%] md:w-[52%] lg:w-[50%]'>Stock Minimum:</h3>
                  <input
                    {...register("stock_minimum", { required: true })}
                    type="text"
                    placeholder="Enter stock minimum"
                    className='border h-[35px] w-[55%] md:w-[201px] lg:w-[230px] border-gray-500 focus:outline-none p-3 py-1 rounded'
                    onInput={restrictToIntegers}
                  />
                </div>
                <small className='text-red-600 ms-[42%] lg:ms-[55%]'>{errors.stock_minimum && <span>This field is required</span>}</small>
              </div>

              <div>
                <div className='flex mt-5 px-5 pb-5 border-b'>
                  <h3 className='mt-2 text-sm font-semibold h-[35px] w-[55%] md:w-[52%] lg:w-[50%]'>Stock Maximum:</h3>
                  <input
                    {...register("stock_maximum", { required: true })}
                    type="text"
                    placeholder="Enter stock maximum"
                    className='border h-[35px] w-[55%] md:w-[201px] lg:w-[230px] border-gray-500 focus:outline-none p-3 py-1 rounded'
                    onInput={restrictToIntegers}
                  />
                </div>
                <small className='text-red-600 ms-[42%] lg:ms-[55%]'>{errors.stock_maximum && <span>This field is required</span>}</small>
              </div>

              <h1 className='ms-5 lg:text-xl font-bold mt-5'>Integration Settings</h1>
              <div className='flex gap-20 md:gap-[70px] mt-5 h-10 px-5'>
                <h3 className='text-sm font-semibold md:w-[100px] w-[100px]'>Update Inventory:</h3>
                <div className="flex gap-2 h-[20px]">
                  <input
                    type="checkbox"
                    {...register("update_inventory")}
                    onChange={() => setInventory(!inventory)}
                    checked={inventory}
                    className=' border h-[20px] w-[15%] lg:w-[40%] border-gray-500 focus:outline-none py-1 rounded checked:bg-[#027840] checked:border-[#027840]'
                  />
                  <ResponsiveTooltip title="Swift Suite will start updating inventory on marketplace for synced products.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>
              <div className='flex gap-20 md:gap-[70px] mt-5 h-10 px-5'>
                <h3 className='text-sm font-semibold md:w-[100px] w-[100px]'>Send Orders:</h3>
                <div className="flex gap-2 h-[20px]">
                  <input
                    type="checkbox"
                    {...register("send_orders")}
                    onChange={() => setOrder(!order)}
                    checked={order}
                    className=' border h-[20px] w-[15%] lg:w-[40%] border-gray-500 focus:outline-none py-1 rounded checked:bg-[#027840] checked:border-[#027840]'
                  />
                  <ResponsiveTooltip title="Check to allow order to be sent to supplier for fulfilment.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>
              <div className='flex gap-20 md:gap-[70px] mt-5 h-10 px-5'>
                <h3 className='text-sm font-semibold md:w-[100px] w-[100px]'>Update Tracking:</h3>
                <div className="flex gap-2 h-[20px]">
                  <input
                    type="checkbox"
                    {...register("update_tracking")}
                    onChange={() => setTracking(!tracking)}
                    checked={tracking}
                    className=' border h-[20px] w-[15%] lg:w-[40%] border-gray-500 focus:outline-none py-1 rounded'
                  />
                  <ResponsiveTooltip title="Start Updating Order Tracking.">
                    <MdInfo />
                  </ResponsiveTooltip>
                </div>
              </div>

<div className='mt-10 flex justify-center items-center gap-10'>
                          <button
                            onClick={handlePrevious}
                            type='button'
                            className='border border-[#089451] text-[#089451] w-[100px] hover:bg-[#089451] hover:text-white font-semibold py-2 rounded-[8px] transition'
                          >
                            Back
                          </button>
            
                          <button
                            type='submit'
                            className='bg-[#027840] text-white hover:bg-white hover:text-[#089451] border border-[#089451] font-semibold py-2 px-4 rounded-[8px] transition-all flex justify-center items-center w-[200px] gap-2'
                          >
                            {myLoader ? (
                              <ThreeDots height="20" width="20"  ariaLabel="loading" />
                            ) : (
                              'Next'
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

export default Ssi;
