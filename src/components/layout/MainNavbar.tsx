import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../../../supabase/auth";
import NotificationCenter from "../notifications/NotificationCenter";
import {
  Home,
  User,
  LogOut,
  Settings,
  MessageSquare,
  ShoppingBag,
  BookOpen,
  BarChart2,
} from "lucide-react";

export default function MainNavbar() {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-purple-800">Scentrium</span>
          </Link>
        </div>
        <div className="flex items-center justify-between flex-1">
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-purple-800"
            >
              Home
            </Link>
            <Link
              to="/forum"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-purple-800"
            >
              Forum
            </Link>
            <Link
              to="/marketplace"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-purple-800"
            >
              Marketplace
            </Link>
            <Link
              to="/learning"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-purple-800"
            >
              Learning
            </Link>
            {profile?.membership_type === "business" && (
              <Link
                to="/business"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-purple-800"
              >
                Business Tools
              </Link>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationCenter />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            profile?.avatar_url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                          }
                          alt={profile?.full_name || ""}
                        />
                        <AvatarFallback>
                          {profile?.full_name?.[0] ||
                            user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {profile?.full_name || user.email?.split("@")[0]}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="cursor-pointer w-full flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/forum/my-threads"
                        className="cursor-pointer w-full flex items-center"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>My Threads</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/marketplace/my-orders"
                        className="cursor-pointer w-full flex items-center"
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/learning/my-courses"
                        className="cursor-pointer w-full flex items-center"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>My Courses</span>
                      </Link>
                    </DropdownMenuItem>
                    {profile?.membership_type === "business" && (
                      <DropdownMenuItem asChild>
                        <Link
                          to="/business/dashboard"
                          className="cursor-pointer w-full flex items-center"
                        >
                          <BarChart2 className="mr-2 h-4 w-4" />
                          <span>Business Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/settings"
                        className="cursor-pointer w-full flex items-center"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
