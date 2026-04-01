import { Input } from "@heroui/react";
import { Search, X } from "react-feather";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { IoMdCheckmark } from "react-icons/io";
import { Label } from "reactstrap";

const ItemSpecificFields = ({
  itemSpecificFields,
  setItemSpecificFields,
  selectedValues,
  setSelectedValues,
  handleSelectChange,
  handleInputChange,
  filteredOptions,
  filterValues,
  setFilterValues,
  isDropdownOpen,
  setIsDropdownOpen,
  toggleDropdown,
  productListing,
  customInputValues,
  handleListingChange,
  setCustomInputValues,
  dropdownRef,
}) => {

  const close = (fieldName) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: "" }));
    setSelectedValues((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const cleanValue = (val) => {
  if (val === null || val === "Null" || val === "null") return "";
  return val;
};

  const autofillFields = ["Brand", "Location", "Type", "MPN", "Map", "volume", "expiration date", "UPC", "Title", "Quantity", "Model", "Manufacturer", "MSRP", "Price", "SKU", "Product type", "Fragrance Name", "formulation", "Color", "Size", "Depth", "Length", "Weight", "Material", "Country/Region of Manufacture", "California Prop 65 Warning", "Unit Quantity", "Unit Type", "Volume", "Formulation", "Size Type", "US Size", "MSRP", "Shipping Weight", "Shipping Length", "Shipping Width", "Shipping Height", "Best Offer Enabled", "Gift", "Category Mapping", "Availability", "Product", "Description", "Image", "Category", "Brand Name", "UPC Code", "MPN Code", "SKU Code", "Quantity Code", "Product Type Code", "Fragrance Code", "Color Code", "Size Code", "Depth Code", "Length Code", "Weight Code", "Material Code", "Country Code", "Region Code", "Warning Code", "Unit Quantity Code", "Unit Type Code", "Volume Code", "Formulation Code", "Size Type Code", "US Size Code", "MSRP Code", "Shipping Weight Code", "Shipping Length Code", "Shipping Width Code", "Shipping Height Code", "Best Offer Enabled Code", "Gift Code", "Category Mapping Code", "category", "country", "Country of Origin"];

  return (
    <section>
      <div>
        {itemSpecificFields && Object.entries(itemSpecificFields).length > 0 && (
          <div className="gap-4 w-full p-5 rounded-lg py-5 bg-white">
            <h1 className="font-bold text-xl">ITEM SPECIFICS</h1>
            <p className="text-gray-500">Buyers also search for these details</p>
            {Object.entries(itemSpecificFields).map(([fieldName, options]) => (
              <div key={fieldName} className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="relative flex items-center gap-1">
                  <Label
                    className="min-w-[200px] text-sm font-medium flex items-center gap-1 text-gray-700">
                    {fieldName}
                    {/* {["Unit Type", "Scent", "Fragrance Name", "Features", "Size Type"].includes(fieldName) && (
                      <span className="text-red-500">*</span>
                    )} */}
                  </Label>

                  {/* {["Unit Type", "Scent", "Fragrance Name", "Features", "Size Type"].includes(fieldName) && (
                    <div className="group relative">
                      <span className="cursor-help text-gray-500 -ms-5">ℹ️</span>
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-max bg-black text-white text-xs rounded-md p-2 shadow-md z-10">
                        This field is required for eBay listings
                      </div>
                    </div>
                  )} */}
                </div>
                <div className="flex-1 relative">
                  {Array.isArray(options) ? (
                    <>
                      <div className="flex items-center justify-between px-4 py-2 my-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer relative dropdown-trigger"
                        onClick={(e) => toggleDropdown(fieldName, e)}>
                        <span className="text-sm text-gray-700 truncate">
                          {autofillFields.includes(fieldName) ? selectedValues[fieldName] || cleanValue(productListing[fieldName?.toLowerCase()] ?? '') || `Select ${fieldName}`
                            : selectedValues[fieldName] || `Select ${fieldName}`}
                        </span>
                        {isDropdownOpen === fieldName ?
                          <BiChevronUp className="h-5 w-5 text-gray-500" /> :
                          <BiChevronDown className="h-5 w-5 text-gray-500" />
                        }
                      </div>
                      {isDropdownOpen === fieldName && (
                        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50" ref={dropdownRef} onClick={(e) => e.stopPropagation()}> 
                          <div className="sticky top-0 bg-white p-2 border-b flex items-center gap-2">
                            <Search className="h-4 w-4 text-gray-400" />
                            <Input type="text" className="flex-1 text-sm" value={filterValues[fieldName] || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                setFilterValues(prev => ({ ...prev, [fieldName]: value }));
                                setCustomInputValues(prev => ({ ...prev, [fieldName]: value }));
                              }}
                              placeholder={`Search ${fieldName.toLowerCase()}...`}
                            />
                            <button
                              onClick={() => close(fieldName)}
                              className="p-1 hover:bg-gray-100 rounded-full"
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                          <div className="max-h-[300px] overflow-y-auto" id="folder">
                            {autofillFields.includes(fieldName) &&
                              productListing[fieldName?.toLowerCase()] && (
                                <div
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                  onClick={(e) =>handleSelectChange(fieldName, productListing[fieldName.toLowerCase()])} 
                                >
                                  {productListing[fieldName.toLowerCase()]}
                                </div>
                              )}
                            {filteredOptions(fieldName, options).map(([index, value]) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center justify-between"
                                onClick={() => handleSelectChange(fieldName, value)}
                              >
                                <p>{value}</p>
                                <p>{selectedValues[fieldName] === value && <IoMdCheckmark size={20} className="text-black" />}</p>
                              </div>
                            ))}
                            {/* Custom Input Field */}
                            {customInputValues[fieldName] && !options.includes(customInputValues[fieldName]) && (
                              <div
                                className="px-4 py-2 bg-gray-100 cursor-pointer text-sm font-medium"
                                onClick={() => handleSelectChange(fieldName, customInputValues[fieldName])}
                              >
                                {customInputValues[fieldName]} (Custom)
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Input
                      type="text"
                      className="w-full bg-white rounded-lg focus:outline-none my-3"
                      value={selectedValues[fieldName] ||
                        (autofillFields.includes(fieldName) ? cleanValue(productListing[fieldName?.toLowerCase()] ?? '') : '') ||
                        ""}
                      onChange={(e) => handleInputChange(fieldName, e.target.value)}
                      placeholder={`Enter ${fieldName}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>

  );
};

export default ItemSpecificFields;
