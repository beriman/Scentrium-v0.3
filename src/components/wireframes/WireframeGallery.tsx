import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthWireframes from "./AuthWireframes";
import ProfileWireframes from "./ProfileWireframes";
import ForumWireframes from "./ForumWireframes";
import MarketplaceWireframes from "./MarketplaceWireframes";
import LearningWireframes from "./LearningWireframes";
import BusinessToolsWireframes from "./BusinessToolsWireframes";
import AdminWireframes from "./AdminWireframes";

export default function WireframeGallery() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">
          Scentrium V 0.3
        </h1>
        <p className="text-gray-600">
          Visual representation of the platform based on the PRD and mermaid
          diagram
        </p>
      </div>
      <Tabs defaultValue="auth" className="w-full">
        <TabsList className="grid grid-cols-7 mb-8">
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
