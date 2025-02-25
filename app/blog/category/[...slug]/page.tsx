import React from 'react';
import { getPaginatedPosts, getAllPosts } from '@/lib/posts';
import PostList from '@/components/blog/PostList';
import Pagination from '@/components/common/Pagination';
import { CATEGORIES } from '@/constants/categories';
import { CategoryFilter } from '@/components/blog';

export const dynamic = "force-static";
export const dynamicParams = false;

interface CategoryPageProps {
  params: {
    slug: string[];
  };
  searchParams: {
    page?: string;
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  // 모든 카테고리와 서브카테고리 조합 수집
  const paths: { slug: string[] }[] = [];
  
  // 메인 카테고리 경로
  CATEGORIES.forEach(category => {
    paths.push({ slug: [category.id] });
    
    // 서브카테고리 경로
    category.subcategories?.forEach(sub => {
      paths.push({ slug: [category.id, sub.id] });
    });
  });

  return paths;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const [mainCategory, subCategory] = params.slug;
  const categoryPath = subCategory ? `${mainCategory}/${subCategory}` : mainCategory;

  // 카테고리 제목 가져오기
  const getCategoryTitle = () => {
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
    category: categoryPath,
  });

  return (
    <div className="container-wrapper">
      <div className="card">
        <h1 className="text-3xl font-bold mb-8">{getCategoryTitle()}</h1>
        
        <CategoryFilter selectedCategory={categoryPath} />

        <PostList posts={posts} />
        <Pagination
          currentPage={isNaN(page) ? 1 : page}
          totalPages={totalPages}
          baseUrl={`/blog/category/${categoryPath}`}
        />
      </div>
    </div>
  );
} 