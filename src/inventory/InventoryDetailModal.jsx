import React, { useState } from 'react';
import { X, Edit, ShoppingCart, CheckCircle, Check } from 'lucide-react';
import { MdDelete } from 'react-icons/md';
import { safeJSONParse, fmtMarkup } from '../utils/utils';
import MarketLogos from './MarketLogos';
import VendorLogo from './VendorLogos';
import MapToSupplierModal from './MapToSupplierModal';

const InventoryDetailModal = ({ isInventoryDetailOpen, setIsInventoryDetailOpen, viewItem, handleEditInventory, setSelectedItemId, setShowModal, catalogue }) => {

  if (!isInventoryDetailOpen) return null;

  const [selectedImage, setSelectedImage] = useState(viewItem?.picture_detail || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const thumbnails = Array.isArray(viewItem.thumbnailImage) ? viewItem.thumbnailImage : safeJSONParse(viewItem.thumbnailImage) || [];

  const displayedThumbnails = thumbnails.slice(0, 3);
  const hasMoreThumbnails = thumbnails.length > 3;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start lg:items-center justify-center p-3 lg:p-6 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full relative overflow-hidden">
        <button
          onClick={() => setIsInventoryDetailOpen(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-orange-600" />
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 lg:gap-8 p-4 lg:p-8">
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img
                src={selectedImage || viewItem?.picture_detail}
                alt={viewItem?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[{ src: viewItem?.picture_detail }]
                .concat(displayedThumbnails.map(img => ({ src: img })))
                .map((thumb, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(thumb.src)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === thumb.src
                      ? 'border-teal-500 ring-2 ring-teal-100'
                      : 'border-gray-200'
                      }`}
                  >
                    <img
                      src={thumb.src}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              {hasMoreThumbnails && (
                <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-teal-50 border-2 border-dashed border-teal-300 flex flex-col items-center justify-center text-teal-600 text-[10px] font-medium">
                  <span className="text-xl">+</span>
                  <span>{thumbnails.length - 3} more</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${viewItem.ends_status
                    ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {viewItem.end_status ? 'Active' : 'Inactive'}
                  </span>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
              {viewItem?.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-bold text-gray-600">SKU:</span>
                <span className="ml-2 bg-gray-200 px-2 py-1 rounded">
                  {viewItem.sku}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-600">UPC:</span>
                <span className="ml-2 bg-gray-200 px-2 py-1 rounded">
                  {viewItem.upc}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-600">Category:</span>
                <span className="ml-2 bg-gray-200 px-2 py-1 rounded">
                  {viewItem?.category?.split('|').pop()}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-600">Brand:</span>
                <span className="ml-2 bg-gray-200 px-2 py-1 rounded">
                  {viewItem?.brand}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Fixed Markup</div>
                <div className="bg-blue-100 text-blue-700 py-2 rounded-xl text-xl font-bold">
                  {fmtMarkup(viewItem?.fixed_markup)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Quantity</div>
                <div className="bg-gray-100 text-gray-800 py-2 rounded-xl text-xl font-bold">
                  {viewItem?.quantity}
                </div>
              </div>
              <div className="text-center col-span-2 sm:col-span-1">
                <div className="text-xs text-gray-600 mb-1">Price</div>
                <div className="bg-green-600 text-white py-2 rounded-xl text-xl font-bold">
                  ${viewItem?.price}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-600">
                Marketplace Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                <MarketLogos
                  marketLogos={viewItem.marketLogos}
                  marketName={viewItem.market_name}
                />
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900" onClick={() => handleEditInventory(viewItem.id)}>
                    <Edit className="w-4 h-4" />
                    Edit Listing
                  </button>
                  <span onClick={() => {
                    setSelectedItemId(viewItem.id);
                    setShowModal(true);
                  }} className="flex items-center gap-1 text-red-600 cursor-pointer">
                    <MdDelete className="w-4 h-4" />
                    Delete
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Map Status</span>
              {viewItem?.end_status ? (
                <span className="flex items-center gap-2 text-green-600">
                  Mapped <CheckCircle className="w-5 h-5" />
                </span>
              ) : (
                <span className="flex items-center gap-2 text-orange-600">
                  Unmapped <X className="w-4 h-4" />
                </span>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                <span>Vendors Mapped to</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <VendorLogo vendor={viewItem.vendor_name} />
                  <div>
                    <div className="font-medium">{viewItem.vendor_name}</div>
                    <div className="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full inline-block mt-1">
                      Category: Eau Der Perfume
                    </div>
                  </div>
                </div>
                <button
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Edit className="w-5 h-5" />
                  Map to different supplier
                </button>
              </div>
            </div>
          </div>
        </div>

        <MapToSupplierModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productData={viewItem}
          catalogue={catalogue}
        />
      </div>
    </div>

  );
};

export default InventoryDetailModal;