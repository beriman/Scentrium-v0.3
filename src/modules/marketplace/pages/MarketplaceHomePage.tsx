import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function MarketplaceHomePage() {
  // Mock data for products
  const products = [
    {
      id: "1",
      title: "Tom Ford Tobacco Vanille 50ml",
      price: 180,
      condition: "Like New",
      seller: "Sarah Chen",
      location: "New York, NY",
      image:
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80",
      category: "Niche Fragrances",
    },
    {
      id: "2",
      title: "Chanel Bleu de Chanel EDP 100ml",
      price: 95,
      condition: "Good",
      seller: "Alex Kim",
      location: "Los Angeles, CA",
      image:
        "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&q=80",
      category: "Designer Fragrances",
    },
    {
      id: "3",
      title: "Dior Sauvage Decant 10ml",
      price: 15,
      condition: "New",
      seller: "Maria Garcia",
      location: "Chicago, IL",
      image:
        "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=500&q=80",
      category: "Samples & Decants",
    },
    {
      id: "4",
      title: "Vintage Guerlain Shalimar 75ml",
      price: 120,
      condition: "Good",
      seller: "James Wilson",
      location: "Miami, FL",
      image:
        "https://images.unsplash.com/photo-1592945403407-9caf930b2c8d?w=500&q=80",
      category: "Vintage Perfumes",
    },
    {
      id: "5",
      title: "Maison Francis Kurkdjian Baccarat Rouge 540 70ml",
      price: 220,
      condition: "Like New",
      seller: "Emily Johnson",
      location: "Seattle, WA",
      image:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80",
      category: "Niche Fragrances",
    },
    {
      id: "6",
      title: "Perfume Atomizer Travel Spray",
      price: 12,
      condition: "New",
      seller: "David Lee",
      location: "Boston, MA",
      image:
        "https://images.unsplash.com/photo-1585386959984-a4a9d49d0519?w=500&q=80",
      category: "Accessories",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-800">
          Browse Fragrances
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-purple-200 text-purple-700"
          >
            Sort by: Newest
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-purple-700 rounded-full"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Badge className="absolute bottom-2 left-2 bg-purple-700">
                {product.category}
              </Badge>
            </div>
            <CardContent className="p-4">
              <Link to={`/marketplace/product/${product.id}`}>
                <h3 className="font-semibold text-lg text-purple-800 hover:text-purple-600 mb-1">
                  {product.title}
                </h3>
              </Link>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">${product.price}</span>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  {product.condition}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                <div>Seller: {product.seller}</div>
                <div>Location: {product.location}</div>
              </div>
              <div className="mt-4">
                <Link to={`/marketplace/product/${product.id}`}>
                  <Button className="w-full bg-purple-700 hover:bg-purple-800">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
