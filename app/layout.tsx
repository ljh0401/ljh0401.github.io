import { Inter } from 'next/font/google';
import { Header, Footer, Profile } from '@/components/index';
import CategoryNav from '@/components/layout/CategoryNav';
import '@/styles/globals.css';
import Link from 'next/link';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '개발자 블로그',
  description: '기술 블로그 및 포트폴리오',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {/* 모바일 헤더 */}
        <div className="md:hidden">
          <Header />
        </div>
        
        <div className="flex min-h-screen">
          {/* 사이드바 (데스크톱) */}
          <aside className="hidden md:flex flex-col w-64 min-h-screen fixed bg-white border-r">
            <div className="p-6 flex flex-col h-full">
              <Link href="/" className="text-xl font-bold mb-6">
                개발자 블로그
              </Link>
              <Profile />
              <nav className="mt-6">
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm">
                      메인
                    </Link>
                  </li>
                </ul>
                <Suspense fallback={<div>카테고리 로딩중...</div>}>
                  <CategoryNav />
                </Suspense>
              </nav>
              <div className="mt-auto pt-6 border-t text-xs text-gray-500">
                © 2024 ljh0401
              </div>
            </div>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="flex-1 bg-gray-50 md:ml-64">
            <div className="max-w-3xl mx-auto px-4 py-8">
              {children}
            </div>
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
} 