import React, { useState, useEffect } from "react";
import { LiaDollarSignSolid } from "react-icons/lia";

const Rsr = ({ formFilters, handleFormInputChange, handleSubmit, clearFilters, filterLoading, dropdownRef }) => {
    const [dropdowns, setDropdowns] = useState({
        isUPCOpen: false,
        isImageOpen: false,
        isImagesOpen: false,
        isMAPOpen: false,
        isShippingOpen: false,
    });

    const toggleDropdown = (dropdown) => {
        setDropdowns((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown],
        }));
    };

    const closeAllDropdowns = () => {
        setDropdowns({
            isUPCOpen: false,
            isImageOpen: false,
            isImagesOpen: false,
            isMAPOpen: false,
            isShippingOpen: false,
        });
    };

    useEffect(() => {
        const handleBodyClick = (e) => {
            if (!e.target.closest(".dropdown")) closeAllDropdowns();
        };
        document.body.addEventListener("click", handleBodyClick);
        return () => document.body.removeEventListener("click", handleBodyClick);
    }, []);

    return (
         <div ref={dropdownRef}>
           <form 
             onSubmit={handleSubmit}
           >
             <div className="flex mt-5 gap-8">
               <p className="md:w-32">Quantity</p>
               <div className="flex border border-gray-300 rounded shadow-sm">
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
               <p className="md:w-32">Wholesale Price</p>
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
                 {filterLoading ?        
                 <div className="w-[25px] h-[25px] border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                 : 'Apply'}
               </button>
             </div>
           </form>
           </div>
    );
};

export default Rsr;