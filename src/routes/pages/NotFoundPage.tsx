import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TopNavbar from "@/components/shared/TopNavbar";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-9xl font-bold text-purple-800">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-500 max-w-md text-center mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-purple-700 hover:bg-purple-800">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
