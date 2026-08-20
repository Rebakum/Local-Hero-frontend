import { createBrowserRouter, Navigate, Outlet, type RouteObject } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { UserRole } from '../types/auth';
import { RootLayout } from '../Layouts/RootLayout';
import { BookingProvider } from '../Context/BookingContext';
import { HomePage } from '../Pages/home/HomePage';
import { ServicesPage } from '../Pages/Servicespage/ServicesPage';
import { ProfessionalsPage } from '../Pages/professionals/ProfessionalsPage';
import { AboutPage } from '../Pages/About/AboutPage';
import { FaqPage } from '../Pages/Faq/FaqPage';
import { NotFoundPage } from '../Pages/Not-found/NotFoundPage';
import { ServiceDetailsPage } from '../Pages/Service-details/ServiceDetailsPage';
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
import AdminNotifications from '../Pages/dashboard/admin/Notifications';
import SuperAdminDashboard from '../Pages/dashboard/super-admin/SuperAdminDashboard';
import SuperAdminApprovals from '../Pages/dashboard/super-admin/SuperAdminApprovals';
import SuperAdminProviderApprovals from '../Pages/dashboard/super-admin/SuperAdminProviderApprovals';
import SuperAdminNotifications from '../Pages/dashboard/super-admin/Notifications';
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
import ServicesManagement from '../Pages/dashboard/admin/manage/ServicesManagement';
import ProfessionsManagement from '../Pages/dashboard/admin/manage/ProfessionsManagement';
import ProfessionalsManagement from '../Pages/dashboard/admin/manage/ProfessionalsManagement';
import SubscriptionsManagement from '../Pages/dashboard/admin/manage/SubscriptionsManagement';
import BeforeAfterManagement from '../Pages/dashboard/admin/manage/BeforeAfterManagement';
import TestimonialsManagement from '../Pages/dashboard/admin/manage/TestimonialsManagement';
import BookingManagement from '../Pages/dashboard/admin/manage/BookingManagement';
import AdminPaymentHistory from '../Pages/dashboard/admin/manage/AdminPaymentHistory';
import SupportTicketsManagement from '../Pages/dashboard/admin/manage/SupportTicketsManagement';
import ProfilePage from '../Pages/dashboard/profile/ProfilePage';
import { ProviderBookingDashboard } from '../Pages/dashboard/provider/ProviderBookingDashboard';
import UserReviews from '../Pages/dashboard/user/UserReviews';
import MyQuotes from '../Pages/dashboard/user/MyQuotes';
import UserMessages from '../Pages/dashboard/user/Messages';
import UserNotifications from '../Pages/dashboard/user/Notifications';
import ProviderQuotes from '../Pages/dashboard/provider/ProviderQuotes';
import ProviderNotifications from '../Pages/dashboard/provider/Notifications';
import ProviderSubscription from '../Pages/dashboard/provider/Subscription';
import SubscriptionSuccess from '../Pages/dashboard/provider/SubscriptionSuccess';
import SubscriptionCancel from '../Pages/dashboard/provider/SubscriptionCancel';
import BeforeAfterSubmissions from '../Pages/dashboard/provider/BeforeAfterSubmissions';
import PricingPage from '../Pages/Pricing/PricingPage';
import { BlogPage } from '../Pages/Blog/BlogPage';
import { TrustSafetyPage } from '../Pages/TrustSafety/TrustSafetyPage';

const ADMIN_ROLES: UserRole[] = ['ADMIN', 'SUPER_ADMIN'];
const USER_ROLES: UserRole[] = ['user'];
const PROVIDER_ROLES: UserRole[] = ['serviceProvider'];
const SUPER_ADMIN_ROLES: UserRole[] = ['SUPER_ADMIN'];

interface DashboardRoleRoute {
  path: string;
  children: RouteObject[];
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

const dashboardRoleRoutes: DashboardRoleRoute[] = [
  {
    path: 'user',
    children: [
      { index: true, element: <UserDashboard /> },
      { path: 'bookings', element: <MyBookings /> },
      { path: 'saved', element: <SavedPros /> },
      { path: 'reviews', element: <UserReviews /> },
      { path: 'quotes', element: <MyQuotes /> },
      { path: 'messages', element: <UserMessages /> },
      { path: 'notifications', element: <UserNotifications /> },
      { path: 'apply-provider', element: <ProviderApplicationForm /> },
    ],
  },
  {
    path: 'provider',
    children: [
      { index: true, element: <ProviderDashboard /> },
      { path: 'leads', element: <Leads /> },
      { path: 'jobs', element: <MyJobs /> },
      { path: 'appointments', element: <Appointments /> },
      { path: 'messages', element: <Messages /> },
      { path: 'reviews', element: <Reviews /> },
      { path: 'quotes', element: <ProviderQuotes /> },
      { path: 'notifications', element: <ProviderNotifications /> },
      { path: 'subscription', element: <ProviderSubscription /> },
      { path: 'subscription/success', element: <SubscriptionSuccess /> },
      { path: 'subscription/cancel', element: <SubscriptionCancel /> },
      { path: 'payments', element: <ProviderPayments /> },
      { path: 'before-after', element: <BeforeAfterSubmissions /> },
      { path: 'providerPBooking', element: <ProviderBookingDashboard /> },
    ],
  },
  {
    path: 'admin',
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'approvals', element: <AdminApprovals /> },
      { path: 'notifications', element: <AdminNotifications /> },
      { path: 'moderation', element: <Moderation /> },
      { path: 'manage/trades', element: <TradesManagement /> },
      { path: 'manage/services', element: <ServicesManagement /> },
      { path: 'manage/subscriptions', element: <SubscriptionsManagement /> },
      { path: 'manage/professions', element: <ProfessionsManagement /> },
      { path: 'manage/professionals', element: <ProfessionalsManagement /> },
      { path: 'manage/before-after', element: <BeforeAfterManagement /> },
      { path: 'manage/testimonials', element: <TestimonialsManagement /> },
      { path: 'manage/bookings', element: <BookingManagement /> },
      { path: 'manage/payments', element: <AdminPaymentHistory /> },
      { path: 'manage/support-tickets', element: <SupportTicketsManagement /> },
    ],
  },
  {
    path: 'super-admin',
    children: [
      { index: true, element: <SuperAdminDashboard /> },
      { path: 'admin-approvals', element: <SuperAdminApprovals /> },
      { path: 'user-approvals', element: <SuperAdminProviderApprovals /> },
      { path: 'notifications', element: <SuperAdminNotifications /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'system', element: <SystemPage /> },
    ],
  },
];

const protectedRoutes: RouteObject[] = dashboardRoleRoutes.map(({ path, children }) => ({
  path,
  element: <Outlet />,
  children,
}));

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
