import Link from 'next/link';
import { PostMeta } from '@/types/post';

interface PostListProps {
  posts: PostMeta[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="border-b pb-4 last:border-b-0"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <time>{post.date}</time>
            <span>•</span>
            <span>{post.category}</span>
          </div>
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
              {post.title}
            </h3>
          </Link>
          <p className="text-gray-600 mt-2 line-clamp-2">
            {post.description}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-gray-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
} 