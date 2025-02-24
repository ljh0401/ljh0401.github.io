import { getPostBySlug, getAllPosts } from '@/lib/posts';
import PostDetail from '@/components/blog/PostDetail';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: {
    category: string;
    slug: string;
  };
}

// 정적 페이지 생성을 위한 params 생성
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    
    // 각 포스트의 category와 slug를 명시적으로 추출
    const params = [];
    
    for (const post of posts) {
      if (!post.slug) continue;
      
      const [category, fileName] = post.slug.split('/');
      if (!category || !fileName) continue;
      
      params.push({
        category: category,
        slug: fileName
      });
    }
    return params;
    
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
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
    const { category, slug } = params;
    const post = await getPostBySlug(`${category}/${slug}`);

    return (
      <div className="max-w-4xl mx-auto px-4">
        <PostDetail post={post} />
      </div>
    );
  } catch (error) {
    notFound();
  }
} 