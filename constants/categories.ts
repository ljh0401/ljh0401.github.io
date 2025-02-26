import { Category } from "@/types/category";

export const CATEGORIES: Category[] = [
  {
    id: "development",
    name: "개발",
    description: "개발 관련 포스트",
    subcategories: [],
  },
  {
    id: "algorithm",
    name: "알고리즘",
    description: "알고리즘 문제 풀이",
    subcategories: [
      {
        id: "solution",
        name: "풀이",
        description: "알고리즘 풀이",
      },
    ],
  },
];
