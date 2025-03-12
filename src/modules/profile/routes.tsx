import { RouteObject } from "react-router-dom";
import { lazy } from "react";

// Use named imports with .then pattern to fix Fast Refresh
const ProfilePage = lazy(() =>
  import("./pages/ProfilePage").then((module) => ({
    default: module.default,
  })),
);

const EditProfilePage = lazy(() =>
  import("./pages/EditProfilePage").then((module) => ({
    default: module.default,
  })),
);

const UserProfilePage = lazy(() =>
  import("./pages/UserProfilePage").then((module) => ({
    default: module.default,
  })),
);

const MembershipPage = lazy(() =>
  import("./pages/MembershipPage").then((module) => ({
    default: module.default,
  })),
);

const NotificationsPage = lazy(() =>
  import("./pages/NotificationsPage").then((module) => ({
    default: module.default,
  })),
);

export const profileRoutes: RouteObject[] = [
  {
    path: "/profile",
    element: <UserProfilePage />,
  },
  {
    path: "/profile/edit",
    element: <EditProfilePage />,
  },
  {
    path: "/profile/membership",
    element: <MembershipPage />,
  },
  {
    path: "/profile/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "/profile/:userId",
    element: <ProfilePage />,
  },
];
