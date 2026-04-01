import React from "react";
import ItemCategoryModal from "./ItemCategoryModal";
import { IoIosArrowForward } from "react-icons/io";

const ItemCategory = ({ itemCategory, setItemCategory }) => {
  return (
      <div className="p-5">
        <div className="flex justify-between items-center">
          <span className="font-bold">ITEM CATEGORY</span>
          <ItemCategoryModal
            itemCategory={itemCategory}
            setItemCategory={setItemCategory}
          />
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-gray-700">
            <p>Sold in batches</p>
            <p className="flex text-gray-500">
              in Travel Items <IoIosArrowForward size={10} className="mt-2" />{" "}
              Travel <IoIosArrowForward size={10} className="mt-2" /> Journeying
            </p>
          </div>
        </div>
      </div>
  );
};

export default ItemCategory;
