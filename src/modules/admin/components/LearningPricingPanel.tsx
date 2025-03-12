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
  Edit,
  Save,
  Plus,
  Trash2,
  DollarSign,
  BookOpen,
  Video,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LearningPricingPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    level: "beginner",
    duration_minutes: 0,
  });

  useEffect(() => {
    const checkAdminAndLoadCourses = async () => {
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

        // Fetch courses
        await fetchCourses();
      } catch (error) {
        console.error("Error loading courses:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load courses",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndLoadCourses();
  }, [user, toast]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("learning_courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load courses",
      });
    }
  };

  const handleEditCourse = (course: any) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      level: course.level,
      duration_minutes: course.duration_minutes,
    });
    setShowEditDialog(true);
  };

  const handleAddCourse = () => {
    setFormData({
      title: "",
      description: "",
      price: 0,
      level: "beginner",
      duration_minutes: 0,
    });
    setShowAddDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "duration_minutes" ? Number(value) : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveCourse = async () => {
    if (!selectedCourse) return;

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("learning_courses")
        .update({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          level: formData.level,
          duration_minutes: formData.duration_minutes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedCourse.id);

      if (error) throw error;

      toast({
        title: "Course Updated",
        description: "Course details have been updated successfully.",
      });

      // Refresh the list
      await fetchCourses();
      setShowEditDialog(false);
    } catch (error: any) {
      console.error("Error updating course:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update course",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!formData.title || formData.price < 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase.from("learning_courses").insert({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        level: formData.level,
        duration_minutes: formData.duration_minutes,
        instructor_id: user?.id,
        thumbnail_url:
          "https://images.unsplash.com/photo-1595425964071-2c1ecb10b52d?w=800&q=80", // Default thumbnail
        status: "active",
        is_featured: false,
      });

      if (error) throw error;

      toast({
        title: "Course Created",
        description: "New course has been created successfully.",
      });

      // Refresh the list
      await fetchCourses();
      setShowAddDialog(false);
    } catch (error: any) {
      console.error("Error creating course:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create course",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-purple-800 mb-1">
            Learning Platform Pricing
          </h1>
          <p className="text-gray-600">Manage course pricing and video sets</p>
        </div>
        <Button
          className="bg-purple-700 hover:bg-purple-800"
          onClick={handleAddCourse}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" /> Course Pricing
          </CardTitle>
          <CardDescription>
            Manage pricing for courses and video sets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
              <p className="text-lg font-medium">No Courses Found</p>
              <p className="text-gray-500">
                There are no courses available at this time. Add a new course to
                get started.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {course.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            course.level === "beginner"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : course.level === "intermediate"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                          }
                        >
                          {course.level.charAt(0).toUpperCase() +
                            course.level.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {Math.floor(course.duration_minutes / 60)} hours{" "}
                        {course.duration_minutes % 60} min
                      </TableCell>
                      <TableCell>{formatCurrency(course.price)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            course.status === "active"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          }
                        >
                          {course.status.charAt(0).toUpperCase() +
                            course.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCourse(course)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
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

      {/* Video Sets Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-purple-600" /> Video Sets
          </CardTitle>
          <CardDescription>
            Manage video sets and modules within courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">
              Select a course above to manage its video sets and modules.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                // In a real app, this would navigate to the video sets management page
                toast({
                  title: "Navigation",
                  description: "Redirecting to Video Sets Management page",
                });
              }}
            >
              Manage Video Sets
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Course Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course details and pricing
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (IDR)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level" className="text-right">
                Level
              </Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleSelectChange("level", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (min)
              </Label>
              <Input
                id="duration_minutes"
                name="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCourse}
              disabled={isProcessing}
              className="bg-purple-700 hover:bg-purple-800"
            >
              {isProcessing ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Course Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>
              Create a new course with pricing details
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-title" className="text-right">
                Title *
              </Label>
              <Input
                id="add-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-description" className="text-right">
                Description
              </Label>
              <Input
                id="add-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-price" className="text-right">
                Price (IDR) *
              </Label>
              <Input
                id="add-price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-level" className="text-right">
                Level *
              </Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleSelectChange("level", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-duration" className="text-right">
                Duration (min) *
              </Label>
              <Input
                id="add-duration"
                name="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCourse}
              disabled={isProcessing}
              className="bg-purple-700 hover:bg-purple-800"
            >
              {isProcessing ? "Creating..." : "Create Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
