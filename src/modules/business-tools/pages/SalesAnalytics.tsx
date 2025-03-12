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
  ArrowUpRight,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
} from "lucide-react";

// Mock data for sales analytics
const monthlySalesData = [
  { month: "Jan", sales: 1200000, orders: 24 },
  { month: "Feb", sales: 1800000, orders: 36 },
  { month: "Mar", sales: 2200000, orders: 44 },
  { month: "Apr", sales: 2000000, orders: 40 },
  { month: "May", sales: 2700000, orders: 54 },
  { month: "Jun", sales: 3100000, orders: 62 },
];

const productPerformance = [
  { name: "Vanilla Musk", sales: 1800000, percentage: 28 },
  { name: "Citrus Bloom", sales: 1500000, percentage: 23 },
  { name: "Woody Amber", sales: 1200000, percentage: 19 },
  { name: "Floral Essence", sales: 1000000, percentage: 16 },
  { name: "Ocean Breeze", sales: 900000, percentage: 14 },
];

const channelPerformance = [
  { name: "Website", sales: 3500000, percentage: 55 },
  { name: "Marketplace", sales: 1800000, percentage: 28 },
  { name: "Social Media", sales: 700000, percentage: 11 },
  { name: "Offline Store", sales: 400000, percentage: 6 },
];

export default function SalesAnalytics() {
  const [timeRange, setTimeRange] = useState("month");
  const [chartType, setChartType] = useState("bar");

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
  const totalSales = monthlySalesData.reduce(
    (sum, item) => sum + item.sales,
    0,
  );

  // Calculate total orders
  const totalOrders = monthlySalesData.reduce(
    (sum, item) => sum + item.orders,
    0,
  );

  // Calculate average order value
  const avgOrderValue = totalSales / totalOrders;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Analytics</h1>
          <p className="text-gray-500">
            Detailed analysis of your sales performance
          </p>
        </div>
        <div className="flex gap-4">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <TrendingUp className="h-6 w-6 text-purple-700" />
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
                  Total Orders
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {totalOrders}
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
                  Avg. Order Value
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(avgOrderValue)}
                </h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <LineChart className="h-6 w-6 text-green-700" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">3.7%</span>
              <span className="text-gray-500 ml-1">from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {chartType === "bar" && (
              <div className="flex h-full items-end gap-2">
                {monthlySalesData.map((item, index) => (
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
            )}

            {chartType === "line" && (
              <div className="h-full w-full flex items-center justify-center">
                <svg viewBox="0 0 600 300" className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    points={monthlySalesData
                      .map((item, index) => {
                        const x = index * 100 + 50;
                        const y = 300 - (item.sales / 3500000) * 250;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />
                  {monthlySalesData.map((item, index) => {
                    const x = index * 100 + 50;
                    const y = 300 - (item.sales / 3500000) * 250;
                    return (
                      <g key={index} className="group">
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill="#8b5cf6"
                          className="group-hover:r-6 transition-all"
                        />
                        <text
                          x={x}
                          y={y - 15}
                          textAnchor="middle"
                          fontSize="12"
                          fill="#6b7280"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {formatCurrency(item.sales)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {chartType === "pie" && (
              <div className="h-full w-full flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-64 h-64">
                  <circle cx="50" cy="50" r="40" fill="#f3f4f6" />
                  {productPerformance.map((product, index) => {
                    const startAngle =
                      index > 0
                        ? productPerformance
                            .slice(0, index)
                            .reduce((sum, p) => sum + p.percentage, 0) * 3.6
                        : 0;
                    const endAngle = startAngle + product.percentage * 3.6;

                    // Convert angles to radians and calculate coordinates
                    const startRad = ((startAngle - 90) * Math.PI) / 180;
                    const endRad = ((endAngle - 90) * Math.PI) / 180;

                    const x1 = 50 + 40 * Math.cos(startRad);
                    const y1 = 50 + 40 * Math.sin(startRad);
                    const x2 = 50 + 40 * Math.cos(endRad);
                    const y2 = 50 + 40 * Math.sin(endRad);

                    // Determine if the arc should be drawn as a large arc
                    const largeArcFlag = product.percentage > 50 ? 1 : 0;

                    // Colors for the pie slices
                    const colors = [
                      "#8b5cf6",
                      "#3b82f6",
                      "#10b981",
                      "#f59e0b",
                      "#ef4444",
                    ];

                    return (
                      <path
                        key={index}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={colors[index % colors.length]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    );
                  })}
                </svg>
              </div>
            )}
          </div>
          <div className="flex justify-between mt-4">
            {monthlySalesData.map((item, index) => (
              <div key={index} className="text-xs font-medium text-gray-500">
                {item.month}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productPerformance.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm text-gray-500">
                      {formatCurrency(product.sales)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: `${product.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{product.percentage}% of total sales</span>
                    <span>
                      {product.percentage > 20
                        ? "High performer"
                        : "Average performer"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelPerformance.map((channel, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{channel.name}</span>
                    <span className="text-sm text-gray-500">
                      {formatCurrency(channel.sales)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${channel.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{channel.percentage}% of total sales</span>
                    <span>
                      {channel.percentage > 30
                        ? "Primary channel"
                        : "Secondary channel"}
                    </span>
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
          Generate Report
        </Button>
      </div>
    </div>
  );
}
