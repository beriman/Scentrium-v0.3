import { Outlet } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import ForumSidebar from "./ForumSidebar";

export default function ForumLayout() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-purple-800 mb-2">
        Community Forum
      </h1>
      <p className="text-gray-600 mb-6">
        Connect with fellow fragrance enthusiasts
      </p>
      <Separator className="mb-6" />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <ForumSidebar />
        </div>
        <div className="md:w-3/4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
