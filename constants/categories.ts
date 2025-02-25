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
  {
    id: "review",
    name: "프로젝트",
    description: "프로젝트 관련",
    subcategories: [],
  },
  // 필요한 카테고리 추가
];
