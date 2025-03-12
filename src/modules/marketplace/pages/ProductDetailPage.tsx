import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Share2, MessageSquare, ShoppingCart, Star } from "lucide-react";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [activeImage, setActiveImage] = useState(0);

  // Mock product data
  const product = {
    id: "1",
    title: "Tom Ford Tobacco Vanille 50ml",
    description: `<p>Selling my bottle of Tom Ford Tobacco Vanille. Purchased in 2023 from Sephora.</p>
                  <p>The fragrance is rich and spicy with notes of tobacco leaf, vanilla, and cocoa. Perfect for fall and winter.</p>
                  <p>Bottle is 50ml with approximately 45ml remaining (90% full).</p>`,
    price: 180,
    condition: "Like New",
    category: "Niche Fragrances",
    brand: "Tom Ford",
    size: "50ml",
    seller: {
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 4.8,
      sales: 27,
      joined: "March 2022",
    },
    location: "New York, NY",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80&fit=crop&auto=format&h=500",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80&fit=crop&auto=format&h=500",
    ],
    reviews: [
      {
        id: "r1",
        user: {
          name: "Alex Kim",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        },
        rating: 5,
        comment:
          "Great seller! Fast shipping and item was exactly as described.",
        date: "2 weeks ago",
      },
      {
        id: "r2",
        user: {
          name: "Maria Garcia",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        },
        rating: 4,
        comment: "Good transaction. The perfume was well packaged.",
        date: "1 month ago",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4">
            <img
              src={product.images[activeImage]}
              alt={product.title}
              className="w-full h-auto"
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer rounded-md overflow-hidden border-2 ${activeImage === index ? "border-purple-700" : "border-transparent"}`}
                onClick={() => setActiveImage(index)}
              >
                <img
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className="w-20 h-20 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold text-purple-800 mb-2">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              {product.condition}
            </Badge>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              {product.category}
            </Badge>
          </div>

          <div className="text-3xl font-bold mb-4">${product.price}</div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-sm text-gray-500">Brand</span>
              <div>{product.brand}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Size</span>
              <div>{product.size}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Location</span>
              <div>{product.location}</div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <Button className="flex-1 bg-purple-700 hover:bg-purple-800">
              <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now
            </Button>
            <Button
              variant="outline"
              className="border-purple-200 text-purple-700"
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Contact Seller
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-purple-200 text-purple-700"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-purple-200 text-purple-700"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={product.seller.avatar}
                    alt={product.seller.name}
                  />
                  <AvatarFallback>{product.seller.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{product.seller.name}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star
                      className="h-4 w-4 text-yellow-500 mr-1"
                      fill="currentColor"
                    />
                    <span>
                      {product.seller.rating} • {product.seller.sales} sales
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Member since {product.seller.joined}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="description">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({product.reviews.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="pt-4">
          <Card>
            <CardContent className="p-6 space-y-6">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={review.user.avatar}
                        alt={review.user.name}
                      />
                      <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.user.name}</div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
