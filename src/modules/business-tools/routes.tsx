import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const BusinessToolsLayout = lazy(
  () => import("./components/BusinessToolsLayout"),
);
const BusinessDashboard = lazy(() => import("./pages/BusinessDashboard"));
const InventoryManagement = lazy(() => import("./pages/InventoryManagement"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const MarketingTools = lazy(() => import("./pages/MarketingTools"));

export const businessToolsRoutes: RouteObject[] = [
  {
    path: "/business",
    element: <BusinessToolsLayout />,
    children: [
      { index: true, element: <BusinessDashboard /> },
      { path: "inventory", element: <InventoryManagement /> },
      { path: "analytics", element: <AnalyticsDashboard /> },
      { path: "marketing", element: <MarketingTools /> },
    ],
  },
];
