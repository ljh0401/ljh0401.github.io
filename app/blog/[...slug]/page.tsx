import React from "react";
import { getCategoryPosts, getPostBySlug, getAllPosts } from "@/lib/posts";
import PostList from "@/components/blog/PostList";
import PostDetail from "@/components/blog/PostDetail";
import { CATEGORIES } from "@/constants/categories";
import { CategoryFilter } from "@/components/blog";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

interface PageProps {
  params: {
    slug: string[];
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const paths = new Set<string>();

  // 카테고리 경로 추가
  CATEGORIES.forEach((category) => {
    paths.add(category.id);
    category.subcategories?.forEach((sub) => {
      paths.add(`${category.id}/${sub.id}`);
    });
  });

  // 포스트 경로 추가
  posts.forEach((post) => {
    paths.add(post.slug); // 전체 경로 추가
  });

  return Array.from(paths).map((path) => ({
    slug: path.split("/"),
  }));
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = params;

  try {
    // 현재 경로가 실제 포스트인지 확인
    try {
      const fullSlug = slug.join("/");
      const post = await getPostBySlug(fullSlug);

      // 포스트를 찾았다면 포스트 상세 페이지 표시
      return (
        <div className="container-wrapper">
          <div className="card">
            <PostDetail post={post} />
          </div>
        </div>
      );
    } catch {
      // 포스트를 찾지 못했다면 카테고리 목록 페이지로 진행
    }

    // 카테고리 목록 페이지 (예: /blog/category 또는 /blog/category/subcategory)
    const categoryPath = slug.join("/");
    const posts = await getCategoryPosts(categoryPath);

    const getCategoryTitle = () => {
      if (slug.length === 0) return "블로그";

      const category = CATEGORIES.find((cat) => cat.id === slug[0]);
      if (!category) return "블로그";

      if (slug.length > 1) {
        const sub = category.subcategories?.find((sub) => sub.id === slug[1]);
        return sub ? sub.name : category.name;
      }

      return category.name;
    };

    return (
      <div className="container-wrapper">
        <div className="card">
          <h1 className="text-3xl font-bold mb-8">{getCategoryTitle()}</h1>
          <CategoryFilter selectedCategory={categoryPath} />
          <PostList posts={posts} />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
