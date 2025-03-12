import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const ForumLayout = lazy(() => import("./components/ForumLayout"));
const ForumHomePage = lazy(() => import("./pages/ForumHomePage"));
const ThreadPage = lazy(() => import("./pages/ThreadPage"));
const NewThreadPage = lazy(() => import("./pages/NewThreadPage"));
const ForumRulesPage = lazy(() => import("./pages/ForumRulesPage"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));

export const forumRoutes: RouteObject[] = [
  {
    path: "/forum",
    element: <ForumLayout />,
    children: [
      { index: true, element: <ForumHomePage /> },
      { path: "thread/:threadId", element: <ThreadPage /> },
      { path: "new", element: <NewThreadPage /> },
      { path: "rules", element: <ForumRulesPage /> },
      { path: "search", element: <SearchResultsPage /> },
      { path: "notifications", element: <NotificationsPage /> },
    ],
  },
];
