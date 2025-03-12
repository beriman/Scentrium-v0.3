import React from "react";
import { Outlet } from "react-router-dom";
import BusinessToolsSidebar from "./BusinessToolsSidebar";

export default function BusinessDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <BusinessToolsSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
