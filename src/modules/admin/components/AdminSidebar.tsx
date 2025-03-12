import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Shield,
  CreditCard,
  Users,
  BookOpen,
  MessageSquare,
  ShoppingBag,
  Settings,
  Home,
} from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard className="h-5 w-5 mr-3" />,
    },
    {
      name: "Content Moderation",
      path: "/admin?tab=moderation",
      icon: <Shield className="h-5 w-5 mr-3" />,
    },
    {
      name: "Transaction Verification",
      path: "/admin?tab=transactions",
      icon: <CreditCard className="h-5 w-5 mr-3" />,
    },
    {
      name: "Membership Management",
      path: "/admin?tab=membership",
      icon: <Users className="h-5 w-5 mr-3" />,
    },
    {
      name: "Learning Platform",
      path: "/admin?tab=learning",
      icon: <BookOpen className="h-5 w-5 mr-3" />,
    },
    {
      name: "Forum Management",
      path: "/admin/forum",
      icon: <MessageSquare className="h-5 w-5 mr-3" />,
    },
    {
      name: "Marketplace Management",
      path: "/admin/marketplace",
      icon: <ShoppingBag className="h-5 w-5 mr-3" />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings className="h-5 w-5 mr-3" />,
    },
  ];

  return (
    <div className="w-64 bg-purple-900 text-white p-4 min-h-screen">
      <div className="flex items-center gap-2 mb-8 px-4">
        <Shield className="h-6 w-6" />
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center py-2 px-4 rounded-md transition-colors",
                  isActive(item.path)
                    ? "bg-purple-800 text-white"
                    : "text-purple-100 hover:bg-purple-800/50",
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 mt-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-purple-100 hover:text-white"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
