import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import {
  Calculator,
  Plus,
  Minus,
  Save,
  Download,
  Trash2,
  DollarSign,
  Percent,
} from "lucide-react";

interface CalculationItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  total: number;
}

interface CalculationResult {
  totalCost: number;
  suggestedPrice: number;
  profit: number;
  profitMargin: number;
  roi: number;
}

export default function ProfitCalculator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [productName, setProductName] = useState("New Fragrance");
  const [productSize, setProductSize] = useState(50);
  const [productUnit, setProductUnit] = useState("ml");
  const [items, setItems] = useState<CalculationItem[]>([]);
  const [laborCost, setLaborCost] = useState(50000);
  const [packagingCost, setPackagingCost] = useState(25000);
  const [overheadCost, setOverheadCost] = useState(15000);
  const [targetMargin, setTargetMargin] = useState(40);
  const [result, setResult] = useState<CalculationResult>({
    totalCost: 0,
    suggestedPrice: 0,
    profit: 0,
    profitMargin: 0,
    roi: 0,
  });
  const [inventory, setInventory] = useState<any[]>([]);

  // Units for items
  const units = [
    { value: "ml", label: "Milliliter (ml)" },
    { value: "l", label: "Liter (L)" },
    { value: "g", label: "Gram (g)" },
    { value: "kg", label: "Kilogram (kg)" },
    { value: "pcs", label: "Pieces" },
    { value: "drop", label: "Drops" },
  ];

  useEffect(() => {
    if (user) {
      fetchInventory();
    }

    // Initialize with some default items
    setItems([
      {
        id: generateId(),
        name: "Perfumer's Alcohol",
        quantity: 40,
        unit: "ml",
        cost: 1000,
        total: 40000,
      },
      {
        id: generateId(),
        name: "Lavender Essential Oil",
        quantity: 5,
        unit: "ml",
        cost: 10000,
        total: 50000,
      },
      {
        id: generateId(),
        name: "Bergamot Essential Oil",
        quantity: 3,
        unit: "ml",
        cost: 15000,
        total: 45000,
      },
    ]);
  }, [user]);

  useEffect(() => {
    calculateResults();
  }, [items, laborCost, packagingCost, overheadCost, targetMargin]);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from("business_inventory")
        .select("id, name, unit, cost_per_unit")
        .eq("user_id", user?.id)
        .order("name", { ascending: true });

      if (error) throw error;
      setInventory(data || []);
    } catch (error: any) {
      console.error("Error fetching inventory:", error);
    }
  };

  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const addItem = () => {
    const newItem: CalculationItem = {
      id: generateId(),
      name: "",
      quantity: 0,
      unit: "ml",
      cost: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof CalculationItem, value: any) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Recalculate total if quantity or cost changes
        if (field === "quantity" || field === "cost") {
          updatedItem.total = updatedItem.quantity * updatedItem.cost;
        }

        return updatedItem;
      }
      return item;
    });

    setItems(updatedItems);
  };

  const addFromInventory = (inventoryItem: any) => {
    const newItem: CalculationItem = {
      id: generateId(),
      name: inventoryItem.name,
      quantity: 1,
      unit: inventoryItem.unit,
      cost: inventoryItem.cost_per_unit,
      total: inventoryItem.cost_per_unit,
    };
    setItems([...items, newItem]);
  };

  const calculateResults = () => {
    // Calculate total cost of ingredients
    const ingredientsCost = items.reduce((sum, item) => sum + item.total, 0);

    // Calculate total cost
    const totalCost =
      ingredientsCost + laborCost + packagingCost + overheadCost;

    // Calculate suggested price based on target margin
    // Formula: Price = Cost / (1 - Margin%)
    const suggestedPrice = totalCost / (1 - targetMargin / 100);

    // Calculate profit
    const profit = suggestedPrice - totalCost;

    // Calculate profit margin
    const profitMargin = (profit / suggestedPrice) * 100;

    // Calculate ROI
    const roi = (profit / totalCost) * 100;

    setResult({
      totalCost,
      suggestedPrice,
      profit,
      profitMargin,
      roi,
    });
  };

  const saveCalculation = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save your calculation.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const calculationData = {
        user_id: user.id,
        product_name: productName,
        product_size: productSize,
        product_unit: productUnit,
        ingredients: items,
        labor_cost: laborCost,
        packaging_cost: packagingCost,
        overhead_cost: overheadCost,
        target_margin: targetMargin,
        result: result,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("business_calculations")
        .insert([calculationData])
        .select();

      if (error) throw error;

      toast({
        title: "Calculation Saved",
        description: "Your calculation has been saved successfully.",
      });
    } catch (error: any) {
      console.error("Error saving calculation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save calculation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportCalculation = () => {
    // In a real app, this would generate a PDF or CSV file
    toast({
      title: "Export Started",
      description: "Your calculation is being exported.",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-800 mb-1">
            Profit Calculator
          </h1>
          <p className="text-gray-600">
            Calculate costs, pricing, and profit margins for your fragrances
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={exportCalculation}
          >
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button
            className="bg-purple-700 hover:bg-purple-800 flex items-center gap-2"
            onClick={saveCalculation}
            disabled={isLoading}
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save Calculation"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                Enter basic information about your product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Lavender Dreams EDP"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="product-size">Size</Label>
                    <Input
                      id="product-size"
                      type="number"
                      value={productSize}
                      onChange={(e) => setProductSize(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2 w-24">
                    <Label htmlFor="product-unit">Unit</Label>
                    <Select value={productUnit} onValueChange={setProductUnit}>
                      <SelectTrigger id="product-unit">
                        <SelectValue placeholder="Unit" />
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ingredients</CardTitle>
                <CardDescription>
                  Add all ingredients used in your product
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={addItem}
              >
                <Plus className="h-4 w-4" /> Add Ingredient
              </Button>
            </CardHeader>
            <CardContent>
              {inventory.length > 0 && (
                <div className="mb-4">
                  <Label className="mb-2 block">Add from Inventory</Label>
                  <div className="flex flex-wrap gap-2">
                    {inventory.slice(0, 10).map((item) => (
                      <Button
                        key={item.id}
                        variant="outline"
                        size="sm"
                        onClick={() => addFromInventory(item)}
                      >
                        {item.name}
                      </Button>
                    ))}
                    {inventory.length > 10 && (
                      <Button variant="ghost" size="sm" disabled>
                        +{inventory.length - 10} more
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No ingredients added yet. Click "Add Ingredient" to start.
                  </div>
                ) : (
                  items.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 items-center"
                    >
                      <div className="col-span-4">
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            updateItem(item.id, "name", e.target.value)
                          }
                          placeholder="Ingredient name"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "quantity",
                              Number(e.target.value),
                            )
                          }
                          min="0"
                          step="0.1"
                          placeholder="Qty"
                        />
                      </div>
                      <div className="col-span-1">
                        <Select
                          value={item.unit}
                          onValueChange={(value) =>
                            updateItem(item.id, "unit", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {units.map((unit) => (
                              <SelectItem key={unit.value} value={unit.value}>
                                {unit.value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.cost}
                          onChange={(e) =>
                            updateItem(item.id, "cost", Number(e.target.value))
                          }
                          min="0"
                          step="1000"
                          placeholder="Cost"
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 mr-2">
                            {formatCurrency(item.total)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Ingredients Total
                    </div>
                    <div className="font-medium">
                      {formatCurrency(
                        items.reduce((sum, item) => sum + item.total, 0),
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Costs */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Costs</CardTitle>
              <CardDescription>
                Include labor, packaging, and overhead costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="labor-cost">Labor Cost</Label>
                    <Input
                      id="labor-cost"
                      type="number"
                      value={laborCost}
                      onChange={(e) => setLaborCost(Number(e.target.value))}
                      min="0"
                      step="1000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="packaging-cost">Packaging Cost</Label>
                    <Input
                      id="packaging-cost"
                      type="number"
                      value={packagingCost}
                      onChange={(e) => setPackagingCost(Number(e.target.value))}
                      min="0"
                      step="1000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overhead-cost">Overhead Cost</Label>
                  <Input
                    id="overhead-cost"
                    type="number"
                    value={overheadCost}
                    onChange={(e) => setOverheadCost(Number(e.target.value))}
                    min="0"
                    step="1000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-600" /> Calculation
                Results
              </CardTitle>
              <CardDescription>
                Based on your inputs and target margin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="target-margin"
                    className="flex justify-between"
                  >
                    <span>Target Profit Margin</span>
                    <span>{targetMargin}%</span>
                  </Label>
                  <Slider
                    id="target-margin"
                    min={0}
                    max={90}
                    step={1}
                    value={[targetMargin]}
                    onValueChange={(value) => setTargetMargin(value[0])}
                    className="mt-2"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Total Cost</span>
                    <span className="font-medium">
                      {formatCurrency(result.totalCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Suggested Price</span>
                    <span className="font-bold text-lg text-purple-700">
                      {formatCurrency(result.suggestedPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Profit per Unit</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(result.profit)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-500 mb-1">
                      Profit Margin
                    </div>
                    <div className="text-xl font-bold text-purple-700 flex items-center justify-center">
                      {result.profitMargin.toFixed(1)}%
                      <Percent className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-500 mb-1">ROI</div>
                    <div className="text-xl font-bold text-green-700 flex items-center justify-center">
                      {result.roi.toFixed(1)}%
                      <TrendingUp className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">
                  Price Breakdown
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ingredients</span>
                    <span>
                      {formatCurrency(
                        items.reduce((sum, item) => sum + item.total, 0),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Labor</span>
                    <span>{formatCurrency(laborCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Packaging</span>
                    <span>{formatCurrency(packagingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Overhead</span>
                    <span>{formatCurrency(overheadCost)}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total Cost</span>
                    <span>{formatCurrency(result.totalCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Profit</span>
                    <span className="text-green-600">
                      {formatCurrency(result.profit)}
                    </span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between font-bold">
                    <span>Selling Price</span>
                    <span>{formatCurrency(result.suggestedPrice)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
