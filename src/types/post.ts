export interface PostHistory {
  version: number;
  date: string;
  changes: string;
}

export interface Post {
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  slug: string;
  content: string;
  lastModified?: string;
  history?: PostHistory[];
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  category: string;
}

export interface Post extends PostMeta {
  content: string;
} 