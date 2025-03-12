export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: "new" | "like-new" | "good" | "fair" | "poor";
  category: string;
  brand: string;
  size: string;
  images: string[];
  sellerId: string;
  status: "available" | "sold" | "reserved";
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  amount: number;
  shippingAddress: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}
