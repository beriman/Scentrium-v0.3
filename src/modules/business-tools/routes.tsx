import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const BusinessToolsLayout = lazy(() =>
  import("./components/BusinessToolsLayout").then((module) => ({
    default: module.default,
  })),
);

const BusinessDashboard = lazy(() =>
  import("./pages/BusinessDashboard").then((module) => ({
    default: module.default,
  })),
);

const InventoryManagement = lazy(() =>
  import("./components/InventoryManagement").then((module) => ({
    default: module.default,
  })),
);

const FinancialDashboard = lazy(() =>
  import("./components/FinancialDashboard").then((module) => ({
    default: module.default,
  })),
);

const ProfitCalculator = lazy(() =>
  import("./components/ProfitCalculator").then((module) => ({
    default: module.default,
  })),
);

const SalesAnalytics = lazy(() =>
  import("./pages/SalesAnalytics").then((module) => ({
    default: module.default,
  })),
);

const BrandingToolkit = lazy(() =>
  import("./pages/BrandingToolkit").then((module) => ({
    default: module.default,
  })),
);

const MarketingTools = lazy(() =>
  import("./pages/MarketingTools").then((module) => ({
    default: module.default,
  })),
);

export const businessToolsRoutes: RouteObject[] = [
  {
    path: "/business",
    element: <BusinessToolsLayout />,
    children: [
      { index: true, element: <BusinessDashboard /> },
      { path: "inventory", element: <InventoryManagement /> },
      { path: "finances", element: <FinancialDashboard /> },
      { path: "calculator", element: <ProfitCalculator /> },
      { path: "analytics", element: <SalesAnalytics /> },
      { path: "branding", element: <BrandingToolkit /> },
      { path: "marketing", element: <MarketingTools /> },
    ],
  },
];
