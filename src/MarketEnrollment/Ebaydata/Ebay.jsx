import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { countries } from './EbayCountries';
import { FaRegRectangleXmark } from "react-icons/fa6";
import { FaRegCheckSquare } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import axios from 'axios';
import { FiRefreshCw } from "react-icons/fi";
import { TbPlugConnected } from "react-icons/tb";
import gif from './images/gif.gif';
import AccessModal from './AccessModal';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import Tooltip from '@mui/material/Tooltip';
import { ArrowLeft } from 'react-feather';
import { completeEnrolmentOrUpdate, refreshEbayConnection, refreshEbaySilentConnection } from '../../api/authApi';
import { extractStoreId } from '../../utils/utils';

const Ebay = () => {
  const store = useSelector(state => state.vendor.vendorData);
  const token = localStorage.getItem('token');
  const userIdString = localStorage.getItem('userId');
  const userId = userIdString ? JSON.parse(userIdString) : null;
  const navigate = useNavigate();
  const vendorName = localStorage.getItem('vendorName');
  const [connectClickedState, setConnectClickedState] = useState(localStorage.getItem('connectClicked') === 'true');

  const [hasResponse, setHasResponse] = useState(false);
  const [ebayConnected, setEbayConnected] = useState(false);
  const [policiesLoaded, setPoliciesLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAccessCodeButton, setShowAccessCodeButton] = useState(false);
  
  const [shipPolicyToggle, setShipPolicyToggle] = useState(false);
  const [returnPolicyToggle, setReturnPolicyToggle] = useState(false);
  const [paymentPolicyToggle, setPaymentPolicyToggle] = useState(false);
  const [shipPolicyArray, setShipPolicyArray] = useState([]);
  const [returnPolicyArray, setReturnPolicyArray] = useState([]);
  const [paymentPolicyArray, setPaymentPolicyArray] = useState([]);
  
  const [authorization_code, setAuthorization_code] = useState('');
  const [refreshIcon, setRefreshIcon] = useState(false);
  const [isRotate, setIsRotate] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  
  const [selectedCountry, setSelectedCountry] = useState("");
  const [storeDetails, setStoreDetails] = useState('');
  const [shipname, setShipname] = useState('');
  const [returnname, setReturnname] = useState('');
  const [paymentname, setPaymentname] = useState('');

  const timeoutRef = useRef(null);
  const accessCodeTimeoutRef = useRef(null);

  const defaultFormData = {
    marketplace_name: 'Ebay',
    region: '',
    store_id: '',
    fixed_percentage_markup: '',
    fixed_markup: '',
    enable_price_update: false,
    enable_quantity_update: false,
    maximum_quantity: '',
    charity_id: '',
    donation_percentage: '',
    enable_best_offer: false,
    enable_charity: false,
    min_profit_mergin: '',
    profit_margin: '',
    send_min_price: false,
    warn_copyright_complaints: false,
    warn_restriction_violation: false,
    shipping_policy: { id: '', name: '' },
    return_policy: { id: '', name: '' },
    payment_policy: { id: '', name: '' },
  };

  const Schema = yup.object().shape({
    marketplace_name: yup.string().required('Marketplace name is required'),
    store_id: yup.string().nullable(),
    region: yup.string().required('Marketplace region is required'),
    fixed_percentage_markup: yup
      .number()
      .typeError('Variable percentage must be a number')
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .when('$value', {
        is: (value) => value != null,
        then: (schema) => schema.min(0, 'Variable percentage must be non-negative'),
        otherwise: (schema) => schema,
      })
      .notRequired(),
    fixed_markup: yup
      .number()
      .typeError('Fixed markup must be a number')
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .when('$value', {
        is: (value) => value != null,
        then: (schema) => schema.min(0, 'Fixed markup must be non-negative'),
        otherwise: (schema) => schema,
      })
      .notRequired(),
    maximum_quantity: yup
      .number()
      .typeError('Maximum quantity must be a number')
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .min(1, 'Maximum quantity must be at least 1')
      .notRequired(),
      min_profit_mergin: yup
      .number()
      .typeError('Minimum profit margin must be a number')
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .when('send_min_price', {
        is: true,
        then: (schema) =>
          schema
            .required('Minimum profit margin is required when Send Min Price is enabled')
            .min(0, 'Minimum profit margin must be non-negative'),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
    profit_margin: yup
      .number()
      .typeError('Profit margin must be a number')
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .when('$value', {
        is: (value) => value != null,
        then: (schema) => schema.min(0, 'Profit margin must be non-negative'),
        otherwise: (schema) => schema,
      })
      .notRequired(),
    charity_id: yup.string().when('enable_charity', {
      is: true,
      then: (schema) => schema
        .required('Charity ID is required when charity is enabled')
        .matches(/^\d+$/, 'Charity ID must be a number'),
      otherwise: (schema) => schema.nullable()
    }),
    donation_percentage: yup.string().when('enable_charity', {
      is: true,
      then: (schema) => schema
        .required('Donation percentage is required when charity is enabled')
        .matches(/^\d+$/, 'Donation percentage must be a number'),
      otherwise: (schema) => schema.nullable()
    }),
    shipping_policy: yup.object({
      id: yup.string().required('Shipping policy is required'),
      name: yup.string().required(''),
    }),
    return_policy: yup.object({
      id: yup.string().required('Return policy is required'),
      name: yup.string().required(''),
    }),
    payment_policy: yup.object({
      id: yup.string().required('Payment policy is required'),
      name: yup.string().required('Payment policy name is required'),
    }),
  });

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch,
    reset,
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: defaultFormData,
    mode: 'onChange'
  });

  const formValues = watch();

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    if (name === "enable_best_offer" && checked) {
      setValue("send_min_price", false);
    } else if (name === "send_min_price" && checked) {
      if (!formValues.enable_best_offer) return;
    } else if (name === "charity_id" || name === "donation_percentage") {
      const integerValue = value.replace(/\D/g, '');
      setValue(name, integerValue);
      return;
    }

    setValue(name, inputValue);
  }, [setValue, formValues.enable_best_offer]);

  const handleSelect = useCallback((fieldName, id, name) => {
    const policy = { id, name };
    setValue(fieldName, policy);
    
    if (fieldName === "shipping_policy") {
      setShipPolicyToggle(false);
      setShipname(name);
    } else if (fieldName === "return_policy") {
      setReturnPolicyToggle(false);
      setReturnname(name);
    } else if (fieldName === "payment_policy") {
      setPaymentPolicyToggle(false);
      setPaymentname(name);
    }
  }, [setValue]);

  const handleCountryChange = useCallback((event) => {
    const value = event.target.value;
    setSelectedCountry(value);
    setValue('region', value);
  }, [setValue]);

  const onSubmit = async (data) => {
    if (!ebayConnected) {
      toast.error('Please connect to eBay first');
      return;
    }
    if (!policiesLoaded) {
      toast.error('Please refresh to load eBay policies');
      return;
    }
    if (!data.shipping_policy?.id || !data.return_policy?.id || !data.payment_policy?.id) {
      toast.error('Please select all required policies');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        charity_id: data.enable_charity ? data.charity_id : null,
        donation_percentage: data.enable_charity ? data.donation_percentage : null,
        region: selectedCountry || data.region,
        profit_margin: data.profit_margin ?? null,
        min_profit_mergin: data.min_profit_mergin ?? null,
        shipping_policy: JSON.stringify(data.shipping_policy),
        return_policy: JSON.stringify(data.return_policy),
        payment_policy: JSON.stringify(data.payment_policy),
        store_id: extractStoreId(data.store_id),
      };
      const response = await completeEnrolmentOrUpdate(userId, payload);
      if (response) {
        toast.success("eBay enrollment successful!");
        localStorage.setItem("submittedMarketPlace", response.marketplace_name);
        localStorage.removeItem('connectClicked');
        setConnectClickedState(false);
        navigate('/marketplace/success');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Enrollment failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshEbaySilent = useCallback(async () => {
    setIsRotating(true);
    try {
      const response = await refreshEbaySilentConnection(userId)
      if (response) {
        const data = response;
        setShipPolicyArray(data.fulfillment_policies?.fulfillmentPolicies || []);
        setPaymentPolicyArray(data.payment_policies?.paymentPolicies || []);
        setReturnPolicyArray(data.return_policies?.returnPolicies || []);
        setRefreshIcon(true);
        setEbayConnected(true);
        setPoliciesLoaded(true);
        const newStoreId = extractStoreId(data.ebay_store_id); 
        setStoreDetails(newStoreId);
        setValue('store_id', newStoreId); 
        localStorage.setItem('refreshData', JSON.stringify(data));
        return data;
      }
    } catch (error) {
      setEbayConnected(false);
      setPoliciesLoaded(false);
      setValue('store_id', '');
      setStoreDetails('');
      return null;
    } finally {
      setIsRotating(false);
    }
  }, [userId, setValue]);

  const refreshEbay = useCallback(async () => {
    setIsRotating(true);
    try {
      const response = await refreshEbayConnection(userId);
      if (response) {
        const data = response;
        setShipPolicyArray(data.fulfillment_policies?.fulfillmentPolicies || []);
        setPaymentPolicyArray(data.payment_policies?.paymentPolicies || []);
        setReturnPolicyArray(data.return_policies?.returnPolicies || []);
        setRefreshIcon(true);
        setEbayConnected(true);
        setPoliciesLoaded(true);
        const newStoreId = extractStoreId(data.ebay_store_id); 
        setStoreDetails(newStoreId);
        setValue('store_id', newStoreId); 
        toast.success("eBay connection refreshed successfully!");
        localStorage.setItem('refreshData', JSON.stringify(data));
        return data;
      }
    } catch (error) {
      toast.error("Failed to refresh eBay connection");
      setEbayConnected(false);
      setPoliciesLoaded(false);
      setValue('store_id', '');
      setStoreDetails('');
      return null;
    } finally {
      setIsRotating(false);
    }
  }, [userId, setValue]);

  const connectEbay = useCallback(() => {
    setIsRotate(true);
    try {
      const now = Date.now();
      localStorage.setItem('connectClicked', 'true');
      localStorage.setItem('connectTime', now.toString());

      setConnectClickedState(true);
      setShowAccessCodeButton(true);

      const ebayConnectEndpoint = 'https://service.swiftsuite.app/marketplaceApp/get_auth_code/Ebay';
      window.open(ebayConnectEndpoint, '_blank');

      timeoutRef.current = setTimeout(() => {
        localStorage.removeItem('connectClicked');
        localStorage.removeItem('connectTime');
        setConnectClickedState(false);
        setShowAccessCodeButton(false);
      }, 15 * 60 * 1000);

      accessCodeTimeoutRef.current = setTimeout(() => {
        setShowAccessCodeButton(false);
      }, 6 * 60 * 1000);

      toast.info('eBay authentication window opened. Please complete the process.');
    } catch (error) {
      toast.error('Failed to initiate eBay connection');
    } finally {
      setIsRotate(false);
    }
  }, []);

  const sendCode = useCallback(async () => {
    if (!authorization_code.trim()) {
      toast.error('Please enter the authorization code');
      return;
    }

    try {
      const endpoint = `https://service.swiftsuite.app/marketplaceApp/oauth/callback/${userId}/Ebay/`;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ authorization_code }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("eBay connection successful!");
        localStorage.removeItem('connectClicked');
        setConnectClickedState(false);
        setShowAccessCodeButton(false);
        setModal2Open(false);
        setAuthorization_code('');
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (accessCodeTimeoutRef.current) {
          clearTimeout(accessCodeTimeoutRef.current);
          accessCodeTimeoutRef.current = null;
        }
        
        await refreshEbaySilent();
      } else if (response.status === 400) {
        toast.error("Invalid authorization code");
      } else if (response.status === 500) {
        toast.error("Authorization code has expired");
      } else {
        toast.error("Connection failed");
      }
    } catch (error) {
      toast.error("Connection error:", error);
    }
  }, [authorization_code, token, refreshEbaySilent]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const refreshData = await refreshEbaySilent();
        
        const marketList = localStorage.getItem('MarketList');
        if (marketList !== 'true') {
          const endpoint = `https://service.swiftsuite.app/marketplaceApp/complete_enrolment_or_update/${userId}/Ebay/`;
          
          const response = await axios.put(endpoint, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            }
          });

          if (response.status === 200) {
            const data = response.data;
            const parsePolicy = (policyString) => {
              try {
                if (!policyString) return { id: '', name: '' };
                const parsed = typeof policyString === 'string' ? JSON.parse(policyString) : policyString;
                return typeof parsed === 'object' && parsed.id && parsed.name ? parsed : { id: '', name: '' };
              } catch {
                return { id: '', name: '' };
              }
            };

            const formDataUpdate = {
              marketplace_name: data.marketplace_name || 'Ebay',
              region: data.region || '',
              store_id: extractStoreId(data.store_id || refreshData?.ebay_store_id),
              fixed_percentage_markup: String(data.fixed_percentage_markup || ''),
              fixed_markup: String(data.fixed_markup || ''),
              enable_price_update: Boolean(data.enable_price_update),
              enable_quantity_update: Boolean(data.enable_quantity_update),
              maximum_quantity: String(data.maximum_quantity || ''),
              charity_id: String(data.charity_id || ''),
              donation_percentage: String(data.donation_percentage || ''),
              enable_best_offer: Boolean(data.enable_best_offer),
              enable_charity: Boolean(data.enable_charity),
              min_profit_mergin: String(data.min_profit_mergin || ''),
              profit_margin: String(data.profit_margin || ''),
              send_min_price: Boolean(data.send_min_price),
              warn_copyright_complaints: Boolean(data.warn_copyright_complaints),
              warn_restriction_violation: Boolean(data.warn_restriction_violation),
              shipping_policy: parsePolicy(data.shipping_policy),
              return_policy: parsePolicy(data.return_policy),
              payment_policy: parsePolicy(data.payment_policy),
            };

            reset(formDataUpdate);
            
            setPaymentname(formDataUpdate.payment_policy.name || '');
            setShipname(formDataUpdate.shipping_policy.name || '');
            setReturnname(formDataUpdate.return_policy.name || '');
            setSelectedCountry(formDataUpdate.region || '');
            setStoreDetails(formDataUpdate.store_id);
            setValue('store_id', formDataUpdate.store_id); 
          }
        }
      } catch (error) {
        toast.error('Error loading initial data', error);
        setValue('store_id', '');
        setStoreDetails('');
      } finally {
        setHasResponse(true);
      }
    };

    if (userId && token) {
      loadInitialData();
    }
  }, [userId, token, refreshEbaySilent, reset, setValue]);

  useEffect(() => {
    if (connectClickedState) {
      const connectTimeStr = localStorage.getItem('connectTime');
      const currentTime = Date.now();

      if (connectTimeStr) {
        const connectTime = parseInt(connectTimeStr);
        const elapsed = currentTime - connectTime;

        const accessCodeRemaining = 6 * 60 * 1000 - elapsed;
        const fullTimeoutRemaining = 15 * 60 * 1000 - elapsed;

        if (accessCodeRemaining > 0) {
          setShowAccessCodeButton(true);
          accessCodeTimeoutRef.current = setTimeout(() => {
            setShowAccessCodeButton(false);
          }, accessCodeRemaining);
        } else {
          setShowAccessCodeButton(false);
        }

        if (fullTimeoutRemaining > 0) {
          timeoutRef.current = setTimeout(() => {
            localStorage.removeItem('connectClicked');
            localStorage.removeItem('connectTime');
            setConnectClickedState(false);
            setShowAccessCodeButton(false);
          }, fullTimeoutRemaining);
        } else {
          localStorage.removeItem('connectClicked');
          localStorage.removeItem('connectTime');
          setConnectClickedState(false);
          setShowAccessCodeButton(false);
        }
      }
    }
  }, [connectClickedState]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(accessCodeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
  if (!formValues.send_min_price) {
    setValue('min_profit_mergin', '', { shouldValidate: true });
  }
}, [formValues.send_min_price, setValue]);

useEffect(() => {
  if (!formValues.enable_best_offer) {
    setValue("send_min_price", false, { shouldValidate: true });
    setValue("min_profit_mergin", "", { shouldValidate: true });
  }
}, [formValues.enable_best_offer, setValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.ship-policy-dropdown') &&
        !event.target.closest('.return-policy-dropdown') &&
        !event.target.closest('.payment-policy-dropdown')
      ) {
        setShipPolicyToggle(false);
        setReturnPolicyToggle(false);
        setPaymentPolicyToggle(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleShipPolicyDropdown = () => {
    if (!policiesLoaded || shipPolicyArray.length === 0) return;
    setShipPolicyToggle(!shipPolicyToggle);
    setReturnPolicyToggle(false);
    setPaymentPolicyToggle(false);
  };

  const toggleReturnPolicyDropdown = () => {
    if (!policiesLoaded || returnPolicyArray.length === 0) return;
    setReturnPolicyToggle(!returnPolicyToggle);
    setShipPolicyToggle(false);
    setPaymentPolicyToggle(false);
  };

  const togglePaymentPolicyDropdown = () => {
    if (!policiesLoaded || paymentPolicyArray.length === 0) return;
    setPaymentPolicyToggle(!paymentPolicyToggle);
    setShipPolicyToggle(false);
    setReturnPolicyToggle(false);
  };

  return (
    <>
      <div className="pb-10">
        <div className="flex justify-between items-center my-5">
          <div className="flex items-center gap-4">
            <Link to="/layout/mymarket" className="flex items-center gap-2 mt-5 bg-[#BB8232] rounded-lg text-white p-2">
              <ArrowLeft size={20} />
              Return
            </Link>
          </div>
          <p className="relative lg:top-4 lg:left-0 md:left-10 font-bold text-xl">Edit eBay Account</p>
        </div>

        <section className="bg-white shadow-lg px-2 w-full py-2 rounded-[10px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white lg:w-[100%] w-[93%] md:w-[90%] lg:ms-0 md:ms-10 lg:h-[20%] ms-3 lg:mt-8 mt-0">
              <div>
                <h1 className="lg:text-xl text-sm font-bold border-b-1 px-4">Account Information</h1>
                <section className="grid grid-cols-12 justify-center items-center gap-4 my-10 px-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                    <h3 className="text-sm font-semibold w-full sm:w-40">Marketplace Name:</h3>
                    <div className="w-full sm:flex-1">
                      <input
                        {...register("marketplace_name")}
                        disabled
                        type="text"
                        className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded"
                      />
                      {errors.marketplace_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.marketplace_name.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                    <label className="text-sm font-semibold w-full sm:w-40" htmlFor="region">
                      Marketplace Region:
                    </label>
                    <div className="w-full sm:flex-1">
                      <select
                        {...register("region")}
                        className="px-2 w-full h-[38px] bg-[#F9F9F9] border border-gray-300 rounded shadow-sm focus:outline-none"
                        value={selectedCountry || formValues.region || ''}
                        onChange={handleCountryChange}
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.name} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      {errors.region && (
                        <p className="text-red-500 text-xs mt-1">{errors.region.message}</p>
                      )}
                    </div>
                  </div>
                </section>

                <div className="flex mx-10 justify-center items-center md:gap-10 gap-4 my-6">
                  <Tooltip title="Connect to eBay" arrow>
                    <div 
                      className="border space-x-2 p-2 px-3 rounded border-[#089451] cursor-pointer hover:bg-[#089451] hover:text-white transition-colors" 
                      onClick={connectEbay}
                    >
                      <span className={`inline-block transition-transform ${isRotate ? "animate-spin" : ""}`}>
                        <TbPlugConnected />
                      </span>
                    </div>
                  </Tooltip>
                  
                  {connectClickedState && (
                    <Tooltip title="Enter the code provided by eBay after authentication" arrow>
                      <button
                        type='button'
                        onClick={() => setModal2Open(true)}
                        className="bg-[#089451] text-white rounded px-3 py-1 hover:bg-[#0A7A44] transition-colors"
                      >
                        Enter Access Code
                      </button>
                    </Tooltip>
                  )}
                  
                  <Tooltip title="Refresh connection with eBay" arrow>
                    <div 
                      onClick={refreshEbay} 
                      className="border space-x-2 p-2 px-3 rounded border-[#089451] cursor-pointer hover:bg-[#089451] hover:text-white transition-colors"
                    >
                      <span className={`inline-block transition-transform ${isRotating ? "animate-spin" : ""}`}>
                        <FiRefreshCw />
                      </span>
                    </div>
                  </Tooltip>
                </div>

                <section className="grid grid-cols-12 justify-center items-center gap-4 my-5 px-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                      <h3 className="text-sm font-semibold w-full sm:w-40">Store ID:</h3>
                      <div className="flex items-center gap-2">
                        {ebayConnected ? (
                          <div className="font-bold text-green-700">
                            <FaRegCheckSquare />
                          </div>
                        ) : (
                          <div className="text-red-600 flex items-center gap-1">
                            <FaRegRectangleXmark />
                            <span className="px-1 shadow rounded text-xs">Not Connected</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full sm:flex-1">
                      <input
                        {...register("store_id")}
                        value={formValues.store_id || ''} 
                        disabled
                        type="text"
                        className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded"
                      />
                      {errors.store_id && (
                        <p className="text-red-500 text-xs mt-1">{errors.store_id.message}</p>
                      )}
                    </div>
                  </div>
                </section>
              </div>

              <div className='my-10'>
                <h1 className="lg:text-xl font-bold mt-5 border-b-1 px-4">Marketplace Fees</h1>
                <section className="grid grid-cols-12 justify-center items-center gap-4 my-5 px-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                    <h3 className="text-sm font-semibold w-full sm:w-40">Variable (%):</h3>
                    <div className="w-full sm:flex-1">
                      <input
                        {...register("fixed_percentage_markup")}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded"
                      />
                      {errors.fixed_percentage_markup && (
                        <p className="text-red-500 text-xs mt-1">{errors.fixed_percentage_markup.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                    <h3 className="text-sm font-semibold w-full sm:w-40">Fixed ($):</h3>
                    <div className="w-full sm:flex-1">
                      <input
                        {...register("fixed_markup")}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded"
                      />
                      {errors.fixed_markup && (
                        <p className="text-red-500 text-xs mt-1">{errors.fixed_markup.message}</p>
                      )}
                    </div>
                  </div>
                </section>
              </div>

              <div className='my-10'>
                <h1 className="border-b-1 lg:text-xl font-bold mt-5 px-4">Marketplace Options</h1>
                
                <div className="flex items-center md:gap-20 gap-10 md:mx-5 mx-0 mt-5">
                  <h3 className="text-sm font-semibold w-[160px]">Enable Price Update:</h3>
                  <div className="flex flex-col justify-center items-center">
                    <Tooltip title="Enable automatic price updates" arrow>
                      <label className="cursor-pointer p-3 -m-3">
                        <input 
                          {...register("enable_price_update")} 
                          type="checkbox" 
                          onChange={handleChange}
                          className="md:w-5 w-8 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5" 
                        />
                      </label>
                    </Tooltip>
                  </div>
                </div>
                
                <div className="flex items-center md:gap-20 gap-10 md:mx-5 mx-0 mt-8">
                  <h3 className="text-sm font-semibold w-[160px]">Enable Quantity Update:</h3>
                  <div className="flex flex-col justify-center items-center">
                    <Tooltip title="Enable automatic quantity updates" arrow>
                      <label className="cursor-pointer p-3 -m-3">
                        <input 
                          {...register("enable_quantity_update")} 
                          type="checkbox" 
                          onChange={handleChange}
                          className="md:w-5 w-8 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5" 
                        />
                      </label>
                    </Tooltip>
                  </div>
                </div>

                <div className="my-10">
                  <h1 className="lg:text-xl font-bold mt-5 border-b-1 px-4">Charity Donation</h1>
                  <div className="flex items-center md:gap-20 gap-10 md:mx-5 mx-0 mt-8">
                    <h3 className="text-sm font-semibold w-[160px]">Enable Charity:</h3>
                    <div className="flex flex-col justify-center items-center">
                      <label className="cursor-pointer p-3 -m-3">
                        <input 
                          {...register("enable_charity")} 
                          type="checkbox" 
                          checked={formValues.enable_charity} 
                          onChange={handleChange} 
                          className="md:w-5 w-8 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5" 
                        />
                      </label>
                    </div>
                  </div>
                  <section className="grid grid-cols-12 justify-center items-center gap-4 my-5 px-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                      <h3 className="text-sm font-semibold w-full sm:w-40">Charity ID:</h3>
                      <div className="w-full sm:flex-1">
                        <input
                          {...register("charity_id")}
                          name="charity_id"
                          value={formValues.charity_id}
                          onChange={handleChange}
                          type="number"
                          step="1"
                          disabled={!formValues.enable_charity}
                          className={`border border-gray-300 h-[35px] w-full sm:flex-1 px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded ${!formValues.enable_charity ? 'cursor-not-allowed' : ''}`}
                        />
                        {errors.charity_id && <p className="text-red-500 text-xs mt-1">{errors.charity_id.message}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                      <h3 className="text-sm font-semibold w-full sm:w-40">Donation Percentage:</h3>
                      <div className="w-full sm:flex-1">
                        <input
                          {...register("donation_percentage")}
                          name="donation_percentage"
                          value={formValues.donation_percentage}
                          onChange={handleChange}
                          type="number"
                          step="1"
                          disabled={!formValues.enable_charity}
                          className={`border border-gray-300 h-[35px] w-full sm:flex-1 px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded ${!formValues.enable_charity ? 'cursor-not-allowed' : ''}`}
                        />
                        {errors.donation_percentage && <p className="text-red-500 text-xs mt-1">{errors.donation_percentage.message}</p>}
                      </div>
                    </div>
                  </section>
                </div>

                <div className="my-10">
                  <h1 className="lg:text-xl font-bold mt-5 border-b-1 px-4">Offers Settings</h1>
                  <div className="flex items-center md:gap-20 gap-10 md:mx-5 mx-0 mt-8">
                    <h3 className="text-sm font-semibold w-[160px]">Enable Best Offer:</h3>
                    <div className="flex flex-col justify-center items-center">
                      <Tooltip title="This will enable best offer" componentsProps={{ tooltip: { sx: { bgcolor: "black", color: "white", fontSize: "10px", borderRadius: "6px", p: 1 } } }} arrow PopperProps={{ modifiers: [{ name: "offset", options: { offset: [0, -10] } }] }}>
                        <label className="cursor-pointer p-3 -m-3">
                          <input
                            {...register("enable_best_offer")}
                            type="checkbox"
                            checked={formValues.enable_best_offer}
                            onChange={handleChange}
                            className="md:w-5 w-8 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5"
                          />
                        </label>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="flex items-center md:gap-20 gap-10 md:mx-5 mx-0 mt-8">
                    <h3 className="text-sm font-semibold w-[160px]">Send Min Price:</h3>
                    <div className="flex flex-col gap-1">
                      <Tooltip 
                        title="Send the minimum price to eBay when enabled" 
                        arrow
                      >
                        <label className="cursor-pointer p-3 -m-3">
                          <input
                            {...register("send_min_price")}
                            type="checkbox"
                            disabled={!formValues.enable_best_offer}
                            checked={formValues.send_min_price}
                            onChange={handleChange}
                            className={`md:w-5 w-8 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5 ${
                              !formValues.enable_best_offer ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          />
                        </label>
                      </Tooltip>
                    </div>
                  </div>
                      {!formValues.enable_best_offer && (
                        <p className="text-gray-500 text-xs italic mt-1 max-w-[620px] text-center">
                          Enable "Best Offer" first to use this option
                        </p>
                      )}
                  <div className='my-10'>
                    <section className="grid grid-cols-12 justify-center items-center gap-6 mb-5 px-4">
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:col-span-6 col-span-12">
                        <h3 className="text-sm font-semibold w-full sm:w-40">Min Profit Margin (%):</h3>
                        <div className="w-full sm:flex-1 min-w-0">
                          <input
                            {...register("min_profit_mergin")}
                            type="number"
                            step="0.01"
                            disabled={!formValues.send_min_price}
                            className={`border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded ${
                              !formValues.send_min_price 
                                ? 'cursor-not-allowed bg-gray-100 opacity-70' 
                                : 'focus:ring-1 focus:ring-[#089451]'
                            }`}
                            placeholder={formValues.send_min_price ? "" : ""}
                          />

                          {formValues.send_min_price ? (
                            errors.min_profit_mergin && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.min_profit_mergin.message}
                              </p>
                            )
                          ) : (
                            <p className="text-gray-500 text-xs mt-1 italic">
                              Enable "Send Min Price" first to set minimum profit margin
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:col-span-6 col-span-12">
                        <h3 className="text-sm font-semibold w-full sm:w-40">Maximum Quantity:</h3>
                        <div className="w-full sm:flex-1 min-w-0">
                          <input
                            {...register("maximum_quantity")}
                            value={formValues.maximum_quantity}
                            onChange={handleChange}
                            type="number"
                            className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded"
                          />
                          {errors.maximum_quantity && (
                            <p className="text-red-500 text-xs mt-1">{errors.maximum_quantity.message}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:col-span-6 col-span-12">
                        <h3 className="text-sm font-semibold w-full sm:w-40">Profit Margin:</h3>
                        <div className="w-full sm:flex-1 min-w-0">
                          <input
                            {...register("profit_margin")}
                            name="profit_margin"
                            value={formValues.profit_margin}
                            onChange={handleChange}
                            type="number"
                            className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded"
                          />
                          {errors.profit_margin && (
                            <p className="text-red-500 text-xs mt-1">{errors.profit_margin.message}</p>
                          )}
                        </div>
                      </div>
                    </section>
                  </div>
                  <div className="flex md:px-5 md:pe-28 px-0 justify-between my-10">
                    <p className="md:w-[75%] w-[50%] text-balance text-sm font-semibold text-[#BB8232]">Warn me when I try to list items known to cause copyright complaints.</p>
                    <label className="cursor-pointer p-3 -m-3">
                      <input 
                        type="checkbox" 
                        {...register("warn_copyright_complaints")} 
                        checked={formValues.warn_copyright_complaints} 
                        onChange={handleChange} 
                        className="md:w-5 w-8 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5" 
                      />
                    </label>
                  </div>
                  <div className="flex md:px-5 md:pe-28 px-0 pb-5 justify-between my-5 border-b-1">
                    <p className="md:w-[75%] w-[50%] text-balance text-sm text-[#BB8232] font-semibold">Warn me when I try to list items known to cause restriction violation.</p>
                    <label className="cursor-pointer p-3 -m-3">
                      <input 
                        {...register("warn_restriction_violation")} 
                        type="checkbox" 
                        checked={formValues.warn_restriction_violation} 
                        onChange={handleChange} 
                        className="md:w-5 w-8 h-5 rounded-[3px] border-[2px] border-[#027840] focus:outline-none bg-white checked:bg-[#027840] checked:border-green-500 relative checked:after:text-white checked:after:text-sm checked:after:font-bold cursor-pointer accent-[#027840] checked:after:top-0 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:leading-5" 
                      />
                    </label>
                  </div>
                  <section>
                    <h1 className="md:ms-5 lg:text-xl font-bold my-5">Business Policy</h1>
                    <div
                      className={`my-10 ship-policy-dropdown ${!refreshIcon || shipPolicyArray.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={refreshIcon && shipPolicyArray.length > 0 ? toggleShipPolicyDropdown : undefined}
                    >
                      <div className="grid grid-cols-12 md:mx-5 mt-5 lg:py-5 py-3 justify-center items-center">
                        <h3 className="mt-2 text-sm font-semibold col-span-6">Shipping Policy:</h3>
                        <div className="col-span-6 md:w-4/5 relative">
                          <div
                            className={`flex bg-[#F9F9F9] border border-gray-300 justify-between py-1 px-3 rounded ${!refreshIcon || shipPolicyArray.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={refreshIcon && shipPolicyArray.length > 0 ? toggleShipPolicyDropdown : undefined}
                          >
                            <span>{shipname || "Select Policy"}</span>
                            <span className="mt-1 text-xl"><MdArrowDropDown /></span>
                          </div>
                          <div
                            className={
                              shipPolicyToggle && refreshIcon && shipPolicyArray.length > 0
                                ? "absolute w-full z-30 bg-white h-[10rem] shadow overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-100 scrollbar-shorter"
                                : "hidden"
                            }
                          >
                            {shipPolicyArray.map((items, i) => (
                              <div
                                onClick={() => handleSelect("shipping_policy", items.fulfillmentPolicyId, items.name)}
                                key={i}
                                className="w-full"
                              >
                                <div className="hover:bg-[#E7F2ED] p-2 border-b">{items.name}</div>
                              </div>
                            ))}
                          </div>
                          {(!refreshIcon || shipPolicyArray.length === 0) && (
                            <small className="flex justify-center text-red-500">
                              Connect to eBay and refresh to get policies
                            </small>
                          )}
                          {errors.shipping_policy?.id && <p className="text-red-500 text-xs mt-1">{errors.shipping_policy.id.message}</p>}
                          {errors.shipping_policy?.name && <p className="text-red-500 text-xs mt-1">{errors.shipping_policy.name.message}</p>}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`my-10 return-policy-dropdown ${!refreshIcon || returnPolicyArray.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={refreshIcon && returnPolicyArray.length > 0 ? toggleReturnPolicyDropdown : undefined}
                    >
                      <div className="grid grid-cols-12 md:mx-5 mt-5 lg:py-5 py-3 justify-center items-center">
                        <h3 className="mt-2 text-sm font-semibold col-span-6">Return Policy:</h3>
                        <div className="col-span-6 md:w-4/5 relative">
                          <div
                            className={`flex bg-[#F9F9F9] border border-gray-300 justify-between py-1 px-3 rounded ${!refreshIcon || returnPolicyArray.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={refreshIcon && returnPolicyArray.length > 0 ? toggleReturnPolicyDropdown : undefined}
                          >
                            <span>{returnname || "Select Policy"}</span>
                            <span className="mt-1 text-xl"><MdArrowDropDown /></span>
                          </div>
                          <div
                            className={
                              returnPolicyToggle && refreshIcon && returnPolicyArray.length > 0
                                ? "absolute w-full z-20 bg-white shadow h-[10rem] overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-100 scrollbar-shorter"
                                : "hidden"
                            }
                          >
                            {returnPolicyArray.map((items, i) => (
                              <div
                                onClick={() => handleSelect("return_policy", items.returnPolicyId, items.name)}
                                key={i}
                                className="w-full"
                              >
                                <div className="hover:bg-[#E7F2ED] p-2 border-b">{items.name}</div>
                              </div>
                            ))}
                          </div>
                          {(!refreshIcon || returnPolicyArray.length === 0) && (
                            <small className="flex justify-center text-red-500">
                              Connect to eBay and refresh to get policies
                            </small>
                          )}
                          {errors.return_policy?.id && <p className="text-red-500 text-xs mt-1">{errors.return_policy.id.message}</p>}
                          {errors.return_policy?.name && <p className="text-red-500 text-xs mt-1">{errors.return_policy.name.message}</p>}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`my-10 payment-policy-dropdown ${!refreshIcon || paymentPolicyArray.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={refreshIcon && paymentPolicyArray.length > 0 ? togglePaymentPolicyDropdown : undefined}
                    >
                      <div className="grid grid-cols-12 md:mx-5 mt-5 lg:py-5 py-3 justify-center items-center">
                        <h3 className="mt-2 text-sm font-semibold col-span-6">Payment Policy:</h3>
                        <div className="col-span-6 md:w-4/5 relative">
                          <div
                            className={`flex bg-[#F9F9F9] border border-gray-300 justify-between py-1 px-3 rounded ${!refreshIcon || paymentPolicyArray.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={refreshIcon && paymentPolicyArray.length > 0 ? togglePaymentPolicyDropdown : undefined}
                          >
                            <span>{paymentname || "Select Policy"}</span>
                            <span className="mt-1 text-xl"><MdArrowDropDown /></span>
                          </div>
                          <div
                            className={
                              paymentPolicyToggle && refreshIcon && paymentPolicyArray.length > 0
                                ? "absolute w-full z-10 bg-white shadow h-[6rem] overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-100 scrollbar-shorter"
                                : "hidden"
                            }
                          >
                            {paymentPolicyArray.map((items, i) => (
                              <div
                                onClick={() => handleSelect("payment_policy", items.paymentPolicyId, items.name)}
                                key={i}
                                className=""
                              >
                                <div className="hover:bg-[#E7F2ED] p-2 border-b">{items.name}</div>
                              </div>
                            ))}
                          </div>
                          {(!refreshIcon || paymentPolicyArray.length === 0) && (
                            <small className="flex justify-center text-red-500">
                              Connect to eBay and refresh to get policies
                            </small>
                          )}
                          {errors.payment_policy?.id && <p className="text-red-500 text-xs mt-1">{errors.payment_policy.id.message}</p>}
                          {errors.payment_policy?.name && <p className="text-red-500 text-xs mt-1">{errors.payment_policy.name.message}</p>}
                        </div>
                      </div>
                    </div>
                  </section>
                  <div className="flex gap-20 justify-center my-5">
                    <Tooltip
                      title={refreshIcon ? "" : "Please connect to eBay before submitting"}
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "white",
                            border: '1px solid #089451',
                            color: "#089451",
                            fontSize: "12px",
                            borderRadius: "6px",
                            p: 1
                          }
                        }
                      }}
                      PopperProps={{
                        modifiers: [{ name: "offset", options: { offset: [0, -8] } }]
                      }}
                      disableHoverListener={refreshIcon}
                    >
                      <span>
                        <button
                          type="submit"
                          className={`bg-[#027840] text-white border py-1 h-[40px]  flex items-center justify-center w-[5rem] rounded font-bold ${!refreshIcon ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:bg-[#089451]'}`}
                          disabled={!refreshIcon}
                        >
                          {isSubmitting ? <img src={gif} alt="Loading" className="w-[25px]" /> : "Submit"}
                        </button>
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
        <Toaster position="top-right" />
      </div>
      <AccessModal
        modal2Open={modal2Open}
        authorization_code={authorization_code}
        setModal2Open={setModal2Open}
        setAuthorization_code={setAuthorization_code}
        sendCode={sendCode}
      />
    </>
  );
};

export default Ebay;