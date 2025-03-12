import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/MockAuthContext";
import {
  Menu,
  Home,
  MessageSquare,
  ShoppingBag,
  BookOpen,
  BarChart2,
  User,
  LogOut,
  Settings,
  Bell,
  Shield,
} from "lucide-react";

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: "Beranda", path: "/", icon: <Home className="h-5 w-5" /> },
    {
      name: "Forum",
      path: "/forum",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Marketplace",
      path: "/marketplace",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Pembelajaran",
      path: "/learning",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Business Tools",
      path: "/business",
      icon: <BarChart2 className="h-5 w-5" />,
    },
  ];

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-purple-600"></span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="border-b py-4 px-6">
            <h2 className="text-lg font-semibold text-purple-800">Scentrium</h2>
            <p className="text-sm text-gray-500">Komunitas Parfum Indonesia</p>
          </div>

          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="py-4">
              <div className="px-3 py-2">
                <h3 className="mb-2 px-4 text-xs font-semibold text-gray-500">
                  MENU UTAMA
                </h3>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive(item.path) ? "bg-purple-100 text-purple-900" : "text-gray-700 hover:bg-gray-100"}`}
                      onClick={() => setOpen(false)}
                    >
                      <span
                        className={`${isActive(item.path) ? "text-purple-700" : "text-gray-500"}`}
                      >
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  ))}

                  {profile?.role === "admin" && (
                    <Link
                      to="/admin"
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive("/admin") ? "bg-purple-100 text-purple-900" : "text-gray-700 hover:bg-gray-100"}`}
                      onClick={() => setOpen(false)}
                    >
                      <span
                        className={`${isActive("/admin") ? "text-purple-700" : "text-gray-500"}`}
                      >
                        <Shield className="h-5 w-5" />
                      </span>
                      Admin Panel
                    </Link>
                  )}
                </nav>
              </div>

              <div className="mt-4 border-t pt-4">
                <h3 className="mb-2 px-7 text-xs font-semibold text-gray-500">
                  AKUN
                </h3>
                <nav className="space-y-1 px-3 py-2">
                  <Link
                    to="/profile"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive("/profile") ? "bg-purple-100 text-purple-900" : "text-gray-700 hover:bg-gray-100"}`}
                    onClick={() => setOpen(false)}
                  >
                    <User
                      className={`h-5 w-5 ${isActive("/profile") ? "text-purple-700" : "text-gray-500"}`}
                    />
                    Profil Saya
                  </Link>
                  <Link
                    to="/notifications"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive("/notifications") ? "bg-purple-100 text-purple-900" : "text-gray-700 hover:bg-gray-100"}`}
                    onClick={() => setOpen(false)}
                  >
                    <Bell
                      className={`h-5 w-5 ${isActive("/notifications") ? "text-purple-700" : "text-gray-500"}`}
                    />
                    Notifikasi
                    <span className="ml-auto bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      3
                    </span>
                  </Link>
                  <Link
                    to="/settings"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive("/settings") ? "bg-purple-100 text-purple-900" : "text-gray-700 hover:bg-gray-100"}`}
                    onClick={() => setOpen(false)}
                  >
                    <Settings
                      className={`h-5 w-5 ${isActive("/settings") ? "text-purple-700" : "text-gray-500"}`}
                    />
                    Pengaturan
                  </Link>
                  {user && (
                    <button
                      onClick={() => {
                        signOut();
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-5 w-5 text-gray-500" />
                      Keluar
                    </button>
                  )}
                </nav>
              </div>

              <div className="mt-6 px-7 py-2">
                <div className="rounded-md bg-purple-50 p-4">
                  <h4 className="text-sm font-medium text-purple-800">
                    Upgrade ke Business
                  </h4>
                  <p className="mt-1 text-xs text-purple-700">
                    Akses fitur eksklusif untuk mengembangkan bisnis parfum Anda
                  </p>
                  <Button
                    className="mt-3 w-full bg-purple-700 hover:bg-purple-800 text-xs"
                    onClick={() => setOpen(false)}
                  >
                    Upgrade Sekarang
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
