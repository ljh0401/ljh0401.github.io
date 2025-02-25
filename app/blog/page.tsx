import React from 'react';
import { getPaginatedPosts, getAllPosts } from '@/lib/posts';
import PostList from '@/components/blog/PostList';
import Pagination from '@/components/common/Pagination';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import { CategoryFilter } from '@/components/blog';

export const dynamic = "force-static";
export const dynamicParams = false; // 동적 라우트 비활성화

interface BlogPageProps {
  searchParams: { 
    page?: string;
    category?: string;
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  // 모든 카테고리와 서브카테고리 조합 수집
  const categoryPaths = new Set<string>();
  posts.forEach(post => {
    categoryPaths.add(post.category);
    if (post.subcategory) {
      categoryPaths.add(`${post.category}/${post.subcategory}`);
    }
  });
  
  const totalPages = Math.ceil(posts.length / 10);
  const paths = [];
  
  // 기본 경로
  paths.push({ searchParams: {} });
  
  // 모든 가능한 조합 생성
  Array.from(categoryPaths).forEach(categoryPath => {
    paths.push({ searchParams: { category: categoryPath } });
    
    const categoryPosts = posts.filter(post => {
      if (categoryPath.includes('/')) {
        const [category, subcategory] = categoryPath.split('/');
        return post.category === category && post.subcategory === subcategory;
      }
      return post.category === categoryPath;
    });
    
    const categoryPages = Math.ceil(categoryPosts.length / 10);
    
    for (let i = 1; i <= categoryPages; i++) {
      paths.push({ 
        searchParams: {
          category: categoryPath,
          page: i.toString()
        }
      });
    }
  });
  
  return paths;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const selectedCategory = searchParams?.category || '';

  // 카테고리 제목 가져오기
  const getCategoryTitle = () => {
    if (!selectedCategory) return '블로그';
    
    const [mainCategory, subCategory] = selectedCategory.split('/');
    const category = CATEGORIES.find(cat => cat.id === mainCategory);
    
    if (!category) return '블로그';
    
    if (subCategory) {
      const sub = category.subcategories?.find(sub => sub.id === subCategory);
      return sub ? sub.name : category.name;
    }
    
    return category.name;
  };

  const { items: posts, totalPages } = await getPaginatedPosts({
    page: isNaN(page) ? 1 : page,
    category: selectedCategory || undefined,
  });

  return (
    <div className="container-wrapper">
      <div className="card">
        <h1 className="text-3xl font-bold mb-8">{getCategoryTitle()}</h1>
        
        <CategoryFilter selectedCategory={selectedCategory} />

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