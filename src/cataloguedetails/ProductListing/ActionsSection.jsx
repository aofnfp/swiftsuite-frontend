import React from "react";
import { Button, Tooltip } from "antd";
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
        <Button
          onClick={handleUpdateListing}
          className="w-full h-10 font-semibold bg-[#089451] text-white border-none hover:!bg-[#06703d] hover:!text-white"
          loading={handleUpdateLoader}
        >
          {!handleUpdateLoader && (
            <Tooltip title="Update Listing" placement="top">
              <div className="flex items-center justify-center gap-2">
                <span>Update Listing</span>
                <FaRegSave size={15} className="text-white" />
              </div>
            </Tooltip>
          )}
        </Button>
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-4 mt-5">
      <div className="text-center">
        <Button
          onClick={handleSaveListing}
          className="w-full h-10 font-semibold bg-[#089451] text-white border-none hover:!bg-[#06703d] hover:!text-white"
          loading={handleSaveListingLoader}
        >
          {!handleSaveListingLoader && (
            <Tooltip title="Save Listing" placement="top">
              <div className="flex items-center justify-center gap-2">
                <span>Save Listing</span>
                <FaRegSave size={15} className="text-white" />
              </div>
            </Tooltip>
          )}
        </Button>
      </div>
      <div className="text-center">
        <Button
          onClick={handleSubmit}
          className="w-full h-10 font-semibold bg-[#089451] text-white border-none hover:!bg-[#06703d] hover:!text-white"
          loading={handleSubmitLoader}
        >
          {!handleSubmitLoader && (
            <Tooltip title="List" placement="top">
              <div className="flex items-center justify-center gap-2">
                <span>List</span>
                <BiListUl size={15} className="text-white" />
              </div>
            </Tooltip>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ActionsSection;
