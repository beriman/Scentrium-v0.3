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
          .select("*, product:product_id(*), seller:seller_id(*)")
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
              order.id === payload.new.id
                ? { ...order, ...payload.new }
                : order,
            ),
          );
        },
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
    if (activeTab === "pending")
      return matchesSearch && order.status === "pending";
    if (activeTab === "processing")
      return (
        matchesSearch && ["payment_confirmed", "shipped"].includes(order.status)
      );
    if (activeTab === "completed")
      return matchesSearch && ["delivered", "completed"].includes(order.status);
    if (activeTab === "cancelled")
      return matchesSearch && order.status === "cancelled";

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-800 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track and manage your marketplace orders
          </p>
        </div>
        <Link to="/marketplace">
          <Button className="bg-purple-700 hover:bg-purple-800">
            <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
          </Button>
        </Link>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Product Image */}
                  <div className="w-full md:w-48 h-48 bg-gray-100 flex-shrink-0">
                    <img
                      src={
                        order.product?.images?.[0] ||
                        "https://via.placeholder.com/150"
                      }
                      alt={order.product?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-lg mb-1">
                          {order.product?.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Order ID: {order.id.substring(0, 8)}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <Badge
                          className={
                            order.status === "completed"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : order.status === "cancelled"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : "bg-blue-100 text-blue-800 border-blue-200"
                          }
                        >
                          {order.status === "payment_confirmed"
                            ? "Payment Confirmed"
                            : order.status === "shipped"
                              ? "Shipped"
                              : order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Seller</p>
                        <p className="font-medium">{order.seller?.full_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-medium">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-medium text-purple-700">
                          {formatPrice(order.total_amount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex justify-end">
                      <Link to={`/marketplace/order/${order.id}`}>
                        <Button
                          variant="outline"
                          className="text-purple-700 border-purple-200"
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            No orders found
          </h2>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? `No orders matching "${searchQuery}"`
              : activeTab !== "all"
                ? `You don't have any ${activeTab} orders`
                : "You haven't placed any orders yet"}
          </p>
          <Link to="/marketplace">
            <Button className="bg-purple-700 hover:bg-purple-800">
              <ShoppingBag className="mr-2 h-4 w-4" /> Browse Products
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
