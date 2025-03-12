import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  LineChart,
  PieChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

// Mock data for financial dashboard
const monthlyFinancials = [
  { month: "Jan", revenue: 1200000, expenses: 800000, profit: 400000 },
  { month: "Feb", revenue: 1800000, expenses: 1100000, profit: 700000 },
  { month: "Mar", revenue: 2200000, expenses: 1300000, profit: 900000 },
  { month: "Apr", revenue: 2000000, expenses: 1200000, profit: 800000 },
  { month: "May", revenue: 2700000, expenses: 1500000, profit: 1200000 },
  { month: "Jun", revenue: 3100000, expenses: 1800000, profit: 1300000 },
];

const expenseCategories = [
  { name: "Raw Materials", amount: 3500000, percentage: 45 },
  { name: "Packaging", amount: 1200000, percentage: 15 },
  { name: "Marketing", amount: 1000000, percentage: 13 },
  { name: "Salaries", amount: 1500000, percentage: 19 },
  { name: "Utilities", amount: 600000, percentage: 8 },
];

const profitMargins = [
  { product: "Vanilla Musk", revenue: 1800000, cost: 900000, margin: 50 },
  { product: "Citrus Bloom", revenue: 1500000, cost: 800000, margin: 47 },
  { product: "Woody Amber", revenue: 1200000, cost: 700000, margin: 42 },
  { product: "Floral Essence", revenue: 1000000, cost: 550000, margin: 45 },
  { product: "Ocean Breeze", revenue: 900000, cost: 500000, margin: 44 },
];

export default function FinancialDashboard() {
  const [timeRange, setTimeRange] = useState("month");
  const [viewType, setViewType] = useState("overview");

  // Format currency to IDR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate totals
  const totalRevenue = monthlyFinancials.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );
  const totalExpenses = monthlyFinancials.reduce(
    (sum, item) => sum + item.expenses,
    0,
  );
  const totalProfit = monthlyFinancials.reduce(
    (sum, item) => sum + item.profit,
    0,
  );

  // Calculate profit margin
  const profitMargin = (totalProfit / totalRevenue) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Financial Dashboard
          </h1>
          <p className="text-gray-500">
            Track your business finances and profitability
          </p>
        </div>
        <div className="flex gap-4">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="View Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="profit-loss">Profit & Loss</SelectItem>
              <SelectItem value="expenses">Expenses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Revenue
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalRevenue)}
                </h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-700" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">12.5%</span>
              <span className="text-gray-500 ml-1">from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Expenses
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalExpenses)}
                </h3>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-700" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 font-medium">8.2%</span>
              <span className="text-gray-500 ml-1">from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Net Profit</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalProfit)}
                </h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-700" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">15.3%</span>
              <span className="text-gray-500 ml-1">from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Profit Margin
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {profitMargin.toFixed(1)}%
                </h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <LineChart className="h-6 w-6 text-blue-700" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">2.1%</span>
              <span className="text-gray-500 ml-1">from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue, Expenses, and Profit Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <div className="flex h-full items-end gap-6">
              {monthlyFinancials.map((item, index) => (
                <div key={index} className="flex-1 flex gap-1 items-end">
                  {/* Revenue Bar */}
                  <div className="flex-1 relative group">
                    <div
                      className="absolute bottom-0 w-full bg-green-500 rounded-t-sm group-hover:bg-green-600 transition-all"
                      style={{ height: `${(item.revenue / 3500000) * 100}%` }}
                    ></div>
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatCurrency(item.revenue)}
                    </div>
                  </div>

                  {/* Expenses Bar */}
                  <div className="flex-1 relative group">
                    <div
                      className="absolute bottom-0 w-full bg-red-500 rounded-t-sm group-hover:bg-red-600 transition-all"
                      style={{ height: `${(item.expenses / 3500000) * 100}%` }}
                    ></div>
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatCurrency(item.expenses)}
                    </div>
                  </div>

                  {/* Profit Bar */}
                  <div className="flex-1 relative group">
                    <div
                      className="absolute bottom-0 w-full bg-purple-500 rounded-t-sm group-hover:bg-purple-600 transition-all"
                      style={{ height: `${(item.profit / 3500000) * 100}%` }}
                    ></div>
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatCurrency(item.profit)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            {monthlyFinancials.map((item, index) => (
              <div
                key={index}
                className="text-xs font-medium text-gray-500 flex-1 text-center"
              >
                {item.month}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Profit</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown and Profit Margins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <div className="relative w-48 h-48">
                <PieChart className="w-full h-full text-gray-200" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(totalExpenses)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {expenseCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500">
                      {formatCurrency(category.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-500 h-2.5 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{category.percentage}% of total expenses</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Profit Margins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {profitMargins.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {product.product}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                        {product.margin}% margin
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(product.revenue - product.cost)}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full h-6 rounded-md overflow-hidden">
                    <div
                      className="bg-blue-500 flex items-center justify-center text-xs text-white"
                      style={{
                        width: `${(product.cost / product.revenue) * 100}%`,
                      }}
                    >
                      Cost
                    </div>
                    <div
                      className="bg-green-500 flex items-center justify-center text-xs text-white"
                      style={{
                        width: `${((product.revenue - product.cost) / product.revenue) * 100}%`,
                      }}
                    >
                      Profit
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Cost: {formatCurrency(product.cost)}</span>
                    <span>Revenue: {formatCurrency(product.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Export as CSV</Button>
        <Button variant="outline">Export as PDF</Button>
        <Button className="bg-purple-700 hover:bg-purple-800">
          Generate Financial Report
        </Button>
      </div>
    </div>
  );
}
