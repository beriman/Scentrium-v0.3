import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
        <Toaster />
      </div>
    </div>
  );
}
