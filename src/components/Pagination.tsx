interface PaginationProps {
  currentPage: number;
  lastPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  lastPage,
  loading,
  onPageChange,
}: PaginationProps) {

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onPageChange(page);
  };

  return (
    <div className="mt-8 mb-8 flex justify-center items-center gap-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-blue-gray-700">
        Page {currentPage} of {lastPage}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === lastPage || loading}
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
