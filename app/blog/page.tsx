import React from "react";
import { getCategoryPosts } from "@/lib/posts";
import PostList from "@/components/blog/PostList";

export const dynamic = "force-static";
export const dynamicParams = false;

export default async function BlogPage() {
  const posts = await getCategoryPosts();

  return (
    <div className="container-wrapper">
      <div className="card">
        <h1 className="text-3xl font-bold mb-8">전체</h1>
        <PostList posts={posts} />
      </div>
    </div>
  );
}
