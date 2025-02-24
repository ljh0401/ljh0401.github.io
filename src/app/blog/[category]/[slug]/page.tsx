import { getPostBySlug, getAllPosts } from '@/lib/posts';
import PostDetail from '@/components/blog/PostDetail';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';
export const dynamicParams = false;

interface PostPageProps {
  params: {
    category: string;
    slug: string;
  };
}

// 정적 페이지 생성을 위한 params 생성
export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  return posts.map((post) => {
    const [category, slug] = post.slug.split('/');
    return {
      category,
      slug,
    };
  });
}

// 메타데이터 생성
export async function generateMetadata({ params }: PostPageProps) {
  try {
    const post = await getPostBySlug(`${params.category}/${params.slug}`);
    return {
      title: post.title,
      description: post.description,
    };
  } catch {
    return {
      title: 'Post Not Found',
      description: 'The post you are looking for does not exist.',
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const post = await getPostBySlug(`${params.category}/${params.slug}`);
    
    return (
      <div className="container-wrapper">
        <div className="card">
          <PostDetail post={post} />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
} 