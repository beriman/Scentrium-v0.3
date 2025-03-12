import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const MarketplaceLayout = lazy(() => import("./components/MarketplaceLayout"));
const MarketplaceHomePage = lazy(() => import("./pages/MarketplaceHomePage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const ListItemPage = lazy(() => import("./pages/ListItemPage"));
const SellerDashboardPage = lazy(() => import("./pages/SellerDashboardPage"));
const AddProductPage = lazy(() => import("./pages/AddProductPage"));

export const marketplaceRoutes: RouteObject[] = [
  {
    path: "/marketplace",
    element: <MarketplaceLayout />,
    children: [
      { index: true, element: <MarketplaceHomePage /> },
      { path: "product/:productId", element: <ProductDetailPage /> },
      { path: "list", element: <ListItemPage /> },
      { path: "lapak", element: <SellerDashboardPage /> },
      { path: "lapak/add", element: <AddProductPage /> },
    ],
  },
];
