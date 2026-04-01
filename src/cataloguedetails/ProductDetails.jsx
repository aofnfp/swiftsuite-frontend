import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { toast } from "react-toastify";
import { productDetails } from "../api/authApi";

const ProductDetails = ({
  selectProduct,
  handleChange,
  handleUpdateProduct,
  closePopup,
  closeDetail,
  selectProductcontd,
  selectedProductId,
  userId,
  handleCatalogue,
  selectedProductCatalogue,
}) => {
  const token = localStorage.getItem("token");

  const getFeatureValue = (name) => {
    if (Array.isArray(selectProduct)) {
      const feature = selectProduct.find((item) => item.Name === name);
      return feature?.Value || "N/A";
    }
    return "N/A";
  };

  const updatedProduct = {
    Brand: getFeatureValue("Manufacturer"),
    Category: getFeatureValue("Type"),
    Description: selectProductcontd?.detailed_desription,
    Model: getFeatureValue("Model"),
    MPN: getFeatureValue("MPN"),
    Price: selectProductcontd?.price,
    Quantity: selectProductcontd?.quantity,
    Shipping_height: parseFloat(getFeatureValue("ItemHeight")) || 0,
    Shipping_weight: parseFloat(getFeatureValue("ItemWeight")) || 0,
    Shipping_width: parseFloat(getFeatureValue("ItemWidth")) || 0,
    Sku: selectProductcontd?.sku,
    Title: selectProductcontd?.title,
    User: 106,
    Upc: selectProductcontd?.upc,
  };

  const addDetails = async () => {
    try {
      const response = await productDetails(
        userId,
        selectedProductId,
        handleCatalogue,
        selectedProductCatalogue
      );
      toast.success("Product added successfully");
      localStorage.setItem("selectProduct", JSON.stringify(updatedProduct));
    } catch (err) {
      toast.error("Request failed, please try again");
    }
  };

  return (
    <div
      className={
        closeDetail
          ? "fixed h-[90%] md:w-[50rem] overflow-y-auto md:mx-[15rem] md:ms-[22rem] z-[100000] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-shorter"
          : "hidden"
      }
    >
      <div className="absolute right-5 top-5">
        <button onClick={closePopup}>
          <MdOutlineCancel />
        </button>{" "}
      </div>
      <section className="flex w-full  shadow bg-white">
        <div className="bg-gray-200 py-14 px-4 flex flex-col gap-5 md:w-[20%]">
          <div>
            <h2 className="font-semibold">Brand</h2>
            <div>{getFeatureValue("Manufacturer")}</div>
          </div>
          <div>
            <h2 className="font-semibold">Category:</h2>
            <div>{getFeatureValue("Type")}</div>
          </div>
          <div>
            <h2 className="font-semibold">Weight</h2>
            <div>{getFeatureValue("weight")}</div>
          </div>
          <div>
            <div className="">
              <p className="font-semibold">Key Features:</p>
            </div>
            <div>
              <div>
                <p>Dimensions:</p>
                <p></p>
              </div>
              <div className="flex gap-2">
                <p>Height:</p>
                <div>{getFeatureValue("ItemHeight")}</div>
              </div>
              <div className="flex gap-2">
                <p>Width:</p>
                <div>{getFeatureValue("ItemWidth")}</div>
              </div>
              <div className="flex gap-2">
                <p>Depth:</p>
                <div>{getFeatureValue("ItemLength")}</div>
              </div>
            </div>
          </div>
          <div>
            <div className="">
              <p className="font-semibold">Specifications:</p>
            </div>
            <div>
              <div>
                <p>Variation:</p>
                <p></p>
              </div>
              <div>
                <p>Parent SKU:</p>
                <p></p>
              </div>
              <div>
                <p>SKU:</p>
                <p>{selectProductcontd?.sku}</p>
              </div>
              <div>
                <p>UPC:</p>
                <p>{selectProductcontd?.upc}</p>
              </div>
              <div className="">
                <p>Category:</p>
                <p>
                  <div>{getFeatureValue("Type")}</div>
                </p>
              </div>
              <div className="flex gap-1">
                <p>Brand:</p>
                <p>
                  {" "}
                  <div>{getFeatureValue("Manufacturer")}</div>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="py-14 grid grid-cols-1 gap-10  px-5 md:w-[70%]">
          <div className=" h-40 flex justify-center items-center w-full">
            <img
              className="shadow-sm p-2 w-60 h-40 flex justify-center items-center"
              src={`https://www.lipseyscloud.com/images/${selectProductcontd?.image}`}
              alt="no image yet"
            />
          </div>
          <div>
            <div className="">
              <p className="font-semibold"> Product Name:</p>
            </div>
            <div>{getFeatureValue("Model")}</div>
          </div>
          <div>
            <div className="">
              <p className="font-semibold"> Product Detail:</p>
            </div>
            <p>{selectProductcontd?.detailed_description}</p>
          </div>
          <div>
            <div className="">
              <p className="font-semibold"> Product Features:</p>
            </div>
            <div className="">
              <ol className="grid grid-cols-1 gap-5">
                <li className="w-[70%]">
                  <div>{getFeatureValue("AdditionalFeature1")}</div>
                </li>
                <li className="w-[70%]">
                  <div>{getFeatureValue("AdditionalFeature2")}</div>
                </li>
                <li className="w-[70%]">
                  <div>{getFeatureValue("AdditionalFeature3")}</div>
                </li>
              </ol>
            </div>
            <div
              className="my-10 flex justify-center cursor-pointer items-center bg-[#098451] text-white w-[10rem] border hover:bg-white hover:text-[#089451] hover:border-[#089451]"
              onClick={addDetails}
            >
              Add to Product
            </div>
            <div></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
