import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
// Mock chart components until recharts is installed
const BarChart = ({ children, data, margin, layout }: any) => (
  <div className="p-4 border rounded bg-gray-50 h-full flex items-center justify-center">
    <p className="text-gray-500">Chart visualization will appear here</p>
  </div>
);
const ResponsiveContainer = ({ children, width, height }: any) => (
  <div className="h-full">{children}</div>
);
const Bar = ({ dataKey, name, fill, stackId, radius }: any) => null;
const XAxis = ({ dataKey, type, tickFormatter }: any) => null;
const YAxis = ({ tickFormatter, type, dataKey, width }: any) => null;
const CartesianGrid = ({ strokeDasharray }: any) => null;
const Tooltip = ({ formatter }: any) => null;
const Legend = () => null;
const PieChart = ({ children }: any) => (
  <div className="h-full">{children}</div>
);
const Pie = ({
  data,
  cx,
  cy,
  labelLine,
  outerRadius,
  fill,
  dataKey,
  nameKey,
  label,
  children,
}: any) => (
  <div className="p-4 border rounded bg-gray-50 h-full flex items-center justify-center">
    <p className="text-gray-500">Pie chart visualization will appear here</p>
    {children}
  </div>
);
const Cell = ({ key, fill }: any) => null;
const LineChart = ({ data, margin, children }: any) => (
  <div className="p-4 border rounded bg-gray-50 h-full flex items-center justify-center">
    <p className="text-gray-500">Line chart visualization will appear here</p>
    {children}
  </div>
);
const Line = ({ type, dataKey, name, stroke, activeDot }: any) => null;
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Package,
  Download,
} from "lucide-react";

interface FinancialData {
  revenue: number;
  expenses: number;
  profit: number;
  salesCount: number;
  averageOrderValue: number;
  topProducts: {
    name: string;
    revenue: number;
    quantity: number;
  }[];
  monthlySales: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
  expenseCategories: {
    category: string;
    amount: number;
  }[];
}

export default function FinancialDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("year");
  const [financialData, setFinancialData] = useState<FinancialData>({
    revenue: 0,
    expenses: 0,
    profit: 0,
    salesCount: 0,
    averageOrderValue: 0,
    topProducts: [],
    monthlySales: [],
    expenseCategories: [],
  });

  // Colors for charts
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088fe",
    "#00c49f",
    "#ffbb28",
    "#ff8042",
  ];

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    fetchFinancialData();
  }, [user, timeRange]);

  const fetchFinancialData = async () => {
    setIsLoading(true);

    try {
      // In a real app, this would fetch actual financial data from the database
      // For this demo, we'll use mock data
      const mockData = generateMockFinancialData(timeRange);
      setFinancialData(mockData);
    } catch (error: any) {
      console.error("Error fetching financial data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load financial data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockFinancialData = (range: string): FinancialData => {
    // Generate different data based on the selected time range
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let monthlySales = [];
    let totalRevenue = 0;
    let totalExpenses = 0;
    let salesCount = 0;

    // Generate monthly data
    if (range === "year") {
      // Full year data
      for (let i = 0; i < 12; i++) {
        const revenue = Math.floor(Math.random() * 50000000) + 10000000;
        const expenses = Math.floor(Math.random() * 30000000) + 5000000;
        const profit = revenue - expenses;
        const sales = Math.floor(Math.random() * 50) + 10;

        totalRevenue += revenue;
        totalExpenses += expenses;
        salesCount += sales;

        monthlySales.push({
          month: months[i],
          revenue,
          expenses,
          profit,
        });
      }
    } else if (range === "quarter") {
      // Last quarter (3 months)
      for (let i = 9; i < 12; i++) {
        const revenue = Math.floor(Math.random() * 50000000) + 10000000;
        const expenses = Math.floor(Math.random() * 30000000) + 5000000;
        const profit = revenue - expenses;
        const sales = Math.floor(Math.random() * 50) + 10;

        totalRevenue += revenue;
        totalExpenses += expenses;
        salesCount += sales;

        monthlySales.push({
          month: months[i],
          revenue,
          expenses,
          profit,
        });
      }
    } else {
      // Last month
      const revenue = Math.floor(Math.random() * 50000000) + 10000000;
      const expenses = Math.floor(Math.random() * 30000000) + 5000000;
      const profit = revenue - expenses;
      const sales = Math.floor(Math.random() * 50) + 10;

      totalRevenue = revenue;
      totalExpenses = expenses;
      salesCount = sales;

      monthlySales.push({
        month: months[11],
        revenue,
        expenses,
        profit,
      });
    }

    // Generate expense categories
    const expenseCategories = [
      {
        category: "Raw Materials",
        amount: Math.floor(totalExpenses * 0.4),
      },
      {
        category: "Packaging",
        amount: Math.floor(totalExpenses * 0.15),
      },
      {
        category: "Marketing",
        amount: Math.floor(totalExpenses * 0.2),
      },
      {
        category: "Shipping",
        amount: Math.floor(totalExpenses * 0.1),
      },
      {
        category: "Utilities",
        amount: Math.floor(totalExpenses * 0.05),
      },
      {
        category: "Other",
        amount: Math.floor(totalExpenses * 0.1),
      },
    ];

    // Generate top products
    const topProducts = [
      {
        name: "Lavender Dreams EDP",
        revenue: Math.floor(totalRevenue * 0.3),
        quantity: Math.floor(salesCount * 0.3),
      },
      {
        name: "Citrus Burst Cologne",
        revenue: Math.floor(totalRevenue * 0.25),
        quantity: Math.floor(salesCount * 0.25),
      },
      {
        name: "Woody Elegance",
        revenue: Math.floor(totalRevenue * 0.2),
        quantity: Math.floor(salesCount * 0.2),
      },
      {
        name: "Ocean Breeze",
        revenue: Math.floor(totalRevenue * 0.15),
        quantity: Math.floor(salesCount * 0.15),
      },
      {
        name: "Floral Essence",
        revenue: Math.floor(totalRevenue * 0.1),
        quantity: Math.floor(salesCount * 0.1),
      },
    ];

    return {
      revenue: totalRevenue,
      expenses: totalExpenses,
      profit: totalRevenue - totalExpenses,
      salesCount,
      averageOrderValue: totalRevenue / salesCount,
      topProducts,
      monthlySales,
      expenseCategories,
    };
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate percentage change (mock data always shows positive growth)
  const getPercentageChange = () => {
    return Math.floor(Math.random() * 20) + 5;
  };

  // Export data as CSV
  const exportFinancialData = () => {
    // In a real app, this would generate a CSV file with the financial data
    toast({
      title: "Export Started",
      description: "Your financial data is being exported as CSV.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading financial data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">
            Please log in to view your financial dashboard
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
            Financial Dashboard
          </h1>
          <p className="text-gray-600">
            Track your business performance and financial metrics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={exportFinancialData}
          >
            <Download className="h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(financialData.revenue)}
            </div>
            <p className="text-xs text-green-500 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />+{getPercentageChange()}%
              from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(financialData.profit)}
            </div>
            <p className="text-xs text-green-500 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />+{getPercentageChange()}%
              from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.salesCount}</div>
            <p className="text-xs text-green-500 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />+{getPercentageChange()}%
              from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(financialData.averageOrderValue)}
            </div>
            <p className="text-xs text-green-500 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />+{getPercentageChange()}%
              from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue & Expenses</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="expenses">Expense Breakdown</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>
                Monthly breakdown of your revenue, expenses, and profit
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialData.monthlySales}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("id-ID", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#8884d8"
                    stackId="a"
                  />
                  <Bar
                    dataKey="expenses"
                    name="Expenses"
                    fill="#82ca9d"
                    stackId="a"
                  />
                  <Bar
                    dataKey="profit"
                    name="Profit"
                    fill="#ffc658"
                    stackId="b"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profit Trend</CardTitle>
              <CardDescription>
                Monthly profit trend over the selected period
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={financialData.monthlySales}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("id-ID", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Products by Revenue</CardTitle>
              <CardDescription>
                Your best-selling products by revenue
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialData.topProducts}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("id-ID", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(value)
                    }
                  />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#8884d8"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Products by Quantity</CardTitle>
              <CardDescription>
                Your best-selling products by quantity sold
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialData.topProducts}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="quantity"
                    name="Quantity Sold"
                    fill="#82ca9d"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>
                Distribution of expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financialData.expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="category"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {financialData.expenseCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>
                Detailed breakdown of expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialData.expenseCategories.map((category, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span>{category.category}</span>
                        <span className="font-medium">
                          {formatCurrency(category.amount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div
                          className="h-2.5 rounded-full"
                          style={{
                            width: `${(category.amount / financialData.expenses) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
