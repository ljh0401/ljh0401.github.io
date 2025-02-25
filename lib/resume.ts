import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const resumePath = path.join(process.cwd(), "content/resume/resume.md");

export interface Resume {
  content: string;
  data: {
    title: string;
    lastModified?: string;
    description?: string;
  };
}

export async function getResume(): Promise<Resume> {
  try {
    if (!fs.existsSync(resumePath)) {
      throw new Error("이력서 파일을 찾을 수 없습니다.");
    }

    const fileContents = fs.readFileSync(resumePath, "utf8");
    const { data, content } = matter(fileContents);

    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
      content: contentHtml,
      data: data as Resume["data"],
    };
  } catch (error) {
    console.error("Error getting resume:", error);
    throw new Error("이력서를 불러오는 중 오류가 발생했습니다.");
  }
}
