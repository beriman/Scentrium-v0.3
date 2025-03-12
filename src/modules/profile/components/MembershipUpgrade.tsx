import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../../../supabase/auth";
import { supabase } from "../../../../supabase/supabase";

export default function MembershipUpgrade() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUpgrade = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update user membership type to business
      const { error } = await supabase
        .from("profiles")
        .update({ membership_type: "business" })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Membership Upgraded",
        description: "Your account has been upgraded to Business membership.",
      });

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error: any) {
      console.error("Error upgrading membership:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upgrade membership",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-purple-800">
          Upgrade Your Membership
        </CardTitle>
        <CardDescription>
          Unlock premium features with a Business membership
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg">Free</CardTitle>
              <CardDescription>Current Plan</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold mb-6">Rp 0</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Basic forum access</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Marketplace listings (limited)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Preview learning content</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500">100 EXP/day limit</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500">No business tools</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500">No learning discounts</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Business Plan */}
          <Card className="border-2 border-purple-200 relative">
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              RECOMMENDED
            </div>
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-lg text-purple-800">
                Business
              </CardTitle>
              <CardDescription>Premium Features</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold mb-6">
                Rp 99.000<span className="text-sm font-normal">/month</span>
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Full forum access with priority</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Unlimited marketplace listings</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Full access to learning content</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">500 EXP/day limit</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">
                    Complete business tools suite
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">
                    20% discount on all courses
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-purple-700 hover:bg-purple-800"
                onClick={handleUpgrade}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Upgrade Now"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 items-start">
        <p className="text-sm text-gray-500">
          * Business membership includes access to all premium features and
          priority support.
        </p>
        <p className="text-sm text-gray-500">
          * Payment is processed securely through our payment partner.
        </p>
      </CardFooter>
    </Card>
  );
}
