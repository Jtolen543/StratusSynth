import { BrowserRouter, Route, Routes } from "react-router";
import { RootLayout } from "./layouts/root-layout";
import { LandingPage } from "./pages/main/landing/LandingPage";
import { SignUpPage } from "./pages/main/auth/SignUpPage";
import { SignInPage } from "./pages/main/auth/SignInPage";
import { ProfilePage } from "./pages/main/profile/ProfilePage";
import { PricingPage } from "./pages/main/pricing/PricingPage";
import { PrivacyPage } from "./pages/main/legal/PrivacyPage";
import { AccessbilityPage } from "./pages/main/legal/AccessibilityPage";
import { TermsPage } from "./pages/main/legal/ToSPage";
import { FAQPage } from "./pages/main/support/FAQPage";
import { ContactPage } from "./pages/main/support/ContactPage";
import { AboutPage } from "./pages/main/support/AboutPage";
import { TwoFactorPage } from "./pages/main/auth/2FAPage";
import { ResetPasswordPage } from "./pages/main/auth/ResetPasswordPage";
import { DashboardLayout } from "./layouts/dashboard-layout";
import { DashboardHomePage } from "./pages/dashboard/home/DashboardHomePage";
import { DashboardStoragePage } from "./pages/dashboard/storage/DashboardStoragePage";
import { DashboardDatabasePage } from "./pages/dashboard/database/DashboardDatabasePage";
import { DashboardApplicationPage } from "./pages/dashboard/application/ApplicationPage";
import { DashboardAgentPage } from "./pages/dashboard/agent/DashboardAgentPage";
import { AdminLayout } from "./layouts/admin-layout";
import { AdminUsersPage } from "./pages/admin/user/AdminUsersPage";
import { AdminAuditLogsPage } from "./pages/admin/audit/AdminAuditLogsPage";
import { AdminHomePage } from "./pages/admin/home/AdminHomePage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<LandingPage />} />

          {/* Pricing */}
          <Route path="pricing" element={<PricingPage />} />

          {/* Auth */}
          <Route path="signup" element={<SignUpPage />} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="2FA" element={<TwoFactorPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />

          <Route path="profile" element={<ProfilePage />} />

          {/* Legal */}
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="accessibility" element={<AccessbilityPage />} />
          <Route path="terms" element={<TermsPage />} />

          {/* Support */}
          <Route path="faq" element={<FAQPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHomePage />} />
          <Route path="storage" element={<DashboardStoragePage />} />
          <Route path="database" element={<DashboardDatabasePage />} />
          <Route path="application" element={<DashboardApplicationPage />} />
          <Route path="agent" element={<DashboardAgentPage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="audits" element={<AdminAuditLogsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}