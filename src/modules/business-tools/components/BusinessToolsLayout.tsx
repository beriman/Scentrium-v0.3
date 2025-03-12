import { Outlet } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import BusinessToolsSidebar from "./BusinessToolsSidebar";
import { useAuth } from "../../../../supabase/auth";

export default function BusinessToolsLayout() {
  const { user } = useAuth();

  // Mock check for business membership
  const isBusinessMember = true;

  if (!isBusinessMember) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">
          Business Tools
        </h1>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">
            Upgrade to Business Membership
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Access powerful tools for perfume entrepreneurs including inventory
            management, analytics dashboard, and marketing tools.
          </p>
          <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-semibold">
            Upgrade Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-purple-800 mb-2">
        Business Tools
      </h1>
      <p className="text-gray-600 mb-6">
        Manage and grow your fragrance business
      </p>
      <Separator className="mb-6" />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <BusinessToolsSidebar />
        </div>
        <div className="md:w-3/4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
