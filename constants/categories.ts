import { Category } from '@/types/category';

export const CATEGORIES: Category[] = [
  {
    id: 'development',
    name: '개발',
    description: '개발 관련 포스트',
    subcategories: [
      {
        id: 'frontend',
        name: '프론트엔드',
        description: '프론트엔드 개발'
      },
      {
        id: 'backend',
        name: '백엔드',
        description: '백엔드 개발'
      },
      {
        id: 'database',
        name: '데이터베이스',
        description: '데이터베이스스 개발'
      },
      {
        id: 'infra',
        name: '인프라',
        description: '인프라 개발'
      }
    ]
  },
  {
    id: 'algorithm',
    name: '알고리즘',
    description: '알고리즘 문제 풀이',
    subcategories: [
      {
        id: 'concept',
        name: '개념',
        description: '개념 알고리즘'
      },
      {
        id: 'solution',
        name: '풀이',
        description: '알고리즘 풀이'
      }
    ]
  },
  {
    id: 'review',
    name: '프로젝트',
    description: '프로젝트 관련',
    subcategories: [
      {
        id: 'personal',
        name: '개인 프로젝트',
        description: '개인 프로젝트 리뷰'
      },
      {
        id: 'team',
        name: '팀 프로젝트',
        description: '팀 프로젝트 리뷰'
      }
    ]
  },
  // 필요한 카테고리 추가
]; 