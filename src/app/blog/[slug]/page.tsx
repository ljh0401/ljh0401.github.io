import { getPostBySlug, getAllPosts } from '@/lib/posts';
import PostDetail from '@/components/blog/PostDetail';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: {
    slug: string;
  };
}

// 정적 페이지 생성을 위한 params 생성
export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const post = await getPostBySlug(params.slug);

    return (
      <div className="max-w-4xl mx-auto px-4">
        <PostDetail post={post} />
      </div>
    );
  } catch (error) {
    notFound();
  }
} 