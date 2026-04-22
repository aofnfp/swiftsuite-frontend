import React from 'react'
import Loader from '../../hooks/Loader'

const GetCategory = ({ isModalOpen, handleCloseModal, setIsModalOpen, loader, searchQuery, handleSearchChange, filteredFirstCategories, filteredSubcategories, filteredMiddleCategories, filteredLastCategories, handleFirstCategoryClick, handleCategoryClick, handleMiddleCategoryClick, handleLastCategoryClick }) => {


  return (
    <div>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg w-[90%] max-h-[80vh] overflow-y-auto shadow-lg">
            <h3 className="font-bold text-2xl mb-4">Choose Category</h3>

            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search categories..."
              className="border border-gray-300 p-2 mb-4 w-full"
            />

            {loader && (
              <Loader />
            )}

            <div className="grid grid-cols-4 gap-4">
              {!loader && filteredFirstCategories?.length > 0 && (
                <div className="w-full">
                  <h3 className="font-bold mb-4">First Category</h3>
                  {filteredFirstCategories.map((item, index) => (
                    <div className="border border-gray-300 p-4" key={index}>
                      <span onClick={() => handleFirstCategoryClick(item.categoryId)}
                        className="cursor-pointer block p-2 mb-5 bg-gray-200 rounded hover:bg-green-600 hover:text-white">
                        <p>{item.categoryName}</p>
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {!loader && filteredSubcategories?.length > 0 && (
                <div className="w-full">
                  <h3 className="font-bold mb-4">Subcategories</h3>
                  {filteredSubcategories.map((item, index) => (
                    <div className="border border-gray-300 p-4" key={index}>
                      <span onClick={() => handleCategoryClick(item.categoryId)}
                        className="cursor-pointer block p-2 mb-5 bg-gray-200 rounded hover:bg-green-600 hover:text-white">
                        <p>{item.categoryName}</p>
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {!loader && filteredMiddleCategories?.length > 0 && (
                <div className="w-full">
                  <h3 className="font-bold">Middle Categories</h3>
                  {filteredMiddleCategories.map((middleCategory) => (
                    <div className="border border-gray-300 p-4" key={middleCategory.categoryId}>
                      <span onClick={() => handleMiddleCategoryClick(middleCategory.categoryId)}
                        className="cursor-pointer block mb-2 p-2 bg-gray-200 rounded hover:bg-green-600 hover:text-white">
                        <p>{middleCategory.categoryName}</p>
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {!loader && filteredLastCategories?.length > 0 && (
                <div className="w-full">
                  <h3 className="font-bold">Last Category</h3>
                  {filteredLastCategories.map((lastCategory) => (
                    <div className="border border-gray-300 p-4" key={lastCategory.categoryId}>
                      <span onClick={() => handleLastCategoryClick(lastCategory.categoryId)}
                        className="cursor-pointer block mb-2 p-2 bg-gray-200 rounded hover:bg-green-600 hover:text-white">
                        <p>{lastCategory.categoryName}</p>
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {!loader && filteredFirstCategories?.length === 0 && filteredSubcategories?.length === 0 && filteredMiddleCategories?.length === 0 && filteredLastCategories?.length === 0 && (
                <div className="w-full col-span-3 text-center">
                  <p className="text-gray-500">Nothing found. Try another search.</p>
                </div>
              )}
            </div>

            <button type='button'
              onClick={handleCloseModal}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GetCategory