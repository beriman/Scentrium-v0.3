import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const MarketplaceHomeWireframe = () => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-800">Marketplace</h1>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-purple-700 text-purple-700 rounded-md hover:bg-purple-50">
              My Orders
            </button>
            <button className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800">
              Sell Item
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
          </div>
          <div className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-md"></div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="font-medium">Filters:</div>
          <div className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm flex items-center">
            Category{" "}
            <div className="w-4 h-4 bg-gray-300 rounded-full ml-2"></div>
          </div>
          <div className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm flex items-center">
            Price Range{" "}
            <div className="w-4 h-4 bg-gray-300 rounded-full ml-2"></div>
          </div>
          <div className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm flex items-center">
            Rating <div className="w-4 h-4 bg-gray-300 rounded-full ml-2"></div>
          </div>
          <div className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm flex items-center">
            Sort By{" "}
            <div className="w-4 h-4 bg-gray-300 rounded-full ml-2"></div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((product) => (
            <div
              key={product}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md cursor-pointer"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="font-medium">Bergamot Essential Oil</div>
                <div className="text-sm text-gray-600 mt-1">
                  By Scentrium Essentials
                </div>
                <div className="mt-2 font-bold text-purple-800">Rp 250.000</div>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className="w-4 h-4 bg-yellow-400 rounded-full mr-1"
                      ></div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-600 ml-1">(24)</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
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

export const ProductDetailWireframe = () => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-5xl mx-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <span>Marketplace</span>
          <span>›</span>
          <span>Essential Oils</span>
          <span>›</span>
          <span>Bergamot</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="w-full md:w-1/2">
            <div className="h-80 bg-gray-200 rounded-lg mb-4"></div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((img) => (
                <div
                  key={img}
                  className="w-20 h-20 bg-gray-300 rounded-md"
                ></div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl font-bold">
              Bergamot Essential Oil (10ml)
            </h1>
            <div className="flex items-center mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="w-4 h-4 bg-yellow-400 rounded-full mr-1"
                  ></div>
                ))}
              </div>
              <div className="text-sm text-gray-600 ml-2">4.8 (24 reviews)</div>
            </div>

            <div className="mt-4 text-2xl font-bold text-purple-800">
              Rp 250.000
            </div>

            <div className="mt-6">
              <div className="font-medium mb-2">Description</div>
              <p className="text-gray-700">
                100% pure bergamot essential oil, cold-pressed from the peel of
                the bergamot orange. Perfect for creating fresh, citrusy accords
                in your perfume formulations.
              </p>
            </div>

            <div className="mt-6">
              <div className="font-medium mb-2">Seller</div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium">Scentrium Essentials</div>
                  <div className="text-sm text-gray-600">
                    4.9 ★ • 128 products
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="font-medium mb-2">Quantity</div>
              <div className="flex items-center space-x-2">
                <button className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center">
                  -
                </button>
                <div className="w-12 h-8 border border-gray-300 rounded-md flex items-center justify-center">
                  1
                </div>
                <button className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center">
                  +
                </button>
                <div className="text-sm text-gray-600 ml-2">12 in stock</div>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <button className="flex-1 px-4 py-3 bg-purple-700 text-white rounded-md hover:bg-purple-800">
                Buy Now
              </button>
              <button className="flex-1 px-4 py-3 bg-white border border-purple-700 text-purple-700 rounded-md hover:bg-purple-50">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="p-6 border-t border-gray-200">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

        <div className="space-y-6">
          {[1, 2].map((review) => (
            <div key={review} className="border-b border-gray-200 pb-6">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium">John Doe</div>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className="w-4 h-4 bg-yellow-400 rounded-full mr-1"
                        ></div>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 ml-2">
                      1 month ago
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">
                    Great quality oil with a wonderful scent. Lasts longer than
                    other bergamot oils I've tried. Will definitely purchase
                    again!
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function MarketplaceWireframes() {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-8 p-4 md:p-8 bg-gray-100">
      <Card className="overflow-hidden">
        <CardHeader className="bg-purple-50 pb-2">
          <CardTitle className="text-lg">Marketplace Home</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
          <MarketplaceHomeWireframe />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="bg-purple-50 pb-2">
          <CardTitle className="text-lg">Product Detail</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
          <ProductDetailWireframe />
        </CardContent>
      </Card>
    </div>
  );
}
