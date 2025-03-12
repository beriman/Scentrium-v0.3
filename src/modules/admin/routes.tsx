import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const AdminLayout = lazy(() =>
  import("./components/AdminLayout").then((module) => ({
    default: module.default,
  })),
);

const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard").then((module) => ({
    default: module.default,
  })),
);

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [{ index: true, element: <AdminDashboard /> }],
  },
];
