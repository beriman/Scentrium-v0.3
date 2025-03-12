import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-md w-full px-4 relative">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 -z-10 h-[200px] w-[200px] rounded-full bg-purple-300/30 blur-[80px]" />
        <div className="absolute -bottom-20 -right-20 -z-10 h-[200px] w-[200px] rounded-full bg-purple-500/20 blur-[80px]" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800">Scentrium</h1>
          <p className="text-gray-600 mt-2">
            Connect with the fragrance community
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
