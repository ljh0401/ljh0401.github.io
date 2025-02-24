import React from 'react';
import { getPaginatedPosts, getAllPosts } from '@/lib/posts';
import PostList from '@/components/blog/PostList';
import Pagination from '@/components/common/Pagination';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';

interface BlogPageProps {
  searchParams: { 
    page?: string;
    category?: string;
  };
}

// 정적 페이지 생성을 위한 설정
export const dynamic = 'force-static';
export const dynamicParams = false;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // 페이지 파라미터를 안전하게 처리
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const selectedCategory = searchParams?.category || '';

  const { items: posts, totalPages } = await getPaginatedPosts({
    page: isNaN(page) ? 1 : page,
    category: selectedCategory || undefined,
  });

  return (
    <div className="container-wrapper">
      <div className="card">
        <h1 className="text-3xl font-bold mb-8">블로그</h1>
        
        {/* 카테고리 필터 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Link
            href="/blog"
            className={`px-3 py-1 rounded-full text-sm ${
              !selectedCategory 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            전체
          </Link>
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/blog?category=${category.id}`}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        <PostList posts={posts} />
        <Pagination
          currentPage={isNaN(page) ? 1 : page}
          totalPages={totalPages}
          baseUrl="/blog"
          category={selectedCategory}
        />
      </div>
    </div>
  );
}

// generateStaticParams 수정
export async function generateStaticParams() {
  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map(post => post.category)));
  const totalPages = Math.ceil(posts.length / 10);
  
  const paths = [];
  
  // 기본 경로 추가
  paths.push({ searchParams: {} });
  
  // 페이지 번호만 있는 경로
  for (let i = 1; i <= totalPages; i++) {
    paths.push({ 
      searchParams: { page: i.toString() } 
    });
  }
  
  // 카테고리별 경로
  for (const category of categories) {
    paths.push({ 
      searchParams: { category } 
    });
    
    const categoryPosts = posts.filter(post => post.category === category);
    const categoryPages = Math.ceil(categoryPosts.length / 10);
    
    for (let i = 1; i <= categoryPages; i++) {
      paths.push({ 
        searchParams: {
          category,
          page: i.toString()
        }
      });
    }
  }
  
  return paths;
} 