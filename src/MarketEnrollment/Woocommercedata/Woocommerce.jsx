import React, { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { countries } from "../Countries";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { MdOutlineArrowBackIosNew, MdInfo } from "react-icons/md";
import ResponsiveTooltip from "../ResponsiveTooltip";
import { Toaster, toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { ArrowLeft } from "react-feather";
import {
  marketplaceEnrolment,
  woocommerceEnrolment,
  testWoocommerceConnection,
} from "../../api/authApi";
import { useMarketplaceStore } from "../../stores/marketplaceStore";
import { Select } from "antd";

const Woocommerce = () => {
  const store = useSelector((state) => state.vendor.vendorData);
  const userId = localStorage.getItem("userId")
    ? JSON.parse(localStorage.getItem("userId"))
    : null;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const price = useMarketplaceStore((state) => state.wcPriceUpdate);
  const setPrice = useMarketplaceStore((state) => state.setWcPriceUpdate);
  const quantity = useMarketplaceStore((state) => state.wcQuantityUpdate);
  const setQuantity = useMarketplaceStore((state) => state.setWcQuantityUpdate);
  const enforcement = useMarketplaceStore((state) => state.wcMapEnforcement);
  const setEnforcement = useMarketplaceStore(
    (state) => state.setWcMapEnforcement,
  );
  const msrp = useMarketplaceStore((state) => state.wcAutoPopulateMsrp);
  const setMsrp = useMarketplaceStore((state) => state.setWcAutoPopulateMsrp);
  const sendMinPrice = useMarketplaceStore((state) => state.wcSendMinPrice);
  const setSendMinPrice = useMarketplaceStore(
    (state) => state.setWcSendMinPrice,
  );
  const selectedCountry = useMarketplaceStore((state) => state.selectedCountry);
  const setSelectedCountry = useMarketplaceStore(
    (state) => state.setSelectedCountry,
  );
  const productStatus = useMarketplaceStore((state) => state.wcProductStatus);
  const setProductStatus = useMarketplaceStore(
    (state) => state.setWcProductStatus,
  );
  const isStatusDropdownOpen = useMarketplaceStore(
    (state) => state.wcStatusDropdownOpen,
  );
  const setIsStatusDropdownOpen = useMarketplaceStore(
    (state) => state.setWcStatusDropdownOpen,
  );
  const loading = useMarketplaceStore((state) => state.wcLoading);
  const setLoading = useMarketplaceStore((state) => state.setWcLoading);
  const apiKeysLoading = useMarketplaceStore((state) => state.wcApiKeysLoading);
  const setApiKeysLoading = useMarketplaceStore(
    (state) => state.setWcApiKeysLoading,
  );
  const connectStoreLoading = useMarketplaceStore(
    (state) => state.wcConnectStoreLoading,
  );
  const setConnectStoreLoading = useMarketplaceStore(
    (state) => state.setWcConnectStoreLoading,
  );
  const initialLoading = useMarketplaceStore((state) => state.wcInitialLoading);
  const setInitialLoading = useMarketplaceStore(
    (state) => state.setWcInitialLoading,
  );
  const hasExistingEnrolment = useMarketplaceStore(
    (state) => state.wcHasExistingEnrolment,
  );
  const setHasExistingEnrolment = useMarketplaceStore(
    (state) => state.setWcHasExistingEnrolment,
  );
  const resetWcStore = useMarketplaceStore((state) => state.resetWcStore);

  const Schema = yup.object().shape({
    wc_consumer_url: yup
      .string()
      .required("Store URL is required")
      .test("is-valid-url", "Must be a valid URL", (value) => {
        if (!value) return false;
        const withProtocol = /^(https?:\/\/)/i.test(value)
          ? value
          : `https://${value}`;
        try {
          const url = new URL(withProtocol);
          const domainRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
          return (
            (url.protocol === "http:" || url.protocol === "https:") &&
            domainRegex.test(url.hostname)
          );
        } catch {
          return false;
        }
      }),
    wc_consumer_key: yup.string().required("Consumer key is required"),
    wc_consumer_secret: yup.string().required("Consumer secret is required"),
    region: yup.string().required("Marketplace Region is required"),
    fixed_percentage_markup: yup
      .number()
      .transform((v, o) => (String(o).trim() === "" ? null : v))
      .typeError("Fixed percentage must be a number")
      .min(0, "Fixed percentage must be non-negative")
      .nullable(),
    fixed_markup: yup
      .number()
      .transform((v, o) => (String(o).trim() === "" ? null : v))
      .typeError("Fixed amount must be a number")
      .min(0, "Fixed amount must be non-negative")
      .nullable(),
    min_profit_mergin: yup
      .number()
      .transform((v, o) => (String(o).trim() === "" ? null : v))
      .typeError("Minimum profit margin must be a number")
      .min(0, "Minimum profit margin must be non-negative")
      .nullable(),
    profit_margin: yup
      .number()
      .transform((v, o) => (String(o).trim() === "" ? null : v))
      .typeError("Margin must be a number")
      .min(0, "Margin must be non-negative")
      .nullable(),
    maximum_quantity: yup
      .number()
      .transform((v, o) => (String(o).trim() === "" ? null : v))
      .typeError("Maximum quantity must be a number")
      .min(1, "Maximum quantity must be at least 1")
      .nullable(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(Schema),
    mode: "onChange",
    defaultValues: {
      marketplace_name: "woocommerce",
      region: "",
    },
  });

  const priceUpdate = watch("enable_price_update");
  const quantityUpdate = watch("enable_quantity_update");
  const enforcementCheck = watch("wc_map_enforcement");
  const msrpCheck = watch("wc_auto_populate_msrp");
  const sendMinPriceCheck = watch("send_min_price");
  const wcConsumerUrl = watch("wc_consumer_url");
  const wcConsumerKey = watch("wc_consumer_key");
  const wcConsumerSecret = watch("wc_consumer_secret");

  const marketList = useMarketplaceStore((state) => state.marketList);

  const loadExistingEnrolment = useCallback(async () => {
    if (!userId || !token || marketList === true) {
      setInitialLoading(false);
      return;
    }

    try {
      setInitialLoading(true);
      const response = await marketplaceEnrolment(userId, "woocommerce");

      if (response && response.status === 200) {
        const data = response.data;

        const formPayload = {
          marketplace_name: data.marketplace_name || "woocommerce",
          region: data.region || "",
          wc_consumer_url: data.wc_consumer_url || "",
          wc_consumer_key: data.wc_consumer_key || "",
          wc_consumer_secret: data.wc_consumer_secret || "",
          fixed_percentage_markup:
            data.fixed_percentage_markup != null
              ? String(data.fixed_percentage_markup)
              : "",
          fixed_markup:
            data.fixed_markup != null ? String(data.fixed_markup) : "",
          enable_price_update: Boolean(data.enable_price_update),
          enable_quantity_update: Boolean(data.enable_quantity_update),
          wc_map_enforcement: Boolean(data.wc_map_enforcement),
          wc_auto_populate_msrp: Boolean(data.wc_auto_populate_msrp),
          send_min_price: Boolean(data.send_min_price),
          RIO_strategy: data.RIO_strategy || "",
          min_profit_mergin:
            data.min_profit_mergin != null
              ? String(data.min_profit_mergin)
              : "",
          profit_margin:
            data.profit_margin != null ? String(data.profit_margin) : "",
          maximum_quantity:
            data.maximum_quantity != null ? String(data.maximum_quantity) : "",
          wc_product_status: data.wc_product_status || "Publish",
        };

        reset(formPayload);

        setPrice(Boolean(data.enable_price_update));
        setQuantity(Boolean(data.enable_quantity_update));
        setEnforcement(Boolean(data.wc_map_enforcement));
        setMsrp(Boolean(data.wc_auto_populate_msrp));
        setSendMinPrice(Boolean(data.send_min_price));
        setSelectedCountry(data.region || "");
        setProductStatus(data.wc_product_status || "Publish");
        setHasExistingEnrolment(true);

        toast.success("Previous enrolment filled");
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Failed to load enrolment", err);
        toast.error("Could not load previous settings");
      }
    } finally {
      setInitialLoading(false);
    }
  }, [userId, token, reset]);

  useEffect(() => {
    loadExistingEnrolment();
  }, [loadExistingEnrolment]);

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }

    let normalizedUrl = data.wc_consumer_url?.trim() || "";
    if (normalizedUrl && !/^(https?:\/\/)/i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const payload = {
      marketplace_name: data.marketplace_name || null,
      wc_consumer_url: normalizedUrl || null,
      wc_consumer_key: data.wc_consumer_key || null,
      wc_consumer_secret: data.wc_consumer_secret || null,
      fixed_percentage_markup: data.fixed_percentage_markup ?? null,
      fixed_markup: data.fixed_markup ?? null,
      send_min_price: sendMinPrice,
      RIO_strategy: data.RIO_strategy || null,
      min_profit_mergin: data.min_profit_mergin ?? null,
      profit_margin: data.profit_margin ?? null,
      maximum_quantity: data.maximum_quantity ?? null,
      wc_product_status: productStatus,
      region: selectedCountry || null,
      store_id: null,
      enable_price_update: priceUpdate || false,
      enable_quantity_update: quantityUpdate || false,
      wc_map_enforcement: enforcementCheck || false,
      wc_auto_populate_msrp: msrpCheck || false,
      store_logo: null,
    };

    try {
      setLoading(true);
      const response = hasExistingEnrolment
        ? await marketplaceEnrolment(userId, "woocommerce", payload)
        : await woocommerceEnrolment(userId, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("WooCommerce account configured successfully! 🎉");
        navigate("/marketplace/success");
      } else {
        const result = response.data;
        if (result === "User is already enrolled in WooCommerce marketplace.") {
          toast.error(result);
        } else {
          toast.error("Failed to enroll Woocommerce");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error – please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    const val = e.target.value;
    setSelectedCountry(val);
    setValue("region", val);
  };

  const toggleStatusDropdown = () =>
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  const handleStatusSelect = (status) => {
    setProductStatus(status);
    setValue("wc_product_status", status);
    setIsStatusDropdownOpen(false);
  };

  const handleCreateAPIKeys = async () => {
    const urlValue = wcConsumerUrl?.trim();
    if (!urlValue) {
      toast.error("Please enter a Site URL first.");
      return;
    }

    const withProto = /^(https?:\/\/)/i.test(urlValue)
      ? urlValue
      : `https://${urlValue}`;

    try {
      const url = new URL(withProto);
      const domainRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
      if (!domainRegex.test(url.hostname)) throw new Error("invalid");

      setApiKeysLoading(true);
      const target = `${url.origin}/wp-admin/admin.php?page=wc-settings&tab=advanced&section=keys`;
      window.open(target, "_blank");
    } catch {
      toast.error("Invalid URL – e.g. https://example.com");
    } finally {
      setApiKeysLoading(false);
    }
  };

  const handleConnectStore = async () => {
    setConnectStoreLoading(true);

    try {
      const res = await testWoocommerceConnection(userId);

      toast.success(res.data?.message || "WooCommerce connection successful");
    } catch (err) {
      toast.error("Failed to connect to WooCommerce");
    } finally {
      setConnectStoreLoading(false);
    }
  };

  return (
    <>
      <style>{`
        select option { max-width: 100%; }
        .dropdown-menu { max-height: 150px; overflow-y: auto; }
      `}</style>

      <Toaster position="top-right" richColors closeButton />
      <div className="pb-10">
        <div className="flex justify-between items-center mt-5 mb-3">
          <div className="flex items-center gap-4">
            <Link
              to="/layout/mymarket"
              className="flex items-center gap-2 mt-5 bg-[#BB8232] rounded-lg text-white p-2"
            >
              <ArrowLeft size={20} />
              Return
            </Link>
          </div>
          <p className="relative lg:top-4 lg:left-0 md:left-10 font-bold text-xl">
            Edit Woocommerce
          </p>
        </div>
        <section className="bg-white shadow-lg px-2 w-full py-2 rounded-[10px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white lg:w-[100%] w-[93%] md:w-[90%] lg:ms-0 md:ms-10 ms-3">
              <h1 className="lg:text-xl text-sm font-bold border-b-1 px-4">
                Account Information
              </h1>

              <section className="grid grid-cols-12 justify-center items-center gap-6 my-10 px-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                  <label
                    htmlFor="marketplace_name"
                    className="text-sm font-semibold w-full sm:w-40"
                  >
                    Marketplace Name:
                  </label>
                  <div className="w-full sm:flex-1">
                    <input
                      id="marketplace_name"
                      {...register("marketplace_name")}
                      type="text"
                      value="woocommerce"
                      readOnly
                      className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] text-gray-500 cursor-not-allowed focus:outline-none py-1 rounded"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                  <label
                    htmlFor="region"
                    className="text-sm font-semibold w-full sm:w-40"
                  >
                    Marketplace Region:
                  </label>
                  <div className="w-full sm:flex-1 relative">
                    <Select
                      id="region"
                      {...register("region")}
                      defaultValue=""
                      className="w-full"
                      onChange={handleCountryChange}
                    >
                      <option value="">
                        Select Country
                      </option>
                      {countries.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </Select>
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xl text-gray-500">
                      <MdArrowDropDown />
                    </span>
                    {errors.region && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.region.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-6 md:col-span-12 col-span-12">
                  <div className="flex flex-col sm:flex-row items-start gap-4 md:col-span-6 col-span-12">
                    <label
                      htmlFor="wc_consumer_url"
                      className="text-sm font-semibold w-full sm:w-40 mt-[7px]"
                    >
                      Site URL:
                    </label>
                    <div className="w-full sm:flex-1">
                      <div className="relative">
                        <input
                          id="wc_consumer_url"
                          {...register("wc_consumer_url")}
                          type="text"
                          className={`border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded ${
                            errors.wc_consumer_url ? "border-red-400" : ""
                          }`}
                        />
                      </div>
                      <div className="h-[18px] mt-1">
                        {errors.wc_consumer_url && (
                          <p className="text-red-500 text-xs">
                            {errors.wc_consumer_url.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-3 md:col-span-6 col-span-12 justify-start sm:justify-start md:justify-start mb-10">
                    <button
                      type="button"
                      onClick={handleCreateAPIKeys}
                      disabled={apiKeysLoading}
                      className={`bg-[#089451] text-white border py-1 px-3 rounded font-bold w-[10rem] border-[#089451] transition-colors h-[35px] whitespace-nowrap text-sm flex items-center justify-center gap-2 ${
                        apiKeysLoading ? "opacity-75" : ""
                      }`}
                    >
                      {apiKeysLoading ? (
                        <>
                          <span>Redirecting</span>
                          <ThreeDots height="20" width="20" color="#fff" />
                        </>
                      ) : (
                        "Create API Keys"
                      )}
                    </button>

                    <ResponsiveTooltip
                      title={`Open WooCommerce → Settings → Advanced → REST API → Add Key`}
                    >
                      <MdInfo className="text-gray-500 text-xl cursor-pointer" />
                    </ResponsiveTooltip>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                  <label
                    htmlFor="wc_consumer_key"
                    className="text-sm font-semibold w-full sm:w-40"
                  >
                    Consumer Key:
                  </label>
                  <div className="w-full sm:flex-1">
                    <input
                      id="wc_consumer_key"
                      {...register("wc_consumer_key")}
                      type="text"
                      className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded"
                    />
                    {errors.wc_consumer_key && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.wc_consumer_key.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                  <label
                    htmlFor="wc_consumer_secret"
                    className="text-sm font-semibold w-full sm:w-40"
                  >
                    Consumer Secret:
                  </label>
                  <div className="w-full sm:flex-1">
                    <input
                      id="wc_consumer_secret"
                      {...register("wc_consumer_secret")}
                      type="password"
                      className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded"
                    />
                    {errors.wc_consumer_secret && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.wc_consumer_secret.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-row items-center justify-center gap-3 md:col-span-12 col-span-12">
                  <button
                    type="button"
                    onClick={handleConnectStore}
                    disabled={connectStoreLoading}
                    className="bg-[#089451] text-white border py-1 px-3 rounded font-bold border-[#089451] transition-colors h-[35px] whitespace-nowrap text-sm flex items-center justify-center gap-2 w-[8rem]"
                  >
                    {connectStoreLoading ? (
                      <ThreeDots height="20" width="20" color="#fff" />
                    ) : (
                      "Test Connection"
                    )}
                  </button>
                </div>
              </section>

              <h1 className="lg:text-xl font-bold mt-5 border-b-1 px-4">
                Processing Fees
              </h1>
              <section className="grid grid-cols-12 justify-center items-center gap-6 my-5 px-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                  <label
                    htmlFor="fixed_percentage_markup"
                    className="text-sm font-semibold w-full sm:w-40"
                  >
                    Fixed (%):
                  </label>
                  <div className="w-full sm:flex-1">
                    <input
                      id="fixed_percentage_markup"
                      {...register("fixed_percentage_markup")}
                      type="number"
                      step="0.01"
                      className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded"
                    />
                    {errors.fixed_percentage_markup && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.fixed_percentage_markup.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                  <label
                    htmlFor="fixed_markup"
                    className="text-sm font-semibold w-full sm:w-40"
                  >
                    Fixed ($):
                  </label>
                  <div className="w-full sm:flex-1">
                    <input
                      id="fixed_markup"
                      {...register("fixed_markup")}
                      type="number"
                      step="0.01"
                      className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded"
                    />
                    {errors.fixed_markup && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.fixed_markup.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <h1 className="lg:text-xl font-bold mt-10 border-b-1 px-4">
                Marketplace Options
              </h1>
              <section className="grid grid-cols-12 justify-center items-center gap-6 my-5 px-4">
                <div className="flex flex-col gap-6 col-span-12">
                  <div className="flex items-center gap-20">
                    <label className="text-sm font-semibold w-full sm:w-40">
                      Enable Price Update:
                    </label>
                    <input
                      {...register("enable_price_update")}
                      type="checkbox"
                      checked={price}
                      onChange={(e) => {
                        setPrice(e.target.checked);
                        setValue("enable_price_update", e.target.checked);
                      }}
                      className="appearance-none md:w-5 w-6 h-5 rounded-[4px] border-2 border-[#027840] bg-white cursor-pointer relative checked:bg-[#027840] checked:border-[#027840] checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/5"
                      aria-label="Enable automatic price updates"
                    />
                  </div>

                  <div className="flex items-center gap-20">
                    <label className="text-sm font-semibold w-full sm:w-40">
                      Enable Quantity Update:
                    </label>
                    <input
                      {...register("enable_quantity_update")}
                      type="checkbox"
                      checked={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.checked);
                        setValue("enable_quantity_update", e.target.checked);
                      }}
                      className="appearance-none md:w-5 w-6 h-5 rounded-[4px] border-2 border-[#027840] bg-white cursor-pointer relative checked:bg-[#027840] checked:border-[#027840] checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/5"
                      aria-label="Enable automatic quantity updates"
                    />
                  </div>

                  <div className="flex items-center gap-20">
                    <label className="text-sm font-semibold w-full sm:w-40">
                      Send Minimum Price:
                    </label>
                    <input
                      {...register("send_min_price")}
                      type="checkbox"
                      checked={sendMinPrice}
                      onChange={(e) => {
                        setSendMinPrice(e.target.checked);
                        setValue("send_min_price", e.target.checked);
                      }}
                      className="appearance-none md:w-5 w-6 h-5 rounded-[4px] border-2 border-[#027840] bg-white cursor-pointer relative checked:bg-[#027840] checked:border-[#027840] checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/5"
                      aria-label="Enable send minimum price"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                  <label
                    htmlFor="RIO_strategy"
                    className="text-sm font-semibold w-full sm:w-40"
                  >
                    ROI Strategy:
                  </label>
                  <div className="w-full sm:flex-1 relative">
                    <select
                      id="RIO_strategy"
                      {...register("RIO_strategy")}
                      className="px-2 w-full h-[38px] bg-[#F9F9F9] border border-gray-300 rounded shadow-sm focus:outline-none appearance-none"
                    >
                      <option value="">Select ROI Strategy</option>
                      <option value="getsend_min_price">Send Min Price</option>
                      <option value="ROI Margin">ROI Margin</option>
                      <option value="ROI Fixed">ROI Fixed</option>
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xl text-gray-500">
                      <MdArrowDropDown />
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                  <label
                    htmlFor="min_profit_mergin"
                    className="text-sm font-semibold w-full sm:w-40"
                  >
                    Min Profit Margin (%):
                  </label>
                  <div className="w-full sm:flex-1">
                    <input
                      id="min_profit_mergin"
                      {...register("min_profit_mergin")}
                      type="number"
                      step="0.01"
                      className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded"
                    />
                    {errors.min_profit_mergin && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.min_profit_mergin.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                  <label
                    htmlFor="profit_margin"
                    className="text-sm font-semibold w-full sm:w-40"
                  >
                    Margin (%):
                  </label>
                  <div className="w-full sm:flex-1">
                    <input
                      id="profit_margin"
                      {...register("profit_margin")}
                      type="number"
                      step="0.01"
                      className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded"
                    />
                    {errors.profit_margin && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.profit_margin.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-6 col-span-12">
                  <div className="flex items-center gap-20">
                    <label className="text-sm font-semibold w-full sm:w-40">
                      Map Enforcement:
                    </label>
                    <input
                      {...register("wc_map_enforcement")}
                      type="checkbox"
                      checked={enforcement}
                      onChange={(e) => {
                        setEnforcement(e.target.checked);
                        setValue("wc_map_enforcement", e.target.checked);
                      }}
                      className="appearance-none md:w-5 w-6 h-5 rounded-[4px] border-2 border-[#027840] bg-white cursor-pointer relative checked:bg-[#027840] checked:border-[#027840] checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/5"
                      aria-label="Enable map enforcement"
                    />
                  </div>

                  <div className="flex items-center gap-20">
                    <label className="text-sm font-semibold w-full sm:w-40">
                      Auto Populate MSRP:
                    </label>
                    <input
                      {...register("wc_auto_populate_msrp")}
                      type="checkbox"
                      checked={msrp}
                      onChange={(e) => {
                        setMsrp(e.target.checked);
                        setValue("wc_auto_populate_msrp", e.target.checked);
                      }}
                      className="appearance-none md:w-5 w-6 h-5 rounded-[4px] border-2 border-[#027840] bg-white cursor-pointer relative checked:bg-[#027840] checked:border-[#027840] checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                      aria-label="Enable auto populate MSRP"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                  <label
                    htmlFor="maximum_quantity"
                    className="text-sm font-semibold w-full sm:w-40"
                  >
                    Maximum Quantity:
                  </label>
                  <div className="w-full sm:flex-1">
                    <input
                      id="maximum_quantity"
                      {...register("maximum_quantity")}
                      type="number"
                      step="1"
                      className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded"
                    />
                    {errors.maximum_quantity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.maximum_quantity.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-12 justify-center items-center gap-6 my-5 px-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 md:col-span-6 col-span-12">
                  <label
                    htmlFor="wc_product_status"
                    className="text-sm font-semibold w-full sm:w-40"
                  >
                    Product Status:
                  </label>
                  <div className="w-full sm:flex-1 relative">
                    <input
                      type="hidden"
                      {...register("wc_product_status")}
                      value={productStatus}
                    />
                    <button
                      type="button"
                      onClick={toggleStatusDropdown}
                      className="border border-gray-300 h-[35px] w-full px-2 bg-[#F9F9F9] focus:outline-none py-1 rounded flex items-center justify-between"
                    >
                      <span>{productStatus}</span>
                      <span className="text-xl text-gray-500">
                        {isStatusDropdownOpen ? (
                          <MdArrowDropUp />
                        ) : (
                          <MdArrowDropDown />
                        )}
                      </span>
                    </button>

                    {isStatusDropdownOpen && (
                      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg dropdown-menu">
                        {["Publish", "Draft", "Pending Review"].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleStatusSelect(s)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <div className="flex gap-20 justify-center my-5">
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    bg-[#089451] text-white px-16 py-2 rounded-lg 
                    transition-all duration-200 ease-in-out
                    flex items-center justify-center gap-2 font-medium
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:bg-green-700 hover:shadow-md active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                  `}
                  aria-busy={loading}
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V4l3 3-3 3V4a8 8 0 00-8 8h4l-3-3 3-3H4z"
                      />
                    </svg>
                  )}
                  {loading
                    ? "Submitting..."
                    : hasExistingEnrolment
                      ? "Update"
                      : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default Woocommerce;
