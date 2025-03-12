import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FORUM_CATEGORIES = [
  {
    id: "diskusi-perfumer",
    name: "Diskusi Perfumer",
    description: "Teknik meracik parfum, sharing formula, metode",
  },
  {
    id: "review-parfum",
    name: "Review Parfum",
    description: "Ulasan mendalam parfum lokal",
  },
  {
    id: "inspirasi-parfum",
    name: "Inspirasi Parfum",
    description: "Diskusi inspirasi dari alam/budaya",
  },
  {
    id: "kolaborasi-event",
    name: "Kolaborasi & Event",
    description: "Mencari partner event atau proyek parfum",
  },
  {
    id: "tips-bisnis-parfum",
    name: "Tips Bisnis Parfum",
    description: "Branding, marketing, penjualan",
  },
];

interface CategorySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function CategorySelector({
  value,
  onValueChange,
  label = "Kategori",
  placeholder = "Pilih kategori",
}: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {FORUM_CATEGORIES.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
