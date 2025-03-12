import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";

export default function ListItemPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mock image upload - in a real app, you would upload to storage
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file),
      );
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle listing submission
    console.log("Listing submitted:", {
      title,
      description,
      price,
      category,
      condition,
      brand,
      size,
      images,
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-purple-800 mb-6">
          List an Item for Sale
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Item Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="niche">Niche Fragrances</SelectItem>
                  <SelectItem value="designer">Designer Fragrances</SelectItem>
                  <SelectItem value="vintage">Vintage Perfumes</SelectItem>
                  <SelectItem value="samples">Samples & Decants</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={condition} onValueChange={setCondition} required>
                <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like-new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g., Tom Ford, Chanel"
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g., 50ml, 100ml"
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price in USD"
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item in detail (condition, usage, authenticity, etc.)"
              className="min-h-[150px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative rounded-md overflow-hidden h-32"
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 rounded-full h-6 w-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {images.length < 6 && (
                <label className="border-2 border-dashed border-purple-200 rounded-md flex flex-col items-center justify-center h-32 cursor-pointer hover:border-purple-400 transition-colors">
                  <Upload className="h-8 w-8 text-purple-500 mb-2" />
                  <span className="text-sm text-gray-500">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Upload up to 6 images. First image will be the cover.
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-purple-700 hover:bg-purple-800">
              List Item
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-purple-200 text-purple-700"
            >
              Preview
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
