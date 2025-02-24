import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  category?: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl, category }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };
  
  return (
    <nav className="flex justify-center items-center space-x-2 my-8 px-4" aria-label="페이지 네비게이션">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          aria-label="이전 페이지"
        >
          이전
        </Link>
      )}
      
      <div className="hidden md:flex space-x-1">
        {pages.map((page) => (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`px-3 py-2 rounded-lg ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
            aria-label={`${page} 페이지`}
          >
            {page}
          </Link>
        ))}
      </div>
      
      <div className="md:hidden">
        <span className="px-3 py-2 bg-gray-100 rounded-lg">
          {currentPage} / {totalPages}
        </span>
      </div>
      
      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          aria-label="다음 페이지"
        >
          다음
        </Link>
      )}
    </nav>
  );
} 