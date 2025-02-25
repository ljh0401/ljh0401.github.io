import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import { getAllPosts } from '@/lib/posts';
import { Category } from '@/types/category';

export default async function CategoryNav() {
  const posts = await getAllPosts();
  
  // 폴더 구조와 프론트매터 모두에서 카테고리 정보를 수집
  const categoryCount = posts.reduce((acc, post) => {
    // 메인 카테고리 카운트
    acc[post.category] = (acc[post.category] || 0) + 1;
    
    // 서브 카테고리가 있는 경우 해당 카운트도 추가
    if (post.subcategory) {
      const fullPath = `${post.category}/${post.subcategory}`;
      acc[fullPath] = (acc[fullPath] || 0) + 1;
    }
    
    return acc;
  }, {} as Record<string, number>);

  const renderSubcategories = (category: Category, parentId: string) => {
    if (!category.subcategories?.length) return null;

    return (
      <ul className="ml-4 mt-1 space-y-1">
        {category.subcategories.map((sub) => {
          const fullId = `${parentId}/${sub.id}`;
          return (
            <li key={sub.id}>
              <Link
                href={`/blog?category=${fullId}`}
                className="block px-2 py-1 text-sm rounded text-gray-600 hover:text-blue-600"
              >
                {sub.name} ({categoryCount[fullId] || 0})
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="mt-4">
      <details className="group" open>
        <summary className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
          <span className="font-medium">카테고리</span>
          <svg
            className="w-4 h-4 transition-transform group-open:rotate-180"
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
        </summary>

        <ul className="mt-2 space-y-1">
          <li>
            <Link
              href="/blog"
              className="block px-2 py-1 text-sm rounded text-gray-600 hover:text-blue-600"
            >
              전체 ({posts.length})
            </Link>
          </li>
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link
                href={`/blog?category=${category.id}`}
                className="block px-2 py-1 text-sm rounded text-gray-600 hover:text-blue-600"
              >
                {category.name} ({categoryCount[category.id] || 0})
              </Link>
              {renderSubcategories(category, category.id)}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
} 