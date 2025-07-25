import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  showTotalInfo = true,
  itemsPerPageOptions = [10, 25, 50, 100],
}) => {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow sm:flex-row sm:items-center sm:justify-between">
      {showItemsPerPage && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Tampilkan</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
            className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">per halaman</span>
        </div>
      )}

      {/* Page info */}
      {showTotalInfo && (
        <div className="text-sm text-gray-700">
          Menampilkan {startItem} - {endItem} dari {totalItems} data
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* First page button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          title="Halaman pertama"
        >
          <FaAngleDoubleLeft size={12} />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          title="Halaman sebelumnya"
        >
          <FaChevronLeft size={12} />
        </button>

        {generatePageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..." || page === currentPage}
            className={`flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : page === "..."
                  ? "cursor-default text-gray-400"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          title="Halaman selanjutnya"
        >
          <FaChevronRight size={12} />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          title="Halaman terakhir"
        >
          <FaAngleDoubleRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
