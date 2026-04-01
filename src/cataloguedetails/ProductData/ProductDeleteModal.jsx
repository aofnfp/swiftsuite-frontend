import React from "react";

const ProductDeleteModal = ({ selectedItem, onConfirm = () => {}, onCancel = () => {} }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this product?</h2>

        <div className="mb-4 text-sm text-gray-700">
          {selectedItem ? (
            <>
              <div className="font-medium">{selectedItem?.title || selectedItem?.productName || selectedItem?.model}</div>
              <div className="text-xs text-gray-500">SKU: {selectedItem?.sku || selectedItem?.itemnumber || "N/A"}</div>
            </>
          ) : (
            <div>No product selected</div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => onConfirm(selectedItem)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Yes
          </button>

          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDeleteModal;