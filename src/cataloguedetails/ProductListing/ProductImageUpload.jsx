import React, { useEffect, useRef, useState } from "react";
import gif from "../../Images/gif.gif";
import { Toaster, toast } from "sonner";
import { MdOutlineDelete } from "react-icons/md";
import { deleteListingImage, getListingImage, uploadListingImage } from "../../api/authApi";
import { Image } from "antd";

function ProductImageUpload({ productListing, thumbnailImage, setThumbnailImage, productId, userId }) {
  const [mainImage, setMainImage] = useState(productListing?.image || productListing?.picture_detail || "");  
  const [loader, setLoader] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteLoader, setDeleteLoader] = useState({});
  const [thumbnailImageDisplay, setThumbnailImageDisplay] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    handleGetImage();
  }, []);

  // Simulate upload progress (replace with actual progress tracking if your API supports it)
  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90; // Keep at 90% until actual upload completes
        }
        return prev + Math.random() * 20;
      });
    }, 200);
    return interval;
  };

  const handleFileChange = async (input) => {
    const files = input instanceof File ? [input] : Array.from(input);
    if (!files || files.length === 0) return;
    setLoader(true);
    const progressInterval = simulateUploadProgress();
    let successCount = 0;
    let errorCount = 0;
    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i];
      const currentTotal =
        thumbnailImageDisplay.length +
        (productListing?.image || productListing?.picture_detail ? 1 : 0) +
        successCount;
      if (currentTotal >= maxImages) {
        toast.warning(
          `Maximum ${maxImages} images allowed. ${
            files.length - i
          } files skipped.`
        );
        break;
      }
      const formData = new FormData();
      formData.append("image_url", currentFile);
      try {
        const response = await uploadListingImage(userId, productId, productListing.vendor_name, formData);
        setUploadProgress(100);
        successCount++;
        setTimeout(() => {
          handleGetImage(userId, productId);
          setUploadProgress(0);
        }, 500);
      } catch (error) {
        toast.error(error.response.data || "An error occurred");
        errorCount++;
      }
    }
    clearInterval(progressInterval);
    setLoader(false);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileChange(files);
      // we pass FileList to handler
    }
    e.target.value = "";
    // reset AFTER calling handler
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleGetImage = async () => {
  try {
    const response = await getListingImage(userId, productId);
    const imageData = response.image_data;
    const imageUrls = imageData.flatMap((item) => {
      try {
        const parsed = JSON.parse(item.image_url);
        return parsed.map((p) => ({
          ...item,
          image_url: p.image_url,
        }));
      } catch (e) {
        toast.error("Error parsing image_url");
        return [];
      }
    });
    setThumbnailImageDisplay(imageUrls);
    const images = imageUrls.map((img) => img.image_url);
    const formattedImages = JSON.stringify(images);
    setThumbnailImage(formattedImages);
    if (!mainImage && imageUrls.length > 0) {
      setMainImage(imageUrls[0].image_url);
    }
  } catch (error) {
  }
};

  const handleImageClick = (img) => {
    setMainImage(img);
  };

  const handleDeleteImage = async (imageName, imageId) => {
    setDeleteLoader((prev) => ({ ...prev, [imageId]: true }));
    try {
      const response = await deleteListingImage(imageName, imageId);
      const updatedImages = thumbnailImageDisplay.filter((image) => image.id !== imageId);
      setThumbnailImageDisplay(updatedImages);

      // Update the thumbnail image state with remaining images
      const remainingImageUrls = updatedImages.map((img) => img.image_url);
      const updatedFormattedImages = JSON.stringify(remainingImageUrls);
      setThumbnailImage(remainingImageUrls.length > 0 ? updatedFormattedImages : "Null");

      // If deleted image was the main image, set a new main image
      const deletedImageUrl = thumbnailImageDisplay.find((img) => img.id === imageId)?.image_url; 
      if (mainImage === deletedImageUrl) {
        setMainImage(
          updatedImages.length > 0
            ? updatedImages[0].image_url
            : productListing?.image || productListing?.picture_detail || ""
        );
      }

      setDeleteLoader((prev) => ({ ...prev, [imageId]: false }));
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Error deleting image");
      setDeleteLoader((prev) => ({ ...prev, [imageId]: false }));
    }
  };

  const totalImages = thumbnailImageDisplay.length + (productListing?.image || productListing?.picture_detail ? 1 : 0);
  const maxImages = 24;

  return (
    <section>
      <Toaster position="top-right" richColors />
      <div className="bg-white rounded-b-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Main Product Image
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {totalImages}/{maxImages} images
            </span>
          </div>
        <div className="flex items-center justify-between mb-4 flex-wrap">
          <div className="relative">
            {mainImage && (
              <Image
                width={320}
                height={260}
                src={mainImage}
                alt={productListing?.title || "Main Product"}
                className="object-cover rounded-xl border-2 border-gray-200 shadow-md"
                onError={() => setMainImage("")}
                preview={{
                  mask: (
                    <div className="flex items-center justify-center w-full h-full text-white font-medium">
                      View
                    </div>
                  ),
                }}
              />
            )}
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Add New Images
            </h3>

            <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50" } ${
                totalImages >= maxImages || loader ? "opacity-50 cursor-not-allowed" : "cursor-pointer" }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !loader && totalImages < maxImages && fileInputRef.current?.click()}
            >
              {loader ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto">
                    <img src={gif} alt="Loading..." className="w-full h-full" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-700">
                      Uploading Image...
                    </p>
                    <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {Math.round(uploadProgress)}% complete
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {totalImages >= maxImages
                        ? "Maximum images reached"
                        : "Upload Product Images"}
                    </p>
                    {totalImages < maxImages && (
                      <>
                        <p className="text-gray-600 mb-2">
                          Drag and drop images here, or click to select
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports JPG, PNG, WEBP up to 10MB each
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileInputChange}
                disabled={loader || totalImages >= maxImages}
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Image Gallery
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {(productListing?.image || productListing?.picture_detail) && (
              <div className="relative group">
                <img
                  src={productListing?.image || productListing?.picture_detail}
                  alt="Original Product"
                  className={`w-full h-24 object-cover rounded-lg cursor-pointer border-2 transition-colors duration-200 ${
                    mainImage ===
                    (productListing?.image || productListing?.picture_detail)
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                  onClick={() =>
                    handleImageClick(
                      productListing?.image || productListing?.picture_detail
                    )
                  }
                />
                <div className="absolute bottom-1 left-1 bg-green-700 text-white text-xs px-2 py-1 rounded">
                  Original
                </div>
              </div>
            )}
            {thumbnailImageDisplay.slice(0, 6).map((img, index) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.image_url}
                  alt={`Product ${index + 1}`}
                  className={`w-full h-24 object-cover rounded-lg cursor-pointer border-2 transition-colors duration-200 ${
                    mainImage === img.image_url
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                  onClick={() => handleImageClick(img.image_url)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(img.image_name, img.id);
                  }}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg"
                >
                  {deleteLoader[img.id] ? (
                    <img src={gif} alt="Loading..." className="w-4 h-4" />
                  ) : (
                    <MdOutlineDelete size={16} />
                  )}
                </button>
                {mainImage === img.image_url && (
                  <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Main
                  </div>
                )}
                <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div  onClick={() => handleImageClick(img.image_url)} className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded cursor-pointer">
                    Click to set as main
                  </div>
                </div>
              </div>
            ))}
            {thumbnailImageDisplay.length > 6 && (
              <div className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors duration-200">
                <div className="w-full h-24 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-1">
                      +{thumbnailImageDisplay.length - 6}
                    </div>
                    <p className="text-sm text-gray-100 font-medium">
                      More images
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductImageUpload;
