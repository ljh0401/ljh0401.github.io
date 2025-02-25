export interface PostHistory {
  version: number;
  datetime: string;
  changes: string;
}

export interface Post {
  title: string;
  description: string;
  datetime: string;
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
  datetime: string;
  description: string;
  tags?: string[];
  category: string;
}

export interface Post extends PostMeta {
  content: string;
} 