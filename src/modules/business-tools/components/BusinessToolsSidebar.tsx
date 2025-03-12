import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Briefcase,
  Calculator,
  CreditCard,
  Home,
  LayoutDashboard,
  Palette,
  Settings,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/business",
    icon: <LayoutDashboard className="h-5 w-5" />,
    exact: true,
  },
  {
    title: "Sales Analytics",
    href: "/business/sales",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Financial Dashboard",
    href: "/business/finance",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Financial Calculator",
    href: "/business/calculator",
    icon: <Calculator className="h-5 w-5" />,
  },
  {
    title: "Branding Toolkit",
    href: "/business/branding",
    icon: <Palette className="h-5 w-5" />,
  },
  {
    title: "Product Management",
    href: "/business/products",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Marketing Templates",
    href: "/business/marketing",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/business/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function BusinessToolsSidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-purple-700" />
          <span className="text-xl font-bold text-purple-800">Scentrium</span>
        </Link>
        <p className="text-sm text-gray-500 mt-1">Business Tools</p>
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
