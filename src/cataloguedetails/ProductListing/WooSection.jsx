import React, { useEffect, useRef } from "react";
import { Button } from "antd";
import GetWooCategory from "./GetWooCategory";
import AttributeAdder from "./AttributeAdder";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

const WooSection = ({
  isWoocommerce,
  isWoocommerceOpen,
  setIsWoocommerceOpen,
  handleWooCommerceCategory,
  loadingWooCategories,
  wooCategories,
  selectedWooCategories,
  setSelectedWooCategories,
  productListing,
  wcAttributes,
  setWcAttributes,
  isFromEditOrUpdate,
}) => {
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    if (isWoocommerce && isFromEditOrUpdate && !hasAutoOpened.current) {
      hasAutoOpened.current = true;
      setIsWoocommerceOpen(true);
    }
  }, [isWoocommerce, isFromEditOrUpdate]);

  return (
    <>
      {isWoocommerce && (
        <div
          className="bg-gray-50 cursor-pointer p-4 rounded border border-gray-300 my-2"
          onClick={() => setIsWoocommerceOpen(!isWoocommerceOpen)}
        >
          <div className="flex items-center justify-between">
            <p>
              <img
                src="https://i.postimg.cc/Wbfbs7QB/woocommerce.png"
                alt="woocommerce"
                className="w-20 h-10"
              />
            </p>
            <div className="text-gray-500">
              {isWoocommerceOpen ? (
                <BiChevronUp size={30} />
              ) : (
                <BiChevronDown size={30} />
              )}
            </div>
          </div>
        </div>
      )}
      {isWoocommerceOpen && isWoocommerce && (
        <div className="bg-gray-100 shadowrounded p-4">
          <div className="mb-4 border border-gray-300 rounded p-4">
            <div className="flex justify-between">
              <div className="font-semi-bold text-xl mt-3">
                Get WooCommerce Category
              </div>
              <div className="text-center">
                <Button
                  className="w-full h-10 font-semibold bg-[#089451] text-white border-none hover:!bg-[#06703d] hover:!text-white"
                  OnClick={handleWooCommerceCategory}
                  disabled={!isWoocommerce}
                  isLoading={loadingWooCategories}
                  size="lg"
                >
                  Category Name
                </Button>
              </div>
            </div>
            {wooCategories.length > 0 && (
              <GetWooCategory
                setWooCategories={() => {}}
                loadingWooCategories={loadingWooCategories}
                wooCategories={wooCategories}
                selectedCategories={selectedWooCategories}
                setSelectedCategories={setSelectedWooCategories}
                productListing={productListing}
              />
            )}
          </div>
          <div className="mb-4 border border-gray-300 rounded p-4">
            <p className="mb-2 text-sm text-gray-600">
              Add product attributes for WooCommerce below.
            </p>
            <AttributeAdder
              initial={
                Array.isArray(productListing?.woocommerce_attributes)
                  ? productListing?.woocommerce_attributes
                  : productListing?.woocommerce_attributes &&
                      typeof productListing?.woocommerce_attributes === "object"
                    ? Object.entries(productListing.woocommerce_attributes).map(
                        ([label, value]) => ({ label, value }),
                      )
                    : []
              }
              onChange={(attrs) => setWcAttributes(attrs)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default WooSection;
