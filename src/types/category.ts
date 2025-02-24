import { Post } from '@/types/post';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface PostWithCategory extends Post {
  category: string;
} 