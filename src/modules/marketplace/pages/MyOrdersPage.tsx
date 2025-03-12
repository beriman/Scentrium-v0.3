import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import { Search, Package, ShoppingBag, Clock, ArrowRight } from "lucide-react";

export default function MyOrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("marketplace_orders")
          .select(
            "*, product:product_id(*), seller:seller_id(*)"
          )
          .eq("buyer_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.message || "Failed to load orders. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();

    // Set up real-time subscription for order updates
    const ordersSubscription = supabase
      .channel("orders-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "marketplace_orders",
          filter: `buyer_id=eq.${user.id}`,
        },
        (payload) => {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === payload.new.id ? { ...order, ...payload.new } : order
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, [user, navigate, toast]);

  // Filter orders based on search query and active tab
  const filteredOrders = orders.filter((order) => {
    // Filter by search query
    const matchesSearch =
      order.product?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && order.status === "pending";
    if (activeTab === "processing")
      return (
        matchesSearch &&
        ["payment_confirmed", "shipped"].includes(order.status)
      );
    if (activeTab === "completed")
      return (
        matchesSearch &&
        ["delivered", "completed"].includes(order.status)
      );
    if (activeTab === "cancelled") return matchesSearch && order.status === "cancelled";

    return matchesSearch;
  });

  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: