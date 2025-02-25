import Link from "next/link";
import { CATEGORIES } from "@/constants/categories";
import { Suspense } from "react";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            나의 작은 블로그
          </Link>
          <Suspense fallback={<div className="w-8 h-8" />}>
            <MobileMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
