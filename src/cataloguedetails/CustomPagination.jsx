import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CustomPagination = ({ pageCount, onPageChange, currentPage, itemsPerPage, totalItems,  }) => {
  const displayPageNumbers = () => {
    const pageNumbers = [];

    const maxPage = Math.min(currentPage + 3, pageCount);

    for (let i = currentPage - 1; i < maxPage; i++) {
      pageNumbers.push(
        <div key={i} className={`inline-block ${currentPage === i + 1 ? 'font-bold bg-white rounded-sm text-[#089451] ' : ''}`}>
          <button
            className="px-2 rounded-full focus:outline-none focus:border-[#089451] transition-colors duration-300"
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        </div>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-between text-xs w-full text-black">
      <ul className="flex space-x-2 justify-center items-center">
        {/* {currentPage > 1 && (
          <li className="inline-block text-sm">
            <button
              className="py-1 rounded-full bg-white-500 text-sm transition-colors duration-300"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
          </li>
        )} */}

        <div>
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} -{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}  <span>Products</span> 
        </div>

        {/* <li className="inline-block">
          <button
            className="py-1 rounded-fulltransition-colors duration-300"
            onClick={handleNextPage}
            disabled={currentPage >= totalItems / itemsPerPage}
          >
            <FaChevronRight />
          </button>
        </li> */}
      </ul>
    </div>
  );
};

export default CustomPagination;
