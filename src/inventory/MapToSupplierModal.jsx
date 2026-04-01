import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const MapToSupplierModal = ({ isOpen, onClose, productData, catalogue }) => {
  const [selectedSupplier, setSelectedSupplier] = useState('FragranceX');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const suppliers = ['FragranceX', 'Lipsey', 'RSR'];

  const handleMap = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative">
        <div className="p-6 pb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Map to Supplier</h2>
          <p className="text-sm text-gray-700 leading-snug mb-2">
            {productData?.title || 'Gucci Hand Bag Size 39 for women Italian Model Red'}
          </p>
          <div className="inline-block">
            <span className="text-xs font-semibold text-gray-600">SKU: </span>
            <span className="text-xs text-gray-800">{productData?.sku}</span>
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="inline-block">
            <span className="text-xs font-semibold text-gray-600">UPC: </span>
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-medium">
              {productData?.upc}
            </span>
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-left text-sm text-teal-600 font-medium flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <span>Select supplier</span>
              <svg
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                {catalogue?.map((supplier) => (
                  <button
                    key={supplier}
                    onClick={() => {
                      setSelectedSupplier(supplier);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-green-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <span>{supplier.name}</span>
                    {selectedSupplier === supplier && (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleMap}
            className="flex-1 bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
          >
            Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapToSupplierModal;