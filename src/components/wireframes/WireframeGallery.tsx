import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthWireframes from "./AuthWireframes";
import ProfileWireframes from "./ProfileWireframes";
import ForumWireframes from "./ForumWireframes";
import MarketplaceWireframes from "./MarketplaceWireframes";
import LearningWireframes from "./LearningWireframes";
import BusinessToolsWireframes from "./BusinessToolsWireframes";
import AdminWireframes from "./AdminWireframes";
import { supabase } from "../../supabase/supabase";

export default function WireframeGallery() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Supabase connection error:", error);
          setIsConnected(false);
        } else {
          console.log("Supabase connection successful");
          setIsConnected(true);
        }
      } catch (err) {
        console.error("Error checking Supabase connection:", err);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

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
        <div className="mt-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isConnected ? "bg-green-100 text-green-800" : isConnected === false ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}
          >
            <span
              className={`w-2 h-2 mr-2 rounded-full ${isConnected ? "bg-green-500" : isConnected === false ? "bg-red-500" : "bg-gray-500"}`}
            ></span>
            {isConnected
              ? "Connected to Supabase"
              : isConnected === false
                ? "Not connected to Supabase"
                : "Checking connection..."}
          </span>
        </div>
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
