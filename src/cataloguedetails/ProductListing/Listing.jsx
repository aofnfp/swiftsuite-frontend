import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import gif from "../../Images/gif.gif";
import "react-quill/dist/quill.snow.css";
import ProductImageUpload from "./ProductImageUpload";
import PricingSku from "./PricingSku";
import { Toaster, toast } from "sonner";
import DynamicProductInputs from "./DynamicProductsInput";
import { buildListingData, buildWoocommerceData, buildUpdateData, buildWoocommerceUpdate } from "./listingDataBuilder";
import { enrolledMarketplaces, fetchItemLeafCategory, fetchProductListing, fetchProductUpdate, fetchUserCategoryId, getWooCommerecCategoryName, marketplaceProductListing, marketplaceProductSaving, marketPlaceProductUpdate, userCategoriesId } from "../../api/authApi";
import { handleApiError } from "../../utils/handleError";
import { mergeSavedAndSelected, normalizeKeys, safeJSONParse } from "../../utils/utils";
import SubscriptionModal from "../../pages/SubscriptionModal";
import { useSelector } from "react-redux";
import { useListingStore } from "../../stores/listingStore";
import TitleSection from "./TitleSection";
import DescriptionSection from "./DescriptionSection";
import MarketplaceSelector from "./MarketplaceSelector";
import PreferencesSection from "./PreferencesSection";
import ItemSpecificsSection from "./ItemSpecificsSection";
import WooSection from "./WooSection";
import ActionsSection from "./ActionsSection";
import ListingSPecifications from "./ListingSPecifications";

const Listing = () => {
  const { productId } = useParams();
  const { subscribed } = useSelector((state) => state.permission);

  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userId");

  const token = localStorage.getItem("token");
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [productListing, setProductListing] = useState("")
  const isMappingChecked = useListingStore((state) => state.isMappingChecked);
  const setIsMappingChecked = useListingStore((state) => state.setIsMappingChecked);
  const isGiftChecked = useListingStore((state) => state.isGiftChecked);
  const setIsGiftChecked = useListingStore((state) => state.setIsGiftChecked);
  const bestOfferEnabled = useListingStore((state) => state.bestOfferEnabled);
  const setBestOfferEnabled = useListingStore((state) => state.setBestOfferEnabled);
  const enableCharity = useListingStore((state) => state.enableCharity);
  const description = useListingStore((state) => state.description);
  const setDescription = useListingStore((state) => state.setDescription);
  const setEnableCharity = useListingStore((state) => state.setEnableCharity);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subcategories, setSubcategories] = useState([]) || [];
  const [middleCategories, setMiddleCategories] = useState([]) || [];
  const [lastCategories, setLastCategories] = useState([]) || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemSpecificFields, setItemSpecificFields] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [firstCategory, setFirstCategory] = useState([]) || [];
  const [filterValues, setFilterValues] = useState({});
  const [itemCategory, setItemCategory] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [isEbay, setIsEbay] = useState(false);
  const [isShopify, setIsShopify] = useState(false);
  const [isWoocommerce, setIsWoocommerce] = useState(false);
  const [isWalmart, setIsWalmart] = useState(false);
  const [isAmazon, setIsAmazon] = useState(false);
  const [isEbayOpen, setIsEbayOpen] = useState(false);
  const [isWoocommerceOpen, setIsWoocommerceOpen] = useState(false);
  const [handleSubmitLoader, setHandleSubmitLoader] = useState(false);
  const [handleSaveListingLoader, setHandleSaveListingLoader] = useState(false);
  const [handleUpdateLoader, setHandleUpdateLoader] = useState(false);
  const [useSavedItem, setUseSavedItem] = useState(false);
  const thumbnailImage = useListingStore((state) => state.thumbnailImage);
  const setThumbnailImage = useListingStore((state) => state.setThumbnailImage);
  const wcAttributes = useListingStore((state) => state.wcAttributes);
  const setWcAttributes = useListingStore((state) => state.setWcAttributes);
  const [customInputValues, setCustomInputValues] = useState({});
  const [newItemSpecific, setNewItemSpecific] = useState(false);
  const maxLength = 80;
  const title = useListingStore((state) => state.title);
  const setTitle = useListingStore((state) => state.setTitle);
  const [remaining, setRemaining] = useState(maxLength - (productListing?.title?.length || 0));
  const [handleChange, setHandleChange] = useState("");
  const [isTitleDirty, setIsTitleDirty] = useState(false);
  const prevProductId = useRef(null);
  const [logos, setLogos] = useState({});
  const [wooCategories, setWooCategories] = useState([]);
  const [loadingWooCategories, setLoadingWooCategories] = useState(false);
  const selectedWooCategories = useListingStore((state) => state.selectedWooCategories);
  const setSelectedWooCategories = useListingStore((state) => state.setSelectedWooCategories);
  const [marketplacesEnrolled, setMarketplacesEnrolled] = useState([]);
  const [showModals, setShowModals] = useState(false);

  const dropdownRef = useRef(null);

  const convertWcAttributesToObject = (attrs = []) => {
    if (!Array.isArray(attrs)) return {};
    return attrs.reduce((acc, cur) => {
      const label = (cur?.label || "").toString().trim();
      const value = cur?.value ?? "";
      if (label) acc[label] = value;
      return acc;
    }, {});
  };

  useEffect(() => {
    if (!subscribed) setShowModals(true);
  }, [subscribed]);
  
  useEffect(() => {
    setIsEbay(!!logos?.Ebay || productListing?.market_name === 'Ebay');
    setIsShopify(!!logos?.Shopify_logo || productListing?.market_name === 'Shopify');
    setIsWoocommerce(!!logos?.Woocommerce_logo || productListing?.market_name === 'Woocommerce');
    setIsWalmart(!!logos?.Walmart_logo || productListing?.market_name === 'Walmart');
    setIsAmazon(!!logos?.Amazon_logo || productListing?.market_name === 'Amazon');
  }, [logos]);

  useEffect(() => {
    if (
      productListing?.enable_best_offer ||
      productListing?.bestOfferEnabled ||
      productListing?.bestofferenabled
    ) {
      setBestOfferEnabled(true);
    }
  }, [productListing]);

  useEffect(() => {
    if (productListing?.enable_charity) {
      setEnableCharity(true);
    }
  }, [productListing]);

  useEffect(() => {
    const currentProductId = productListing?.product_id || productId || null;
    if (prevProductId.current !== currentProductId) {
      prevProductId.current = currentProductId;
      setIsTitleDirty(false);
    }

    if (!isTitleDirty) {
      let newTitle = productListing?.title || "";
      setTitle(newTitle);
      setRemaining(maxLength - newTitle.length);
    }
  }, [productListing, isTitleDirty, productId]);

  useEffect(() => {
    getMarketplacesEnrolled(); 
  }, []);

  const handleTitleChange = (e) => {
    let newValue = e.target.value;
    setTitle(newValue);
    setRemaining(maxLength - newValue.length);
    setIsTitleDirty(true);
  };

   const getMarketplacesEnrolled = async () => {
      try {
        const response = await enrolledMarketplaces(userId);
        const marketplaces = response.enrollment_detail || [];
        const transformedMarketplaces = marketplaces.map((marketplace) => ({
          endpointName: marketplace,
          name: marketplace.toLowerCase(),
        }));
        setMarketplacesEnrolled(transformedMarketplaces);
      } catch (err) {
      }
    };

  const hasMarketplace = (platform) => marketplacesEnrolled?.some((marketplace) => marketplace.endpointName.toLowerCase() === platform.toLowerCase());  
  
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if click is outside both dropdown and its trigger button
      const isDropdownButton = event.target.closest(".dropdown-trigger");
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !isDropdownButton
      ) {
        setIsDropdownOpen(null);
        setFilterValues({});
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleDescriptionChange = (value) => {
    setDescription(value);
    setProductListing((prev) => ({ ...prev, detailed_description: value }));
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const isFromEdit = location.state?.isFromEdit || false;
      const isFromUpdate = location.state?.isFromUpdate || false;
      try {
        if (isFromUpdate) {
          await fetchProductForUpdate(productId);
        } else if (isFromEdit) {
          await fetchSavedProducts(productId);
        } else {
          await fetchProductDetails();
        }
      } catch (error) {
        toast.error("Error fetching product listing details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId, location.state]);

  const fetchProductForUpdate = async (productId) => {
    try {
      const response = await fetchProductUpdate(productId);
      const savedItem = response?.saved_items?.[0];
      if (!savedItem) {
        toast.error("No product found.");
        return;
      }
      const logos = safeJSONParse(savedItem?.market_logos);
      if (logos) {
      setLogos(logos);
      } else {
      setLogos({}); 
      }
      let item_specific = {};
      if (savedItem.item_specific_fields) {
        try {
          const cleanedString = savedItem.item_specific_fields.replace(/'/g, '"').replace(/\\/g, "\\\\");
          const parsed = JSON.parse(cleanedString);
          setUseSavedItem(parsed);
          item_specific = normalizeKeys(parsed);
          setNewItemSpecific(item_specific);
        } catch (parseError) { }
      }
      const { item_specific_fields, ...rest } = savedItem;
      const mergedProduct = { ...normalizeKeys(rest), ...item_specific };
      setProductListing(mergedProduct);
    } catch (error) {
      toast.error("Failed to load products details");
    }
  };

  const fetchSavedProducts = async (productId) => {
    try {
      const response = await fetchProductUpdate(productId);
      const savedItem = response?.saved_items?.[0];
      if (!savedItem) {
        toast.error("No saved product found.");
        return;
      }
      if (savedItem?.market_logos && savedItem?.market_logos !== "Null") {
        const logos = JSON.parse(savedItem?.market_logos);
        setLogos(logos);
      } else {
        setLogos({});
      }
      let item_specific = {};
      if (savedItem.item_specific_fields) {
        try {
          const cleanedString = savedItem.item_specific_fields.replace(/'/g, '"').replace(/\\/g, "\\\\");
          const parsed = JSON.parse(cleanedString);
          setUseSavedItem(parsed);
          item_specific = normalizeKeys(parsed);
          setNewItemSpecific(item_specific);
        } catch (parseError) { }
      }
      const { item_specific_fields, ...rest } = savedItem;
      const mergedProduct = { ...normalizeKeys(rest), ...item_specific };
      setProductListing(mergedProduct);
    } catch (error) {
      toast.error("Failed to load product details");
    }
  };

  const fetchProductDetails = async () => {
    if (!token) {
      navigate("/signin");
      return;
    }
    if (!userId || !productId) {
      toast.error("Invalid userId or productId");
      return;
    }
    try {
      const response = await fetchProductListing(userId, productId);
      const productInfo = response?.product_info[0];
      const vendorDetails = response.vendor_details[0];
      const ebayInfo = response?.ebay_info[0];
      const policyInfo = response?.policies_info[0];
      const paymentPolicy = ebayInfo?.payment_policy ? JSON.parse(ebayInfo.payment_policy) : null;
      const returnPolicy = ebayInfo?.return_policy ? JSON.parse(ebayInfo.return_policy) : null;
      const shippingPolicy = ebayInfo?.shipping_policy ? JSON.parse(ebayInfo.shipping_policy) : null;
      const vendor_location = response.vendor_details[0].vendor_location[0];
      setProductListing({
        ...ebayInfo,
        ...vendorDetails,
        ...vendor_location,
        payment_policy: paymentPolicy,
        return_policy: returnPolicy,
        shipping_policy: shippingPolicy,
        policyInfo,
        ...productInfo,
      });
    } catch (error) {
      if (error.response.data) {
        toast.error(`${error.response.data}`);
        return;
      } else if (error.response.data.message) {
        toast.error(`${error.response.data.message}`);
        return;
      } else {
        toast.error(
          "Error fetching product listing details, please try again."
        );
        return;
      }
    }
  };

  const productImageUploadId = location.state?.isFromEdit || location.state?.isFromUpdate ? productListing?.product_id : productId;

  const toggleDropdown = (fieldName, e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDropdownOpen((prev) => (prev === fieldName ? null : fieldName));
  };

  const handleSelectChange = (fieldName, label) => {
    setSelectedValues((prev) => ({ ...prev, [fieldName]: label }));
    setCustomInputValues((prev) => ({ ...prev, [fieldName]: "" }));
    setFilterValues((prev) => ({ ...prev, [fieldName]: "" }));
    setIsDropdownOpen(null);
  };

  const filteredOptions = (fieldName, options) => {
    const filterValue = filterValues[fieldName]?.toLowerCase() || "";
    return Object.entries(options).filter(([key, label]) =>
      label.toLowerCase().includes(filterValue)
    );
  };

  const handleListingChange = (e) => {
    const { name, value } = e.target;
    setProductListing((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenModal = async () => {
    const userCategoryId = productListing.category_id;
    setIsLoadingCategory(true);
    try {
      if (userCategoryId) {
        const response = await userCategoriesId(userId, userCategoryId);
        const itemSpecificArray = response?.item_specifics || [];
        const validChoices = response?.valid_choices || {};
        const formattedFields = {};
        // Set each field with empty string as default value
        itemSpecificArray.forEach((field) => {
          formattedFields[field] = "";
        });
        Object.entries(validChoices).forEach(([key, options]) => {
          formattedFields[key] = Array.isArray(options) ? options : "";
        });
        setItemSpecificFields(formattedFields);
        toast.success("Fetched successfully");
        setIsModalOpen(false);
      } else {
        setLoader(true);
        setIsModalOpen(true);
        const response = await fetchUserCategoryId(userId, productImageUploadId);
        const isValidCategory = response?.category_info?.offset === 0 || response?.category_info?.total === 0 || response?.category_info?.errors;
        if (isValidCategory) {
          toast.error(`${response?.category_info?.errors[0].longMessage || "No categories found"}`);
          setIsModalOpen(false);
          return;
        }
        setFirstCategory(response.category_info);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message || "An error occurred");
    } finally {
      setIsLoadingCategory(false);
      setLoader(false);
    }
  };

  const handleFirstCategoryClick = async (categoryId) => {
    setLoader(true);
    try {
      const response = await fetchItemLeafCategory(userId, categoryId);
      const fetchedSubcategories = response?.More_subcategory || [];
      if (fetchedSubcategories.length > 0) {
        setSubcategories(fetchedSubcategories);
        setLoader(false);
        return;
      }
      const specificFieldsResponse = await userCategoriesId(userId, categoryId);
      handleListingChange({
        target: { name: "category_id", value: categoryId },
      });
      const itemSpecificArray = specificFieldsResponse?.item_specifics || [];
      const validChoices = specificFieldsResponse?.valid_choices || {};

      let formattedFields = {};
      // Convert item_specifics (Array) to input fields
      itemSpecificArray.forEach((field) => {
        formattedFields[field] = "";
      });
      Object.entries(validChoices).forEach(([key, options]) => {
        formattedFields[key] = Array.isArray(options) ? options : "";
      });
      setItemSpecificFields(formattedFields);
      toast.success("Fetched successfully");
      setLoader(false);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error fetching item specific fields");
      setLoader(false);
    }
  };

  const handleCategoryClick = async (categoryId) => {
    setLoader(true);
    try {
      const response = await fetchItemLeafCategory(userId, categoryId);
      const fetchedMiddleCategories = response?.More_subcategory || [];
      if (fetchedMiddleCategories.length > 0) {
        setMiddleCategories(fetchedMiddleCategories);
        setLoader(false);
        return;
      }
      const specificFieldsResponse = await userCategoriesId(userId, categoryId);
      handleListingChange({ target: { name: "category_id", value: categoryId } });
      const itemSpecificArray = specificFieldsResponse?.item_specifics || [];
      const validChoices = specificFieldsResponse?.valid_choices || {};
      let formattedFields = {};
      itemSpecificArray.forEach((field) => {
        formattedFields[field] = "";
      });
      Object.entries(validChoices).forEach(([key, options]) => {
        formattedFields[key] = Array.isArray(options) ? options : "";
      });
      setItemSpecificFields(formattedFields);
      toast.success("Fetched successfully");
      setLoader(false);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error fetching category data");
      setLoader(false);
    }
  };

  const handleMiddleCategoryClick = async (categoryId) => {
    setLoader(true);
    try {
      const response = await fetchItemLeafCategory(userId, categoryId);
      const fetchedLastCategories = response?.Last_subcategory || [];
      if (fetchedLastCategories.length > 0) {
        setLastCategories(fetchedLastCategories);
        setLoader(false);
        return;
      }
      const specificFieldsResponse = await userCategoriesId(userId, categoryId);
      handleListingChange({
        target: { name: "category_id", value: categoryId },
      });
      const itemSpecificArray = specificFieldsResponse?.item_specifics || [];
      const validChoices = specificFieldsResponse?.valid_choices || {};

      let formattedFields = {};

      itemSpecificArray.forEach((field) => {
        formattedFields[field] = "";
      });
      Object.entries(validChoices).forEach(([key, options]) => {
        formattedFields[key] = Array.isArray(options) ? options : "";
      });
      setItemSpecificFields(formattedFields);
      toast.success("Fetched successfully");
      setLoader(false);
      setIsModalOpen(false);
    } catch (error) {
      setLoader(false);
    }
  };

  const handleLastCategoryClick = async (categoryId) => {
    setLoader(true);
    try {
      const specificFieldsResponse = await userCategoriesId(userId, categoryId);
      handleListingChange({
        target: { name: "category_id", value: categoryId },
      });
      const itemSpecificFields =
        specificFieldsResponse?.item_specific_fields || [];
      const validChoices = specificFieldsResponse?.valid_choices || {};
      let formattedFields = {};
      itemSpecificFields.forEach((field) => {
        formattedFields[field] = "";
      });
      Object.entries(validChoices).forEach(([key, options]) => {
        formattedFields[key] = Array.isArray(options) ? options : "";
      });
      setItemSpecificFields(formattedFields);
      toast.success("Fetched successfully");
      setIsModalOpen(false);
      setLoader(false);
    } catch (error) {
      toast.error("An error occurred while fetching specific fields.");
    } finally {
      setLoader(false);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFirstCategory([]);
    setSubcategories([]);
    setMiddleCategories([]);
    setLastCategories([]);
  };

  const market_logos = {
    ebay_logo: isEbay ? "https://i.postimg.cc/3xZSgy9Z/ebay.png" : false,
    shopify_logo: isShopify ? "https://i.postimg.cc/ZqRGnFZN/shopify.png" : false,
    woocommerce_logo: isWoocommerce ? "https://i.postimg.cc/Wbfbs7QB/woocommerce.png" : false,
    walmart_logo: isWalmart ? "https://i.postimg.cc/vZpK8RPJ/walmart.png" : false,
    amazon_logo: isAmazon ? "https://i.postimg.cc/JzYvBDpB/amazon.png" : false,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submittingProduct = location.state?.isFromEdit ? mergeSavedAndSelected(useSavedItem, selectedValues) : selectedValues;
    if (!isEbay && !isShopify && !isWoocommerce && !isWalmart && !isAmazon) {
      toast.error("Please select at least one marketplace");
      return;
    }
    const category_id = productListing?.category_id;
    const id = location.state?.isFromEdit ? productListing?.product_id : productListing?.id;
    if (isEbay && !category_id) {
      toast.error("Please enter a category id");
      return;
    }
    if (isWoocommerce && (!selectedWooCategories || selectedWooCategories.length === 0)) {
      toast.error("Please select WooCommerce category");
      return;
    };
    setHandleSubmitLoader(true);
    const listingData = buildListingData(productListing, title, bestOfferEnabled, enableCharity, market_logos, id, thumbnailImage);
    const buildMarketName = () => {
      const markets = [];
      if (isEbay) markets.push("Ebay");
      if (isShopify) markets.push("Shopify");
      if (isWoocommerce) markets.push("Woocommerce");
      if (isWalmart) markets.push("Walmart");
      if (isAmazon) markets.push("Amazon");
      if (markets.length === 0) return null;
      return markets.length === 1 ? markets[0] : markets;
    };
    const market_name = buildMarketName();
    const platformParam = Array.isArray(market_name) ? "all" : market_name;
    const mergedData = isWoocommerce ? buildWoocommerceData(productListing, title, selectedWooCategories, thumbnailImage, convertWcAttributesToObject, wcAttributes, id, bestOfferEnabled, enableCharity, market_logos, isWoocommerce) : {
      ...itemCategory,
      ...handleChange,
      userId,
      product: id,
      // ...itemSpecificFields ? itemSpecificFields : {},
      ...listingData,
      ...submittingProduct,
      category_id,
      gift: isGiftChecked,
      categoryMappingAllowed: isMappingChecked,
      market_name,
      thumbnailImage: (() => {
        try {
          if (typeof thumbnailImage === 'string' && thumbnailImage.trim()) {
            const parsed = JSON.parse(thumbnailImage);
            return Array.isArray(parsed) && parsed.length > 0 ? JSON.stringify(parsed) : "Null";
          }
          return (Array.isArray(thumbnailImage) && thumbnailImage.length > 0) ? JSON.stringify(thumbnailImage) : "[]";
        } catch {
          return "Null";
        }
      })(),
    };
    try {
      const response = await marketplaceProductListing(userId, platformParam, isEbay ? category_id : isWoocommerce ? selectedWooCategories : null, mergedData);
      setHandleSubmitLoader(false);
      toast.success(response);
    } catch (error) {
      console.log(error)
      setHandleSubmitLoader(false);
      handleApiError(error);
    }
  };

  const handleSaveListing = async (e) => {
    e.preventDefault();
    const category_id = productListing?.category_id || "";
    const id = location.state?.isFromEdit ? productListing?.product_id : productListing?.id;
    const submittingProduct = location.state?.isFromEdit ? mergeSavedAndSelected(useSavedItem, selectedValues) : selectedValues;
    if (!isEbay && !isShopify && !isWoocommerce && !isWalmart && !isAmazon) {
      toast.error("Please select at least one marketplace");
      return;
    }
    if (isEbay && !category_id) {
      toast.error("Please enter a category id");
      return;
    }
    if (isWoocommerce && (!selectedWooCategories || selectedWooCategories.length === 0)) {
      toast.error("Please select WooCommerce category");
      return;
    }
    setHandleSaveListingLoader(true);
    const savingListingData = buildListingData(productListing, title, bestOfferEnabled, enableCharity, market_logos, id);
    const buildMarketName = () => {
      const markets = [];
      if (isEbay) markets.push("Ebay");
      if (isShopify) markets.push("Shopify");
      if (isWoocommerce) markets.push("Woocommerce");
      if (isWalmart) markets.push("Walmart");
      if (isAmazon) markets.push("Amazon");
      if (markets.length === 0) return null;
      return markets.length === 1 ? markets[0] : markets;
    };
    const market_name = buildMarketName();
    const platformParam = Array.isArray(market_name) ? "all" : market_name;
    const mergedSavingData = isWoocommerce ? buildWoocommerceData(productListing, title, selectedWooCategories, thumbnailImage, convertWcAttributesToObject, wcAttributes, productId, bestOfferEnabled, enableCharity, market_logos) : {
      ...itemCategory,
      ...handleChange,
      userId,
      product: productId,
      // ...itemSpecificFields ? itemSpecificFields : {},
      ...savingListingData,
      ...submittingProduct,
      category_id,
      gift: isGiftChecked,
      categoryMappingAllowed: isMappingChecked,
      thumbnailImage: (() => {
        try {
          if (typeof thumbnailImage === 'string' && thumbnailImage.trim()) {
            const parsed = JSON.parse(thumbnailImage);
            return Array.isArray(parsed) && parsed.length > 0 ? JSON.stringify(parsed) : "Null";
          }
          return (Array.isArray(thumbnailImage) && thumbnailImage.length > 0) ? JSON.stringify(thumbnailImage) : "Null";
        } catch {
          return "Null";
        }
      })(),
      ...(isWoocommerce ? { itemSpecific: convertWcAttributesToObject(wcAttributes) } : {}),
    };
    console.log(mergedSavingData)
    try {
      const response = await marketplaceProductSaving(userId, platformParam, isEbay ? category_id : isWoocommerce ? selectedWooCategories : null, mergedSavingData);
      setHandleSaveListingLoader(false);
      toast.success(response);
    } catch (error) {
      console.log(error)
      setHandleSaveListingLoader(false);
      handleApiError(error);
    }
  };

  const handleUpdateListing = async (e) => {
    e.preventDefault();
    const id = location.state?.isFromUpdate ? productListing?.product_id : productListing?.id;
    const submittingProduct = location.state?.isFromUpdate ? mergeSavedAndSelected(useSavedItem, selectedValues) : selectedValues;
    if (!isEbay && !isShopify && !isWoocommerce && !isWalmart && !isAmazon) {
      toast.error("Please select at least one marketplace");
      return;
    }
    const inventory_id = productListing?.id;
    if (!inventory_id) {
      toast.error("Please enter a category id");
      return;
    }
    if (isWoocommerce && (!selectedWooCategories || selectedWooCategories.length === 0)) {
      toast.error("Please select WooCommerce category");
      return;
    }
    setHandleUpdateLoader(true);
    const updateData = buildUpdateData(
      productListing,
      title,
      bestOfferEnabled,
      enableCharity,
      thumbnailImage,
      submittingProduct
    );
    const buildMarketName = () => {
      const markets = [];
      if (isEbay) markets.push("Ebay");
      if (isShopify) markets.push("Shopify");
      if (isWoocommerce) markets.push("Woocommerce");
      if (isWalmart) markets.push("Walmart");
      if (isAmazon) markets.push("Amazon");
      if (markets.length === 0) return null;
      return markets.length === 1 ? markets[0] : markets;
    };
    const market_name = buildMarketName();
    const platformParam = Array.isArray(market_name) ? "all" : market_name;
    const mergedData = isWoocommerce ? buildWoocommerceUpdate(productListing, title, selectedWooCategories, thumbnailImage, convertWcAttributesToObject, wcAttributes, id, bestOfferEnabled, enableCharity, market_logos) : {
      ...itemCategory,
      ...handleChange,
      userId,
      product: id,
      ...updateData,
      inventory_id,
      gift: isGiftChecked,
      categoryMappingAllowed: isMappingChecked,
      thumbnailImage: (() => {
        try {
          if (typeof thumbnailImage === 'string' && thumbnailImage.trim()) {
            const parsed = JSON.parse(thumbnailImage);
            return Array.isArray(parsed) && parsed.length > 0 ? JSON.stringify(parsed) : "[]";
          }
          return (Array.isArray(thumbnailImage) && thumbnailImage.length > 0) ? JSON.stringify(thumbnailImage) : "[]";
        } catch {
          return "[]";
        }
      })(),
      ...(isWoocommerce ? { itemSpecific: convertWcAttributesToObject(wcAttributes) } : {}),
    };
    try {
      const response = await marketPlaceProductUpdate(userId, platformParam, isEbay ? inventory_id : isWoocommerce ? inventory_id : null, mergedData);
      setHandleUpdateLoader(false);
      toast.success(response);
    } catch (error) {
      setHandleUpdateLoader(false);
      handleApiError(error);
    }
  };

  const filteredFirstCategories = firstCategory?.filter((item) => item?.categoryName && item?.categoryName?.toLowerCase()?.includes(searchQuery?.toLowerCase()));

  const filteredSubcategories = subcategories?.filter((subcategory) => subcategory?.categoryName && subcategory?.categoryName?.toLowerCase()?.includes(searchQuery?.toLowerCase()));

  const filteredMiddleCategories = middleCategories?.filter((middleCategory) => middleCategory?.categoryName && middleCategory?.categoryName?.toLowerCase()?.includes(searchQuery?.toLocaleLowerCase()));

  const filteredLastCategories = lastCategories?.filter((lastCategory) => lastCategory?.categoryName?.toLowerCase()?.includes(searchQuery?.toLowerCase()));

  const handleWooCommerceCategory = async () => {
    try {
      setLoadingWooCategories(true);
      const response = await getWooCommerecCategoryName(userId);
      setWooCategories(response.Product_categories || []);
      setLoadingWooCategories(false);
    } catch (error) {
      setLoadingWooCategories(false);
      toast.error(error.response?.data || error.message || "An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <img
          src={gif}
          alt="Loading..."
          className="lg:ms-[-100px] border p-3 shadow-xl rounded-xl w-[50px] mt-10"
        />
      </div>
    );
  }

  return (
    <section className="lg:px-20 md:px-10 px-2 h-100% pb-20">
      <Toaster position="top-right" />
       <SubscriptionModal
        isOpen={showModals}
        onClose={() => setShowModals(false)}
      />
      <div className="bg-white rounded-lg p-5 shadow-md mt-20">
        <div className="lg:flex lg:space-x-5">
          <div className="lg:w-1/4 flex flex-col space-y-5 border-r border-gray-300 pr-4 text-sm">
           <ListingSPecifications productListing={productListing}/>
            <MarketplaceSelector
              hasMarketplace={hasMarketplace}
              isEbay={isEbay}
              setIsEbay={setIsEbay}
              isShopify={isShopify}
              setIsShopify={setIsShopify}
              isWoocommerce={isWoocommerce}
              setIsWoocommerce={setIsWoocommerce}
              isWalmart={isWalmart}
              setIsWalmart={setIsWalmart}
              isAmazon={isAmazon}
              setIsAmazon={setIsAmazon}
            />
          </div>

          <div className="lg:w-3/4 flex flex-col space-y-5">
            <div>
              <ProductImageUpload productListing={productListing} thumbnailImage={thumbnailImage} setThumbnailImage={setThumbnailImage} productId={productImageUploadId} userId={userId} token={token} />
            </div>
            <div>
              <TitleSection title={title} maxLength={maxLength} onChange={handleTitleChange} />
            </div>

            <div>
              <DescriptionSection value={productListing?.detailed_description || productListing?.description || ""} onChange={handleDescriptionChange} modules={modules} />
            </div>

            <DynamicProductInputs handleListingChange={handleListingChange} productListing={productListing} />
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <div>
                  <label className="mb-1 font-semibold">Category Mapping</label>
                </div>
                <div>
                  <input
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-green-500 checked:border-green-500 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                    type="checkbox" onChange={(e) => setIsMappingChecked(e.target.checked)} checked={isMappingChecked} />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div>
                  <label className="mb-1 font-semibold">Gift</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-green-500 checked:border-green-500 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                    type="checkbox"
                    onChange={(e) => setIsGiftChecked(e.target.checked)}
                    checked={isGiftChecked}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div>
                  <label className="mb-1 font-semibold">
                    Best Offer Enabled
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-green-500 checked:border-green-500 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
                    type="checkbox" onChange={(e) => setBestOfferEnabled(e.target.checked)} checked={bestOfferEnabled} />
                </div>
              </div>
            </div>
            <ItemSpecificsSection
              isEbay={isEbay}
              isEbayOpen={isEbayOpen}
              setIsEbayOpen={setIsEbayOpen}
              productListing={productListing}
              isLoadingCategory={isLoadingCategory}
              handleOpenModal={handleOpenModal}
              isModalOpen={isModalOpen}
              handleCloseModal={handleCloseModal}
              loader={loader}
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              filteredFirstCategories={filteredFirstCategories}
              filteredSubcategories={filteredSubcategories}
              filteredMiddleCategories={filteredMiddleCategories}
              filteredLastCategories={filteredLastCategories}
              handleFirstCategoryClick={handleFirstCategoryClick}
              handleCategoryClick={handleCategoryClick}
              handleMiddleCategoryClick={handleMiddleCategoryClick}
              handleLastCategoryClick={handleLastCategoryClick}
              itemSpecificFields={itemSpecificFields}
              setItemSpecificFields={setItemSpecificFields}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              handleSelectChange={handleSelectChange}
              customInputValues={customInputValues}
              setCustomInputValues={setCustomInputValues}
              handleInputChange={handleInputChange}
              filteredOptions={filteredOptions}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              toggleDropdown={toggleDropdown}
              dropdownRef={dropdownRef}
              handleListingChange={handleListingChange}
            />
            <WooSection
              isWoocommerce={isWoocommerce}
              isWoocommerceOpen={isWoocommerceOpen}
              setIsWoocommerceOpen={setIsWoocommerceOpen}
              handleWooCommerceCategory={handleWooCommerceCategory}
              loadingWooCategories={loadingWooCategories}
              wooCategories={wooCategories}
              selectedWooCategories={selectedWooCategories}
              setSelectedWooCategories={setSelectedWooCategories}
              productListing={productListing}
              wcAttributes={wcAttributes}
              setWcAttributes={setWcAttributes}
            />
            <PreferencesSection productListing={productListing} setProductListing={setProductListing} enableCharity={enableCharity} setEnableCharity={setEnableCharity} />
              {isShopify && (
                <div className="bg-gray-50 p-4 rounded border border-gray-300">
                  <p>
                    <img
                      src="https://i.postimg.cc/ZqRGnFZN/shopify.png"
                      alt="shopify"
                      className="w-20 h-10"
                    />
                  </p>
                </div>
              )}
              {isWalmart && (
                <div className="bg-gray-50 p-4 rounded border border-gray-300">
                  <p>
                    <img src="https://i.postimg.cc/vZpK8RPJ/walmart.png" alt="walmart" className="w-20 h-10" />
                  </p>
                </div>
              )}
              {isAmazon && (
                <div className="bg-gray-50 p-4 rounded border border-gray-300">
                  <p>
                    <img
                      src="https://i.postimg.cc/JzYvBDpB/amazon.png"
                      alt="amazon"
                      className="w-20 h-10"
                    />
                  </p>
                </div>
              )}

            <div className="bg-gray-50 p-4 rounded shadow">
              <PricingSku
                productListing={productListing}
                handleChange={handleChange}
                setHandleChange={setHandleChange}
                setShippingCost={setShippingCost}
                shippingCost={shippingCost}
              />
            </div>
            <ActionsSection
              isFromUpdate={location.state?.isFromUpdate}
              handleUpdateListing={handleUpdateListing}
              handleSaveListing={handleSaveListing}
              handleSubmit={handleSubmit}
              handleUpdateLoader={handleUpdateLoader}
              handleSaveListingLoader={handleSaveListingLoader}
              handleSubmitLoader={handleSubmitLoader}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Listing;
