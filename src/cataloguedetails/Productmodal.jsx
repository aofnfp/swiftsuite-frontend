import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { toast, Toaster } from "sonner";
import gif from "../Images/gif.gif";
import { productModal } from "../api/authApi";
import { Image } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";


const stripHtml = (html) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;

  div.querySelectorAll("li").forEach((li) => {
    const bullet = document.createTextNode(`• ${li.textContent.trim()}`);
    li.parentNode.insertBefore(bullet, li);
    li.parentNode.removeChild(li);
  });

  div.querySelectorAll("br").forEach((br) => {
    br.parentNode.insertBefore(document.createTextNode("\n"), br);
    br.parentNode.removeChild(br);
  });

  let text = div.textContent || div.innerText || "";
  return text
    .replace(/\n\s*\n/g, "\n\n")
    .replace(/^\s+|\s+$/g, "")
    .trim();
};

const safe = (val) => {
  if (!val) return null;
  const str = String(val).trim();
  return str && str !== "N/A" ? str : null;
};

/* ------------------- Component ------------------- */
const Productmodal = ({
  isOpen,
  onClose,
  selectProduct,
  selectProductcontd,
  selectedProductId,
  userId,
  productChange,
  selectedProductCatalogue,
  closePopup,
  catalogue,
  page,
}) => {
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();
  const [myLoader, setMyLoader] = useState(false);

  /* ---- Feature extraction ---- */
  const getFeatureValue = (name) => {
    if (Array.isArray(selectProduct) && selectProduct.length > 0) {
      const feature = selectProduct.find(
        (item) => item.Name === name || item.name === name
      );
      return safe(feature?.Value || feature?.value);
    }
    return null;
  };

  const vendor_name = safe(selectProductcontd?.vendor_name);
  const brand = safe(
    selectProductcontd?.brand ||
      getFeatureValue("Manufacturer") ||
      getFeatureValue("Brand")
  );
  const category = safe(
    selectProductcontd?.category ||
      getFeatureValue("Type") ||
      getFeatureValue("Product Type")
  );
  const weight = safe(
    selectProductcontd?.weight ||
      getFeatureValue("ItemWeight") ||
      getFeatureValue("ShippingWeight")
  );
  const height = safe(
    selectProductcontd?.height ||
      getFeatureValue("ItemHeight") ||
      selectProductcontd?.shipping_height
  );
  const width = safe(
    selectProductcontd?.width ||
      getFeatureValue("ItemWidth") ||
      selectProductcontd?.shipping_width
  );
  const depth = safe(
    selectProductcontd?.depth ||
      getFeatureValue("ItemLength") ||
      selectProductcontd?.shipping_length
  );
  const variation = safe(selectProductcontd?.variation);
  const parentSku = safe(selectProductcontd?.parent_sku);
  const sku = safe(selectProductcontd?.sku);
  const upc = safe(selectProductcontd?.upc);
  const title = safe(selectProductcontd?.title || getFeatureValue("Model"));
  const description = stripHtml(selectProductcontd?.detailed_description);
  const image = safe(selectProductcontd?.image);

  /* ---- Price & Quantity ---- */
  const price = safe(selectProductcontd?.price);
  const quantity = safe(selectProductcontd?.quantity);

  /* ---- Key Features (vendor-specific) ---- */
  const getKeyFeatures = () => {
    const feats = [];
    if (!vendor_name) return feats;
    const lower = vendor_name.toLowerCase();

    if (lower === "fragrancex") {
      const size = safe(selectProductcontd?.size) || getFeatureValue("Size");
      const gender = getFeatureValue("Gender");
      const metric = getFeatureValue("Metric Size");
      const type = getFeatureValue("Product Type");
      if (size) feats.push(`Size: ${size}`);
      if (gender) feats.push(`Gender: ${gender}`);
      if (metric) feats.push(`Metric: ${metric}`);
      if (type) feats.push(`Type: ${type}`);
    } else if (lower === "lipsey") {
      const model = safe(selectProductcontd?.model) || getFeatureValue("Model");
      const caliber = getFeatureValue("CaliberGauge");
      const action = getFeatureValue("Action");
      const barrel = getFeatureValue("BarrelLength");
      const capacity = getFeatureValue("Capacity");
      if (model) feats.push(`Model: ${model}`);
      if (caliber) feats.push(`Caliber: ${caliber}`);
      if (action) feats.push(`Action: ${action}`);
      if (barrel) feats.push(`Barrel: ${barrel}`);
      if (capacity) feats.push(`Capacity: ${capacity}`);
    } else if (lower === "cwr") {
      const quick = getFeatureValue("Quick Specs");
      const backlight = getFeatureValue("Backlight");
      const mount = getFeatureValue("Mounting Style");
      const lubber = getFeatureValue("Lubber Lines");
      if (quick) feats.push(quick);
      if (backlight && backlight !== "None") feats.push(`Backlight: ${backlight}`);
      if (mount) feats.push(`Mount: ${mount}`);
      if (lubber) feats.push(`Lubber Lines: ${lubber}`);
    } else if (lower === "zanders") {
      const grain = getFeatureValue("Grain Weight");
      const type = getFeatureValue("Type");
      const units = getFeatureValue("Units per Box");
      const desc = stripHtml(selectProductcontd?.detailed_description);
      if (grain) feats.push(`Grain: ${grain}`);
      if (type) feats.push(`Type: ${type}`);
      if (units) feats.push(`Box: ${units}`);
      if (desc && desc.length < 50) feats.push(desc);
    } else if (lower === "rsr") {
      const caliber = getFeatureValue("Caliber");
      const grain = getFeatureValue("Grain Weight");
      const type = getFeatureValue("Type");
      const box = getFeatureValue("Units per Box");
      if (caliber) feats.push(`Caliber: ${caliber}`);
      if (grain) feats.push(`Grain: ${grain}`);
      if (type) feats.push(`Bullet: ${type}`);
      if (box) feats.push(`Box: ${box}`);
    }

    if (feats.length < 3) {
      const fallback = [
        getFeatureValue("Size"),
        getFeatureValue("Metric Size"),
        getFeatureValue("Gender"),
        getFeatureValue("Model"),
        getFeatureValue("CaliberGauge"),
        getFeatureValue("Action"),
        getFeatureValue("BarrelLength"),
        getFeatureValue("Capacity"),
        getFeatureValue("Backlight"),
        getFeatureValue("Mounting Style"),
      ]
        .filter(Boolean)
        .map((v) => (v.includes(":") ? v : `Feature: ${v}`));
      feats.push(...fallback.slice(0, 5 - feats.length));
    }
    return feats.slice(0, 5);
  };
  const keyFeatures = getKeyFeatures();

  /* ---- Payload for add ---- */
  const updatedProduct = {
    user: parseInt(userId) || 0,
    Brand: brand || "",
    Category: category || "",
    Description: selectProductcontd?.detailed_description || "",
    Model: selectProductcontd?.model || getFeatureValue("Model") || "",
    MPN: getFeatureValue("MPN") || "",
    Price: parseFloat(selectProductcontd?.price) || 0,
    Quantity: parseInt(selectProductcontd?.quantity) || 0,
    shipping_height: parseFloat(height) || 0,
    Shipping_weight: parseFloat(weight) || 0,
    Shipping_width: parseFloat(width) || 0,
    msrp: selectProductcontd?.msrp || 0,
    map: selectProductcontd?.map || 0,
    Sku: sku || "",
    Title: title || "",
    Upc: upc || "",
    total_product_cost: selectProductcontd?.total_product_cost || 0,
  };

  const addDetails = async () => {
    setMyLoader(true);
    console.log("Sending to backend:", {
    userId,
    selectedProductId,
    productChange,
    selectedProductCatalogue,
    updatedProduct
  });

    try {
      await productModal(
        userId,
        selectedProductId,
        productChange,
        selectedProductCatalogue
      );
      toast.success("Product added successfully");
      queryClient.invalidateQueries([
        "vendorProducts",
        userId,
        productChange,
        catalogue,
        page,
      ]);
      localStorage.setItem("selectProduct", JSON.stringify(updatedProduct));
      closePopup();
      onClose();
    } catch {
      toast.error("Request failed, please try again");
    } finally {
      setMyLoader(false);
    }
  };

  /* ---- Click-outside close ---- */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  /* ------------------- JSX ------------------- */
  return (
    <Modal
      ref={dropdownRef}
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={false}
      showCloseButton={false}
      className="z-[10000] !font-mirza !rounded-none scrollbar-thin scrollbar-thumb-white scrollbar-track-white !p-0 mb-10 md:max-h-[90vh] max-h-[80vh] md:max-w-[50vw] max-w-[90vw] h-[80vh]"
      style={{ overflowY: "auto" }}
    >
      <ModalContent className="!p-0">
        <ModalBody className="!p-0">
          <section className="flex flex-col md:flex-row bg-white shadow-lg h-full">
            {/* ==== LEFT: Specs ==== */}
            <div className="flex flex-col gap-4 p-4 md:w-[30%] text-sm overflow-y-auto">

              {/* Brand */}
              {brand && (
                <div className="bg-[#00000033] p-3 rounded-lg">
                  <h3 className="font-bold">Brand</h3>
                  <p>{brand}</p>
                </div>
              )}

              {/* Category */}
              {category && (
                <div className="bg-[#02784033] p-3 rounded-lg">
                  <h3 className="font-bold">Category</h3>
                  <p>{category}</p>
                </div>
              )}

              {/* Price & Quantity – right after Category */}
              {(price || quantity) && (
                <div className="p-3 bg-[#09845133] rounded-lg">
                  <h3 className="font-bold">Pricing & Stock</h3>
                  <div className="mt-1 space-y-1">
                    {price && (
                      <div className="flex gap-2">
                        <span>Price:</span>
                        <span>${parseFloat(price).toFixed(2)}</span>
                      </div>
                    )}
                    {quantity && (
                      <div className="flex gap-2">
                        <span>Quantity:</span>
                        <span>{quantity}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Key Features */}
              {keyFeatures.length > 0 && (
                <div className="p-3 bg-[#BB823266] rounded-lg">
                  <h3 className="font-bold">Key Features</h3>
                  <ul className="mt-1 space-y-1 text-gray-700">
                    {keyFeatures.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weight */}
              {weight && (
                <div className="p-3">
                  <h3 className="font-bold">Weight</h3>
                  <p>{weight}</p>
                </div>
              )}

              {/* Dimensions */}
              {(height || width || depth) && (
                <div className="p-3 bg-[#BB823266] rounded-lg">
                  <h3 className="font-bold">Dimensions</h3>
                  <div className="mt-1 space-y-1">
                    {height && (
                      <div className="flex gap-2">
                        <span>Height:</span>
                        <span>{height}</span>
                      </div>
                    )}
                    {width && (
                      <div className="flex gap-2">
                        <span>Width:</span>
                        <span>{width}</span>
                      </div>
                    )}
                    {depth && (
                      <div className="flex gap-2">
                        <span>Depth:</span>
                        <span>{depth}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {(variation || parentSku || sku || upc) && (
                <div className="bg-[#00000033] p-3 rounded-lg">
                  <h3 className="font-bold">Specifications</h3>
                  <dl className="grid grid-cols-3 gap-x-2 text-sm mt-1">
                    {variation && (
                      <>
                        <dt className="font-medium">Variation:</dt>
                        <dd className="col-span-2 text-gray-700">{variation}</dd>
                      </>
                    )}
                    {parentSku && (
                      <>
                        <dt className="font-medium">Parent SKU:</dt>
                        <dd className="col-span-2 text-gray-700">{parentSku}</dd>
                      </>
                    )}
                    {sku && (
                      <>
                        <dt className="font-medium">SKU:</dt>
                        <dd className="col-span-2 text-gray-700">{sku}</dd>
                      </>
                    )}
                    {upc && (
                      <>
                        <dt className="font-medium">UPC:</dt>
                        <dd className="col-span-2 text-gray-700">{upc}</dd>
                      </>
                    )}
                  </dl>
                </div>
              )}
            </div>

            {/* ==== RIGHT: Image → Content → Button ==== */}
            <div className="flex flex-col md:w-[70%]">
              {/* Image – NO gray background */}
              <div className="flex justify-center p-4 md:p-6">
                <Image
                  isZoomed
                  src={image || "https://via.placeholder.com/300"}
                  alt={title || "Product"}
                  className="w-full max-w-[280px] h-64 md:h-72 object-contain rounded-lg shadow-md"
                />
              </div>

              {/* Text Content */}
              <div className="flex-1 px-4 md:px-6 pb-4 space-y-6 text-sm overflow-y-auto">
                {/* Product Name */}
                {title && (
                  <div>
                    <p className="font-semibold text-base text-gray-900">
                      Product Name:
                    </p>
                    <p className="mt-1 text-gray-800">{title}</p>
                  </div>
                )}

                {/* Product Detail */}
                {description && (
                  <div>
                    <p className="font-semibold text-base text-gray-900">
                      Product Detail:
                    </p>
                    <p className="mt-1 whitespace-pre-line leading-relaxed text-gray-700">
                      {description}
                    </p>
                  </div>
                )}

                {/* Additional Features */}
                {(getFeatureValue("AdditionalFeature1") ||
                  getFeatureValue("AdditionalFeature2") ||
                  getFeatureValue("AdditionalFeature3")) && (
                  <div>
                    <p className="font-semibold text-base text-gray-900">
                      Product Features:
                    </p>
                    <ul className="mt-2 space-y-1 text-gray-700">
                      {getFeatureValue("AdditionalFeature1") && (
                        <li>• {getFeatureValue("AdditionalFeature1")}</li>
                      )}
                      {getFeatureValue("AdditionalFeature2") && (
                        <li>• {getFeatureValue("AdditionalFeature2")}</li>
                      )}
                      {getFeatureValue("AdditionalFeature3") && (
                        <li>• {getFeatureValue("AdditionalFeature3")}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Add Button */}
              <div className="p-4 md:p-6 bg-white border-t">
                <button
                  onClick={addDetails}
                  disabled={myLoader}
                  className="flex items-center justify-center h-10 w-full max-w-xs mx-auto bg-[#098451] text-white rounded-md border border-[#098451] hover:bg-white hover:text-[#098451] transition-all duration-200 disabled:opacity-70"
                >
                  {myLoader ? (
                    <img src={gif} alt="Loading" className="w-6 h-6" />
                  ) : (
                    "Add Product"
                  )}
                </button>
              </div>
            </div>

            <Toaster position="top-right" />
          </section>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Productmodal;