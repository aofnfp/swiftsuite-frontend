import React from "react";
import { Button, Tooltip } from "antd";
import { FaRegSave } from "react-icons/fa";
import { BiListUl } from "react-icons/bi";
import gif from "../../Images/gif.gif";

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
      disabled={handleUpdateLoader}
      className="w-full h-10 font-semibold bg-[#089451] text-white border-none hover:!bg-[#06703d] hover:!text-white flex items-center justify-center gap-2"
    >
      {handleUpdateLoader ? (
        <div className="flex items-center gap-2">
          <img src={gif} alt="loading" className="w-5 h-5" />
          <span>Updating...</span>
        </div>
      ) : (
        <Tooltip title="Update Listing" placement="top">
          <div className="flex items-center gap-2">
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
          disabled={handleSaveListingLoader}
          className="w-full h-10 font-semibold bg-[#089451] text-white border-none hover:!bg-[#06703d] hover:!text-white flex items-center justify-center gap-2"  
        >
          {handleSaveListingLoader ? (
            <div className="flex items-center gap-2">
              <img src={gif} alt="loading" className="w-5 h-5" />
              <span>Saving...</span>
            </div>
          ) : (
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
          disabled={handleSubmitLoader}
          className="w-full h-10 font-semibold bg-[#089451] text-white border-none hover:!bg-[#06703d] hover:!text-white flex items-center justify-center gap-2"  
        >
          {handleSubmitLoader ? (
            <div className="flex items-center gap-2">
              <img src={gif} alt="loading" className="w-5 h-5" />
              <span>Listing...</span>
            </div>
          ) : ( 
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
