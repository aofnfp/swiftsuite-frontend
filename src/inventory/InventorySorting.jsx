import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";

const InventorySorting = ({ sortConfig, setSortConfig }) => {
  const SORT_OPTIONS = [
    { key: "title", label: "Title" },
    { key: "upc", label: "UPC" },
    { key: "sku", label: "SKU" },
    { key: "brand", label: "Brand" },
    { key: "quantity", label: "Quantity" },
    {key: "lastUpdated", label: "Last Updated"}
  ];


      const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "ascending" ? "descending" : "ascending";
    }
    setSortConfig({ key, direction });
  };
  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button
            className="capitalize text-green-700 font-semibold border-2 border-green-700 -z-1"
            variant=""
          >
            {sortConfig.key
              ? SORT_OPTIONS.find((opt) => opt.key === sortConfig.key)?.label ||
                "Sort By"
              : "Sort By"}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Sort selection"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={new Set([sortConfig.key])}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            handleSort(selectedKey);
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <DropdownItem className="text-green-700" key={option.key}>{option.label}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default InventorySorting;
