import { Outlet } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import LearningSidebar from "./LearningSidebar";
import TopNavbar from "@/components/shared/TopNavbar";

export default function LearningLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavbar />
      <div className="container mx-auto py-4 md:py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-800 mb-2">
          Learning Platform
        </h1>
        <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
          Expand your fragrance knowledge with courses and articles
        </p>
        <Separator className="mb-4 md:mb-6" />

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="w-full md:w-1/4 order-2 md:order-1">
            <LearningSidebar />
          </div>
          <div className="w-full md:w-3/4 order-1 md:order-2">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
