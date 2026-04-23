import { Button } from 'antd';
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
        pageNumbers.push(
          <span key="ellipsis1" className="px-1 text-gray-500 font-semibold">
            ...
          </span>
        );
      }
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(pageCount - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(renderPageNumber(i));
      }
      
      if (currentPage < pageCount - 2) {
        pageNumbers.push(
          <span key="ellipsis2" className="px-1 text-gray-500 font-semibold">
            ...
          </span>
        );
      }
      
      pageNumbers.push(renderPageNumber(pageCount));
    }
    
    return pageNumbers;
  };

  const renderPageNumber = (page) => (
    <Button
      key={page}
      size="sm"
      radius="md"
      variant={currentPage === page ? "bordered" : "flat"}
      className={`min-w-11 h-10 mx-0.5 font-semibold transition-all bg-[#a4b1ab] border-none hover:!bg-[#4c5e55] hover:!text-white ${
        currentPage === page
          ? "bg-white border border-slate-500 text-slate-900 shadow-sm"
          : "bg-[#d7d8de] text-slate-700 hover:bg-[#cfd1d9]"
      }`}
      onClick={() => onPageChange(page)}
    >
      {page}
    </Button>
  );

  return (
    <div className="flex flex-wrap items-center gap-2 text-gray-800 bg-[#eef1f0] p-3 rounded-lg border border-gray-200">
      <Button
        size="sm"
        className="h-10 font-semibold bg-[#a4b1ab] text-white border-none hover:!bg-[#4c5e55] hover:!text-white"
        disabled={currentPage === 1}
        onClick={handleFirstPage}
      >
        <FaChevronLeft className="mr-1" /> First
      </Button>
      <Button
        size="sm"
        className="h-10 font-semibold bg-[#a4b1ab] text-white border-none hover:!bg-[#4c5e55] hover:!text-white"
        disabled={currentPage === 1}
        onClick={handlePreviousPage}
      >
        <FaChevronLeft className="mr-1" /> Previous
      </Button>

      <div className="flex items-center gap-1 rounded-lg bg-[#eef1f0] px-1">{displayPageNumbers()}</div>

      <Button
        size="sm"
        className="h-10 font-semibold bg-[#a4b1ab] text-white border-none hover:!bg-[#4c5e55] hover:!text-white"
        disabled={currentPage === pageCount}
        onClick={handleNextPage}
      >
        Next <FaChevronRight className="ml-1" />
      </Button>
      <Button
        size="sm"
        className="h-10 font-semibold bg-[#a4b1ab] text-white border-none hover:!bg-[#4c5e55] hover:!text-white"
        disabled={currentPage === pageCount}
        onClick={handleLastPage}
      >
        Last <FaChevronRight className="ml-1" />
      </Button>
    </div>
  );
};

export default FixedCustomPagination;
