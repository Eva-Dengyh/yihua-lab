"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAdmin, removeToken } from "@/lib/auth";

const MENU_ITEMS = [
  { label: "导航管理", href: "/admin/navigation" },
  { label: "项目管理", href: "/admin/projects" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* 侧边栏 */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="px-5 py-4 text-lg font-semibold text-gray-800 border-b border-gray-200">
          后台管理
        </div>
        <nav className="flex-1 py-4">
          {MENU_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-5 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 p-4 space-y-2">
          <Link
            href="/en"
            className="block text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            &larr; 返回博客
          </Link>
          <button
            onClick={handleLogout}
            className="block text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            退出登录
          </button>
        </div>
      </aside>

      {/* 内容区 */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
