import React from 'react'

const InventoryHeader = ({
  searchTerm,
  handleSearchChange,
  handleClearSearch,
  entriesPerPage,
  handleEntriesChange
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Saved Listings</h1>

      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div className="relative flex-grow">
          <div className="flex items-center">
            <label className="mr-2 text-sm text-gray-600">Search:</label>
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search listings..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label className="mr-2 text-sm text-gray-600">Show:</label>
          <select
            value={entriesPerPage}
            onChange={handleEntriesChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            {[5, 10, 15, 20].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span className="ml-2 text-sm text-gray-600">entries</span>
        </div>
      </div>
    </div>
  );
};

export default InventoryHeader