import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/MockAuthContext";
import {
  Menu,
  MessageSquare,
  ShoppingBag,
  BookOpen,
  User,
  LogOut,
  Settings,
  Briefcase,
  ShieldAlert,
} from "lucide-react";

export default function TopNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
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
      name: "Learning",
      path: "/learning",
      icon: <BookOpen className="h-5 w-5" />,
    },
    { name: "Profile", path: "/profile", icon: <User className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 md:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-purple-800">Scentrium</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-1.5 text-sm font-medium ${isActive(item.path) ? "text-purple-700" : "text-gray-600 hover:text-purple-700"}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Menu (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt={profile?.full_name || "User"}
                    />
                    <AvatarFallback>
                      {profile?.full_name?.[0] || user.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.full_name || "User"}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {profile?.role === "business" && (
                  <DropdownMenuItem asChild>
                    <Link to="/business" className="cursor-pointer">
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>Business Tools</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {profile?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/profile/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-purple-700 hover:bg-purple-800">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <div className="flex flex-col h-full">
                {/* User Info */}
                {user ? (
                  <div className="flex items-center gap-3 py-4 border-b">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={profile?.full_name || "User"}
                      />
                      <AvatarFallback>
                        {profile?.full_name?.[0] || user.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {profile?.full_name || "User"}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 py-4 border-b">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-purple-700 hover:bg-purple-800">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="flex flex-col py-4 flex-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 text-base ${isActive(item.path) ? "text-purple-700 bg-purple-50" : "text-gray-700 hover:bg-gray-50"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}

                  {/* Conditional Links */}
                  {user && (
                    <>
                      {profile?.role === "business" && (
                        <Link
                          to="/business"
                          className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsOpen(false)}
                        >
                          <Briefcase className="h-5 w-5" />
                          Business Tools
                        </Link>
                      )}
                      {profile?.role === "admin" && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsOpen(false)}
                        >
                          <ShieldAlert className="h-5 w-5" />
                          Admin Panel
                        </Link>
                      )}
                    </>
                  )}
                </nav>

                {/* Logout Button */}
                {user && (
                  <div className="border-t py-4">
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-base text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
