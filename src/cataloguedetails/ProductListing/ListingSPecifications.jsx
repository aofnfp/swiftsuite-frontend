import React from "react";
import MarketplaceSelector from "./MarketplaceSelector";

const ListingSPecifications = ({ productListing }) => {
  return (
    <div className="bg-gray-100 p-4 my-5 rounded-lg space-y-4">
      <div>
        <h4 className="font-bold">Brand</h4>
        <p>
          {productListing?.brand || productListing.manufacturer && productListing?.brand || productListing.manufacturer !== "Null"
            ? productListing?.brand || productListing.manufacturer
            : productListing?.Brand
              ? productListing?.Brand
              : ""}
        </p>
      </div>
      <div>
        <h4 className="font-bold">Category</h4>
        <p>
          {productListing?.category && productListing?.category !== "Null" ? productListing?.category : ""}
        </p>
      </div>
      <div>
        <h4 className="font-bold">Key Features:</h4>
        <h4 className="mb-2">Dimensions:</h4>
        <div>
          <p>
            Height: [
            {productListing?.shipping_length && productListing?.shipping_length !== "Null"
              ? productListing?.shipping_length
              : 0}
            ] inches
          </p>
          <p>
            Width: [
            {productListing?.shipping_width && productListing?.shipping_width !== "Null"
              ? productListing?.shipping_width
              : 0}
            ] inches
          </p>
          <p>
            Depth: [
            {productListing?.shipping_height && productListing?.shipping_height !== "Null"
              ? productListing?.shipping_height
              : 0}
            ] inches
          </p>
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-2">Specifications</h4>
        <p>Variation: {productListing?.variation && productListing?.variation !== "Null" ? productListing?.variation : ""}</p>
        <p>Parent SKU: {productListing?.parent_sku && productListing?.parent_sku !== "Null" ? productListing?.parent_sku : ""}</p>
        <p>SKU: {productListing?.sku && productListing?.sku !== "Null" ? productListing?.sku : ""}</p>
        <p>UPC: {productListing?.upc && productListing?.upc !== "Null" ? productListing?.upc : ""}</p>
        <p>
          Category:{" "}
          {productListing?.category && productListing?.category !== "Null" ? productListing?.category : ""}
        </p>
        <p>
          Brand:{" "}
          {productListing?.brand || productListing.manufacturer && productListing?.brand || productListing.manufacturer !== "Null"
            ? productListing?.brand || productListing.manufacturer
            : productListing?.Brand
              ? productListing?.Brand
              : ""}
        </p>
      </div>
    </div>
  );
};

export default ListingSPecifications;
