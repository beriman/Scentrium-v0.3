import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import ThreadCard from "../components/ThreadCard";
import { FORUM_CATEGORIES } from "../components/CategorySelector";
import { Badge } from "@/components/ui/badge";

export default function ForumHomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");

  // Mock data for threads
  const threads = [
    {
      id: "1",
      title: "Parfum musim panas favorit kamu apa?",
      preview:
        "Saya mencari rekomendasi untuk aroma ringan dan segar untuk cuaca panas...",
      categoryId: "review-parfum",
      author: {
        id: "user1",
        name: "Sarah Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      upvotes: 42,
      downvotes: 3,
      userVote: null,
      replies: 24,
      views: 156,
      createdAt: "2 jam yang lalu",
    },
    {
      id: "2",
      title: "Review: Formulasi baru Chanel No. 5",
      preview:
        "Saya baru saja mencoba formulasi terbaru dari parfum klasik ini dan ingin berbagi pendapat saya...",
      categoryId: "review-parfum",
      author: {
        id: "user2",
        name: "Alex Kim",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      },
      upvotes: 28,
      downvotes: 2,
      userVote: "upvote",
      replies: 18,
      views: 203,
      createdAt: "1 hari yang lalu",
    },
    {
      id: "3",
      title: "DIY: Membuat campuran minyak esensial sendiri",
      preview:
        "Saya telah bereksperimen dengan membuat aroma sendiri di rumah menggunakan minyak esensial...",
      categoryId: "diskusi-perfumer",
      author: {
        id: "user3",
        name: "Maria Garcia",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      },
      upvotes: 56,
      downvotes: 4,
      userVote: null,
      replies: 32,
      views: 289,
      createdAt: "3 hari yang lalu",
    },
    {
      id: "4",
      title: "Inspirasi aroma dari budaya Nusantara",
      preview:
        "Mari kita diskusikan bagaimana kekayaan budaya Indonesia bisa menjadi inspirasi untuk kreasi parfum...",
      categoryId: "inspirasi-parfum",
      author: {
        id: "user4",
        name: "Budi Santoso",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
      },
      upvotes: 78,
      downvotes: 1,
      userVote: "upvote",
      replies: 45,
      views: 320,
      createdAt: "5 hari yang lalu",
    },
    {
      id: "5",
      title: "Mencari partner untuk event parfum di Jakarta",
      preview:
        "Saya berencana mengadakan workshop parfum di Jakarta bulan depan dan mencari partner kolaborasi...",
      categoryId: "kolaborasi-event",
      author: {
        id: "user5",
        name: "Dian Wijaya",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dian",
      },
      upvotes: 34,
      downvotes: 0,
      userVote: null,
      replies: 27,
      views: 189,
      createdAt: "1 minggu yang lalu",
    },
    {
      id: "6",
      title: "Tips branding untuk bisnis parfum indie",
      preview:
        "Berbagi pengalaman dan strategi branding untuk bisnis parfum indie yang baru memulai...",
      categoryId: "tips-bisnis-parfum",
      author: {
        id: "user6",
        name: "Rina Putri",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rina",
      },
      upvotes: 62,
      downvotes: 5,
      userVote: "downvote",
      replies: 38,
      views: 276,
      createdAt: "2 minggu yang lalu",
    },
  ];

  // Filter and sort threads
  const filteredThreads = threads
    .filter((thread) => {
      // Filter by search query
      const matchesSearch =
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.preview.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by category
      const matchesCategory = selectedCategory
        ? thread.categoryId === selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort by newest or popular
      if (sortBy === "newest") {
        // This is a mock sort since we don't have real timestamps
        return threads.indexOf(a) - threads.indexOf(b);
      } else {
        // Sort by vote score (upvotes - downvotes)
        return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
      }
    });

  const handleVote = (type: "upvote" | "downvote", threadId: string) => {
    console.log(`Voted ${type} on thread ${threadId}`);
    // In a real app, this would make an API call to update the vote
  };

  return (
    <div className="space-y-6">
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari diskusi..."
            className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant={sortBy === "newest" ? "default" : "outline"}
            className={
              sortBy === "newest"
                ? "bg-purple-700 hover:bg-purple-800"
                : "border-purple-200 text-purple-700"
            }
            onClick={() => setSortBy("newest")}
          >
            Terbaru
          </Button>
          <Button
            variant={sortBy === "popular" ? "default" : "outline"}
            className={
              sortBy === "popular"
                ? "bg-purple-700 hover:bg-purple-800"
                : "border-purple-200 text-purple-700"
            }
            onClick={() => setSortBy("popular")}
          >
            Populer
          </Button>
          <Button
            variant="outline"
            className="border-purple-200 text-purple-700"
          >
            <Filter className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Filter</span>
          </Button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className={`cursor-pointer ${selectedCategory === null ? "bg-purple-700" : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"}`}
          onClick={() => setSelectedCategory(null)}
        >
          Semua
        </Badge>
        {FORUM_CATEGORIES.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`cursor-pointer ${selectedCategory === category.id ? "bg-purple-700" : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Badge>
        ))}
      </div>

      {/* Thread list */}
      <div className="space-y-4">
        {filteredThreads.length > 0 ? (
          filteredThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              id={thread.id}
              title={thread.title}
              preview={thread.preview}
              categoryId={thread.categoryId}
              author={thread.author}
              upvotes={thread.upvotes}
              downvotes={thread.downvotes}
              userVote={thread.userVote}
              replies={thread.replies}
              views={thread.views}
              createdAt={thread.createdAt}
              onVote={handleVote}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <SlidersHorizontal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Tidak ada diskusi ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
