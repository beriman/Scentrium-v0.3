import { RouteObject } from "react-router-dom";
import { lazy } from "react";

// Use named imports to fix Fast Refresh issue
const LearningLayout = lazy(() =>
  import("./components/LearningLayout").then((module) => ({
    default: module.default,
  })),
);
const LearningHomePage = lazy(() =>
  import("./pages/LearningHomePage").then((module) => ({
    default: module.default,
  })),
);
const CourseDetailPage = lazy(() =>
  import("./pages/CourseDetailPage").then((module) => ({
    default: module.default,
  })),
);
const LessonPage = lazy(() =>
  import("./pages/LessonPage").then((module) => ({ default: module.default })),
);
const ArticlePage = lazy(() =>
  import("./pages/ArticlePage").then((module) => ({ default: module.default })),
);
const PaymentConfirmationPage = lazy(() =>
  import("./pages/PaymentConfirmationPage").then((module) => ({
    default: module.default,
  })),
);
const MyCoursesPage = lazy(() =>
  import("./pages/MyCoursesPage").then((module) => ({
    default: module.default,
  })),
);
const AdminPaymentVerificationPage = lazy(() =>
  import("./pages/AdminPaymentVerificationPage").then((module) => ({
    default: module.default,
  })),
);
const QuizEditorPage = lazy(() =>
  import("./pages/QuizEditorPage").then((module) => ({
    default: module.default,
  })),
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
      { path: "admin/lesson/:lessonId/quiz", element: <QuizEditorPage /> },
    ],
  },
];
