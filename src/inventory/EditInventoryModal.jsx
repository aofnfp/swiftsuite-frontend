import React, { useState } from "react";
import { Input } from "@heroui/react";
import { toast, Toaster } from "sonner";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { updateInventoryProductDetails } from "../api/authApi";

const EditInventoryModal = ({ isOpen, onClose, inventoryEdit, setInventoryEdit, token, userId }) => {
  const [loader, setLoader] = useState(false);

  if (!inventoryEdit) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInventoryEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async () => {
    const editDetails = {
      market_item_id: inventoryEdit.market_item_id || null,
      title: inventoryEdit.title || null,
      description: inventoryEdit.description || null,
      sku: inventoryEdit.sku || null,
      location: inventoryEdit.location || null,
      category_id: inventoryEdit.category_id || null,
      start_price: inventoryEdit.start_price || null,
      picture_detail: inventoryEdit.picture_detail || null,
      postal_code: inventoryEdit.postal_code || null,
      quantity: inventoryEdit.quantity || null,
      return_profileID: inventoryEdit.return_profileID || null,
      return_profileName: inventoryEdit.return_profileName || null,
      payment_profileID: inventoryEdit.payment_profileID || null,
      payment_profileName: inventoryEdit.payment_profileName || null,
      shipping_profileID: inventoryEdit.shipping_profileID || null,
      shipping_profileName: inventoryEdit.shipping_profileName || null,
      bestOfferEnabled: inventoryEdit.bestOfferEnabled || null,
      listingType: inventoryEdit.listingType || null,
      gift: inventoryEdit.gift || null,
      categoryMappingAllowed: inventoryEdit.categoryMappingAllowed || null,
      Color: inventoryEdit.Color || null,
      Material: inventoryEdit.Material || null,
      Brand: inventoryEdit.brand || null,
      "Pet Type": inventoryEdit.PetType || null,
      Type: inventoryEdit.Type || null,
      Model: inventoryEdit.Model || "Null",
      MPN: inventoryEdit.MPN || "Null",
      "Country/Region of Manufacture": inventoryEdit.CountryRegionofManufacture || null,
      "California Prop 65 Warning": inventoryEdit.CaliforniaProp65Warning || null,
      "Unit Quantity": inventoryEdit.UnitQuantity || null,
      "Unit Type": inventoryEdit.UnitType || null,
      product: inventoryEdit.product_id || null,
      total_product_cost: inventoryEdit.total_product_cost || "Null",
      us_size: inventoryEdit.us_size || null,
      upc: inventoryEdit.upc,
      send_min_price: inventoryEdit.send_min_price,
      profit_margin: inventoryEdit.profit_margin,
      min_profit_mergin: inventoryEdit.min_profit_mergin,
      shipping_weight: inventoryEdit.shipping_weight,
      shipping_width: inventoryEdit.shipping_width,
      shipping_cost: inventoryEdit.shipping_cost,
      shipping_height: inventoryEdit.shipping_height,
      shipping_length: inventoryEdit.shipping_length,
      maximum_quantity: inventoryEdit.maximum_quantity,
      minimum_quantity: inventoryEdit.minimum_quantity,
      model: inventoryEdit.model,
      msrp: inventoryEdit.msrp,
      donation_percentage: inventoryEdit.donation_percentage,
      enable_charity: inventoryEdit.enable_charity,
      fixed_markup: inventoryEdit.fixed_markup,
      fixed_percentage_markup: inventoryEdit.fixed_percentage_markup,
      charity_id: inventoryEdit.charity_id,
      city: inventoryEdit.city || null,
      cost: inventoryEdit.cost || "Null",
      country: inventoryEdit.country || null,
      category: inventoryEdit.category,
      mode: inventoryEdit.mode || "Null",
      price: inventoryEdit.price || "Null",
      percentage_markup: inventoryEdit.percentage_markup || "Null",
      thumbnailImage: inventoryEdit.thumbnailImage || "Null",
    }
    
    handleInventoryDetails(editDetails);
  };

  const handleInventoryDetails = async (editDetails) => {
    setLoader(true);
    try {
      const response = updateInventoryProductDetails(userId, inventoryEdit.market_item_id, editDetails);
      setLoader(false);
      if (response.data === 200) {
        toast.success("Item updated successfully");
        onClose();
      } else {
        setLoader(false);
      }
    } catch (error) {
      toast.error("Failed to update item");
      setLoader(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Toaster position="top-right" />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl transition-all flex flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Edit Inventory Details
                  </Dialog.Title>
                </div>

                <div className="overflow-y-auto p-6 space-y-4">
                  <div className="w-full flex justify-center mb-2">
                    <img
                      src={inventoryEdit?.picture_detail}
                      alt="Image"
                      className="w-40 h-40 object-contain border rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Description" name="description" value={inventoryEdit?.description || ""} onChange={handleChange} />
                    <Input label="Title" name="title" value={inventoryEdit?.title || ""} onChange={handleChange} />
                    <Input label="Quantity" name="quantity" value={inventoryEdit?.quantity || ""} onChange={handleChange} />
                    <Input label="MSRP" name="msrp" value={inventoryEdit?.msrp || ""} onChange={handleChange} />
                    <Input label="UPC" name="upc" value={inventoryEdit?.upc || ""} onChange={handleChange} />
                    <Input label="MPN" name="mpn" value={inventoryEdit?.mpn || ""} onChange={handleChange} />
                    <Input label="SKU" name="sku" value={inventoryEdit?.sku || ""} onChange={handleChange} />
                    <Input label="Brand" name="brand" value={inventoryEdit?.brand || ""} onChange={handleChange} />
                    <Input label="Price" name="price" value={inventoryEdit?.price || ""} onChange={handleChange} />
                    <Input label="Map" name="map" value={inventoryEdit?.map || ""} onChange={handleChange} />
                    <Input label="Fixed Markup" name="fixed_markup" value={inventoryEdit?.fixed_markup || ""} onChange={handleChange} />
                    <Input label="Percentage Markup" name="percentage_markup" value={inventoryEdit?.percentage_markup || ""} onChange={handleChange} />
                    <Input label="Minimum Profit Margin" name="min_profit_mergin" value={inventoryEdit?.min_profit_mergin || ""} onChange={handleChange} />
                  </div>
                </div>

                <div className="p-4 border-t flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    {loader ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default EditInventoryModal;
