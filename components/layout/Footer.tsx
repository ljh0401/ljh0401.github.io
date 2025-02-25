import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} ljh0401's Blog
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/ljh0401"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 