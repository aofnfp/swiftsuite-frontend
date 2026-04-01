import React from 'react'

const DeleteModal = ({ onClose, onConfirm, selectedItemId }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[60]">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Do you also want to end the listing on eBay?
        </h2>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => onConfirm(selectedItemId, true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Yes, End on eBay
          </button>

          <button
            onClick={() => onConfirm(selectedItemId, false)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            No, Just Delete
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal