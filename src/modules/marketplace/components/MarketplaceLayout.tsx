import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../../../../supabase/auth";
import MarketplaceSidebar from "./MarketplaceSidebar";

export default function MarketplaceLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"market" | "lapak">(
    location.pathname.includes("/lapak") ? "lapak" : "market",
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value as "market" | "lapak");
    if (value === "market") {
      navigate("/marketplace");
    } else {
      navigate("/marketplace/lapak");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-purple-800 mb-2">
        Fragrance Marketplace
      </h1>
      <p className="text-gray-600 mb-6">
        Beli, jual, dan tukar parfum dengan komunitas
      </p>
      <Separator className="mb-6" />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="lapak" disabled={!user}>
            Lapak Saya
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <MarketplaceSidebar activeTab={activeTab} />
        </div>
        <div className="md:w-3/4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
