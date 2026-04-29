import { Input } from "antd";
import { Search, X } from "react-feather";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { IoMdCheckmark } from "react-icons/io";
import { Label } from "reactstrap";

const ItemSpecificFields = ({
  itemSpecificFields,
  requiredFields = [],
  selectedValues,
  setSelectedValues,
  handleSelectChange,
  handleInputChange,
  filteredOptions,
  filterValues,
  setFilterValues,
  isDropdownOpen,
  toggleDropdown,
  customInputValues,
  setCustomInputValues,
  dropdownRef,
}) => {

  const close = (fieldName) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: "" }));
    setSelectedValues((prev) => ({ ...prev, [fieldName]: "" }));
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
                </div>
                <div className="flex-1 relative">
                  {Array.isArray(options) ? (
                    <>
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
                                close(fieldName);
                              }}
                              className="p-1 hover:bg-gray-100 rounded-full"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                          <div className="max-h-[300px] overflow-y-auto" id="folder">
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
