import InventoryListItem from "./InventoryListItem";

const InventoryListView = ({ data = [], handleEditInventory, deleteLoader, setSelectedItemId, setShowModal, handleInventoryDetail, showCheckboxes, checkedItems, onToggleItem }) => {
  return (
    <div className="space-y-6 p-4 bg-[#f3f8f6]">
      {data.map((item) => (
        <InventoryListItem
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

export default InventoryListView;