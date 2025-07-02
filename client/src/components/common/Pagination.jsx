function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 rounded border bg-white disabled:opacity-50"
      >
        Prev
      </button>
      <span className="px-3 py-1 mx-1">Page {currentPage} of {totalPages}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 mx-1 rounded border bg-white disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
