import React from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-purple-800">Scentrium</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="py-4 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          <p>© 2023 Scentrium. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
