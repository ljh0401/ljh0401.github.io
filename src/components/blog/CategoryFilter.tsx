import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';

interface CategoryFilterProps {
  selectedCategory: string;
}

export default function CategoryFilter({ selectedCategory }: CategoryFilterProps) {
  return (
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
  );
} 