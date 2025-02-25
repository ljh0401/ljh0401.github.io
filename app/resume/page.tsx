import { getResume } from "@/lib/resume";

export const dynamic = "force-static";

export default async function ResumePage() {
  const resume = await getResume();

  return (
    <div className="container-wrapper">
      <div className="card">
        <div className="prose prose-lg max-w-none">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{resume.data.title}</h1>
          </div>
          <div
            className="mt-8"
            dangerouslySetInnerHTML={{ __html: resume.content }}
          />
        </div>
      </div>
    </div>
  );
}
