import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const LearningLayout = lazy(() => import("./components/LearningLayout"));
const LearningHomePage = lazy(() => import("./pages/LearningHomePage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const LessonPage = lazy(() => import("./pages/LessonPage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const PaymentConfirmationPage = lazy(
  () => import("./pages/PaymentConfirmationPage"),
);
const MyCoursesPage = lazy(() => import("./pages/MyCoursesPage"));
const AdminPaymentVerificationPage = lazy(
  () => import("./pages/AdminPaymentVerificationPage"),
);

export const learningRoutes: RouteObject[] = [
  {
    path: "/learning",
    element: <LearningLayout />,
    children: [
      { index: true, element: <LearningHomePage /> },
      { path: "course/:courseId", element: <CourseDetailPage /> },
      { path: "course/:courseId/lesson/:lessonId", element: <LessonPage /> },
      { path: "article/:articleId", element: <ArticlePage /> },
      { path: "payment/:enrollmentId", element: <PaymentConfirmationPage /> },
      { path: "my-courses", element: <MyCoursesPage /> },
      { path: "admin/payments", element: <AdminPaymentVerificationPage /> },
    ],
  },
];
