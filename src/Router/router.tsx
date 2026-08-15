import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { UserRole } from '../types/auth';
import { RootLayout } from '../Layouts/RootLayout';
import { BookingProvider } from '../Context/BookingContext';
import { HomePage } from '../Pages/home/HomePage';
import { ServicesPage } from '../Pages/servicespage/ServicesPage';
import { ProfessionalsPage } from '../Pages/professionals/ProfessionalsPage';
import { AboutPage } from '../Pages/About/AboutPage';
import { FaqPage } from '../Pages/Faq/FaqPage';
import { NotFoundPage } from '../Pages/Not-found/NotFoundPage';
import { ServiceDetailsPage } from '../Pages/service-details/ServiceDetailsPage';
import { ContactPage } from '../Pages/Contact/ContactPage';
import ProDetailsPage from '../Pages/home/Sections/FeaturedPros/ProDetailsPage';
import AllCategoriesPage from '../Pages/AllCategories/AllCategoriesPage';
import LoginPage from '../Pages/Auth/login/LoginPage';
import RegisterPage from '../Pages/Auth/register/RegisterPage';
import VerifyEmailPage from '../Pages/Auth/verify-email/VerifyEmailPage';
import ForgotPasswordPage from '../Pages/Auth/forgot-password/ForgotPasswordPage';
import ResetPasswordPage from '../Pages/Auth/reset-password/ResetPasswordPage';
import DashboardLayout from '../Layouts/DashboardLayout';
import ProtectedRoute from '../Layouts/ProtectedRoute';
import UserDashboard from '../Pages/dashboard/user/UserDashboard';
import ProviderDashboard from '../Pages/dashboard/provider/ProviderDashboard';
import AdminDashboard from '../Pages/dashboard/admin/AdminDashboard';
import AdminApprovals from '../Pages/dashboard/admin/AdminApprovals';
import SuperAdminDashboard from '../Pages/dashboard/super-admin/SuperAdminDashboard';
import SuperAdminApprovals from '../Pages/dashboard/super-admin/SuperAdminApprovals';
import SuperAdminProviderApprovals from '../Pages/dashboard/super-admin/SuperAdminProviderApprovals';
import UserManagement from '../Pages/dashboard/super-admin/UserManagement';
import SystemPage from '../Pages/dashboard/super-admin/SystemPage';
import ProviderApplicationForm from '../Pages/dashboard/user/ProviderApplicationForm';
import MyBookings from '../Pages/dashboard/user/MyBookings';
import SavedPros from '../Pages/dashboard/user/SavedPros';
import Leads from '../Pages/dashboard/provider/Leads';
import MyJobs from '../Pages/dashboard/provider/MyJobs';
import Appointments from '../Pages/dashboard/provider/Appointments';
import Messages from '../Pages/dashboard/provider/Messages';
import Reviews from '../Pages/dashboard/provider/Reviews';
import ProviderPayments from '../Pages/dashboard/provider/ProviderPayments';
import Moderation from '../Pages/dashboard/admin/Moderation';
import TradesManagement from '../Pages/dashboard/admin/manage/TradesManagement';
import ProfessionsManagement from '../Pages/dashboard/admin/manage/ProfessionsManagement';
import ProfessionalsManagement from '../Pages/dashboard/admin/manage/ProfessionalsManagement';
import SubscriptionsManagement from '../Pages/dashboard/admin/manage/SubscriptionsManagement';
import BeforeAfterManagement from '../Pages/dashboard/admin/manage/BeforeAfterManagement';
import TestimonialsManagement from '../Pages/dashboard/admin/manage/TestimonialsManagement';
import BookingManagement from '../Pages/dashboard/admin/manage/BookingManagement';
import AdminPaymentHistory from '../Pages/dashboard/admin/manage/AdminPaymentHistory';
import ProfilePage from '../Pages/dashboard/profile/ProfilePage';
import { ProviderBookingDashboard } from '../Pages/dashboard/provider/ProviderBookingDashboard';
import UserReviews from '../Pages/dashboard/user/UserReviews';
import MyQuotes from '../Pages/dashboard/user/MyQuotes';
import UserMessages from '../Pages/dashboard/user/Messages';
import UserNotifications from '../Pages/dashboard/user/Notifications';
import ProviderQuotes from '../Pages/dashboard/provider/ProviderQuotes';
import ProviderNotifications from '../Pages/dashboard/provider/Notifications';
import ProviderSubscription from '../Pages/dashboard/provider/Subscription';
import PricingPage from '../Pages/Pricing/PricingPage';
import { BlogPage } from '../Pages/Blog/BlogPage';
import { TrustSafetyPage } from '../Pages/TrustSafety/TrustSafetyPage';

const ADMIN_ROLES: UserRole[] = ['ADMIN', 'SUPER_ADMIN'];
const USER_ROLES: UserRole[] = ['user'];
const PROVIDER_ROLES: UserRole[] = ['serviceProvider'];
const SUPER_ADMIN_ROLES: UserRole[] = ['SUPER_ADMIN'];

interface ProtectedRouteEntry {
  path: string;
  roles: UserRole[];
  element: ReactNode;
}

const publicRoutes = [
  { path: 'services', element: <ServicesPage /> },
  { path: 'services/:id', element: <ServiceDetailsPage /> },
  { path: 'categories', element: <AllCategoriesPage /> },
  { path: 'professionals', element: <ProfessionalsPage /> },
  { path: 'professionals/:id', element: <ProDetailsPage /> },
  { path: 'pricing', element: <PricingPage /> },
  { path: 'about', element: <AboutPage /> },
  { path: 'blog', element: <BlogPage /> },
  { path: 'trust-and-safety', element: <TrustSafetyPage /> },
  { path: 'faq', element: <FaqPage /> },
  { path: 'contact', element: <ContactPage /> },
];

const authRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
];

const protectedRouteEntries: ProtectedRouteEntry[] = [
  { path: 'user', roles: USER_ROLES, element: <UserDashboard /> },
  { path: 'user/bookings', roles: USER_ROLES, element: <MyBookings /> },
  { path: 'user/saved', roles: USER_ROLES, element: <SavedPros /> },
  { path: 'user/reviews', roles: USER_ROLES, element: <UserReviews /> },
  { path: 'user/quotes', roles: USER_ROLES, element: <MyQuotes /> },
  { path: 'user/messages', roles: USER_ROLES, element: <UserMessages /> },
  { path: 'user/notifications', roles: USER_ROLES, element: <UserNotifications /> },
  { path: 'user/apply-provider', roles: USER_ROLES, element: <ProviderApplicationForm /> },

  { path: 'provider', roles: PROVIDER_ROLES, element: <ProviderDashboard /> },
  { path: 'provider/leads', roles: PROVIDER_ROLES, element: <Leads /> },
  { path: 'provider/jobs', roles: PROVIDER_ROLES, element: <MyJobs /> },
  { path: 'provider/appointments', roles: PROVIDER_ROLES, element: <Appointments /> },
  { path: 'provider/messages', roles: PROVIDER_ROLES, element: <Messages /> },
  { path: 'provider/reviews', roles: PROVIDER_ROLES, element: <Reviews /> },
  { path: 'provider/quotes', roles: PROVIDER_ROLES, element: <ProviderQuotes /> },
  { path: 'provider/notifications', roles: PROVIDER_ROLES, element: <ProviderNotifications /> },
  { path: 'provider/subscription', roles: PROVIDER_ROLES, element: <ProviderSubscription /> },
  { path: 'provider/payments', roles: PROVIDER_ROLES, element: <ProviderPayments /> },
  { path: 'provider/providerPBooking', roles: PROVIDER_ROLES, element: <ProviderBookingDashboard /> },

  { path: 'admin', roles: ADMIN_ROLES, element: <AdminDashboard /> },
  { path: 'admin/approvals', roles: ADMIN_ROLES, element: <AdminApprovals /> },
  { path: 'admin/moderation', roles: ADMIN_ROLES, element: <Moderation /> },
  { path: 'admin/manage/trades', roles: ADMIN_ROLES, element: <TradesManagement /> },
  { path: 'admin/manage/subscriptions', roles: ADMIN_ROLES, element: <SubscriptionsManagement /> },
  { path: 'admin/manage/professions', roles: ADMIN_ROLES, element: <ProfessionsManagement /> },
  { path: 'admin/manage/professionals', roles: ADMIN_ROLES, element: <ProfessionalsManagement /> },
  { path: 'admin/manage/before-after', roles: ADMIN_ROLES, element: <BeforeAfterManagement /> },
  { path: 'admin/manage/testimonials', roles: ADMIN_ROLES, element: <TestimonialsManagement /> },
  { path: 'admin/manage/bookings', roles: ADMIN_ROLES, element: <BookingManagement /> },
  { path: 'admin/manage/payments', roles: ADMIN_ROLES, element: <AdminPaymentHistory /> },

  { path: 'super-admin', roles: SUPER_ADMIN_ROLES, element: <SuperAdminDashboard /> },
  { path: 'super-admin/admin-approvals', roles: SUPER_ADMIN_ROLES, element: <SuperAdminApprovals /> },
  { path: 'super-admin/user-approvals', roles: SUPER_ADMIN_ROLES, element: <SuperAdminProviderApprovals /> },
  { path: 'super-admin/users', roles: SUPER_ADMIN_ROLES, element: <UserManagement /> },
  { path: 'super-admin/system', roles: SUPER_ADMIN_ROLES, element: <SystemPage /> },
];

const protectedRoutes: RouteObject[] = protectedRouteEntries.map(
  ({ path, roles, element }) => ({
    path,
    element: <ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>,
  })
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      ...publicRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  ...authRoutes,
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <BookingProvider>
          <DashboardLayout />
        </BookingProvider>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard/user" replace /> },
      ...protectedRoutes,
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
]);
