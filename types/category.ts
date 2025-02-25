import { Post } from '@/types/post';

export interface Category {
  id: string;
  name: string;
  description?: string;
  subcategories?: Category[];
}

export interface PostWithCategory extends Post {
  category: string;
  subcategory?: string;
}

// 폴더 경로에서 카테고리 정보를 파싱하기 위한 타입
export interface CategoryPath {
  category: string;
  subcategory?: string;
}

// 폴더 경로를 카테고리로 파싱하는 유틸리티 함수
export function parseCategoryFromPath(path: string): CategoryPath {
  const parts = path.split('/');
  return {
    category: parts[0],
    subcategory: parts[1]
  };
} 