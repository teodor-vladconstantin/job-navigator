import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/404";
import ResetNewPasswordPage from "./pages/ResetNewPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import EmployerDashboard from "./pages/EmployerDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import ProfilePage from "./pages/ProfilePage";
import PostJobPage from "./pages/PostJobPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import CompaniesPage from "./pages/CompaniesPage";
import EditJobPage from "./pages/EditJobPage";
import CompanyPublicPage from "./pages/CompanyPublicPage";
import CandidateApplicationsPage from "./pages/CandidateApplicationsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { ProtectedRoute, RoleRoute } from "./components/ProtectedRoute";
import { useEffect } from "react";

const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return children;
};

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/companies/:id" element={<CompanyPublicPage />} />
            <Route path="/termeni" element={<TermsPage />} />
            <Route path="/confidentialitate" element={<PrivacyPage />} />
            <Route path="/despre" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/resetare-parola-noua" element={<ResetNewPasswordPage />} />
            <Route path="/resetare-parola" element={<ForgotPasswordPage />} />
            <Route
              path="/dashboard/employer"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="employer">
                    <EmployerDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/employer/post-job"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="employer">
                    <PostJobPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/employer/companies"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="employer">
                    <CompaniesPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/employer/jobs/:id/edit"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="employer">
                    <EditJobPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/candidate"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="candidate">
                    <CandidateDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/candidate/applications"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="candidate">
                    <CandidateApplicationsPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ScrollToTop>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
