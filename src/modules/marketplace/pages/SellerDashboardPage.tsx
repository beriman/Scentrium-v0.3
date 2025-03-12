import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Package,
  ShoppingBag,
  BarChart2,
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  AlertCircle,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import TopNavbar from "@/components/shared/TopNavbar";

// Mock product data
const sellerProducts = [
  {
    id: "1",
    name: "Tom Ford Tobacco Vanille",
    brand: "Tom Ford",
    price: 2850000,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=500&q=80",
    status: "active",
    sales: 12,
    views: 245,
    category: "Parfum",
    size: "50ml",
    condition: "Baru/Belum Dipakai",
    createdAt: "2023-05-15",
  },
  {
    id: "2",
    name: "Byredo Gypsy Water Decant",
    brand: "Byredo",
    price: 450000,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=500&q=80",
    status: "active",
    sales: 24,
    views: 312,
    category: "Decant",
    size: "10ml",
    condition: "Baru/Belum Dipakai",
    createdAt: "2023-06-02",
  },
  {
    id: "3",
    name: "Maison Margiela Replica Jazz Club",
    brand: "Maison Margiela",
    price: 2100000,
    stock: 2,
    image:
      "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=500&h=500&q=80",
    status: "active",
    sales: 7,
    views: 189,
    category: "Parfum",
    size: "100ml",
    condition: "Baru/Belum Dipakai",
    createdAt: "2023-06-18",
  },
  {
    id: "4",
    name: "Creed Aventus",
    brand: "Creed",
    price: 3950000,
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=500&q=80",
    status: "out_of_stock",
    sales: 5,
    views: 278,
    category: "Parfum",
    size: "50ml",
    condition: "Baru/Belum Dipakai",
    createdAt: "2023-07-05",
  },
  {
    id: "5",
    name: "Jo Malone Wood Sage & Sea Salt",
    brand: "Jo Malone",
    price: 1650000,
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1588405748880-b434362febd6?w=500&h=500&q=80",
    status: "active",
    sales: 9,
    views: 156,
    category: "Cologne",
    size: "30ml",
    condition: "Baru/Belum Dipakai",
    createdAt: "2023-07-22",
  },
];

// Mock orders data
const orders = [
  {
    id: "ORD001",
    customer: "Budi Santoso",
    product: "Tom Ford Tobacco Vanille",
    quantity: 1,
    total: 2850000,
    status: "paid",
    date: "2023-08-15",
  },
  {
    id: "ORD002",
    customer: "Siti Nuraini",
    product: "Byredo Gypsy Water Decant",
    quantity: 2,
    total: 900000,
    status: "shipped",
    date: "2023-08-12",
  },
  {
    id: "ORD003",
    customer: "Dian Wijaya",
    product: "Maison Margiela Replica Jazz Club",
    quantity: 1,
    total: 2100000,
    status: "delivered",
    date: "2023-08-08",
  },
  {
    id: "ORD004",
    customer: "Ahmad Fauzi",
    product: "Jo Malone Wood Sage & Sea Salt",
    quantity: 1,
    total: 1650000,
    status: "paid",
    date: "2023-08-16",
  },
  {
    id: "ORD005",
    customer: "Rina Putri",
    product: "Byredo Gypsy Water Decant",
    quantity: 1,
    total: 450000,
    status: "pending",
    date: "2023-08-17",
  },
];

// Mock reviews data
const reviews = [
  {
    id: "REV001",
    customer: "Budi Santoso",
    product: "Tom Ford Tobacco Vanille",
    rating: 5,
    comment:
      "Parfum yang sangat berkualitas, aroma tahan lama dan sesuai deskripsi. Pengiriman juga cepat!",
    date: "2023-08-20",
  },
  {
    id: "REV002",
    customer: "Siti Nuraini",
    product: "Byredo Gypsy Water Decant",
    rating: 4,
    comment:
      "Suka dengan aromanya yang unik, tapi longevity-nya kurang lama di kulit saya.",
    date: "2023-08-15",
  },
  {
    id: "REV003",
    customer: "Dian Wijaya",
    product: "Maison Margiela Replica Jazz Club",
    rating: 5,
    comment:
      "Parfum favorit saya! Aroma woody dan tobacco-nya sangat maskulin dan elegan.",
    date: "2023-08-12",
  },
  {
    id: "REV004",
    customer: "Ahmad Fauzi",
    product: "Jo Malone Wood Sage & Sea Salt",
    rating: 4,
    comment:
      "Aroma segar yang cocok untuk sehari-hari. Packaging-nya juga bagus.",
    date: "2023-08-18",
  },
];

// Format price to IDR
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function SellerDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter products based on search query
  const filteredProducts = sellerProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Calculate statistics
  const totalSales = sellerProducts.reduce(
    (sum, product) => sum + product.sales,
    0,
  );
  const totalRevenue = sellerProducts.reduce(
    (sum, product) => sum + product.price * product.sales,
    0,
  );
  const totalProducts = sellerProducts.length;
  const activeProducts = sellerProducts.filter(
    (p) => p.status === "active",
  ).length;

  // Mobile product card component
  const ProductCard = ({ product }: { product: typeof sellerProducts[0] }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <img
            src={product.image}
            alt={product.name}
            className="h-16 w-16 rounded-md object-cover"
          />
          <div className="flex-1">
            <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
            <div className="text-xs text-gray-500 mt-1">
              {product.brand} · {product.size}
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
              {product.status === "active" ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 text-xs"
                >
                  Aktif
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200 text-xs"
                >
                  Stok Habis
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3 pt-3 border-t text-xs text-gray-500">
          <div>Stok: <span className={product.stock === 0 ? "text-red-500 font-medium" : ""}>{product.stock}</span></div>
          <div>Terjual: {product.sales}</div>
          <div>Dilihat: {product.views}</div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" className="flex-1 h-8">
            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-8">
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Mobile order card component
  const OrderCard = ({ order }: { order: typeof orders[0] }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium text-sm">{order.id}</div>
            <div className="text-xs text-gray-500 mt-1">{order.date}</div>
          </div>
          {order.status === "pending" && (
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
            >
              Menunggu Pembayaran
            </Badge>
          )}
          {order.status === "paid" && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
            >
              Dibayar
            </Badge>
          )}
          {order.status === "shipped" && (
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200 text-xs"
            >
              Dikirim
            </Badge>
          )}
          {order.status === "delivered" && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 text-xs"
            >
              Selesai
            </Badge>
          )}
        </div>
        <div className="mt-3 pt-3 border-t">
          <div className="text-sm font-medium">{order.product}</div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-xs text-gray-500">Pembeli: {order.customer}</div>
            <div className="text-xs text-gray-500">Jumlah: {order.quantity}</div>
          </div>
          <div className="font-semibold text-sm mt-2">{formatPrice(order.total)}</div>
        </div>
        <div className="mt-3">
          <Button variant="outline" size="sm" className="w-full h-8">
            Lihat Detail <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Mobile review card component
  const ReviewCard = ({ review }: { review: typeof reviews[0] }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium text-sm">{review.customer}</div>
            <div className="text-xs text-gray-500 mt-1">{review.date}</div>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t">
          <div className="text-xs text-gray-500 mb-1">Produk: {review.product}</div>
          <div className="text-sm text-gray-600">{review.comment}</div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button variant="outline" size="sm" className="h-8">
            Balas
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavbar />
        <div className="container mx-auto py-4 md:py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <div className="container mx-auto py-4 md:py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-purple-800">Lapak Saya</h2>
          <Link to="/marketplace/lapak/add">
            <Button className="bg-purple-700 hover:bg-purple-800 w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Tambah Produk
            </Button>
          </Link>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card>
            <CardContent className="p-3 md:p-6">
