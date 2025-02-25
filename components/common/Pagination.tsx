import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  category?: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl, category }: PaginationProps) {
  // 정적 URL 생성 함수
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (page > 1) params.set('page', page.toString());
    const queryString = params.toString();
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <nav className="flex justify-center items-center space-x-2 my-8">
      {/* 이전 페이지 */}
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          이전
        </Link>
      )}
      
      {/* 페이지 번호 */}
      <div className="hidden md:flex space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={getPageUrl(page)}
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
      
      {/* 다음 페이지 */}
      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          다음
        </Link>
      )}
    </nav>
  );
} 