import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  BarChart3,
  CreditCard,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

// Mock data for the dashboard
const salesData = [
  { month: "Jan", sales: 1200000 },
  { month: "Feb", sales: 1800000 },
  { month: "Mar", sales: 2200000 },
  { month: "Apr", sales: 2000000 },
  { month: "May", sales: 2700000 },
  { month: "Jun", sales: 3100000 },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Budi Santoso",
    product: "Vanilla Musk Parfum",
    amount: 450000,
    status: "completed",
    date: "2023-06-15",
  },
  {
    id: "ORD-002",
    customer: "Siti Rahayu",
    product: "Citrus Bloom Parfum",
    amount: 350000,
    status: "processing",
    date: "2023-06-14",
  },
  {
    id: "ORD-003",
    customer: "Ahmad Hidayat",
    product: "Woody Amber Parfum",
    amount: 550000,
    status: "completed",
    date: "2023-06-12",
  },
  {
    id: "ORD-004",
    customer: "Maya Wijaya",
    product: "Floral Essence Parfum",
    amount: 400000,
    status: "completed",
    date: "2023-06-10",
  },
];

export default function BusinessDashboard() {
  const [timeRange, setTimeRange] = useState("month");

  // Format currency to IDR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total sales
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);

  // Calculate average monthly sales
  const avgMonthlySales = totalSales / salesData.length;

  // Calculate total orders
  const totalOrders = recentOrders.length;

  // Calculate total customers (unique)
  const totalCustomers = new Set(recentOrders.map((order) => order.customer))
    .size;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Business Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome back! Here's an overview of your business performance
          </p>
        </div>
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalSales)}
                </h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-700" />
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
                  Avg. Monthly Sales
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(avgMonthlySales)}
                </h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-700" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">8.2%</span>
              <span className="text-gray-500 ml-1">from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Orders
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {totalOrders}
                </h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-green-700" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">5.3%</span>
              <span className="text-gray-500 ml-1">from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Customers
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {totalCustomers}
                </h3>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-700" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">3.1%</span>
              <span className="text-gray-500 ml-1">from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <div className="flex h-full items-end gap-2">
              {salesData.map((item, index) => (
                <div key={index} className="relative flex-1 group">
                  <div
                    className="absolute bottom-0 w-full bg-purple-600 rounded-t-sm group-hover:bg-purple-700 transition-all"
                    style={{ height: `${(item.sales / 3500000) * 100}%` }}
                  ></div>
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatCurrency(item.sales)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            {salesData.map((item, index) => (
              <div key={index} className="text-xs font-medium text-gray-500">
                {item.month}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Recent Orders</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 border-b">
                  <th className="pb-3 pl-4">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-4 pl-4 text-sm font-medium">
                      {order.id}
                    </td>
                    <td className="py-4 text-sm">{order.customer}</td>
                    <td className="py-4 text-sm">{order.product}</td>
                    <td className="py-4 text-sm">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {order.status === "completed"
                          ? "Completed"
                          : "Processing"}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-sm">
                      {new Date(order.date).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <h3 className="font-medium">Manage Products</h3>
                <p className="text-sm text-gray-500">
                  Add or update your product catalog
                </p>
              </div>
            </div>
            <Button className="w-full mt-4 bg-purple-700 hover:bg-purple-800">
              Go to Products
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-medium">Sales Analytics</h3>
                <p className="text-sm text-gray-500">
                  View detailed sales reports
                </p>
              </div>
            </div>
            <Button className="w-full mt-4 bg-blue-700 hover:bg-blue-800">
              View Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-medium">Financial Dashboard</h3>
                <p className="text-sm text-gray-500">
                  Track your business finances
                </p>
              </div>
            </div>
            <Button className="w-full mt-4 bg-green-700 hover:bg-green-800">
              View Finances
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
