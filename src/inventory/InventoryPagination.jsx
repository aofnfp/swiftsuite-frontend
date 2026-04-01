import React from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

const InventoryPagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  listingDetail,
  handleNextPage,
  handlePreviousPage,
  handleFirstPage,
  handleLastPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const startItem =
    Math.min((currentPage - 1) * itemsPerPage + 1, totalItems) || 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (!listingDetail?.length) return null;

  const viewingText = `${startItem} - ${endItem} of ${totalItems} (${currentPage}/${totalPages})`;

  return (
    <nav aria-label="Inventory pagination" className="w-full">
      <div className="flex flex-col sm:flex-row items-center sm:items-stretch justify-between w-full gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-green-700 rounded-full px-2 py-1 shadow-sm">
            <button
              onClick={handleFirstPage}
              disabled={isFirstPage}
              aria-label="First page"
              title="First"
              className="p-2 rounded-full hover:bg-green-500 bg-green-700 text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaAngleDoubleLeft className="w-3 h-3" />
            </button>

            <button
              onClick={handlePreviousPage}
              disabled={isFirstPage}
              aria-label="Previous page"
              title="Previous"
              className="p-2 rounded-full hover:bg-green-500 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="w-3 h-3" />
            </button>
            <div className="hidden sm:flex items-center text-xs text-green-700 ml-2">
              <span>Viewing</span>
              <span className="font-medium mx-1">{startItem}</span>
              <span>-</span>
              <span className="font-medium  mx-1">{endItem}</span>
              <span>of</span>
              <span className="font-medium ml-1">{totalItems}</span>
              <span className="ml-2">
                ({currentPage}/{totalPages})
              </span>
            </div>
            <button
              onClick={handleNextPage}
              disabled={isLastPage}
              aria-label="Next page"
              title="Next"
              className="p-2 rounded-full transition hover:bg-green-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaChevronRight className="w-3 h-3" />
            </button>

            <button
              onClick={handleLastPage}
              disabled={isLastPage}
              aria-label="Last page"
              title="Last"
              className="p-2 rounded-full bg-green-700 text-white hover:bg-green-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaAngleDoubleRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="sm:hidden text-xs text-gray-600">{viewingText}</div>
      </div>
    </nav>
  );
};

export default InventoryPagination;
