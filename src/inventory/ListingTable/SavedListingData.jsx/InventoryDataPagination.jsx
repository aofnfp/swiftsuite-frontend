import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

const InventoryDataPagination = ({
  currentPage,
  totalPages,
  handlePreviousPage,
  handleNextPage,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 w-full">
      <div className="text-sm text-gray-600">
        Showing page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md border ${currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-white text-green-700 border-green-500 hover:bg-green-50 transition-colors duration-200"
            } flex items-center gap-1`}
        >
          <IoIosArrowDropleft className="text-lg" />
          <span>Previous</span>
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md border ${currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-white text-green-700 border-green-500 hover:bg-green-50 transition-colors duration-200"
            } flex items-center gap-1`}
        >
          <span>Next</span>
          <IoIosArrowDropright className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default InventoryDataPagination;
