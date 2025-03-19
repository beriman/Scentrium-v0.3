import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu, X } from "lucide-react";
import AuthWireframes from "./AuthWireframes";
import ProfileWireframes from "./ProfileWireframes";
import ForumWireframes from "./ForumWireframes";
import MarketplaceWireframes from "./MarketplaceWireframes";
import LearningWireframes from "./LearningWireframes";
import BusinessToolsWireframes from "./BusinessToolsWireframes";
import AdminWireframes from "./AdminWireframes";

export default function WireframeGallery() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("auth");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsMenuOpen(false);
  };

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 md:py-8">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-800 mb-2">
          Scentrium V 0.3
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Visual representation of the platform based on the PRD and mermaid
          diagram
        </p>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md bg-purple-100 text-purple-800"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="font-medium text-purple-800">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute z-10 left-0 right-0 bg-white shadow-lg rounded-b-lg px-4 py-2 border-t border-gray-200 mx-4">
            <div className="flex flex-col space-y-2 py-2">
              {[
                { value: "auth", label: "Authentication" },
                { value: "profile", label: "Profile" },
                { value: "forum", label: "Forum" },
                { value: "marketplace", label: "Marketplace" },
                { value: "learning", label: "Learning" },
                { value: "business", label: "Business Tools" },
                { value: "admin", label: "Admin" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  className={`text-left px-4 py-2 rounded-md ${activeTab === tab.value ? "bg-purple-100 text-purple-800" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => handleTabChange(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Tabs */}
        <TabsList className="hidden md:grid grid-cols-2 lg:grid-cols-7 mb-8 overflow-x-auto">
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="forum">Forum</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="business">Business Tools</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="auth">
          <AuthWireframes />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileWireframes />
        </TabsContent>

        <TabsContent value="forum">
          <ForumWireframes />
        </TabsContent>

        <TabsContent value="marketplace">
          <MarketplaceWireframes />
        </TabsContent>

        <TabsContent value="learning">
          <LearningWireframes />
        </TabsContent>

        <TabsContent value="business">
          <BusinessToolsWireframes />
        </TabsContent>

        <TabsContent value="admin">
          <AdminWireframes />
        </TabsContent>
      </Tabs>
    </div>
  );
}
