import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  cover_photo_url: string | null;
  website: string | null;
  location: string | null;
  created_at: string | null;
  updated_at: string | null;
  role: "free" | "business" | "admin" | null;
  exp: number | null;
  level: number | null;
  daily_exp_earned: number | null;
  last_exp_reset: string | null;
};

export type ForumCategory = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  icon: string | null;
  color: string | null;
  position: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ForumThread = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category_id: string;
  is_pinned: boolean | null;
  is_locked: boolean | null;
  view_count: number | null;
  created_at: string | null;
  updated_at: string | null;
  user?: Profile;
  category?: ForumCategory;
  posts_count?: number;
  votes_count?: number;
};

export type ForumPost = {
  id: string;
  content: string;
  user_id: string;
  thread_id: string;
  created_at: string | null;
  updated_at: string | null;
  user?: Profile;
};

export type Vote = {
  id: string;
  user_id: string;
  thread_id: string | null;
  post_id: string | null;
  vote_type: "upvote" | "downvote";
  created_at: string | null;
};

export type MarketplaceProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  user_id: string;
  category: string;
  location: string | null;
  listing_type: "regular" | "sambatan" | null;
  images: string[] | null;
  created_at: string | null;
  updated_at: string | null;
  user?: Profile;
};

export type MarketplaceOrder = {
  id: string;
  buyer_id: string;
  seller_id: string;
  total_amount: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled" | null;
  payment_proof: string | null;
  shipping_address: string | null;
  created_at: string | null;
  updated_at: string | null;
  buyer?: Profile;
  seller?: Profile;
  items?: MarketplaceOrderItem[];
};

export type MarketplaceOrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string | null;
  product?: MarketplaceProduct;
};

export type LearningCourse = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnail_url: string | null;
  created_by: string;
  is_published: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  creator?: Profile;
  videos?: LearningVideo[];
};

export type LearningVideo = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration: number | null;
  is_preview: boolean | null;
  position: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export type UserEnrollment = {
  id: string;
  user_id: string;
  course_id: string;
  progress: number | null;
  is_completed: boolean | null;
  payment_status: "pending" | "paid" | "refunded" | null;
  payment_proof: string | null;
  created_at: string | null;
  updated_at: string | null;
  course?: LearningCourse;
};

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  content: string;
  is_read: boolean | null;
  related_id: string | null;
  created_at: string | null;
};

export type Badge = {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  category: string | null;
  required_exp: number | null;
  created_at: string | null;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string | null;
  badge?: Badge;
};

export type BusinessStats = {
  id: string;
  user_id: string;
  total_sales: number | null;
  total_products: number | null;
  total_customers: number | null;
  created_at: string | null;
  updated_at: string | null;
};
