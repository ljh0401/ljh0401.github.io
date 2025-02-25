import Image from 'next/image';
import Link from 'next/link';

export default function Profile() {
  return (
    <div className="hidden md:block text-center">
      {/* 프로필 이미지 */}
      <div className="w-20 h-20 mx-auto mb-3 relative">
        <Image
          src="https://github.com/ljh0401.png"
          alt="Profile"
          width={80}
          height={80}
          className="rounded-full object-cover max-w-[80px] max-h-[80px]"
          priority
        />
      </div>

      {/* 프로필 정보 */}
      <div>
        <h2 className="text-lg font-semibold mb-1">이준환</h2>
        <p className="text-gray-600 text-xs mb-3">
          안녕하세요! 이준환입니다.
        </p>
        
        {/* 소셜 링크 */}
        <Link
          href="https://github.com/ljh0401"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm"
        >
          @ljh0401
        </Link>
      </div>
    </div>
  );
} 