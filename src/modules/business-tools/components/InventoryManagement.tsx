import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  ArrowUpDown,
} from "lucide-react";

interface InventoryItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  cost_per_unit: number;
  supplier?: string;
  reorder_point?: number;
  last_restock_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function InventoryManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof InventoryItem>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "raw_material",
    quantity: 0,
    unit: "ml",
    cost_per_unit: 0,
    supplier: "",
    reorder_point: 0,
    notes: "",
  });

  // Categories for inventory items
  const categories = [
    { value: "raw_material", label: "Raw Material" },
    { value: "fragrance_oil", label: "Fragrance Oil" },
    { value: "packaging", label: "Packaging" },
    { value: "finished_product", label: "Finished Product" },
    { value: "equipment", label: "Equipment" },
    { value: "other", label: "Other" },
  ];

  // Units for inventory items
  const units = [
    { value: "ml", label: "Milliliter (ml)" },
    { value: "l", label: "Liter (L)" },
    { value: "g", label: "Gram (g)" },
    { value: "kg", label: "Kilogram (kg)" },
    { value: "pcs", label: "Pieces" },
    { value: "bottle", label: "Bottle" },
    { value: "box", label: "Box" },
  ];

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    fetchInventory();
  }, [user]);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...inventory];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.supplier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.notes?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        // Handle numeric or other types
        if (aValue === undefined) return sortDirection === "asc" ? -1 : 1;
        if (bValue === undefined) return sortDirection === "asc" ? 1 : -1;
        return sortDirection === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    setFilteredInventory(filtered);
  }, [inventory, searchQuery, categoryFilter, sortField, sortDirection]);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from("business_inventory")
        .select("*")
        .eq("user_id", user?.id)
        .order("name", { ascending: true });

      if (error) throw error;
      setInventory(data || []);
    } catch (error: any) {
      console.error("Error fetching inventory:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load inventory items",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: keyof InventoryItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "quantity" ||
        name === "cost_per_unit" ||
        name === "reorder_point"
          ? parseFloat(value) || 0
          : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "raw_material",
      quantity: 0,
      unit: "ml",
      cost_per_unit: 0,
      supplier: "",
      reorder_point: 0,
      notes: "",
    });
  };

  const handleAddItem = async () => {
    if (!formData.name || formData.quantity < 0 || formData.cost_per_unit < 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("business_inventory")
        .insert([
          {
            user_id: user?.id,
            name: formData.name,
            category: formData.category,
            quantity: formData.quantity,
            unit: formData.unit,
            cost_per_unit: formData.cost_per_unit,
            supplier: formData.supplier || null,
            reorder_point: formData.reorder_point || null,
            notes: formData.notes || null,
          },
        ])
        .select();

      if (error) throw error;

      setInventory([...inventory, data[0]]);
      setShowAddDialog(false);
      resetForm();

      toast({
        title: "Item Added",
        description: "Inventory item has been added successfully.",
      });
    } catch (error: any) {
      console.error("Error adding inventory item:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add inventory item",
      });
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      cost_per_unit: item.cost_per_unit,
      supplier: item.supplier || "",
      reorder_point: item.reorder_point || 0,
      notes: item.notes || "",
    });
    setShowEditDialog(true);
  };

  const handleUpdateItem = async () => {
    if (!currentItem) return;

    if (!formData.name || formData.quantity < 0 || formData.cost_per_unit < 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("business_inventory")
        .update({
          name: formData.name,
          category: formData.category,
          quantity: formData.quantity,
          unit: formData.unit,
          cost_per_unit: formData.cost_per_unit,
          supplier: formData.supplier || null,
          reorder_point: formData.reorder_point || null,
          notes: formData.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentItem.id);

      if (error) throw error;

      // Update local state
      setInventory(
        inventory.map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                name: formData.name,
                category: formData.category,
                quantity: formData.quantity,
                unit: formData.unit,
                cost_per_unit: formData.cost_per_unit,
                supplier: formData.supplier || null,
                reorder_point: formData.reorder_point || null,
                notes: formData.notes || null,
                updated_at: new Date().toISOString(),
              }
            : item,
        ),
      );

      setShowEditDialog(false);
      resetForm();
      setCurrentItem(null);

      toast({
        title: "Item Updated",
        description: "Inventory item has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating inventory item:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update inventory item",
      });
    }
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setCurrentItem(item);
    setShowDeleteDialog(true);
  };

  const handleDeleteItem = async () => {
    if (!currentItem) return;

    try {
      const { error } = await supabase
        .from("business_inventory")
        .delete()
        .eq("id", currentItem.id);

      if (error) throw error;

      // Update local state
      setInventory(inventory.filter((item) => item.id !== currentItem.id));
      setShowDeleteDialog(false);
      setCurrentItem(null);

      toast({
        title: "Item Deleted",
        description: "Inventory item has been deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting inventory item:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete inventory item",
      });
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

  // Get category label
  const getCategoryLabel = (value: string) => {
    const category = categories.find((cat) => cat.value === value);
    return category ? category.label : value;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading inventory...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">
            Please log in to manage your inventory
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-800 mb-1">
            Inventory Management
          </h1>
          <p className="text-gray-600">
            Track and manage your raw materials and products
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}
          className="bg-purple-700 hover:bg-purple-800"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Inventory Items</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Name
                      {sortField === "name" && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      Category
                      {sortField === "category" && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("quantity")}
                  >
                    <div className="flex items-center justify-end">
                      Quantity
                      {sortField === "quantity" && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("cost_per_unit")}
                  >
                    <div className="flex items-center justify-end">
                      Cost
                      {sortField === "cost_per_unit" && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-gray-500"
                    >
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{getCategoryLabel(item.category)}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`${item.reorder_point && item.quantity <= item.reorder_point ? "text-red-600 font-medium" : ""}`}
                        >
                          {item.quantity} {item.unit}
                        </span>
                        {item.reorder_point &&
                          item.quantity <= item.reorder_point && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                              Low Stock
                            </span>
                          )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.cost_per_unit)}/{item.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.quantity * item.cost_per_unit)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>
              Add a new item to your inventory tracking system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="e.g., Lavender Essential Oil"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity *
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                className="col-span-1"
                min="0"
                step="0.01"
              />
              <Select
                value={formData.unit}
                onValueChange={(value) => handleSelectChange("unit", value)}
              >
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost_per_unit" className="text-right">
                Cost per Unit *
              </Label>
              <Input
                id="cost_per_unit"
                name="cost_per_unit"
                type="number"
                value={formData.cost_per_unit}
                onChange={handleInputChange}
                className="col-span-3"
                min="0"
                step="1000"
                placeholder="e.g., 150000"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>
              <Input
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="e.g., Supplier Name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reorder_point" className="text-right">
                Reorder Point
              </Label>
              <Input
                id="reorder_point"
                name="reorder_point"
                type="number"
                value={formData.reorder_point}
                onChange={handleInputChange}
                className="col-span-3"
                min="0"
                placeholder="e.g., 10"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Any additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Update the details of your inventory item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name *
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-quantity" className="text-right">
                Quantity *
              </Label>
              <Input
                id="edit-quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                className="col-span-1"
                min="0"
                step="0.01"
              />
              <Select
                value={formData.unit}
                onValueChange={(value) => handleSelectChange("unit", value)}
              >
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-cost_per_unit" className="text-right">
                Cost per Unit *
              </Label>
              <Input
                id="edit-cost_per_unit"
                name="cost_per_unit"
                type="number"
                value={formData.cost_per_unit}
                onChange={handleInputChange}
                className="col-span-3"
                min="0"
                step="1000"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-supplier" className="text-right">
                Supplier
              </Label>
              <Input
                id="edit-supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-reorder_point" className="text-right">
                Reorder Point
              </Label>
              <Input
                id="edit-reorder_point"
                name="reorder_point"
                type="number"
                value={formData.reorder_point}
                onChange={handleInputChange}
                className="col-span-3"
                min="0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-notes" className="text-right">
                Notes
              </Label>
              <Input
                id="edit-notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateItem}>Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this inventory item? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <AlertTriangle className="h-10 w-10 text-red-500" />
            <div>
              <p className="font-medium">{currentItem?.name}</p>
              <p className="text-sm text-gray-500">
                {currentItem?.quantity} {currentItem?.unit} ·{" "}
                {getCategoryLabel(currentItem?.category || "")}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
