'use client';

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  displayedResults: number;
  resultLabel?: string;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
  displayedResults,
  resultLabel = 'results',
  className = '',
}: PaginationProps) {
  // Generate page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > halfVisible + 1) {
        pages.push('...');
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - halfVisible);
      const endPage = Math.min(totalPages - 1, currentPage + halfVisible);

      for (let i = startPage; i <= endPage; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      {/* Results info */}
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
        {displayedResults > 0 ? (
          <>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {displayedResults}
            </span>
            {' of '}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {totalResults}
            </span>
            {' ' + resultLabel}
          </>
        ) : (
          'No results'
        )}
      </div>

      {/* Page controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={isFirstPage}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
            title={isFirstPage ? 'Already on first page' : 'Go to previous page'}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1 sm:gap-2">
            {pageNumbers.map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={page === '...'}
                className={`
                  min-w-[2.5rem] px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    page === currentPage
                      ? 'bg-[#162660] text-white shadow-md'
                      : page === '...'
                      ? 'text-gray-400 cursor-default hover:bg-transparent'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }
                `}
                aria-label={page === '...' ? 'More pages' : `Go to page ${page}`}
                title={page === '...' ? 'More pages available' : `Go to page ${page}`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={isLastPage}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
            title={isLastPage ? 'Already on last page' : 'Go to next page'}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
