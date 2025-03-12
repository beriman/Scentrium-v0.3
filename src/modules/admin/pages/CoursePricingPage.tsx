import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Percent,
  Tag,
  Plus,
  Save,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function CoursePricingPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("courses");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null);
  const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false);
  const [isEditDiscountDialogOpen, setIsEditDiscountDialogOpen] =
    useState(false);
  const [isAddDiscountDialogOpen, setIsAddDiscountDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state for editing course
  const [courseForm, setCourseForm] = useState({
    title: "",
    price: 0,
    is_featured: false,
    is_published: false,
  });

  // Form state for editing/adding discount
  const [discountForm, setDiscountForm] = useState({
    name: "",
    code: "",
    discount_percent: 0,
    is_for_business: false,
    is_active: true,
    course_id: "",
    valid_until: "",
  });

  useEffect(() => {
    if (activeTab === "courses") {
      fetchCourses();
    } else {
      fetchDiscounts();
    }
  }, [activeTab]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("learning_courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to load courses. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDiscounts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("learning_discounts")
        .select("*, course:course_id(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDiscounts(data || []);
    } catch (error: any) {
      console.error("Error fetching discounts:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to load discounts. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCourse = (course: any) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title || "",
      price: course.price || 0,
      is_featured: course.is_featured || false,
      is_published: course.is_published || false,
    });
    setIsEditCourseDialogOpen(true);
  };

  const handleEditDiscount = (discount: any) => {
    setSelectedDiscount(discount);
    setDiscountForm({
      name: discount.name || "",
      code: discount.code || "",
      discount_percent: discount.discount_percent || 0,
      is_for_business: discount.is_for_business || false,
      is_active: discount.is_active || true,
      course_id: discount.course_id || "",
      valid_until: discount.valid_until
        ? new Date(discount.valid_until).toISOString().split("T")[0]
        : "",
    });
    setIsEditDiscountDialogOpen(true);
  };

  const handleAddDiscount = () => {
    setDiscountForm({
      name: "",
      code: "",
      discount_percent: 10,
      is_for_business: false,
      is_active: true,
      course_id: "",
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 days from now
    });
    setIsAddDiscountDialogOpen(true);
  };

  const confirmEditCourse = async () => {
    try {
      const { error } = await supabase
        .from("learning_courses")
        .update({
          title: courseForm.title,
          price: courseForm.price,
          is_featured: courseForm.is_featured,
          is_published: courseForm.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedCourse.id);

      if (error) throw error;

      toast({
        title: "Course Updated",
        description:
          "Course pricing and settings have been updated successfully.",
      });

      setIsEditCourseDialogOpen(false);
      fetchCourses();
    } catch (error: any) {
      console.error("Error updating course:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update course. Please try again.",
      });
    }
  };

  const confirmEditDiscount = async () => {
    try {
      const { error } = await supabase
        .from("learning_discounts")
        .update({
          name: discountForm.name,
          code: discountForm.code,
          discount_percent: discountForm.discount_percent,
          is_for_business: discountForm.is_for_business,
          is_active: discountForm.is_active,
          course_id: discountForm.course_id || null,
          valid_until: discountForm.valid_until
            ? new Date(discountForm.valid_until).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedDiscount.id);

      if (error) throw error;

      toast({
        title: "Discount Updated",
        description: "Discount has been updated successfully.",
      });

      setIsEditDiscountDialogOpen(false);
      fetchDiscounts();
    } catch (error: any) {
      console.error("Error updating discount:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update discount. Please try again.",
      });
    }
  };

  const confirmAddDiscount = async () => {
    try {
      const { error } = await supabase.from("learning_discounts").insert({
        name: discountForm.name,
        code: discountForm.code,
        discount_percent: discountForm.discount_percent,
        is_for_business: discountForm.is_for_business,
        is_active: discountForm.is_active,
        course_id: discountForm.course_id || null,
        valid_until: discountForm.valid_until
          ? new Date(discountForm.valid_until).toISOString()
          : null,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Discount Added",
        description: "New discount has been added successfully.",
      });

      setIsAddDiscountDialogOpen(false);
      fetchDiscounts();
    } catch (error: any) {
      console.error("Error adding discount:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to add discount. Please try again.",
      });
    }
  };

  // Format currency to IDR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) => {
    return course.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filter discounts based on search query
  const filteredDiscounts = discounts.filter((discount) => {
    return (
      discount.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discount.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discount.course?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Pricing</h1>
          <p className="text-gray-500">
            Manage course prices and special discounts for members
          </p>
        </div>
        {activeTab === "discounts" && (
          <Button
            onClick={handleAddDiscount}
            className="bg-purple-700 hover:bg-purple-800"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Discount
          </Button>
        )}
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder={
              activeTab === "courses"
                ? "Search courses..."
                : "Search discounts..."
            }
            className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="discounts">Discounts</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            className="border-purple-200 text-purple-700"
          >
            <Filter className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Filter</span>
          </Button>
        </div>
      </div>

      {/* Courses Tab Content */}
      <TabsContent value="courses" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Course Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 border-b">
                      <th className="pb-3 pl-4">Course Title</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Featured</th>
                      <th className="pb-3">Created</th>
                      <th className="pb-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course) => (
                        <tr
                          key={course.id}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="py-4 pl-4">
                            <div className="font-medium">{course.title}</div>
                          </td>
                          <td className="py-4 text-sm">
                            {formatCurrency(course.price || 0)}
                          </td>
                          <td className="py-4">
                            {course.is_published ? (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="outline">Draft</Badge>
                            )}
                          </td>
                          <td className="py-4">
                            {course.is_featured ? (
                              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                                Featured
                              </Badge>
                            ) : (
                              <span className="text-gray-500 text-sm">-</span>
                            )}
                          </td>
                          <td className="py-4 text-sm">
                            {new Date(course.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 pr-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCourse(course)}
                              className="h-8 gap-1"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-10 text-center text-gray-500"
                        >
                          No courses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Discounts Tab Content */}
      <TabsContent value="discounts" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Discount Codes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 border-b">
                      <th className="pb-3 pl-4">Discount Name</th>
                      <th className="pb-3">Code</th>
                      <th className="pb-3">Discount</th>
                      <th className="pb-3">Course</th>
                      <th className="pb-3">Business Only</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Valid Until</th>
                      <th className="pb-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDiscounts.length > 0 ? (
                      filteredDiscounts.map((discount) => (
                        <tr
                          key={discount.id}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="py-4 pl-4">
                            <div className="font-medium">{discount.name}</div>
                          </td>
                          <td className="py-4">
                            <Badge variant="outline" className="font-mono">
                              {discount.code}
                            </Badge>
                          </td>
                          <td className="py-4 text-sm">
                            {discount.discount_percent}%
                          </td>
                          <td className="py-4 text-sm">
                            {discount.course?.title || "All Courses"}
                          </td>
                          <td className="py-4 text-sm">
                            {discount.is_for_business ? "Yes" : "No"}
                          </td>
                          <td className="py-4">
                            {discount.is_active ? (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline">Inactive</Badge>
                            )}
                          </td>
                          <td className="py-4 text-sm">
                            {discount.valid_until
                              ? new Date(
                                  discount.valid_until,
                                ).toLocaleDateString()
                              : "No Expiry"}
                          </td>
                          <td className="py-4 pr-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditDiscount(discount)}
                              className="h-8 gap-1"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-10 text-center text-gray-500"
                        >
                          No discounts found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Edit Course Dialog */}
      <Dialog
        open={isEditCourseDialogOpen}
        onOpenChange={setIsEditCourseDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course Pricing</DialogTitle>
            <DialogDescription>
              Update the pricing and settings for this course.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={courseForm.title}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, title: e.target.value })
                }
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (IDR)</Label>
              <Input
                id="price"
                type="number"
                value={courseForm.price}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    price: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_featured" className="cursor-pointer">
                Featured Course
              </Label>
              <Switch
                id="is_featured"
                checked={courseForm.is_featured}
                onCheckedChange={(checked) =>
                  setCourseForm({ ...courseForm, is_featured: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_published" className="cursor-pointer">
                Published
              </Label>
              <Switch
                id="is_published"
                checked={courseForm.is_published}
                onCheckedChange={(checked) =>
                  setCourseForm({ ...courseForm, is_published: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditCourseDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmEditCourse}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Discount Dialog */}
      <Dialog
        open={isEditDiscountDialogOpen}
        onOpenChange={setIsEditDiscountDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Discount</DialogTitle>
            <DialogDescription>Update the discount settings.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Discount Name</Label>
              <Input
                id="name"
                value={discountForm.name}
                onChange={(e) =>
                  setDiscountForm({ ...discountForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Discount Code</Label>
              <Input
                id="code"
                value={discountForm.code}
                onChange={(e) =>
                  setDiscountForm({
                    ...discountForm,
                    code: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount_percent">Discount Percentage (%)</Label>
              <Input
                id="discount_percent"
                type="number"
                min="1"
                max="100"
                value={discountForm.discount_percent}
                onChange={(e) =>
                  setDiscountForm({
                    ...discountForm,
                    discount_percent: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course_id">Apply to Course</Label>
              <Select
                value={discountForm.course_id}
                onValueChange={(value) =>
                  setDiscountForm({ ...discountForm, course_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course or apply to all" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="valid_until">Valid Until</Label>
              <Input
                id="valid_until"
                type="date"
                value={discountForm.valid_until}
                onChange={(e) =>
                  setDiscountForm({
                    ...discountForm,
                    valid_until: e.target.value,
                  })
                }
              />
              <p className="text-xs text-gray-500">
                Leave empty for no expiration
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_for_business" className="cursor-pointer">
                Business Members Only
              </Label>
              <Switch
                id="is_for_business"
                checked={discountForm.is_for_business}
                onCheckedChange={(checked) =>
                  setDiscountForm({ ...discountForm, is_for_business: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active" className="cursor-pointer">
                Active
              </Label>
              <Switch
                id="is_active"
                checked={discountForm.is_active}
                onCheckedChange={(checked) =>
                  setDiscountForm({ ...discountForm, is_active: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDiscountDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmEditDiscount}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Discount Dialog */}
      <Dialog
        open={isAddDiscountDialogOpen}
        onOpenChange={setIsAddDiscountDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Discount</DialogTitle>
            <DialogDescription>
              Create a new discount code for courses.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Discount Name</Label>
              <Input
                id="add-name"
                value={discountForm.name}
                onChange={(e) =>
                  setDiscountForm({ ...discountForm, name: e.target.value })
                }
                placeholder="Summer Sale"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-code">Discount Code</Label>
              <Input
                id="add-code"
                value={discountForm.code}
                onChange={(e) =>
                  setDiscountForm({
                    ...discountForm,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="SUMMER2023"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-discount_percent">
                Discount Percentage (%)
              </Label>
              <Input
                id="add-discount_percent"
                type="number"
                min="1"
                max="100"
                value={discountForm.discount_percent}
                onChange={(e) =>
                  setDiscountForm({
                    ...discountForm,
                    discount_percent: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-course_id">Apply to Course</Label>
              <Select
                value={discountForm.course_id}
                onValueChange={(value) =>
                  setDiscountForm({ ...discountForm, course_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course or apply to all" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-valid_until">Valid Until</Label>
              <Input
                id="add-valid_until"
                type="date"
                value={discountForm.valid_until}
                onChange={(e) =>
                  setDiscountForm({
                    ...discountForm,
                    valid_until: e.target.value,
                  })
                }
              />
              <p className="text-xs text-gray-500">
                Leave empty for no expiration
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="add-is_for_business" className="cursor-pointer">
                Business Members Only
              </Label>
              <Switch
                id="add-is_for_business"
                checked={discountForm.is_for_business}
                onCheckedChange={(checked) =>
                  setDiscountForm({ ...discountForm, is_for_business: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="add-is_active" className="cursor-pointer">
                Active
              </Label>
              <Switch
                id="add-is_active"
                checked={discountForm.is_active}
                onCheckedChange={(checked) =>
                  setDiscountForm({ ...discountForm, is_active: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDiscountDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAddDiscount}
              disabled={
                !discountForm.name ||
                !discountForm.code ||
                discountForm.discount_percent <= 0
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Add Discount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
