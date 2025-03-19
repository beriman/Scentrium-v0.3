import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BusinessDashboardWireframe = () => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-800">
            Business Dashboard
          </h1>
          <div className="flex space-x-3">
            <div className="px-4 py-2 bg-gray-100 rounded-md text-sm flex items-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
              <span>Last 30 days</span>
            </div>
            <button className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800">
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: "Rp 12,500,000" },
          { label: "Orders", value: "42" },
          { label: "Avg. Order Value", value: "Rp 297,619" },
          { label: "Conversion Rate", value: "3.2%" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <div className="text-sm text-gray-600">{stat.label}</div>
            <div className="text-2xl font-bold mt-1">{stat.value}</div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <div className="w-4 h-4 bg-green-200 rounded-full mr-1"></div>
              <span>+12% from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="font-medium mb-4">Revenue Over Time</div>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-gray-400">Revenue Chart</div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="font-medium mb-4">Top Selling Products</div>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-gray-400">Products Chart</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Recent Orders</h2>
          <div className="text-sm text-purple-700">View All Orders</div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((order) => (
                <tr key={order} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #ORD-{1000 + order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    John Doe
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    May 12, 2023
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rp 350,000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const InventoryManagementWireframe = () => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-800">
            Inventory Management
          </h1>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Import
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Export
            </button>
            <button className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800">
              Add Product
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mt-4 flex space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
            </div>
            <div className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-md"></div>
          </div>
          <div className="w-40">
            <div className="h-10 border border-gray-300 rounded-md px-3 flex items-center justify-between">
              <span className="text-gray-600">Category</span>
              <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <div className="w-40">
            <div className="h-10 border border-gray-300 rounded-md px-3 flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((product) => (
                <tr key={product} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded-md mr-3"></div>
                      <div className="text-sm font-medium text-gray-900">
                        Bergamot Essential Oil
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    BEO-001
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Essential Oils
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    24
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rp 250,000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      In Stock
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing 1 to 8 of 24 entries
          </div>
          <div className="flex space-x-1">
            <div className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md bg-gray-100">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
            <div className="w-8 h-8 flex items-center justify-center border border-purple-700 rounded-md bg-purple-700 text-white">
              1
            </div>
            <div className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50">
              2
            </div>
            <div className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50">
              3
            </div>
            <div className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md bg-gray-100">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BusinessToolsWireframes() {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-8 p-4 md:p-8 bg-gray-100">
      <Card className="overflow-hidden">
        <CardHeader className="bg-purple-50 pb-2">
          <CardTitle className="text-lg">Business Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
          <BusinessDashboardWireframe />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="bg-purple-50 pb-2">
          <CardTitle className="text-lg">Inventory Management</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
          <InventoryManagementWireframe />
        </CardContent>
      </Card>
    </div>
  );
}
