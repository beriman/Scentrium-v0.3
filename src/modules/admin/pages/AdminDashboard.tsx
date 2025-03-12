import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentModerationPanel from "../components/ContentModerationPanel";
import TransactionVerificationPanel from "../components/TransactionVerificationPanel";
import MembershipManagementPanel from "../components/MembershipManagementPanel";
import LearningPricingPanel from "../components/LearningPricingPanel";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("moderation");

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">
        Admin Dashboard
      </h1>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
          <TabsTrigger value="transactions">
            Transaction Verification
          </TabsTrigger>
          <TabsTrigger value="membership">Membership Management</TabsTrigger>
          <TabsTrigger value="learning">Learning Platform</TabsTrigger>
        </TabsList>

        <TabsContent value="moderation" className="space-y-6">
          <ContentModerationPanel />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <TransactionVerificationPanel />
        </TabsContent>

        <TabsContent value="membership" className="space-y-6">
          <MembershipManagementPanel />
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <LearningPricingPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
