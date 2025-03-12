import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  Shield,
  Settings,
  BarChart2,
  MessageSquare,
  ShoppingBag,
  BookOpen,
  Home,
  Bell,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <BarChart2 className="h-5 w-5" />,
    exact: true,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Content Moderation",
    href: "/admin/moderation",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Forum Management",
    href: "/admin/forum",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Marketplace Management",
    href: "/admin/marketplace",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Learning Management",
    href: "/admin/learning",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: <Bell className="h-5 w-5" />,
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
          <Shield className="h-6 w-6 text-purple-700" />
          <span className="text-xl font-bold text-purple-800">Scentrium</span>
        </Link>
        <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
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
                      ? "bg-purple-50 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  {React.cloneElement(item.icon, {
                    className: cn(
                      "h-5 w-5",
                      isActive ? "text-purple-700" : "text-gray-500",
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
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-700"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
