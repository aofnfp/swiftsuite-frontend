import React from "react";
import { Tooltip } from "@heroui/react";
import { FaRegSave } from "react-icons/fa";
import { BiListUl } from "react-icons/bi";

const ActionsSection = ({
  isFromUpdate,
  handleUpdateListing,
  handleSaveListing,
  handleSubmit,
  handleUpdateLoader,
  handleSaveListingLoader,
  handleSubmitLoader,
}) => {
  return isFromUpdate ? (
    <div className="gap-4 mt-5">
      <div className="text-center">
        <button
          onClick={handleUpdateListing}
          className="w-full bg-[#089451] text-white rounded h-10 font-bold hover:bg-green-400"
        >
          {handleUpdateLoader ? (
            <span>Loading...</span>
          ) : (
            <Tooltip content="Update Listing">
              <div className="flex items-center justify-center gap-2">
                <span>Update Listing</span>
                <FaRegSave size={15} className="text-white hover:text-green-600 cursor-pointer" />
              </div>
            </Tooltip>
          )}
        </button>
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-4 mt-5">
      <div className="text-center">
        <button
          onClick={handleSaveListing}
          className="w-full bg-[#089451] text-white rounded h-10 font-bold hover:bg-green-400"
        >
          {handleSaveListingLoader ? (
            <span>Loading...</span>
          ) : (
            <Tooltip content="Save Listing">
              <div className="flex items-center justify-center gap-2">
                <span>Save Listing</span>
                <FaRegSave size={15} className="text-white hover:text-green-600 cursor-pointer" />
              </div>
            </Tooltip>
          )}
        </button>
      </div>
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="w-full bg-[#089451] text-white rounded h-10 font-bold hover:bg-green-400"
        >
          {handleSubmitLoader ? (
            <span>Loading...</span>
          ) : (
            <Tooltip content="List">
              <div className="flex items-center justify-center gap-2">
                <span>List</span>
                <BiListUl size={15} className="text-white hover:text-green-600 cursor-pointer" />
              </div>
            </Tooltip>
          )}
        </button>
      </div>
    </div>
  );
};

export default ActionsSection;
