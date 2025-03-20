import React, { useState } from "react";
import {
  Bell,
  Home,
  Search,
  Settings,
  User,
  LogOut,
  MessageSquare,
  ShoppingBag,
  BookOpen,
  BarChart2,
  Package,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../../../../supabase/auth";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface TopNavigationProps {
  onSearch?: (query: string) => void;
  notifications?: Array<{ id: string; title: string }>;
}

const TopNavigation = ({
  onSearch = () => {},
  notifications = [
    { id: "1", title: "Ada balasan baru di thread kamu" },
    { id: "2", title: "Pesanan baru di toko kamu" },
  ],
}: TopNavigationProps) => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const isBusiness = profile?.membership_type === "business";

  const mainNavItems = [
    {
      name: "Beranda",
      path: "/",
      icon: <Home className="h-5 w-5" />,
    },
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
  ];

  const businessNavItems = [
    {
      name: "Dashboard",
      path: "/business/dashboard",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "Inventaris",
      path: "/business/inventory",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      path: "/business/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // If user is not logged in, show a simplified navbar with login/signup buttons
  if (!user) {
    return <></>;
  }

  return (
    <div className="w-full h-16 border-b bg-background flex items-center justify-between px-4 fixed top-0 z-50">
      {/* Logo and main navigation */}
      <div className="flex items-center gap-4 flex-1">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl text-purple-700">Scentrium</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${isActive(item.path) ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}

          {/* Business tools section - only for business accounts */}
          {isBusiness && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  <BarChart2 className="h-5 w-5" />
                  <span>Business Tools</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {businessNavItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Search bar */}
        <div className="relative hidden md:block ml-4 w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari di Scentrium..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      {/* Right side icons and user menu */}
      <div className="flex items-center gap-2">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {/* Notifications */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id}>
                      {notification.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifikasi</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.email || ""}
                />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">
                  {profile?.full_name || user.email?.split("@")[0]}
                </span>
                <Badge variant="outline" className="text-xs">
                  {isBusiness ? "Business" : "Free"}
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile/edit" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan
              </Link>
            </DropdownMenuItem>
            {!isBusiness && (
              <DropdownMenuItem asChild>
                <Link to="/profile?tab=upgrade" className="flex items-center">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Upgrade ke Business
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 p-4">
          <div className="flex flex-col space-y-4">
            {/* Mobile search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari di Scentrium..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            {/* Main navigation items */}
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 p-3 rounded-md ${isActive(item.path) ? "bg-purple-100 text-purple-700" : "text-gray-700"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Business tools section - only for business accounts */}
            {isBusiness && (
              <>
                <div className="border-t pt-4 mt-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Business Tools
                  </h3>
                  {businessNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 p-3 rounded-md ${isActive(item.path) ? "bg-purple-100 text-purple-700" : "text-gray-700"}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* User section */}
            <div className="border-t pt-4 mt-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 p-3 rounded-md text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Profil Saya</span>
              </Link>
              <Link
                to="/profile/edit"
                className="flex items-center gap-2 p-3 rounded-md text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Pengaturan</span>
              </Link>
              {!isBusiness && (
                <Link
                  to="/profile?tab=upgrade"
                  className="flex items-center gap-2 p-3 rounded-md text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BarChart2 className="h-5 w-5" />
                  <span>Upgrade ke Business</span>
                </Link>
              )}
              <Button
                variant="ghost"
                className="flex items-center gap-2 p-3 w-full justify-start rounded-md text-gray-700"
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>Keluar</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNavigation;
