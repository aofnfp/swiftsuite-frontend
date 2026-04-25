import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Heart,
  Share2,
  Package,
  MapPin,
  Calendar,
  Tag,
  Eye,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import EditInventoryModal from "./EditInventoryModal";
import { useDisclosure } from "@heroui/react";
import { safeJSONParse, safeParseItemSpecific, overlayEnrollmentMarkup, fmtMarkup } from "../utils/utils";
import { getInventoryProductDetails, getVendorEnrolledIdentifeir, mapInventoryItems, getMarketplaceEnrolmentDetail } from "../api/authApi";
import { Toaster, toast } from "sonner";
import { MdOutlineDelete } from "react-icons/md";
import VendorlistDropdown from "../cataloguedetails/Dropdown/VendorlistDropdown";
import ActiveRemapControls from "./ActivemapControls";
import MapModal from "./MapModal";
import InventoryTab from "./InventoryTab";

const InventoryDetail = () => {
  const params = useParams();
  const inventoryId = params?.inventoryDetail || "";
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [inventoryEdit, setInventoryEdit] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [openVendor, setOpenVendor] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [deleteLoader, setDeleteLoader] = useState({});
  const [vendorList, setVendorList] = useState([]);
  const [failedMapModalOpen, setFailedMapModalOpen] = useState(false);
  const [failedMapItems, setFailedMapItems] = useState([]);
  const [inventoryDetail, setInventoryDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parsedItemSpecific, setParsedItemSpecific] = useState(null);

  useEffect(() => {
    if (!inventoryId) {
      navigate("/layout/inventory");
    }
  }, [inventoryId, navigate]);

  useEffect(() => {
    vendorIdentifiers();
  }, []);

  useEffect(() => {
    if (inventoryId) {
      fetchInventoryDetail(inventoryId);
    }
  }, [inventoryId]);

  const vendorIdentifiers = async () => {
    try {
      const response = await getVendorEnrolledIdentifeir(userId);
      setVendorList(response.vendor_list);
    } catch (err) {
      toast.error("Error fetching vendor identifiers:", err);
    }
  };

  const fetchInventoryDetail = async (id) => {
    try {
      setLoading(true);
      const response = await getInventoryProductDetails(userId, id);
      const item = response?.item_details?.[0];
      if (!item) return;
      // The detail endpoint doesn't include enrollment_detail (unlike the list
      // endpoints), so the per-row markup fields are stale. Pull the live
      // enrollment for this item's marketplace and overlay before display.
      let enriched = item;
      if (item?.market_name) {
        try {
          const enrolment = await getMarketplaceEnrolmentDetail(userId, item.market_name);
          const enrollmentDetail = enrolment?.marketplace_info || [];
          const overlaid = overlayEnrollmentMarkup([item], enrollmentDetail);
          enriched = overlaid?.[0] || item;
        } catch {
          // No enrollment available — fall back to the row's stored values.
        }
      }
      setInventoryDetail(enriched);
      const parsed = safeParseItemSpecific(item.item_specific_fields);
      setParsedItemSpecific(parsed);
    } catch (err) {
      toast.error("Failed to fetch inventory details");
    } finally {
      setLoading(false);
    }
  };

  const handleMapProducts = async () => {
    if (!selectedVendor) {
      toast.error("Please select a vendor first");
      return;
    }
    setIsMapLoading(true);
    try {
      const payload = {
        vendor_name: selectedVendor.toLowerCase(),
        product_objects: [
          {
            id: inventoryDetail.id,
            mpn: inventoryDetail.mpn || "",
            sku: inventoryDetail.sku || "",
            upc: inventoryDetail.upc || "",
          },
        ],
      };
      const res = await mapInventoryItems(userId, selectedVendor.endpointName, payload);
      const failedItems = res.Failed_to_map_items || [];
      const mappedWithCaution = res.Mapped_with_caution || [];
      if (failedItems.length > 0) {
        setFailedMapItems(failedItems);
        setFailedMapModalOpen(true);
        return;
      }
      if (mappedWithCaution.length > 0) {
        setFailedMapItems(mappedWithCaution);
        setFailedMapModalOpen(true);
        return;
      };
      toast.success("Products mapped successfully");
    } catch (err) {
      toast.error("Failed to map product");
    } finally {
      setIsMapLoading(false);
    }
  };

  const inventoryImages = useMemo(() => {
    const images = inventoryDetail?.thumbnailImage;
    if (!images) return [];
    if (Array.isArray(images)) return images;
    const parsed = safeJSONParse(images);
    if (Array.isArray(parsed)) return parsed;
    // Comma-separated string
    if (typeof images === "string") {
      return images
        .split(",")
        .map((img) => img.trim())
        .filter(Boolean);
    }

    return [];
  }, [inventoryDetail]);

  const handleEditInventory = (item) => {
    navigate(`/layout/listing/${item.id}`, { state: { isFromUpdate: true } });
  };

  const handleDeleteImage = async (image, index) => {
    const imageName = image;
    const imageIndex = index;
    setDeleteLoader((prev) => ({ ...prev, [imageIndex]: true }));
    const filtereredImages = inventoryImages.filter(
      (img) => index !== imageIndex
    );
    // setInventoryImages(filtereredImages);
    // try {
    //   await deleteListingImage(imageName, imageIndex);
    //   const updatedImages = inventoryImages.filter((img) => img.id !== imageId);
    //   // setInventoryImages(updatedImages);
    //   // // Update the thumbnail image state with remaining images
    //   // const remainingImageUrls = updatedImages.map((img) => img.image_url);
    //   // const updatedFormattedImages = JSON.stringify(remainingImageUrls);
    //   // setThumbnailImage(remainingImageUrls.length > 0 ? updatedFormattedImages : "Null");
    //   // toast.success("Image deleted successfully");
    // } catch (error) {
    //   toast.error("Error deleting image");
    // }
    // setDeleteLoader((prev) => ({ ...prev, [imageIndex]: false }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-medium">Loading product details...</span>
      </div>
    );
  }

  if (!inventoryDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-medium text-red-500">
          Product not found
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="bg-green-700 text-white shadow-lg">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/layout/inventory")}
                className="flex items-center space-x-2 mt-14 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Inventory</span>
              </button>
            </div>
          </div>
          <div className="text-2xl font-bold flex justify-center items-center">
            <h1>Product Details</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-10">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="rounded-lg flex items-center justify-center overflow-hidden h-64 md:h-80 mb-3">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={inventoryDetail?.title}
                  className="object-contain w-full h-full"
                />
              ) : (
                <img
                  src={inventoryDetail?.picture_detail}
                  alt={inventoryDetail.title}
                  className="object-contain w-full h-full"
                />
              )}
            </div>

            <div className="flex space-x-2 relative overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-1">
              <button
                onClick={() =>
                  setSelectedImage(inventoryDetail?.picture_detail)
                }
                className={`w-16 h-16 relative group flex-shrink-0 rounded-md overflow-hidden border transition-all duration-200 cursor-pointer ${selectedImage === inventoryDetail?.picture_detail
                    ? "border-green-500 ring-2 ring-green-200"
                    : "border-gray-200 hover:border-blue-400"
                  }`}
              >
                <img
                  src={inventoryDetail?.picture_detail}
                  alt={inventoryDetail?.title}
                  className="w-full h-full object-cover"
                />
              </button>

              {inventoryImages.length > 0 &&
                inventoryImages.slice(0, 8).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 relative group flex-shrink-0 rounded-md overflow-hidden border transition-all duration-200 ${selectedImage === img
                        ? "border-green-500 ring-2 ring-green-200"
                        : "border-gray-200 hover:border-blue-400"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-full h-full object-cover rounded-md cursor-pointer transition-colors duration-200 ${selectedImage === img ? "border-blue-500" : ""
                        }`}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(img, index);
                      }}
                      aria-label={`Delete thumbnail ${index + 1}`}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg"
                    >
                      {" "}
                      {deleteLoader[img.id] ? (
                        <img
                          src={gif}
                          alt="Loading..."
                          className="w-4 h-4 z-50"
                        />
                      ) : (
                        <MdOutlineDelete
                          size={16}
                          className="text-white z-50"
                        />
                      )}
                    </button>
                    {selectedImage === img && (
                      <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Main
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-1">
                      <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        Click
                      </div>
                    </div>
                  </button>
                ))}
              {inventoryImages && inventoryImages.length > 8 && (
                <div className="relative group flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors duration-200 w-16 h-16">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center cursor-pointer">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">
                        +{inventoryImages.length - 8}
                      </div>
                      <p className="text-xs text-gray-100 font-medium">More</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {inventoryDetail.end_status !== undefined && (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${inventoryDetail.end_status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {inventoryDetail.end_status ? "Active" : "Inactive"}
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Package className="w-3 h-3 mr-1" />
                    In Stock: {inventoryDetail.quantity}
                  </span>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                {inventoryDetail.title}
              </h1>
              <div className="flex items-center space-x-4 mb-5">
                <span className="text-2xl font-bold text-green-600">
                  ${inventoryDetail.price}
                </span>
                <span className="text-sm text-gray-500">Vendor Unit Cost</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    SKU
                  </span>
                  <p className="font-medium text-gray-900">
                    {inventoryDetail.sku}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    UPC
                  </span>
                  <p className="font-medium text-gray-900">
                    {inventoryDetail.upc}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    Brand
                  </span>
                  <p className="font-medium text-gray-900">
                    {inventoryDetail.brand}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    Location
                  </span>
                  <p className="font-medium text-gray-900 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {inventoryDetail.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 sm:p-5 mb-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 items-center w-full">
                <button
                  onClick={() => handleEditInventory(inventoryDetail)}
                  className="flex-1 w-full sm:w-auto min-w-0 bg-green-600 hover:bg-green-700 active:scale-95 text-white py-3 px-5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <Edit3 className="w-5 h-5" />
                  <span className="hidden sm:inline">Edit Product</span>
                  <span className="sm:hidden">Edit</span>
                </button>

                {inventoryDetail?.end_status ? (
                  <ActiveRemapControls
                    selectedVendor={selectedVendor}
                    setSelectedVendor={setSelectedVendor}
                    openVendor={openVendor}
                    setOpenVendor={setOpenVendor}
                    vendorList={vendorList}
                    handleMapProducts={handleMapProducts}
                    isMapLoading={isMapLoading}
                  />
                ) : (
                  <div className="w-full sm:w-auto flex items-center gap-2">
                    <div className="w-full sm:w-72">
                      <VendorlistDropdown
                        selected={selectedVendor || "Select Vendor"}
                        onChange={(v) => setSelectedVendor(v)}
                        open={openVendor}
                        setOpen={setOpenVendor}
                        catalogue={vendorList}
                      />
                    </div>
                    <button
                      onClick={handleMapProducts}
                      disabled={!selectedVendor || isMapLoading}
                      className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg font-semibold transition-all ${!selectedVendor
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 active:scale-95 shadow-md hover:shadow-lg"
                        }`}
                    >
                      {isMapLoading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-green-600"
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
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                          <span className="hidden sm:inline">Mapping...</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-5 h-5" />
                          <span className="hidden sm:inline">Map Product</span>
                          <span className="sm:hidden">Map</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t pt-4 text-sm text-gray-600">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Listed:{" "}
                  {new Date(inventoryDetail.date_created).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  Fixed Markup: {fmtMarkup(inventoryDetail.fixed_markup)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {["details", "specifications", "shipping"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "details" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Description
                </h3>
                <p
                  className="text-gray-700 leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{
                    __html: inventoryDetail.description,
                  }}
                ></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="px-5">
                    <h4 className="text-gray-900 mb-3 text-lg font-semibold">
                      Business Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost Price:</span>
                        <span className="font-medium">
                          ${inventoryDetail.total_product_cost}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Price:</span>
                        <span className="font-medium">
                          ${inventoryDetail.start_price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Best Offer:</span>
                        <span
                          className={`font-medium ${inventoryDetail.bestOfferEnabled
                              ? "text-green-600"
                              : "text-gray-500"
                            }`}
                        >
                          {inventoryDetail.bestOfferEnabled
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category ID:</span>
                        <span className="font-medium">
                          {inventoryDetail.category_id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Postal Code:</span>
                        <span className="font-medium">
                          {inventoryDetail.postal_code}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Marketplace & Profiles
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Listing Type:</span>
                        <span className="font-medium">
                          {inventoryDetail.listingType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Profile:</span>
                        <span className="font-medium">
                          {inventoryDetail.payment_profileName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Return Profile:</span>
                        <span className="font-medium">
                          {inventoryDetail.return_profileName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping Profile:</span>
                        <span className="font-medium">
                          {inventoryDetail.shipping_profileName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {parsedItemSpecific &&
                    Object.entries(parsedItemSpecific).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-3 border-b border-gray-100 px-5"
                      >
                        <span className="text-gray-600 font-medium">
                          {key}:
                        </span>
                        <span className="text-gray-900">
                          {value !== "Null" ? value : ""}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Free Standard Shipping
                        </p>
                        <p className="text-sm text-gray-600">
                          5-7 business days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Buyer Protection
                        </p>
                        <p className="text-sm text-gray-600">
                          Full refund if not received
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Shipping Details
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Ships from:</span>
                        <span>{inventoryDetail.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping Profile:</span>
                        <span>{inventoryDetail.shipping_profileName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Return Policy:</span>
                        <span>{inventoryDetail.return_profileName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Policy:</span>
                        <span>{inventoryDetail.payment_profileName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div> */}
        <div>
          <InventoryTab
            inventoryDetail={inventoryDetail}
            parsedItemSpecific={parsedItemSpecific}
          />
        </div>
      </div>
      <MapModal setFailedMapModalOpen={setFailedMapModalOpen} failedMapItems={failedMapItems} setFailedMapItems={setFailedMapItems} failedMapModalOpen={failedMapModalOpen} />
      <EditInventoryModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        useDisclosure={useDisclosure}
        onClose={onClose}
        inventoryEdit={inventoryEdit}
        setInventoryEdit={setInventoryEdit}
        token={token}
        userId={userId}
      />
    </div>
  );
};

export default InventoryDetail;
