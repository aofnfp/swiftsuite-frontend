import { Input } from "antd";
import { Search, X } from "react-feather";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { IoMdCheckmark } from "react-icons/io";
import { Label } from "reactstrap";

const ItemSpecificFields = ({
  itemSpecificFields,
  setItemSpecificFields,
  requiredFields = [],
  selectedValues,
  setSelectedValues,
  handleSelectChange,
  handleMultiToggle,
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
    if (autofillFields.includes(fieldName)) {
      handleListingChange({ target: { name: fieldName.toLowerCase(), value: "" } });
    }
  };

  const MULTI_VALUE_FIELDS = ["Features", "Scent"];
  const isMultiField = (fieldName) => MULTI_VALUE_FIELDS.includes(fieldName);
  const getMultiValues = (fieldName) => {
    const raw = selectedValues[fieldName] || "";
    return raw ? raw.split(", ").filter(Boolean) : [];
  };

  // What the trigger is currently displaying for a single-select field:
  // the explicit selection if any, else the autofilled product value.
  // Used to match the checkmark in the dropdown to the displayed value.
  const currentValue = (fieldName) => {
    if (selectedValues[fieldName]) return selectedValues[fieldName];
    if (autofillFields.includes(fieldName)) {
      return cleanValue(productListing[fieldName?.toLowerCase()] ?? "");
    }
    return "";
  };

  const cleanValue = (val) => {
    if (val === null || val === "Null" || val === "null") return "";
    return val;
  };

  return (
    <section className="item-specific-fields">
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
                    {requiredFields.includes(fieldName.replace(" (Boolean field)", "")) && (
                      <span className="text-red-500">*</span>
                    )}
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
                      {isMultiField(fieldName) && getMultiValues(fieldName).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 mb-1">
                          {getMultiValues(fieldName).map((chip) => (
                            <span key={chip} className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-800 text-xs px-2 py-1 rounded-full">
                              {chip}
                              <button
                                type="button"
                                onClick={() => handleMultiToggle(fieldName, chip)}
                                className="hover:bg-green-100 rounded-full p-0.5"
                                aria-label={`Remove ${chip}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between px-4 py-2 my-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer relative dropdown-trigger"
                        onClick={(e) => toggleDropdown(fieldName, e)}>
                        <span className="text-sm text-gray-700 truncate">
                          {selectedValues[fieldName] || `Select ${fieldName}`}
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
                              onClick={() => {
                                if (isMultiField(fieldName)) {
                                  setFilterValues((prev) => ({ ...prev, [fieldName]: "" }));
                                  setCustomInputValues((prev) => ({ ...prev, [fieldName]: "" }));
                                } else {
                                  close(fieldName);
                                }
                              }}
                              className="p-1 hover:bg-gray-100 rounded-full"
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                          <div className="max-h-[300px] overflow-y-auto" id="folder">
                              {filteredOptions(fieldName, options).map(([index, value]) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center justify-between"
                                onClick={() => isMultiField(fieldName) ? handleMultiToggle(fieldName, value) : handleSelectChange(fieldName, value)}
                              >
                                <p>{value}</p>
                                <p>{(isMultiField(fieldName) ? getMultiValues(fieldName).includes(value) : currentValue(fieldName) === value) && <IoMdCheckmark size={20} className="text-black" />}</p>
                              </div>
                            ))}
                            {/* Custom Input Field */}
                            {customInputValues[fieldName] && !options.includes(customInputValues[fieldName]) && (
                              <div
                                className="px-4 py-2 bg-gray-100 cursor-pointer text-sm font-medium"
                                onClick={() => isMultiField(fieldName) ? handleMultiToggle(fieldName, customInputValues[fieldName]) : handleSelectChange(fieldName, customInputValues[fieldName])}
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
                      value={selectedValues[fieldName] || ""}
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
