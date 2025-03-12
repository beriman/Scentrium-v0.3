export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  logo?: string;
  website?: string;
  socialLinks: Record<string, string>;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  businessId: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  quantity: number;
  reorderPoint: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SalesData {
  id: string;
  businessId: string;
  period: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  topProducts: string[];
  createdAt: string;
}

export interface MarketingCampaign {
  id: string;
  businessId: string;
  name: string;
  description: string;
  type: "email" | "social" | "discount" | "other";
  status: "draft" | "scheduled" | "active" | "completed";
  startDate: string;
  endDate?: string;
  budget?: number;
  results?: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  createdAt: string;
  updatedAt: string;
}
