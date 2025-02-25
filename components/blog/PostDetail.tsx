import { Post } from '@/types/post';
import Link from 'next/link';
import PostHistory from './PostHistory';

interface PostDetailProps {
  post: Post;
}

function formatDateTime(datetime: string) {
  const date = new Date(datetime);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export default function PostDetail({ post }: PostDetailProps) {
  return (
    <article className="prose prose-lg max-w-none">
      {/* 포스트 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
          <time dateTime={post.datetime} className="text-sm">
            작성: {formatDateTime(post.datetime)}
          </time>
          {post.lastModified && (
            <time dateTime={post.lastModified} className="text-sm">
              수정: {formatDateTime(post.lastModified)}
            </time>
          )}
          <span className="text-sm px-2 py-1 bg-gray-100 rounded">
            {post.category}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 포스트 본문 */}
      <div 
        className="mt-8"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      {/* 포스트 히스토리 */}
      <PostHistory 
        lastModified={post.lastModified}
        history={post.history}
      />

      {/* 포스트 푸터 */}
      <div className="mt-12 pt-8 border-t">
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
} 