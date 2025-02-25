import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Post, PostMeta } from '@/types/post';
import { PaginationResult, PaginationParams } from '@/types/pagination';

// 경로 수정
const postsDirectory = path.join(process.cwd(), 'content/posts');

// 슬러그 생성을 위한 유틸리티 함수
function generateSlug(text: string): string {
  return text
    .toLowerCase() // 소문자로 변환
    .normalize('NFD') // 유니코드 정규화
    .replace(/[\u0300-\u036f]/g, '') // 발음 구별 기호 제거
    .replace(/[^a-z0-9가-힣]/g, '-') // 알파벳, 숫자, 한글이 아닌 문자를 하이픈으로 변환
    .replace(/--+/g, '-') // 여러 개의 하이픈을 하나로 변환
    .replace(/^-|-$/g, ''); // 시작과 끝의 하이픈 제거
}

export async function getAllPosts(): Promise<PostMeta[]> {
  try {
    // 디렉토리가 없으면 생성
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
      return [];
    }

    const categories = fs.readdirSync(postsDirectory).filter(file => 
      fs.statSync(path.join(postsDirectory, file)).isDirectory()
    );

    const allPosts = categories.flatMap(category => {
      const categoryPath = path.join(postsDirectory, category);
      // 디렉토리 내의 .md 파일만 필터링
      const files = fs.readdirSync(categoryPath).filter(file => 
        file.endsWith('.md') && 
        fs.statSync(path.join(categoryPath, file)).isFile()
      );
      
      return files.map(fileName => {
        const fullPath = path.join(categoryPath, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        const slug = `${category}/${fileName.replace(/\.md$/, '')}`;

        data.category = category;

        return {
          slug,
          ...(data as Omit<PostMeta, 'slug'>),
        };
      });
    });

    return allPosts.sort((a, b) => (a.datetime < b.datetime ? 1 : -1));
  } catch (error) {
    console.error('Error getting all posts:', error);
    if (process.env.NODE_ENV === 'development') {
      return [];
    }
    throw new Error('포스트를 불러오는 중 오류가 발생했습니다.');
  }
}

export async function getPostBySlug(slug: string): Promise<Post> {
  try {
    const [category, postSlug] = slug.split('/');
    const categoryPath = path.join(postsDirectory, category);
    
    // 디렉토리 내의 모든 파일을 읽어서 매칭되는 슬러그 찾기
    const files = fs.readdirSync(categoryPath);
    const fileName = files.find(file => {
      const baseSlug = file.replace(/\.md$/, '');
      return generateSlug(baseSlug) === postSlug;
    });

    if (!fileName) {
      throw new Error('포스트를 찾을 수 없습니다.');
    }

    const fullPath = path.join(categoryPath, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
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
  } catch (error) {
    console.error('Error getting post by slug:', error);
    throw new Error('포스트를 불러오는 중 오류가 발생했습니다.');
  }
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