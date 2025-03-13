import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((module) => ({
    default: module.default,
  })),
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
];
