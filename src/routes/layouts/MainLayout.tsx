import React from "react";
import TopNavbar from "@/components/shared/TopNavbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
