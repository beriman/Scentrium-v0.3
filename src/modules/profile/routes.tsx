import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const EditProfilePage = lazy(() => import("./pages/EditProfilePage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));

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
    path: "/profile/:userId",
    element: <ProfilePage />,
  },
];
