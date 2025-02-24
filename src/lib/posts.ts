import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Post, PostMeta } from '@/types/post';
import { PaginationResult, PaginationParams } from '@/types/pagination';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export async function getAllPosts(): Promise<PostMeta[]> {
  const categories = fs.readdirSync(postsDirectory).filter(file => 
    fs.statSync(path.join(postsDirectory, file)).isDirectory()
  );

  const allPosts = categories.flatMap(category => {
    const categoryPath = path.join(postsDirectory, category);
    const files = fs.readdirSync(categoryPath);
    
    return files.map(fileName => {
      const fullPath = path.join(categoryPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      const slug = `${category}/${fileName.replace(/\.md$/, '')}`;

      // 폴더명을 카테고리로 사용
      data.category = category;

      return {
        slug,
        ...(data as Omit<PostMeta, 'slug'>),
      };
    });
  });

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const [category, postSlug] = slug.split('/');
  const fullPath = path.join(postsDirectory, category, `${postSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // 폴더명을 카테고리로 사용
  data.category = category;

  const processedContent = await remark()
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    content: contentHtml,
    ...(data as Omit<Post, 'slug' | 'content'>),
  };
}

export async function getPaginatedPosts({
  page = 1,
  limit = 10,
  category,
}: PaginationParams & { category?: string } = {}): Promise<PaginationResult<PostMeta>> {
  const allPosts = await getAllPosts();
  
  // 카테고리 필터링
  const filteredPosts = category
    ? allPosts.filter(post => post.category === category)
    : allPosts;
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  return {
    items: paginatedPosts,
    currentPage: page,
    totalPages: Math.ceil(filteredPosts.length / limit),
    totalItems: filteredPosts.length,
    itemsPerPage: limit,
  };
} 