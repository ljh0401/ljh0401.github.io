import Link from "next/link";
import { CATEGORIES } from "@/constants/categories";

interface CategoryFilterProps {
  selectedCategory: string;
}

export default function CategoryFilter({
  selectedCategory,
}: CategoryFilterProps) {
  // 현재 선택된 메인 카테고리와 서브카테고리 구분
  const [mainCategory, subCategory] = selectedCategory
    ? selectedCategory.split("/")
    : ["", ""];

  // 현재 선택된 메인 카테고리의 서브카테고리들 가져오기
  const currentMainCategory = CATEGORIES.find((cat) => cat.id === mainCategory);

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {/* 서브카테고리가 있을 경우 상위 카테고리로 가는 링크 추가 */}
      {subCategory && (
        <Link
          href={`/blog/${mainCategory}`}
          className="px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200"
        >
          ← {currentMainCategory?.name || "전체"}
        </Link>
      )}

      {/* 메인 카테고리가 선택되지 않았거나, 서브카테고리 보기 상태일 때 */}
      {!mainCategory || subCategory ? (
        <Link
          href="/blog"
          className={`px-3 py-1 rounded-full text-sm ${
            !selectedCategory
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          전체
        </Link>
      ) : null}

      {/* 메인 카테고리가 선택되지 않았을 때는 메인 카테고리들 표시 */}
      {!mainCategory &&
        CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/blog/${category.id}`}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === category.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </Link>
        ))}

      {/* 메인 카테고리가 선택되었고 서브카테고리가 없을 때는 서브카테고리들 표시 */}
      {mainCategory &&
        !subCategory &&
        currentMainCategory?.subcategories?.map((sub) => (
          <Link
            key={sub.id}
            href={`/blog/${mainCategory}/${sub.id}`}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === `${mainCategory}/${sub.id}`
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {sub.name}
          </Link>
        ))}
    </div>
  );
}
