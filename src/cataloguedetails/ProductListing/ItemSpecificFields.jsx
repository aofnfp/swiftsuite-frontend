import { Input } from "antd";
import { Search, X } from "react-feather";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { IoMdCheckmark } from "react-icons/io";
import { Label } from "reactstrap";

// Fallback list used only when the backend's get_item_specifics_fields
// response doesn't include multi_value_fields (e.g. backend hasn't deployed
// yet). The authoritative source is eBay's Taxonomy API
// aspectConstraint.itemToAspectCardinality === "MULTI" per category, which
// the backend now surfaces as multi_value_fields and we receive via the
// multiValueFields prop. Once that field is consistently populated this
// fallback can be removed.
const FALLBACK_MULTI_VALUE_FIELDS = ["Features", "Scent"];

const ItemSpecificFields = ({
  itemSpecificFields,
  requiredFields = [],
  multiValueFields,
  selectedValues,
  setSelectedValues,
  handleSelectChange,
  handleMultiToggle,
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

  // Effective multi-value list: prefer the per-category list from eBay
  // (backend), fall back to the static list only if the prop is absent or
  // empty so behavior degrades gracefully when the backend hasn't shipped.
  const effectiveMultiValueFields = (Array.isArray(multiValueFields) && multiValueFields.length > 0)
    ? multiValueFields
    : FALLBACK_MULTI_VALUE_FIELDS;
  const isMultiField = (fieldName) => effectiveMultiValueFields.includes(fieldName);
  const getMultiValues = (fieldName) => {
    const raw = selectedValues[fieldName] || "";
    return raw ? raw.split(", ").filter(Boolean) : [];
  };

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
                <div className="flex-1 relative min-w-0">
                  {Array.isArray(options) ? (
                    <>
                      {/* Chips row for multi-value aspects (Features, Scent) —
                          each selected value renders as a removable pill above
                          the dropdown trigger. */}
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
                      <div className="flex items-center justify-between gap-2 px-4 py-2 my-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer relative dropdown-trigger"
                        onClick={(e) => toggleDropdown(fieldName, e)}>
                        <span className="text-sm text-gray-700 truncate min-w-0 flex-1">
                          {selectedValues[fieldName] || `Select ${fieldName}`}
                        </span>
                        {isDropdownOpen === fieldName ?
                          <BiChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" /> :
                          <BiChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
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
                                  // Multi-fields: just clear the search input,
                                  // don't wipe the user's selected chips.
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
                            {(() => {
                              const selectedList = isMultiField(fieldName)
                                ? getMultiValues(fieldName)
                                : (selectedValues[fieldName] ? [selectedValues[fieldName]] : []);
                              return selectedList.map((sv) => (
                                <div
                                  key={`pinned-${sv}`}
                                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 cursor-pointer text-sm flex items-center justify-between border-b border-gray-200"
                                  onClick={() => isMultiField(fieldName) ? handleMultiToggle(fieldName, sv) : handleSelectChange(fieldName, sv)}
                                >
                                  <p>
                                    {sv}
                                    {!options.includes(sv) && (
                                      <span className="ml-2 text-xs text-gray-500">(custom)</span>
                                    )}
                                  </p>
                                  <IoMdCheckmark size={20} className="text-black" />
                                </div>
                              ));
                            })()}
                            {filteredOptions(fieldName, options).map(([index, value]) => {
                              const selectedList = isMultiField(fieldName)
                                ? getMultiValues(fieldName)
                                : (selectedValues[fieldName] ? [selectedValues[fieldName]] : []);
                              if (selectedList.includes(value)) return null;
                              return (
                                <div
                                  key={index}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center justify-between"
                                  onClick={() => isMultiField(fieldName) ? handleMultiToggle(fieldName, value) : handleSelectChange(fieldName, value)}
                                >
                                  <p>{value}</p>
                                </div>
                              );
                            })}
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
