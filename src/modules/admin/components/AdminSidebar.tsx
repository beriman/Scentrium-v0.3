import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Activity,
  BookOpen,
  CreditCard,
  Flag,
  Home,
  MessageSquare,
  Settings,
  ShieldAlert,
  Users,
} from "lucide-react";

const menuItems = [
  {
    title: "User Management",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
    exact: true,
  },
  {
    title: "Forum Moderation",
    href: "/admin/forum",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Activity Monitoring",
    href: "/admin/activity",
    icon: <Activity className="h-5 w-5" />,
  },
  {
    title: "Course Pricing",
    href: "/admin/courses",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Payment Verification",
    href: "/admin/payments",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-red-700" />
          <span className="text-xl font-bold text-red-800">Admin Panel</span>
        </Link>
        <p className="text-sm text-gray-500 mt-1">Scentrium Management</p>
      </div>

      <nav className="mt-2">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  {React.cloneElement(item.icon, {
                    className: cn(
                      "h-5 w-5",
                      isActive ? "text-red-700" : "text-gray-500",
                    ),
                  })}
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 mt-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-700"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
