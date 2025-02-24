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
          baseUrl={selectedCategory ? `/blog?category=${selectedCategory}` : '/blog'}
        />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const totalPages = Math.ceil(posts.length / 10);
  
  return Array.from({ length: totalPages }, (_, i) => ({
    searchParams: { page: (i + 1).toString() }
  }));
} 