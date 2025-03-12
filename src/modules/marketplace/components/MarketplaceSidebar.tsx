import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Search, ShoppingBag, Heart, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function MarketplaceSidebar() {
  const [priceRange, setPriceRange] = useState([0, 500]);

  const categories = [
    { name: "Niche Fragrances", slug: "niche" },
    { name: "Designer Fragrances", slug: "designer" },
    { name: "Vintage Perfumes", slug: "vintage" },
    { name: "Samples & Decants", slug: "samples" },
    { name: "Accessories", slug: "accessories" },
  ];

  const conditions = [
    { label: "New", value: "new" },
    { label: "Like New", value: "like-new" },
    { label: "Good", value: "good" },
    { label: "Fair", value: "fair" },
  ];

  return (
    <div className="space-y-6">
      <Link to="/marketplace/list">
        <Button className="w-full bg-purple-700 hover:bg-purple-800">
          <PlusCircle className="mr-2 h-4 w-4" /> List an Item
        </Button>
      </Link>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-medium text-gray-900 mb-3">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <Link
              to="/marketplace?filter=favorites"
              className="text-gray-600 hover:text-purple-700 flex items-center"
            >
              <Heart className="mr-2 h-4 w-4" />
              Saved Items
            </Link>
          </li>
          <li>
            <Link
              to="/marketplace?filter=purchases"
              className="text-gray-600 hover:text-purple-700 flex items-center"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              My Purchases
            </Link>
          </li>
          <li>
            <Link
              to="/marketplace?filter=selling"
              className="text-gray-600 hover:text-purple-700 flex items-center"
            >
              <Package className="mr-2 h-4 w-4" />
              My Listings
            </Link>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-medium text-gray-900 mb-3">Filter Products</h3>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>

          <div>
            <Label className="mb-2 block">Categories</Label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.slug} className="flex items-center">
                  <Checkbox id={category.slug} className="text-purple-700" />
                  <label
                    htmlFor={category.slug}
                    className="ml-2 text-sm text-gray-600"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Condition</Label>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <div key={condition.value} className="flex items-center">
                  <Checkbox id={condition.value} className="text-purple-700" />
                  <label
                    htmlFor={condition.value}
                    className="ml-2 text-sm text-gray-600"
                  >
                    {condition.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label>Price Range</Label>
              <span className="text-sm text-gray-600">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[0, 500]}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="py-4"
            />
          </div>

          <Button className="w-full bg-purple-700 hover:bg-purple-800">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
