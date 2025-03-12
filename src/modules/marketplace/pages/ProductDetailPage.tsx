import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Minus,
  Plus,
} from "lucide-react";
import ProductReviews from "../components/ProductReviews";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("marketplace_products")
          .select("*, seller:seller_id(*)")
          .eq("id", productId)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error: any) {
        console.error("Error fetching product details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.message ||
            "Failed to load product details. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, toast]);

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.stock) {
      toast({
        variant: "destructive",
        title: "Maximum Stock Reached",
        description: `Only ${product.stock} items available in stock.`,
      });
      return;
    }
    setQuantity(value);
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity} × ${product.title} added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to continue with your purchase.",
      });
      navigate("/login", {
        state: { from: `/marketplace/product/${productId}` },
      });
      return;
    }

    // Navigate to checkout page
    navigate(`/marketplace/checkout/${productId}/${quantity}`);
  };

  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          to="/marketplace"
          className="flex items-center text-purple-700 hover:text-purple-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={
                product.images?.[activeImageIndex] ||
                "https://via.placeholder.com/500"
              }
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images?.map((image: string, index: number) => (
              <button
                key={index}
                className={`w-20 h-20 rounded-md overflow-hidden border-2 ${index === activeImageIndex ? "border-purple-500" : "border-transparent"}`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${product.title} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  4.0 (24 reviews)
                </span>
              </div>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                {product.condition}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-purple-700 mb-4">
              {formatPrice(product.price)}
            </div>
            <p className="text-gray-600 mb-6">{product.short_description}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Availability:</span>
              <span
                className={
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Brand:</span>
              <span>{product.brand}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Size:</span>
              <span>{product.size}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Seller:</span>
              <Link
                to={`/profile/${product.seller_id}`}
                className="text-purple-700 hover:underline"
              >
                {product.seller?.full_name}
              </Link>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-medium mr-4">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={product.stock <= quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 bg-purple-700 hover:bg-purple-800"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
              >
                Buy Now
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-purple-200 text-purple-700"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Heart className="h-5 w-5 text-gray-500" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-purple-600" />
              <span className="text-sm">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <span className="text-sm">Secure Transaction</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-purple-600" />
              <span className="text-sm">14-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-medium mb-4">
                    Product Description
                  </h3>
                  <div className="whitespace-pre-line">
                    {product.description}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Brand</span>
                      <span>{product.brand}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Size</span>
                      <span>{product.size}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Condition</span>
                      <span>{product.condition}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Type</span>
                      <span>{product.type || "Eau de Parfum"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Origin</span>
                      <span>{product.origin || "Indonesia"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Year</span>
                      <span>{product.year || "2023"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <ProductReviews productId={productId || ""} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* This would be populated with actual related products */}
          <Card className="h-full flex flex-col">
            <div className="aspect-square bg-gray-100">
              <img
                src="https://via.placeholder.com/300"
                alt="Related Product"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="flex-1 p-4">
              <h3 className="font-medium mb-2">Similar Perfume</h3>
              <p className="text-sm text-gray-500 mb-2">Brand Name</p>
              <p className="font-bold text-purple-700">{formatPrice(350000)}</p>
            </CardContent>
          </Card>
          {/* Repeat for other related products */}
        </div>
      </div>
    </div>
  );
}
