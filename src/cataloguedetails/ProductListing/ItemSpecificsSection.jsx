import React, { useEffect } from "react";
import { Tooltip } from "antd";
import GetCategory from "./GetCategory";
import ItemSpecificFields from "./ItemSpecificFields";
import { BiCategoryAlt, BiChevronDown, BiChevronUp } from "react-icons/bi";

const ItemSpecificsSection = ({
  isEbay,
  isEbayOpen,
  setIsEbayOpen,
  productListing,
  isLoadingCategory,
  handleOpenModal,
  isModalOpen,
  handleCloseModal,
  loader,
  searchQuery,
  handleSearchChange,
  filteredFirstCategories,
  filteredSubcategories,
  filteredMiddleCategories,
  filteredLastCategories,
  handleFirstCategoryClick,
  handleCategoryClick,
  handleMiddleCategoryClick,
  handleLastCategoryClick,
  itemSpecificFields,
  setItemSpecificFields,
  requiredFields,
  selectedValues,
  setSelectedValues,
  handleSelectChange,
  customInputValues,
  setCustomInputValues,
  handleInputChange,
  filteredOptions,
  filterValues,
  setFilterValues,
  isDropdownOpen,
  setIsDropdownOpen,
  toggleDropdown,
  dropdownRef,
  handleListingChange,
}) => {
  
useEffect(() => {
  if (productListing?.category_id) {
    setIsEbayOpen(true);
    handleOpenModal();
  }
}, [productListing?.category_id]);


  if (!isEbay) return null;

  return (
    <>
      <div onClick={() => setIsEbayOpen(!isEbayOpen)} className="bg-gray-50 cursor-pointer p-4 rounded border border-gray-300 my-2">
        <div className="flex items-center justify-between">
          <p>
            <img src="https://i.postimg.cc/3xZSgy9Z/ebay.png" alt="eBay" className="w-20 h-10" />
          </p>
          <div className="text-gray-500">
            {isEbayOpen ? <BiChevronUp size={30} /> : <BiChevronDown size={30}/>}
          </div>
        </div>
      </div>
      {isEbayOpen && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <div>
            <label className="my-3 font-bold">Category</label>
            <div className="flex items-center space-x-2 my-3">
              <input
                type="text"
                value={productListing?.category_id || ""}
                onChange={handleListingChange}
                name="category_id"
                placeholder="Enter category ID"
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Tooltip title="get category" placement="top">
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-500"
                >
                  {isLoadingCategory ? <span>Loading...</span> : <BiCategoryAlt className="w-5 h-5" />}
                </button>
              </Tooltip>
            </div>
            <GetCategory
              isModalOpen={isModalOpen}
              handleCloseModal={handleCloseModal}
              loader={loader}
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              filteredFirstCategories={filteredFirstCategories}
              filteredSubcategories={filteredSubcategories}
              filteredMiddleCategories={filteredMiddleCategories}
              filteredLastCategories={filteredLastCategories}
              handleFirstCategoryClick={handleFirstCategoryClick}
              handleCategoryClick={handleCategoryClick}
              handleMiddleCategoryClick={handleMiddleCategoryClick}
              handleLastCategoryClick={handleLastCategoryClick}
              setIsModalOpen={() => {}}
            />
          </div>
          <div>
            <ItemSpecificFields
              itemSpecificFields={itemSpecificFields}
              setItemSpecificFields={setItemSpecificFields}
              requiredFields={requiredFields}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              handleSelectChange={handleSelectChange}
              customInputValues={customInputValues}
              setCustomInputValues={setCustomInputValues}
              handleInputChange={handleInputChange}
              filteredOptions={filteredOptions}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              toggleDropdown={toggleDropdown}
              productListing={productListing}
              handleListingChange={handleListingChange}
              dropdownRef={dropdownRef}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ItemSpecificsSection;
