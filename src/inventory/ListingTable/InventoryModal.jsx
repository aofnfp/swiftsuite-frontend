import React from "react";
import { Modal, Button, Image } from "antd";
import { useNavigate } from "react-router-dom";
import { fmtMarkup } from "../../utils/utils";

const InventoryModal = ({ isOpen, onOpenChange, onClose, viewItem }) => {
  if (!viewItem) return null;

  const navigate = useNavigate();

  const {
    title,
    picture_detail,
    brand,
    sku,
    model,
    profit_margin,
    cost,
    price,
    location,
    category,
    upc,
    min_profit_mergin,
    parsedItemSpecific = {},
    description,
    id,
    percentage_markup,
    fixed_markup,
    city,
    country,
    date_created,
    vendor_name,
  } = viewItem;

  const handleListing = () => {
    navigate(`/layout/listing/${id}`, { state: { isFromEdit: true } });
    onClose?.();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width="50vw"
      style={{ maxWidth: 1000 }}
      centered
      title="Product Details"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-6">
          <div className="w-1/3">
            <Image
              src={picture_detail}
              alt={title}
              className="w-full h-80 object-cover rounded"
            />
          </div>
          <div className="w-2/3">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              {brand && brand !== "Null" && <li><strong>Brand:</strong> {brand}</li>}
              {parsedItemSpecific.Type && parsedItemSpecific.Type !== "Null" && <li><strong>Type:</strong> {parsedItemSpecific.Type}</li>}
              {parsedItemSpecific.Volume && parsedItemSpecific.Volume !== "Null" && <li><strong>Volume:</strong> {parsedItemSpecific.Volume}</li>}
              {parsedItemSpecific.Formulation && parsedItemSpecific.Formulation !== "Null" && <li><strong>Formulation:</strong> {parsedItemSpecific.Formulation}</li>}
              {parsedItemSpecific.Scent && parsedItemSpecific.Scent !== "Null" && <li><strong>Scent:</strong> {parsedItemSpecific.Scent}</li>}
              {sku && sku !== "Null" && <li><strong>SKU:</strong> {sku}</li>}
              {model && model !== "Null" && <li><strong>Model:</strong> {model}</li>}
              {upc && upc !== "Null" && <li><strong>UPC:</strong> {upc}</li>}
              {min_profit_mergin && min_profit_mergin !== "Null" && <li><strong>Min Profit Margin:</strong> {fmtMarkup(min_profit_mergin)}%</li>}
              {category && category !== "Null" && <li><strong>Category:</strong> {category}</li>}
              {location && location !== "Null" && <li><strong>Location:</strong> {location}</li>}
              {price && price !== "Null" && <li><strong>Price:</strong> ${price}</li>}
              {cost && cost !== "Null" && <li><strong>Cost:</strong> ${cost}</li>}
              {profit_margin && profit_margin !== "Null" && <li><strong>Profit Margin:</strong> {profit_margin}%</li>}
              {percentage_markup && percentage_markup !== "Null" && <li><strong>Percentage Markup:</strong> {percentage_markup}%</li>}
              {fixed_markup && fixed_markup !== "Null" && <li><strong>Fixed Markup:</strong> ${fmtMarkup(fixed_markup)}</li>}
              {vendor_name && vendor_name !== "Null" && <li><strong>Vendor Name:</strong> {vendor_name}</li>}
              {city && city !== "Null" && <li><strong>City:</strong> {city}</li>}
              {country && country !== "Null" && <li><strong>Country:</strong> {country}</li>}
              {date_created && date_created !== "Null" && <li><strong>Date Created:</strong> {date_created}</li>}
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-1">Description:</h3>
          <div
            className="prose prose-sm max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onClose} className="h-10 font-semibold bg-white text-gray-700 border-none hover:!bg-gray-100 hover:!text-gray-700">
            Close
          </Button>
          <Button onClick={handleListing} className="h-10 font-semibold bg-[#089451] text-white border-none hover:!bg-[#06703d] hover:!text-white">
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InventoryModal;