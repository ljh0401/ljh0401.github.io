import { Post } from "@/types/post";

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

export interface CategoryPath {
  category: string;
  subcategory?: string;
}

export function parseCategoryFromPath(path: string): CategoryPath {
  const parts = path.split("/");
  return {
    category: parts[0],
    subcategory: parts[1],
  };
}
