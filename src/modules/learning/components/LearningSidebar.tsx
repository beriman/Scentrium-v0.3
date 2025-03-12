import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  GraduationCap,
  FileText,
  BookmarkIcon,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LearningSidebar() {
  const categories = [
    { name: "Perfume Basics", slug: "basics" },
    { name: "Fragrance Families", slug: "families" },
    { name: "Perfume Making", slug: "making" },
    { name: "Scent Appreciation", slug: "appreciation" },
    { name: "Industry Insights", slug: "industry" },
  ];

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search courses..."
          className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-medium text-gray-900 mb-3">Learning Categories</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                to={`/learning?category=${category.slug}`}
                className="text-gray-600 hover:text-purple-700 flex items-center"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-medium text-gray-900 mb-3">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <Link
              to="/learning?type=courses"
              className="text-gray-600 hover:text-purple-700 flex items-center"
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              All Courses
            </Link>
          </li>
          <li>
            <Link
              to="/learning?type=articles"
              className="text-gray-600 hover:text-purple-700 flex items-center"
            >
              <FileText className="mr-2 h-4 w-4" />
              Articles & Guides
            </Link>
          </li>
          <li>
            <Link
              to="/learning?filter=saved"
              className="text-gray-600 hover:text-purple-700 flex items-center"
            >
              <BookmarkIcon className="mr-2 h-4 w-4" />
              Saved Content
            </Link>
          </li>
        </ul>
      </div>

      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="font-medium text-purple-800 mb-2">My Learning</h3>
        <p className="text-sm text-gray-600 mb-4">
          Track your progress and continue where you left off.
        </p>
        <Link to="/learning?filter=enrolled">
          <Button className="w-full bg-purple-700 hover:bg-purple-800">
            View My Courses
          </Button>
        </Link>
      </div>
    </div>
  );
}
