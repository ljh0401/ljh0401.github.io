import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <nav className="flex justify-center items-center space-x-2 my-8 px-4">
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}/${currentPage - 1}`}
          className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          이전
        </Link>
      )}
      
      <div className="hidden md:flex space-x-1">
        {pages.map((page) => (
          <Link
            key={page}
            href={`${baseUrl}/${page}`}
            className={`px-3 py-2 rounded-lg ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
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
          href={`${baseUrl}/${currentPage + 1}`}
          className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          다음
        </Link>
      )}
    </nav>
  );
} 