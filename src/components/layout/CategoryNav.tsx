import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import { getAllPosts } from '@/lib/posts';

export default async function CategoryNav() {
  // 빌드 시점에 모든 포스트를 가져옴
  const posts = await getAllPosts();
  const categoryCount = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
} 