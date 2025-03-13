import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Settings,
  User,
  MessageSquare,
  ShoppingBag,
  BookOpen,
  BarChart,
  Award,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: "Community Forum",
      description:
        "Connect with fellow fragrance enthusiasts, share experiences, and discuss your favorite scents.",
      icon: <MessageSquare className="h-10 w-10 text-purple-600" />,
    },
    {
      title: "Marketplace",
      description:
        "Buy, sell, and trade fragrances with other community members in our secure marketplace.",
      icon: <ShoppingBag className="h-10 w-10 text-purple-600" />,
    },
    {
      title: "Learning Platform",
      description:
        "Expand your knowledge with courses, articles, and videos from industry experts.",
      icon: <BookOpen className="h-10 w-10 text-purple-600" />,
    },
    {
      title: "Business Tools",
      description:
        "Access powerful tools for perfume entrepreneurs to grow and manage their business.",
      icon: <BarChart className="h-10 w-10 text-purple-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-purple-50">
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="font-bold text-2xl text-purple-700">
              Scentrium
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <Avatar className="h-8 w-8 border-2 border-purple-200">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                          alt={user.email || ""}
                        />
                        <AvatarFallback>
                          {user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-block">
                        {user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => signOut()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-purple-700 hover:text-purple-900 hover:bg-purple-100"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-purple-700 hover:bg-purple-800">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <Badge className="px-3 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200 mb-4">
                Community Platform
              </Badge>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900"
              >
                <span className="text-purple-700">Scentrium</span> for Fragrance
                Enthusiasts
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-gray-600 max-w-xl"
              >
                Connect with fellow perfume lovers, share experiences, and
                explore the world of fragrances in our all-in-one platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="bg-purple-700 hover:bg-purple-800 text-lg px-8"
                  >
                    Join Community
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Learn More
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-2 pt-6"
              ></motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 relative"
            >
              <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=800&q=80"
                  alt="Perfume bottles"
                  className="w-full h-auto rounded-xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-purple-500/20 blur-[100px]" />
              <div className="absolute -top-6 -left-6 -z-10 h-[200px] w-[200px] rounded-full bg-purple-300/30 blur-[80px]" />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="px-3 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200 mb-4">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                All-in-One Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover our integrated modules designed to enhance your
                fragrance journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gamification Section */}
        <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2"
              >
                <Badge className="px-3 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200 mb-4">
                  Gamification
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Level Up Your Experience
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  Earn points, unlock badges, and rise through the ranks as you
                  participate in our community.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      title: "Experience Points",
                      desc: "Earn XP for every contribution you make",
                    },
                    {
                      title: "Achievement Badges",
                      desc: "Unlock special badges for your accomplishments",
                    },
                    {
                      title: "Community Levels",
                      desc: "Progress through levels to gain recognition",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-purple-100 rounded-full">
                        <Award className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 relative"
              >
                <div className="bg-white rounded-xl shadow-xl p-6 relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16 border-4 border-purple-200">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=expert" />
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">Fragrance Expert</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-purple-700 font-semibold">
                          Level 8
                        </span>
                        <span className="text-xs text-gray-500">
                          • 2,450 XP
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Progress to Level 9</span>
                        <span>65%</span>
                      </div>
                      <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                    </div>

                    <h4 className="font-semibold mt-6 mb-3">Recent Badges</h4>
                    <div className="flex flex-wrap gap-3">
                      {["Reviewer", "Contributor", "Explorer", "Mentor"].map(
                        (badge, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="px-3 py-1 bg-purple-100 text-purple-800"
                          >
                            {badge}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 -z-10 h-[200px] w-[200px] rounded-full bg-purple-300/30 blur-[80px]" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-purple-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Join Our Fragrance Community Today
              </h2>
              <p className="text-xl text-purple-100">
                Connect with fellow enthusiasts, share your passion, and explore
                the world of scents.
              </p>
              <div className="pt-6">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-purple-700 hover:bg-purple-50 text-lg px-8"
                  >
                    Get Started — It's Free
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Scentrium</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Marketplace
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Learning
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Business Tools
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Cookies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Licenses
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Scentrium. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
