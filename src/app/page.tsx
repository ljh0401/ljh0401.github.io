import { getAllPosts } from '@/lib/posts';
import { PostList } from '@/components/index';
import Link from 'next/link';

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-8">
      {/* 최신 글 섹션 */}
      <section className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">최신 글</h2>
          <Link 
            href="/blog" 
            className="btn btn-ghost text-sm"
          >
            모든 글 보기
          </Link>
        </div>
        <PostList posts={posts.slice(0, 5)} />
      </section>
    </div>
  );
} 