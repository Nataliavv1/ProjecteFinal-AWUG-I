import React from 'react';

function Pagination({ currentPage, setCurrentPage, visiblePages, setVisiblePages, recipes, recipesPerPage }) {
  const handleNextPages = () => {
    if (visiblePages[4] < Math.ceil(recipes.length / recipesPerPage)) {
      setVisiblePages(visiblePages.map((page) => page + 1));
    }
  };

  const handlePrevPages = () => {
    if (visiblePages[0] > 1) {
      setVisiblePages(visiblePages.map((page) => page - 1));
    }
  };

  return (
    <div className="pagination">
      <button onClick={handlePrevPages} disabled={visiblePages[0] === 1}>
        &lt;
      </button>
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={page === currentPage ? 'active' : ''}
        >
          {page}
        </button>
      ))}
      <button
        onClick={handleNextPages}
        disabled={visiblePages[4] >= Math.ceil(recipes.length / recipesPerPage)}
      >
        &gt;
      </button>
    </div>
  );
}

export default Pagination;

