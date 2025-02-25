"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/constants/categories";

// 정적으로 생성될 메뉴 아이템 컴포넌트
function MenuItem({
  href,
  isActive,
  onClick,
  children,
}: {
  href: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`block py-2 ${isActive ? "text-blue-600" : "text-gray-600"}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export default function MobileMenu() {
  // 클라이언트 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // 경로 관련 훅은 별도로 관리
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  // 메뉴 닫기 핸들러
  const handleClose = () => {
    setIsMenuOpen(false);
    setIsCategoryOpen(false);
  };

  return (
    <div className="md:hidden">
      {" "}
      {/* 데스크톱에서는 숨김 */}
      <button
        className="p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={isMenuOpen}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          {isMenuOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      {/* 모바일 메뉴 오버레이 */}
      {isMenuOpen && (
        <>
          {/* 배경 오버레이 - 클릭시 메뉴 닫힘 */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* 메뉴 내용 */}
          <nav
            className="absolute top-16 left-0 right-0 bg-white border-t py-4 z-50 shadow-lg"
            role="navigation"
            aria-label="모바일 메뉴"
          >
            <div className="max-w-4xl mx-auto px-4">
              <ul className="space-y-2">
                <li>
                  <MenuItem
                    href="/"
                    isActive={pathname === "/"}
                    onClick={handleClose}
                  >
                    메인
                  </MenuItem>
                </li>
                <li>
                  {/* 카테고리 섹션 */}
                  <div className="py-2 border-t border-gray-100">
                    <button
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="flex items-center justify-between w-full py-2"
                      aria-expanded={isCategoryOpen}
                    >
                      <span className="font-medium">카테고리</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isCategoryOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* 카테고리 목록 */}
                    {isCategoryOpen && (
                      <ul className="ml-4 mt-2 space-y-2">
                        <li>
                          <MenuItem
                            href="/blog"
                            isActive={pathname === "/blog" && !currentCategory}
                            onClick={handleClose}
                          >
                            전체
                          </MenuItem>
                        </li>
                        {CATEGORIES.map((category) => (
                          <li key={category.id}>
                            <MenuItem
                              href={`/blog?category=${category.id}`}
                              isActive={currentCategory === category.id}
                              onClick={handleClose}
                            >
                              {category.name}
                            </MenuItem>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
                <li>
                  <MenuItem
                    href="/resume"
                    isActive={pathname === "/resume"}
                    onClick={handleClose}
                  >
                    이력서
                  </MenuItem>
                </li>
              </ul>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
