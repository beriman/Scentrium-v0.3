import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Upload, X, Plus, ArrowLeft } from "lucide-react";

export default function AddProductPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    originalPrice: "",
    stock: "",
    condition: "",
    size: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = () => {
    // In a real app, this would handle file uploads
    // For this demo, we'll just add a placeholder image
    setImages([
      ...images,
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=500&q=80",
    ]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In a real app, this would send data to the backend
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/marketplace/lapak");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="flex items-center text-gray-500 hover:text-gray-700"
        onClick={() => navigate("/marketplace/lapak")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Lapak
      </Button>

      <h2 className="text-2xl font-bold text-purple-800">Tambah Produk Baru</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Produk</CardTitle>
            <CardDescription>
              Masukkan detail produk yang akan dijual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama produk"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Masukkan nama brand"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parfum">Parfum</SelectItem>
                    <SelectItem value="cologne">Cologne</SelectItem>
                    <SelectItem value="minyak_esensial">
                      Minyak Esensial
                    </SelectItem>
                    <SelectItem value="sampel">Sampel</SelectItem>
                    <SelectItem value="decant">Decant</SelectItem>
                    <SelectItem value="aksesoris">Aksesoris</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Ukuran</Label>
                <Input
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="Contoh: 50ml, 100ml"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Kondisi</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) =>
                    handleSelectChange("condition", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kondisi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Baru/Belum Dipakai</SelectItem>
                    <SelectItem value="90-99">90-99% Isi</SelectItem>
                    <SelectItem value="75-89">75-89% Isi</SelectItem>
                    <SelectItem value="50-74">50-74% Isi</SelectItem>
                    <SelectItem value="below-50">Di bawah 50%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Masukkan harga"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">
                  Harga Asli (Rp) - Opsional
                </Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="Masukkan harga asli jika ada diskon"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stok</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Masukkan jumlah stok"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Produk</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Deskripsikan produk Anda secara detail"
                className="min-h-[150px]"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Foto Produk</CardTitle>
            <CardDescription>
              Unggah foto produk (maksimal 5 foto)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-md overflow-hidden border"
                >
                  <img
                    src={image}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {images.length < 5 && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center aspect-square hover:bg-gray-50 transition-colors"
                >
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Unggah Foto</span>
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/marketplace/lapak")}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
          </Button>
        </div>
      </form>
    </div>
  );
}
