import { Button, Dropdown } from "antd";

const InventorySorting = ({ sortConfig, setSortConfig }) => {
  const SORT_OPTIONS = [
    {key: "all", label: "All"},
    { key: "title", label: "Title" },
    { key: "upc", label: "UPC" },
    { key: "sku", label: "SKU" },
    { key: "brand", label: "Brand" },
    { key: "quantity", label: "Quantity" },
    { key: "lastUpdated", label: "Last Updated" },
  ];

  const sortMenuItems = SORT_OPTIONS.map((option) => ({
    key: option.key,
    label: option.label,
  }));

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key) {
      direction =
        sortConfig.direction === "ascending" ? "descending" : "ascending";
    }
    setSortConfig({ key, direction });
  };
  return (
    <div className="inventory-sorting">
      <Dropdown
        trigger={["click"]}
        menu={{
          items: sortMenuItems,
          selectable: true,
          selectedKeys: sortConfig?.key ? [sortConfig.key] : [],
          onClick: ({ key }) => handleSort(key),
        }}
      >
        <Button className="capitalize text-green-700 font-semibold border-2 border-green-700">
          {sortConfig.key
            ? SORT_OPTIONS.find((opt) => opt.key === sortConfig.key)?.label ||
              "Sort By"
            : "Sort By"}
        </Button>
      </Dropdown>
    </div>
  );
};

export default InventorySorting;
