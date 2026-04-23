import React, { useState } from "react";
import { Modal, Button, Input, Tooltip, Checkbox } from "antd";

const ItemCategoryModal = ({ itemCategory, setItemCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [remember, setRemember] = useState(false);

  const handleOk = () => {
    setItemCategory({
      category: value,
      remember,
    });
    setIsOpen(false);
  };

  return (
    <>
      <Tooltip title="Edit Item Category" placement="top">
        <Button
          type="link"
          className="text-xs text-blue-500"
          onClick={() => setIsOpen(true)}
        >
          Edit ✏️
        </Button>
      </Tooltip>
      <Modal
        title="Item Category"
        open={isOpen}
        onOk={handleOk}
        onCancel={() => setIsOpen(false)}
        okText="Save"
        cancelText="Close"
        centered
      >
        <div className="flex flex-col gap-4 mt-2">
          <Input
            placeholder="Enter category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Checkbox
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          >
            Remember selection
          </Checkbox>
        </div>
      </Modal>
    </>
  );
};

export default ItemCategoryModal;