import InventoryGridItem from "./InventoryGridItem";

const InventoryGridView = ({ data = [], handleEditInventory, deleteLoader, setSelectedItemId, setShowModal, handleInventoryDetail, showCheckboxes, checkedItems, onToggleItem }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#f3f8f6]">
      {data.map((item) => (
        <InventoryGridItem
          key={item.id}
          item={item}
          handleEditInventory={handleEditInventory}
          deleteLoader={deleteLoader}
          setSelectedItemId={setSelectedItemId}
          setShowModal={setShowModal}
          handleInventoryDetail={handleInventoryDetail}
          showCheckboxes={showCheckboxes}
          checkedItems={checkedItems}
          onToggleItem={onToggleItem}
        />
      ))}
    </div>
  );
}

export default InventoryGridView;