import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { Post, PostMeta } from "@/types/post";
import { CategoryPath } from "@/types/category";

// 경로 수정
const postsDirectory = path.join(process.cwd(), "content/posts");

// 슬러그 생성을 위한 유틸리티 함수
function generateSlug(text: string): string {
  return text
    .toLowerCase() // 소문자로 변환
    .normalize("NFD") // 유니코드 정규화
    .replace(/[\u0300-\u036f]/g, "") // 발음 구별 기호 제거
    .replace(/[^a-z0-9가-힣]/g, "-") // 알파벳, 숫자, 한글이 아닌 문자를 하이픈으로 변환
    .replace(/--+/g, "-") // 여러 개의 하이픈을 하나로 변환
    .replace(/^-|-$/g, ""); // 시작과 끝의 하이픈 제거
}

export function getCategoryFromSlug(slug: string): CategoryPath {
  const parts = slug.split("/");
  // 폴더 구조가 category/subcategory/post-name.md 형태일 경우
  if (parts.length >= 2) {
    return {
      category: parts[0],
      subcategory: parts[1],
    };
  }
  // 폴더 구조가 category/post-name.md 형태일 경우
  return {
    category: parts[0],
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  try {
    // 디렉토리가 없으면 생성
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
      return [];
    }

    const categories = fs
      .readdirSync(postsDirectory)
      .filter((file) =>
        fs.statSync(path.join(postsDirectory, file)).isDirectory()
      );

    const allPosts = categories.flatMap((category) => {
      const categoryPath = path.join(postsDirectory, category);
      const items = fs.readdirSync(categoryPath);

      return items.flatMap((item) => {
        const itemPath = path.join(categoryPath, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();

        if (isDirectory) {
          // 서브카테고리인 경우
          const subCategoryFiles = fs.readdirSync(itemPath);
          return subCategoryFiles
            .filter((file) => file.endsWith(".md"))
            .map((file) => {
              const fullPath = path.join(itemPath, file);
              const fileContents = fs.readFileSync(fullPath, "utf8");
              const { data } = matter(fileContents);
              const slug = `${category}/${item}/${file.replace(/\.md$/, "")}`;

              return {
                slug,
                ...data,
                category,
                subcategory: item,
              } as PostMeta;
            });
        } else if (item.endsWith(".md")) {
          // 메인 카테고리 직접 하위의 파일인 경우
          const fileContents = fs.readFileSync(itemPath, "utf8");
          const { data } = matter(fileContents);
          const slug = `${category}/${item.replace(/\.md$/, "")}`;

          return [
            {
              slug,
              ...data,
              category,
            } as PostMeta,
          ];
        }

        return [];
      });
    });

    return allPosts.sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
  } catch (error) {
    console.error("Error getting all posts:", error);
    if (process.env.NODE_ENV === "development") {
      return [];
    }
    throw new Error("포스트를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const parts = slug.split("/");
    let fullPath: string;

    // 서브카테고리가 있는 경우 (예: category/subcategory/post)
    if (parts.length === 3) {
      const [category, subcategory, postName] = parts;
      fullPath = path.join(
        postsDirectory,
        category,
        subcategory,
        `${postName}.md`
      );
    } else {
      // 서브카테고리가 없는 경우 (예: category/post)
      const [category, postName] = parts;
      fullPath = path.join(postsDirectory, category, `${postName}.md`);
    }

    if (!fs.existsSync(fullPath)) {
      return null; // 에러를 발생시키는 대신 null 반환
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    // 서브카테고리 정보 추가
    const subcategory = parts.length === 3 ? parts[1] : undefined;

    return {
      slug,
      content: contentHtml,
      ...data,
      category: parts[0],
      subcategory,
    } as Post;
  } catch (error) {
    console.error("Error getting post by slug:", error);
    return null; // 에러가 발생해도 null 반환
  }
}

export async function getCategoryPosts(category?: string): Promise<PostMeta[]> {
  const allPosts = await getAllPosts();

  if (!category) return allPosts;

  // 카테고리 필터링
  return allPosts.filter((post) => {
    if (category.includes("/")) {
      // 서브카테고리가 포함된 경우
      const [mainCategory, subCategory] = category.split("/");
      return post.category === mainCategory && post.subcategory === subCategory;
    }
    // 메인 카테고리만 있는 경우
    return post.category === category;
  });
}
