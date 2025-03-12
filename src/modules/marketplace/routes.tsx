import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const MarketplaceLayout = lazy(() => import("./components/MarketplaceLayout"));
const MarketplaceHomePage = lazy(() => import("./pages/MarketplaceHomePage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const ListItemPage = lazy(() => import("./pages/ListItemPage"));
const SellerDashboardPage = lazy(() => import("./pages/SellerDashboardPage"));
const AddProductPage = lazy(() => import("./pages/AddProductPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));

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
      { path: "my-orders", element: <MyOrdersPage /> },
      { path: "order/:orderId", element: <OrderDetailsPage /> },
      { path: "checkout/:productId/:quantity", element: <CheckoutPage /> },
    ],
  },
];
