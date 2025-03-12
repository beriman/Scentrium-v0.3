import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  MessageSquare,
  TrendingUp,
  BookmarkIcon,
  Award,
  Clock,
  ThumbsUp,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FORUM_CATEGORIES } from "./CategorySelector";
import ForumStats from "./ForumStats";
import SearchBar from "@/components/forum/SearchBar";

export default function ForumSidebar() {
  const handleSearch = (query: string) => {
    // In a real app, this would navigate to search results page
    window.location.href = `/forum/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      <Link to="/forum/new">
        <Button className="w-full bg-purple-700 hover:bg-purple-800">
          <PlusCircle className="mr-2 h-4 w-4" /> Buat Thread Baru
        </Button>
      </Link>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-medium text-gray-900 mb-3">Kategori</h3>
        <ul className="space-y-2">
          {FORUM_CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link
                to={`/forum?category=${category.id}`}
                className="text-gray-600 hover:text-purple-700 flex items-center"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-medium text-gray-900 mb-3">Link Cepat</h3>
        <ul className="space-y-2">
          <li>
            <Link
              to="/forum?sort=popular"
              className="text-gray-600 hover:text-purple-700 flex items-center"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Diskusi Populer
            </Link>
          </li>
          <li>
            <Link
              to="/forum?sort=newest"
              className="text-gray-600 hover:text-purple-700 flex items-center"
            >
              <Clock className="mr-2 h-4 w-4" />
              Thread Terbaru
            </Link>
          </li>
          <li>
            <Link
              to="/forum?filter=top-rated"
              className="text-gray-600 hover:text-purple-700 flex items-center"
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              Thread Teratas
            </Link>
          </li>
          <li>
            <Link
              to="/forum?filter=saved"
              className="text-gray-600 hover:text-purple-700 flex items-center"
            >
              <BookmarkIcon className="mr-2 h-4 w-4" />
              Thread Tersimpan
            </Link>
          </li>
          <li>
            <Link
              to="/forum?filter=my-threads"
              className="text-gray-600 hover:text-purple-700 flex items-center"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Thread Saya
            </Link>
          </li>
          <li>
            <Link
              to="/forum?filter=my-replies"
              className="text-gray-600 hover:text-purple-700 flex items-center"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Balasan Saya
            </Link>
          </li>
          <li>
            <Link
              to="/forum/notifications"
              className="text-gray-600 hover:text-purple-700 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                Notifikasi
              </div>
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                3
              </span>
            </Link>
          </li>
        </ul>
      </div>

      <ForumStats />
    </div>
  );
}
