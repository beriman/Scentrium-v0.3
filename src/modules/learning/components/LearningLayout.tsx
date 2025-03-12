import { Outlet } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import LearningSidebar from "./LearningSidebar";

export default function LearningLayout() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-purple-800 mb-2">
        Learning Platform
      </h1>
      <p className="text-gray-600 mb-6">
        Expand your fragrance knowledge with courses and articles
      </p>
      <Separator className="mb-6" />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <LearningSidebar />
        </div>
        <div className="md:w-3/4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
