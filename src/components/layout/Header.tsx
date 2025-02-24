'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/constants/categories';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            개발자 블로그
          </Link>
          
          <button
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <nav className="py-4 border-t">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="block py-2 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  메인
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center justify-between w-full py-2"
                >
                  <span>카테고리</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isCategoryOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li>
                      <Link
                        href="/blog"
                        className={`block py-2 ${
                          pathname === '/blog' && !currentCategory
                            ? 'text-blue-600'
                            : 'text-gray-600'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        전체
                      </Link>
                    </li>
                    {CATEGORIES.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/blog?category=${category.id}`}
                          className={`block py-2 ${
                            currentCategory === category.id
                              ? 'text-blue-600'
                              : 'text-gray-600'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
} 