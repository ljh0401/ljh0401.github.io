import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Post, PostMeta } from '@/types/post';
import { PaginationResult, PaginationParams } from '@/types/pagination';
const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const DEFAULT_PAGE_SIZE = 10;

function getFileCreationDate(filePath: string): string {
  try {
    const stats = fs.statSync(filePath);
    return stats.birthtime.toISOString().split('T')[0];
  } catch (error) {
    return new Date().toISOString().split('T')[0];
  }
}

function getFileModificationDate(filePath: string): string {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0];
  } catch (error) {
    return new Date().toISOString().split('T')[0];
  }
}

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

      // date가 없으면 오늘 날짜를 사용
      if (!data.date) {
        data.date = new Date().toISOString().split('T')[0];
      }

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
  
  // frontmatter에 date가 없으면 파일 생성일을 사용
  if (!data.date) {
    data.date = getFileCreationDate(fullPath);
  }

  // lastModified가 없으면 파일 수정일을 사용
  if (!data.lastModified) {
    const modifiedDate = getFileModificationDate(fullPath);
    if (modifiedDate !== data.date) {
      data.lastModified = modifiedDate;
    }
  }

  // 폴더명을 카테고리로 사용 (md 파일의 category를 덮어씀)
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