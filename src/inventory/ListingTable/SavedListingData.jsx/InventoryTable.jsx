import React from 'react'

const InventoryTable = ({
  filteredUsers,
  actionDropdown,
  dropdownRef,
  handleActionClick,
  handleActionSelect,
  handleListing,
  handleDelete,
  deleteLoader,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Image", "SKU", "Title", "Price", "Created", "Marketplace", "Action"].map(text => (
              <th key={text}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {text}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200" ref={dropdownRef}>
          {filteredUsers.map(user => (
            <tr key={user?.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4">
                <img
                  src={user?.picture_detail}
                  className="w-10 h-10 rounded object-cover"
                />
              </td>

              <td className="px-6 py-4 text-sm text-gray-500">
                {user?.sku !== "Null" ? user?.sku : ""}
              </td>

              <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                {user?.title !== "Null" ? user?.title : ""}
              </td>

              <td className="px-6 py-4 text-sm text-gray-500">
                ${user?.start_price !== "Null" ? user?.start_price : ""}
              </td>

              <td className="px-6 py-4 text-sm text-gray-500">
                {user?.date_created}
              </td>

              <td className="px-6 py-4">
                <img
                  src={
                    user?.marketLogos?.ebay_logo ||
                    (user?.market_name === "Woocommerce"
                      ? "https://i.postimg.cc/Wbfbs7QB/woocommerce.png"
                      : "")
                  }
                  className="w-8 h-8 object-contain"
                />
              </td>

              <td className="px-6 py-4 relative text-sm text-gray-500">
                {actionDropdown === user?.id && (
                  <div className="absolute right-12 bottom-0 w-48 bg-white border rounded-md shadow-lg z-10">
                    <button onClick={() => handleActionSelect(user?.id)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      View Details
                    </button>

                    <button onClick={() => handleListing(user?.id)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      Proceed to Listing
                    </button>

                    <button onClick={() => handleDelete(user?.id)}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                      {deleteLoader[user?.id] ? "..." : "Delete"}
                    </button>
                  </div>
                )}

                <button
                  className="p-2 rounded hover:bg-gray-100"
                  onClick={() => handleActionClick(user?.id)}
                >
                  ⋮
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
