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

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const selectedCategory = searchParams.category;

  const { items: posts, totalPages } = await getPaginatedPosts({
    page: currentPage,
    category: selectedCategory,
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
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/blog"
          category={selectedCategory}
        />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map(post => post.category)));
  const totalPages = Math.ceil(posts.length / 10);
  
  const params = [];
  
  // 카테고리가 없는 경우의 페이지들
  for (let i = 1; i <= totalPages; i++) {
    params.push({
      searchParams: { page: i.toString() }
    });
  }
  
  // 각 카테고리별 페이지들
  for (const category of categories) {
    const categoryPosts = posts.filter(post => post.category === category);
    const categoryPages = Math.ceil(categoryPosts.length / 10);
    
    for (let i = 1; i <= categoryPages; i++) {
      params.push({
        searchParams: {
          category,
          page: i.toString()
        }
      });
    }
  }
  
  return params;
} 