import { PostHistory as PostHistoryType } from '@/types/post';

interface PostHistoryProps {
  lastModified?: string;
  history?: PostHistoryType[];
}

export default function PostHistory({ lastModified, history }: PostHistoryProps) {
  if (!lastModified && !history?.length) return null;

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-semibold mb-4">포스트 히스토리</h2>
      {lastModified && (
        <p className="text-sm text-gray-600 mb-4">
          마지막 수정일: {lastModified}
        </p>
      )}
      {history && history.length > 0 && (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.version}
              className="flex items-start gap-4 text-sm text-gray-600"
            >
              <div className="min-w-[100px]">v{item.version}</div>
              <div className="min-w-[120px]">{item.datetime}</div>
              <div>{item.changes}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 