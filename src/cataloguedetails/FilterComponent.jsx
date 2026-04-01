import React from "react";
import { FaCaretDown } from "react-icons/fa";

const FilterComponent = ({
  endpoint,
  filterOpen,
  setfilterOpen,
  open,
  toggleDropdown,
  handleOptionClick,
  symbolMap,
  filterType,
  filterValue,
  onFilterValueChange,
  handleFilterByUPCChange,
  formFilters,
  handleFormInputChange,
  handleSubmit,
  filterByUPC,
  openQuantity,
  toggleQuantityDropdown,
  handleQuantityClick,
  quantityMap,
  filterQuantityType,
  filterQuantityValue,
  onFilterQuantityChange,
}) => {

  const userId = (localStorage.getItem('userId'))

  return (
    <div className={filterOpen ? "ms-[2%] fixed text-white" : "hidden"}>
      {/* Forms */}
      <form
        className=""
        onSubmit={handleSubmit}
      >
        {/* FRAGRANCEX */}
        {endpoint === `https://service.swiftsuite.app/vendor/catalogue-fragrancex/${userId}/` && (
        <div className="w-full grid lg:grid-cols-4 md:grid-cols-4 grid-cols-3 lg:gap-5 md:gap-10 my-4 lg:ms-[1%]">
            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <input className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black" type="text" placeholder="e.g  obsession for men" name="type"
                value={formFilters.type} onChange={handleFormInputChange} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name">Title</label>
              <input className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black" type="text" placeholder="e.g charlie gold" name="productName"
                value={formFilters.productName} onChange={handleFormInputChange} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name">Gender</label>
              <input className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black" type="text" placeholder="e.g  woman" name="gender"
                value={formFilters.gender} onChange={handleFormInputChange}/>
            </div>
            <div className="flex flex-col">
              <label htmlFor="name">Brand</label>
              <input className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white h-[35px] w-[80%] outline-none text-black" type="text" placeholder="e.g Yardley London" name="brandName"
                value={formFilters.brandName} onChange={handleFormInputChange} />
            </div>
          </div>
        )}

        {/* LIPSEY */}
        {endpoint === `https://service.swiftsuite.app/vendor/catalogue-lipsey/${userId}/` && (
          <div className="w-full grid lg:grid-cols-4 md:grid-cols-4 grid-cols-4 lg:gap-5 md:gap-10 my-4 lg:ms-[1%]">
            {/* Lipsey specific inputs */}
            <div className="flex flex-col">
              <label htmlFor="name">Shippingcost</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g  calvin klein"
                name="shippingcost"
                value={formFilters.shippingcost}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name">Name/Type</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g  Rifle"
                name="type"
                value={formFilters.type}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="title">Title/Model</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g   P365 X-MACRO COMP"
                name="model"
                value={formFilters.model}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="title">MSRP</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g   79.53"
                name="msrp"
                value={formFilters.msrp}
                onChange={handleFormInputChange}
              />
            </div>
          </div>
        )}

        {/* CWR */}
        {endpoint === `https://service.swiftsuite.app/vendor/catalogue-cwr/${userId}/` && (
          <div className="w-full grid lg:grid-cols-4 md:grid-cols-4 grid-cols-4 lg:gap-5 md:gap-10 my-4 lg:ms-[1%] ">
            {/* CWR specific inputs */}
            <div className="flex flex-col">
              <label htmlFor="name">Brand/Manufacturer</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g  calvin klein"
                name="manufacturer_name"
                value={formFilters.manufacturer_name}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name">Name/Category</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g  Rifle"
                name="category_name"
                value={formFilters.category_name}
                onChange={handleFormInputChange}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="title">Title</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g   P365 X-MACRO COMP"
                name="title"
                value={formFilters.title}
                onChange={handleFormInputChange}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="title">SKU</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g   P365 X-MACRO COMP"
                name="sku"
                value={formFilters.sku}
                onChange={handleFormInputChange}
              />
            </div>
          </div>
        )}

        {/* SSI */}
        {endpoint === `https://service.swiftsuite.app/vendor/catalogue-ssi/${userId}/` && (
          <div className="w-full grid lg:grid-cols-4 md:grid-cols-4 grid-cols-4 lg:gap-5 md:gap-10 my-4 lg:ms-[1%] ">
            <div className="flex flex-col">
              <label htmlFor="name">Brand/Manufacturer</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g  calvin klein"
                name="manufacturer"
                value={formFilters.manufacturer}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name">Name/Category</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g  Golf"
                name="category"
                value={formFilters.category}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="title">SKU</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g   1110201"
                name="sku"
                value={formFilters.sku}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="title">MSRP</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g   79.53"
                name="msrp"
                value={formFilters.msrp}
                onChange={handleFormInputChange}
              />
            </div>
          </div>
        )}

        {endpoint === `https://service.swiftsuite.app/vendor/catalogue-zanders/${userId}/` && (
          <div className="w-full grid lg:grid-cols-4 md:grid-cols-4 grid-cols-4 lg:gap-5 md:gap-10 my-4 lg:ms-[1%] ">
            {/* Lipsey specific inputs */}
            <div className="flex flex-col">
              <label htmlFor="name">Brand/Manufacturer</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g  calvin klein"
                name="manufacturer"
                value={formFilters.manufacturer}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="category">Category</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g  Rifle"
                name="category"
                value={formFilters.category}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description">DESCRIPTION</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g   Semi-fancy Walnut Monte Carlo stock-Rubber"
                name="description"
                value={formFilters.description}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="title">MSRP</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g   79.53"
                name="msrp"
                value={formFilters.msrp}
                onChange={handleFormInputChange}
              />
            </div>
          </div>
        )}

         {/* RSR */}
         {endpoint === `https://service.swiftsuite.app/vendor/catalogue-rsr/${userId}/` && (
          <div className="w-full grid lg:grid-cols-5 md:grid-cols-4 grid-cols-4 lg:gap-5 md:gap-10 my-4 lg:ms-[1%] ">
            {/* RSR specific inputs */}
            <div className="flex flex-col">
              <label htmlFor="brand">Brand/Manufacturer</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g  calvin klein"
                name="manufacturer_name"
                value={formFilters.manufacturer_name}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name">Name/Category</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g  Golf"
                name="category_name"
                value={formFilters.category_name}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="flex flex-col">

              <label htmlFor="title">Title</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g  Golf"
                name="title"
                value={formFilters.title}
                onChange={handleFormInputChange}
              />  
            </div>
            <div className="flex flex-col">
              <label htmlFor="sku">SKU</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g   1110201"
                name="sku"
                value={formFilters.sku}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="msrp">MSRP</label>
              <input
                className="rounded-md p-2 sm:text-xs lg:text-base bg-transparent bg-white  h-[35px] w-[80%] outline-none text-black"
                type="text"
                placeholder="e.g 79.53"
                name="msrp"
                value={formFilters.msrp}
                onChange={handleFormInputChange}
              />
            </div>
          </div>
        )}

        {/* Neutral specific inputs */}
        <div className="w-full grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 lg:gap-5 md:gap-10 my-4 lg:ms-[1%] ">
          {/* PRICE DROPDOWN */}
          <div>
            <p>Price</p>
            <div className="flex h-[58%]">
              <div className="relative w-[20%] bg-white border-r-1 border-black rounded-l">
                <div
                  className="flex text-black cursor-pointer py-1 border-gray-300"
                  onClick={toggleDropdown}
                >
                  <div>
                    <FaCaretDown className="mt-[5px]" />
                  </div>
                  {symbolMap[filterType]}
                </div>
                {open && (
                  <div className="absolute py-1  w-[400%] bg-white text-black border">
                    {Object.keys(symbolMap).map((key) => (
                      <div
                        key={key}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleOptionClick(key)}
                      >
                        {key}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input
                className="text-black w-[60%] px-4 py-1 rounded-r outline-none"
                type="number"
                placeholder="e.g  $250"
                value={filterValue}
                onChange={onFilterValueChange}
              />
            </div>
          </div>


          {/* QUANTITY DROPDOWN */}
          <div>
            <p>Quantity</p>
            <div className="flex h-[58%]">
              <div className="relative w-[20%] bg-white border-r-1 border-black rounded-l">
                <div
                  className="flex text-black cursor-pointer py-1 border-gray-300"
                  onClick={toggleQuantityDropdown}
                >
                  <div className="">
                    <FaCaretDown className="mt-[5px]" />
                  </div>

                  <div>{quantityMap[filterQuantityType]}</div>
                </div>
                {openQuantity && (
                  <div className="absolute  w-[400%] bg-white text-black border border-gray-300">
                    {Object.keys(quantityMap).map((key) => (
                      <div
                        key={key}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleQuantityClick(key)}
                      >
                        {key}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div></div>
              <input
                className="text-black w-[60%] px-4 py-1 rounded-r outline-none"
                type="number"
                placeholder="e.g  200"
                value={filterQuantityValue}
                onChange={onFilterQuantityChange}
              />
            </div>
          </div>
          <div className="flex gap-1 mt-5">
            <input
              className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-green-500 checked:border-green-500 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5"
              type="checkbox"
              checked={filterByUPC}
              onChange={handleFilterByUPCChange}
            />
            <label htmlFor="filterByUPC" className="mt-1">UPC</label>
          </div>


          <button
            className="bg-white rounded border hover:bg-[#089451] hover:text-white hover:border-white text-[#089451] w-[40%] lg:mt-6 mt-4 h-[35px]"
            type="submit"
          >
            Search
          </button>
        </div>
      </form>

    </div>
  );
};

export default FilterComponent;