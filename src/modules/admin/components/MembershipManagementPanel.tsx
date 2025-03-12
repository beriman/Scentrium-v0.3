import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  Percent,
  Users,
  Crown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MembershipManagementPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [businessUsers, setBusinessUsers] = useState<any[]>([]);
  const [discountSettings, setDiscountSettings] = useState({
    courseDiscount: 20,
    isEditing: false,
  });
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user is admin
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        const isUserAdmin = profileData.role === "admin";
        setIsAdmin(isUserAdmin);

        if (!isUserAdmin) {
          setIsLoading(false);
          return;
        }

        // Fetch business users
        await fetchBusinessUsers();

        // Fetch discount settings
        // In a real app, this would come from a settings table
        // For now, we'll use a mock value
        setDiscountSettings({
          courseDiscount: 20,
          isEditing: false,
        });
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load membership data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndLoadData();
  }, [user, toast]);

  const fetchBusinessUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("membership_type", "business")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBusinessUsers(data || []);
    } catch (error) {
      console.error("Error fetching business users:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load business users",
      });
    }
  };

  const handleSaveDiscount = async () => {
    // In a real app, this would update a settings table
    setDiscountSettings({
      ...discountSettings,
      isEditing: false,
    });

    toast({
      title: "Discount Updated",
      description: `Business member discount has been updated to ${discountSettings.courseDiscount}%`,
    });
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleDowngradeUser = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          membership_type: "free",
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedUser.id);

      if (error) throw error;

      toast({
        title: "Membership Downgraded",
        description: `${selectedUser.full_name}'s membership has been downgraded to Free.`,
      });

      // Refresh the list
      await fetchBusinessUsers();
      setShowEditDialog(false);
    } catch (error: any) {
      console.error("Error downgrading user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to downgrade user",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
          <p className="text-lg font-medium">Access Denied</p>
          <p className="text-gray-500">
            You don't have permission to access this page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-purple-800 mb-1">
          Membership Management
        </h1>
        <p className="text-gray-600">
          Manage business memberships and discount settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Discount Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-purple-600" /> Business Member
              Discounts
            </CardTitle>
            <CardDescription>
              Set discount rates for business members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="course-discount">
                  Course Discount Rate (%)
                </Label>
                {discountSettings.isEditing ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="course-discount"
                      type="number"
                      min="0"
                      max="100"
                      value={discountSettings.courseDiscount}
                      onChange={(e) =>
                        setDiscountSettings({
                          ...discountSettings,
                          courseDiscount: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-24"
                    />
                    <span>%</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-2xl font-bold">
                      {discountSettings.courseDiscount}%
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <p className="text-sm text-blue-700">
                  Business members receive this discount on all course purchases
                  automatically.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {discountSettings.isEditing ? (
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    setDiscountSettings({
                      ...discountSettings,
                      isEditing: false,
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-purple-700 hover:bg-purple-800"
                  onClick={handleSaveDiscount}
                >
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setDiscountSettings({
                    ...discountSettings,
                    isEditing: true,
                  })
                }
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Discount
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Business Members Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" /> Business Members
              Stats
            </CardTitle>
            <CardDescription>
              Overview of business membership statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-md text-center">
                  <p className="text-sm text-purple-700">Total Members</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {businessUsers.length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-md text-center">
                  <p className="text-sm text-green-700">Active Members</p>
                  <p className="text-2xl font-bold text-green-800">
                    {businessUsers.length}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Membership Benefits
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Unlimited marketplace listings</li>
                  <li>• {discountSettings.courseDiscount}% off all courses</li>
                  <li>• Access to business tools</li>
                  <li>• Increased daily EXP limit (500)</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Pricing Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-600" /> Learning Platform
              Pricing
            </CardTitle>
            <CardDescription>
              Manage course pricing and video sets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Configure pricing for learning content and video sets in the
                Learning Platform section.
              </p>
              <Button
                className="w-full bg-purple-700 hover:bg-purple-800"
                onClick={() => {
                  // In a real app, this would navigate to the learning platform pricing page
                  toast({
                    title: "Navigation",
                    description:
                      "Redirecting to Learning Platform Pricing page",
                  });
                }}
              >
                Manage Course Pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Business Members</CardTitle>
          <CardDescription>
            Manage users with business membership
          </CardDescription>
        </CardHeader>
        <CardContent>
          {businessUsers.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
              <p className="text-lg font-medium">No Business Members</p>
              <p className="text-gray-500">
                There are no users with business membership at this time.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Member Since</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businessUsers.map((businessUser) => (
                    <TableRow key={businessUser.id}>
                      <TableCell className="font-medium">
                        {businessUser.full_name}
                      </TableCell>
                      <TableCell>{businessUser.email}</TableCell>
                      <TableCell>
                        {new Date(businessUser.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(businessUser)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Business Member</DialogTitle>
            <DialogDescription>
              View and manage business membership for this user
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="font-medium">{selectedUser.full_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Member Since
                  </h3>
                  <p className="font-medium">
                    {new Date(selectedUser.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Membership Type
                  </h3>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    Business
                  </Badge>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Downgrade Warning
                </h3>
                <p className="text-sm text-yellow-700">
                  Downgrading this user will remove their business membership
                  benefits, including access to business tools and discounts.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDowngradeUser}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Downgrade to Free"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
