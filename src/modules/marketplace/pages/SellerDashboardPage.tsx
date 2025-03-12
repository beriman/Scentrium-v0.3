import React, { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-800">Lapak Saya</h2>
        <Link to="/marketplace/lapak/add">
          <Button className="bg-purple-700 hover:bg-purple-800">
            <Plus className="mr-2 h-4 w-4" /> Tambah Produk
          </Button>
        </Link>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Produk</p>
                <h3 className="text-2xl font-bold">{totalProducts}</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Package className="h-6 w-6 text-purple-700" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="text-green-600 bg-green-50">
                <ArrowUp className="h-3 w-3 mr-1" /> {activeProducts} Aktif
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Penjualan</p>
                <h3 className="text-2xl font-bold">{totalSales}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-blue-700" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="text-green-600 bg-green-50">
                <ArrowUp className="h-3 w-3 mr-1" /> 12% dari bulan lalu
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Pendapatan</p>
                <h3 className="text-2xl font-bold">
                  {formatPrice(totalRevenue)}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <BarChart2 className="h-6 w-6 text-green-700" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="text-green-600 bg-green-50">
                <ArrowUp className="h-3 w-3 mr-1" /> 8% dari bulan lalu
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Rating Toko</p>
                <h3 className="text-2xl font-bold flex items-center">
                  4.8{" "}
                  <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" />
                </h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="text-blue-600 bg-blue-50">
                {reviews.length} ulasan
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Produk</TabsTrigger>
          <TabsTrigger value="orders">Pesanan</TabsTrigger>
          <TabsTrigger value="reviews">Ulasan</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="pt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <CardTitle>Daftar Produk</CardTitle>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari produk..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produk</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Stok</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Terjual</TableHead>
                      <TableHead>Dilihat</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-gray-500">
                                {product.brand} · {product.size}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell>
                          <div
                            className={`font-medium ${product.stock === 0 ? "text-red-500" : ""}`}
                          >
                            {product.stock}
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.status === "active" ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Aktif
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200"
                            >
                              Stok Habis
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell>{product.views}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pesanan Masuk</CardTitle>
              <CardDescription>Kelola pesanan dari pembeli</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Pesanan</TableHead>
                      <TableHead>Pembeli</TableHead>
                      <TableHead>Produk</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{formatPrice(order.total)}</TableCell>
                        <TableCell>
                          {order.status === "pending" && (
                            <Badge
                              variant="outline"
                              className="bg-yellow-50 text-yellow-700 border-yellow-200"
                            >
                              Menunggu Pembayaran
                            </Badge>
                          )}
                          {order.status === "paid" && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              Dibayar
                            </Badge>
                          )}
                          {order.status === "shipped" && (
                            <Badge
                              variant="outline"
                              className="bg-purple-50 text-purple-700 border-purple-200"
                            >
                              Dikirim
                            </Badge>
                          )}
                          {order.status === "delivered" && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Selesai
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ulasan Pembeli</CardTitle>
              <CardDescription>
                Lihat dan tanggapi ulasan dari pembeli
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{review.customer}</div>
                        <div className="text-sm text-gray-500">
                          {review.date}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {review.comment}
                    </div>
                    <div className="text-xs text-gray-500">
                      Produk: {review.product}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">
                        Balas
                      </Button>
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
