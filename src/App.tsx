import { Suspense } from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import Dashboard from "./components/pages/dashboard";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";
import Verify2FAForm from "./components/auth/Verify2FAForm";
import Setup2FAForm from "./components/auth/Setup2FAForm";
import AuthCallback from "./components/auth/AuthCallback";
import { profileRoutes } from "./modules/profile";
import { forumRoutes } from "./modules/forum";
import { marketplaceRoutes } from "./modules/marketplace";
import { learningRoutes } from "./modules/learning";
import { businessToolsRoutes } from "./modules/business-tools";
import { adminRoutes } from "./modules/admin/routes";
import SeedForumPage from "./modules/forum/pages/SeedForumPage";
import WireframeGallery from "./components/wireframes/WireframeGallery";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WireframeGallery />} />
        <Route path="/wireframes" element={<WireframeGallery />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/verify-2fa" element={<Verify2FAForm />} />
        <Route path="/setup-2fa" element={<Setup2FAForm />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/success" element={<Success />} />

        {/* Module routes */}
        {profileRoutes.map((route, index) => (
          <Route
            key={`profile-${index}`}
            path={route.path}
            element={<PrivateRoute>{route.element}</PrivateRoute>}
          />
        ))}

        {forumRoutes.map((route, index) => (
          <Route
            key={`forum-${index}`}
            path={route.path}
            element={<PrivateRoute>{route.element}</PrivateRoute>}
          />
        ))}

        {marketplaceRoutes.map((route, index) => (
          <Route
            key={`marketplace-${index}`}
            path={route.path}
            element={<PrivateRoute>{route.element}</PrivateRoute>}
          />
        ))}

        {learningRoutes.map((route, index) => (
          <Route
            key={`learning-${index}`}
            path={route.path}
            element={<PrivateRoute>{route.element}</PrivateRoute>}
          />
        ))}

        {businessToolsRoutes.map((route, index) => (
          <Route
            key={`business-${index}`}
            path={route.path}
            element={<PrivateRoute>{route.element}</PrivateRoute>}
          />
        ))}

        {adminRoutes.map((route, index) => (
          <Route
            key={`admin-${index}`}
            path={route.path}
            element={<PrivateRoute>{route.element}</PrivateRoute>}
          />
        ))}
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

      {/* Add this before the catchall route */}
      {import.meta.env.VITE_TEMPO === "true" && (
        <Routes>
          <Route path="/tempobook/*" element={<div />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <AppRoutes />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
