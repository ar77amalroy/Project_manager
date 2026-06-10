'use client';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      let rangeStart = Math.max(2, currentPage - 1);
      let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        rangeEnd = 4;
      } else if (currentPage >= totalPages - 1) {
        rangeStart = totalPages - 3;
      }

      if (rangeStart > 2) pages.push('...');
      for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
      if (rangeEnd < totalPages - 1) pages.push('...');

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 animate-fade-in">
      <button
        id="pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-secondary flex items-center gap-1.5 text-sm px-4 py-2"
        style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Prev
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((pageNum, index) =>
          pageNum === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="w-9 h-9 flex items-center justify-center text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              …
            </span>
          ) : (
            <button
              key={pageNum}
              id={`pagination-page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: pageNum === currentPage
                  ? 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))'
                  : 'transparent',
                color: pageNum === currentPage ? 'white' : 'var(--text-muted)',
                border: pageNum === currentPage ? 'none' : '1px solid transparent',
              }}
              onMouseEnter={(event) => {
                if (pageNum !== currentPage) {
                  event.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                  event.currentTarget.style.color = 'var(--foreground)';
                }
              }}
              onMouseLeave={(event) => {
                if (pageNum !== currentPage) {
                  event.currentTarget.style.background = 'transparent';
                  event.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              {pageNum}
            </button>
          )
        )}
      </div>

      <button
        id="pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-secondary flex items-center gap-1.5 text-sm px-4 py-2"
        style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
      >
        Next
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
