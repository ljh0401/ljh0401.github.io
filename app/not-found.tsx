export const dynamic = 'force-static';

export default function NotFound() {
  return (
    <div className="container-wrapper">
      <div className="card">
        <h1 className="text-3xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
        <p className="text-gray-600 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <a
          href="/"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          메인 페이지로 돌아가기
        </a>
      </div>
    </div>
  );
}