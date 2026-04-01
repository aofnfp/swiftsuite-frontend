import { Button } from '@heroui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const FixedCustomPagination = ({ pageCount, onPageChange, currentPage, handleNextPage, handlePreviousPage, handleFirstPage, handleLastPage }) => {
  const displayPageNumbers = () => {
    const pageNumbers = [];
    
    if (pageCount <= 5) {
      for (let i = 1; i <= pageCount; i++) {
        pageNumbers.push(renderPageNumber(i));
      }
    } else {
      pageNumbers.push(renderPageNumber(1));
      
      if (currentPage > 3) {
        pageNumbers.push(<span key="ellipsis1">....</span>);
      }
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(pageCount - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(renderPageNumber(i));
      }
      
      if (currentPage < pageCount - 2) {
        pageNumbers.push(<span key="ellipsis2">....</span>);
      }
      
      pageNumbers.push(renderPageNumber(pageCount));
    }
    
    return pageNumbers;
  };

  const renderPageNumber = (page) => (
    <Button
      key={page}
      className={`px-3 py-1 mx-1 rounded ${currentPage === page ? 'border border-gray-500 font-bold' : ''}`}
      onPress={() => onPageChange(page)}
    >
      {page}
    </Button>
  );

  return (
    <div className="flex items-center space-x-2 text-gray-800 bg-white p-2 rounded shadow">
      <Button
        className="flex items-center text-gray-700 hover:text-black"
        disabled={currentPage === 1}
        onPress={handleFirstPage}
      >
        <FaChevronLeft className="mr-1" /> First
      </Button>
      <Button
        className="flex items-center text-gray-700 hover:text-black"
        disabled={currentPage === 1}
        onPress={handlePreviousPage}
      >
        <FaChevronLeft className="mr-1" /> Previous
      </Button>

      <div className="flex items-center space-x-1">{displayPageNumbers()}</div>

      <Button
        className="flex items-center text-gray-700 hover:text-black"
        disabled={currentPage === pageCount}
        onPress={handleNextPage}
      >
        Next <FaChevronRight className="ml-1" />
      </Button>
      <Button
        className="flex items-center text-gray-700 hover:text-black"
        disabled={currentPage === pageCount}
        onPress={handleLastPage}
      >
        Last <FaChevronRight className="ml-1" />
      </Button>
    </div>
  );
};

export default FixedCustomPagination;
