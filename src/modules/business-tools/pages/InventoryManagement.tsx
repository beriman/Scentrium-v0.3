import React, { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react";

export default function InventoryManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock inventory data
  const inventoryItems = [
    {
      id: "INV001",
      name: "Amber Glass Bottles (50ml)",
      category: "Packaging",
      quantity: 120,
      reorderPoint: 30,
      price: 2.5,
      status: "In Stock",
    },
    {
      id: "INV002",
      name: "Rose Essential Oil",
      category: "Ingredients",
      quantity: 15,
      reorderPoint: 20,
      price: 45.0,
      status: "Low Stock",
    },
    {
      id: "INV003",
      name: "Vanilla Extract",
      category: "Ingredients",
      quantity: 25,
      reorderPoint: 10,
      price: 18.75,
      status: "In Stock",
    },
    {
      id: "INV004",
      name: "Spray Pumps",
      category: "Packaging",
      quantity: 200,
      reorderPoint: 50,
      price: 0.75,
      status: "In Stock",
    },
    {
      id: "INV005",
      name: "Lavender Essential Oil",
      category: "Ingredients",
      quantity: 8,
      reorderPoint: 15,
      price: 32.5,
      status: "Low Stock",
    },
    {
      id: "INV006",
      name: "Custom Labels (Roll of 100)",
      category: "Packaging",
      quantity: 5,
      reorderPoint: 3,
      price: 45.0,
      status: "In Stock",
    },
    {
      id: "INV007",
      name: "Bergamot Essential Oil",
      category: "Ingredients",
      quantity: 0,
      reorderPoint: 10,
      price: 38.25,
      status: "Out of Stock",
    },
  ];

  // Filter items based on search query
  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-800">
          Inventory Management
        </h2>
        <Button className="bg-purple-700 hover:bg-purple-800">
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search inventory..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "In Stock"
                            ? "outline"
                            : item.status === "Low Stock"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
