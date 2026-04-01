import React, { useState, useEffect } from "react";
import { LiaDollarSignSolid } from "react-icons/lia";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const Zanders = ({
    formFilters,
    handleFormInputChange,
    handleSubmit,
    clearFilters,
}) => {
    const [dropdowns, setDropdowns] = useState({
        isUPCOpen: false,
        isImageOpen: false,
        isImagesOpen: false,
        isMAPOpen: false,
        isShippingOpen: false,
        ismanufacturerOpen: false,
    });

    const toggleDropdown = (dropdown) => {
        setDropdowns((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown],
        }));
    };

    return (
        <form
            onSubmit={handleSubmit}
        >

            <div className="flex mt-5 gap-8">
                <p className="md:w-32">Quantity</p>
                <div className="flex border border-gray-300 rounded shadow-sm">
                    <p className="pt-[5px] border-r text-[#089451]">
                        <LiaDollarSignSolid />
                    </p>
                    <input
                        type="number"
                        name="minquantity"
                        value={formFilters.minquantity || ""}
                        onChange={handleFormInputChange}
                        className="focus:outline-none rounded py-[2px] md:w-[156px]"
                    />
                </div>
                <p>To</p>
                <div className="flex border border-gray-300 rounded shadow-sm">
                    <p className="pt-[5px] border-r text-[#089451]">
                        <LiaDollarSignSolid />
                    </p>
                    <input
                        type="number"
                        name="maxquantity"
                        value={formFilters.maxquantity || ""}
                        onChange={handleFormInputChange}
                        className="focus:outline-none rounded py-[2px] md:w-[156px]"
                    />
                </div>
            </div>

            <div className="flex mt-5 gap-8">
                <p className="md:w-32">Price</p>
                <div className="flex border border-gray-300 rounded shadow-sm">
                    <p className="pt-[5px] border-r text-[#089451]">
                        <LiaDollarSignSolid />
                    </p>
                    <input
                        type="number"
                        name="minprice"
                        value={formFilters.minprice || ""}
                        onChange={handleFormInputChange}
                        className="focus:outline-none rounded py-[2px] md:w-[156px]"
                    />
                </div>
                <p>To</p>
                <div className="flex border border-gray-300 rounded shadow-sm">
                    <p className="pt-[5px] border-r text-[#089451]">
                        <LiaDollarSignSolid />
                    </p>
                    <input
                        type="number"
                        name="maxprice"
                        value={formFilters.maxprice || ""}
                        onChange={handleFormInputChange}
                        className="focus:outline-none rounded py-[2px] md:w-[156px]"
                    />
                </div>
            </div>
            {/* Has UPC */}
            <div className="mt-5">
                <div className="flex gap-8 relative dropdown">
                    <p className="md:w-32">Has UPC</p>
                    <input
                        type="text"
                        className="border md:w-[58%] border-gray-300 rounded focus:outline-none py-[2px] px-1 shadow-sm cursor-pointer"
                        value={formFilters.upc || "Yes"}
                        name="upc"
                        readOnly
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown("isUPCOpen");
                        }}
                    />
                    <div className="pt-[4px] text-[#089451] absolute right-[185px] top-1">
                        {dropdowns.isUPCOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                    </div>
                </div>
                {dropdowns.isUPCOpen && (
                    <div className="absolute bg-white border shadow-md md:w-[55%] left-[200px] z-10">
                        <p
                            className="cursor-pointer hover:bg-gray-200 px-2"
                            onClick={() => {
                                handleFormInputChange({
                                    target: { name: "upc", value: "Yes" },
                                });
                                toggleDropdown("isUPCOpen");
                            }}
                        >
                            Yes
                        </p>
                        <p
                            className="cursor-pointer hover:bg-gray-200 px-2"
                            onClick={() => {
                                handleFormInputChange({
                                    target: { name: "upc", value: "No" },
                                });
                                toggleDropdown("isUPCOpen");
                            }}
                        >
                            No
                        </p>
                    </div>
                )}
            </div>
            {/* Has MAP Price */}
            <div className="mt-5">
                <div className="flex gap-8 relative dropdown">
                    <p className="md:w-32">Has MAP Price</p>
                    <input
                        type="text"
                        className="border md:w-[58%] border-gray-300 rounded focus:outline-none py-[2px] px-1 shadow-sm cursor-pointer"
                        value={formFilters.mapprice || "Yes"}
                        readOnly
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown("isMAPOpen");
                        }}
                    />
                    <div className="pt-[4px] text-[#089451] absolute right-[185px] top-1">
                        {dropdowns.isMAPOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                    </div>
                </div>
                {dropdowns.isMAPOpen && (
                    <div className="absolute bg-white border shadow-md md:w-[55%] left-[200px] z-10">
                        <p
                            className="cursor-pointer hover:bg-gray-200 px-2"
                            onClick={() => {
                                handleFormInputChange({
                                    target: { name: "mapprice", value: "Yes" },
                                });
                                toggleDropdown("isMAPOpen");
                            }}
                        >
                            Yes
                        </p>
                        <p
                            className="cursor-pointer hover:bg-gray-200 px-2"
                            onClick={() => {
                                handleFormInputChange({
                                    target: { name: "mapprice", value: "No" },
                                });
                                toggleDropdown("isMAPOpen");
                            }}
                        >
                            No
                        </p>
                    </div>
                )}
            </div>
            {/* 
            <div className="mt-5">
                <div className="flex gap-8 relative dropdown">
                    <p className="md:w-32">Must Have Image</p>
                    <input
                        type="text"
                        className="border md:w-[58%] border-gray-300 rounded focus:outline-none py-[2px] px-1 shadow-sm cursor-pointer"
                        value={formFilters.image || "Yes"}
                        readOnly
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown("isImageOpen");
                        }}
                    />
                    <div className="pt-[4px] text-[#089451] absolute right-[185px] top-1">
                        {dropdowns.isImageOpen ? (
                            <IoMdArrowDropup />
                        ) : (
                            <IoMdArrowDropdown />
                        )}
                    </div>
                </div>
                {dropdowns.isImageOpen && (
                    <div className="absolute bg-white border shadow-md md:w-[55%] left-[200px] z-10">
                        <p
                            className="cursor-pointer hover:bg-gray-200 px-2"
                            onClick={() => {
                                handleFormInputChange({
                                    target: { name: "image", value: "Yes" },
                                });
                                toggleDropdown("isImageOpen");
                            }}
                        >
                            Yes
                        </p>
                        <p
                            className="cursor-pointer hover:bg-gray-200 px-2"
                            onClick={() => {
                                handleFormInputChange({
                                    target: { name: "image", value: "No" },
                                });
                                toggleDropdown("isImageOpen");
                            }}
                        >
                            No
                        </p>
                    </div>
                )}
            </div> */}
            <div className="mt-5">
                <div className="flex gap-8 relative dropdown">
                    <p className="md:w-32">Has Manufacturer</p>
                    <input
                        type="text"
                        className="border md:w-[58%] border-gray-300 rounded focus:outline-none py-[2px] px-1 shadow-sm cursor-pointer"
                        value={formFilters.manufacturer || "Yes"}
                        readOnly
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown("ismanufacturerOpen");
                        }}
                    />
                    <div className="pt-[4px] text-[#089451] absolute right-[185px] top-1">
                        {dropdowns.ismanufacturerOpen ? (
                            <IoMdArrowDropup />
                        ) : (
                            <IoMdArrowDropdown />
                        )}
                    </div>
                </div>
                {dropdowns.ismanufacturerOpen && (
                    <div className="absolute bg-white border shadow-md md:w-[55%] left-[200px] z-10">
                        <p
                            className="cursor-pointer hover:bg-gray-200 px-2"
                            onClick={() => {
                                handleFormInputChange({
                                    target: { name: "manufacturer", value: "Yes" },
                                });
                                toggleDropdown("ismanufacturerOpen");
                            }}
                        >
                            Yes
                        </p>
                        <p
                            className="cursor-pointer hover:bg-gray-200 px-2"
                            onClick={() => {
                                handleFormInputChange({
                                    target: { name: "manufacturer", value: "No" },
                                });
                                toggleDropdown("ismanufacturerOpen");
                            }}
                        >
                            No
                        </p>
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="flex justify-center items-center gap-10 mt-5 mb-5">
                <button
                    type="button"
                    onClick={clearFilters}
                    className="border-[1px] text-red-700 border-red-700 rounded py-1 md:px-10 cursor-pointer"
                >
                    Clear
                </button>
                <button
                    type="submit"
                    className="border text-white bg-[#089451] rounded py-1 md:px-10 cursor-pointer"
                >
                    Apply
                </button>
            </div>
        </form>
    );
};

export default Zanders;
