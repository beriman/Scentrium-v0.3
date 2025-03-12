import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../../../../supabase/auth";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import MembershipUpgrade from "../components/MembershipUpgrade";

export default function MembershipPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <ProfileHeader isCurrentUser={true} />

      <div className="mt-8">
        <Tabs defaultValue="upgrade" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upgrade">Membership Upgrade</TabsTrigger>
            <TabsTrigger value="benefits">Membership Benefits</TabsTrigger>
          </TabsList>
          <TabsContent value="upgrade" className="mt-6">
            <MembershipUpgrade />
          </TabsContent>
          <TabsContent value="benefits" className="mt-6">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-bold mb-4">
                Membership Benefits Comparison
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-3 text-left">Feature</th>
                      <th className="border p-3 text-center">Free</th>
                      <th className="border p-3 text-center bg-purple-50">
                        Business
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-3 font-medium">Forum Access</td>
                      <td className="border p-3 text-center">Basic</td>
                      <td className="border p-3 text-center bg-purple-50">
                        Full + Priority
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">
                        Daily EXP Limit
                      </td>
                      <td className="border p-3 text-center">100 EXP</td>
                      <td className="border p-3 text-center bg-purple-50">
                        500 EXP
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">
                        Marketplace Listings
                      </td>
                      <td className="border p-3 text-center">Limited</td>
                      <td className="border p-3 text-center bg-purple-50">
                        Unlimited
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">
                        Learning Content
                      </td>
                      <td className="border p-3 text-center">Preview Only</td>
                      <td className="border p-3 text-center bg-purple-50">
                        Full Access
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">
                        Course Discounts
                      </td>
                      <td className="border p-3 text-center">None</td>
                      <td className="border p-3 text-center bg-purple-50">
                        20% Off
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">Business Tools</td>
                      <td className="border p-3 text-center">Not Available</td>
                      <td className="border p-3 text-center bg-purple-50">
                        Full Suite
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">Support</td>
                      <td className="border p-3 text-center">Standard</td>
                      <td className="border p-3 text-center bg-purple-50">
                        Priority
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">Profile Badge</td>
                      <td className="border p-3 text-center">Basic</td>
                      <td className="border p-3 text-center bg-purple-50">
                        Premium
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">
                        Two-Factor Authentication
                      </td>
                      <td className="border p-3 text-center">Optional</td>
                      <td className="border p-3 text-center bg-purple-50">
                        Included
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">Price</td>
                      <td className="border p-3 text-center">Free</td>
                      <td className="border p-3 text-center font-bold bg-purple-50">
                        Rp 99.000/month
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
