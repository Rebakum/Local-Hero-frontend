import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '../Layouts/RootLayout';
import { HomePage } from '../Pages/home/HomePage';
import { ServicesPage } from '../Pages/servicespage/ServicesPage';
import { ProfessionalsPage } from '../Pages/professionals/ProfessionalsPage';
import { HowItWorksPage } from '../Pages/how-it-works/HowItWorksPage';
import { AboutPage } from '../Pages/about/AboutPage';
import { FaqPage } from '../Pages/faq/FaqPage';
import { NotFoundPage } from '../Pages/not-found/NotFoundPage';
import { ServiceDetailsPage } from '../Pages/service-details/ServiceDetailsPage';
import { ContactPage } from '../Pages/Contact/ContactPage';
import ProDetailsPage from '../Components/Sections/FeaturedPros/ProDetailsPage';
import AllCategoriesPage from '../Pages/AllCategories/AllCategoriesPage';
import LoginPage from '../Pages/login/LoginPage';
import RegisterPage from '../Pages/register/RegisterPage';
import DashboardLayout from '../Layouts/DashboardLayout';
import ProtectedRoute from '../Components/ProtectedRoute';
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
import Moderation from '../Pages/dashboard/admin/Moderation';
import TradesManagement from '../Pages/dashboard/admin/manage/TradesManagement';
import ProfessionalsManagement from '../Pages/dashboard/admin/manage/ProfessionalsManagement';
import BeforeAfterManagement from '../Pages/dashboard/admin/manage/BeforeAfterManagement';
import TestimonialsManagement from '../Pages/dashboard/admin/manage/TestimonialsManagement';
import BookingManagement from '../Pages/dashboard/admin/manage/BookingManagement';
import AdminPaymentHistory from '../Pages/dashboard/admin/manage/AdminPaymentHistory';
import ProfilePage from '../Pages/dashboard/profile/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'services/:id', element: <ServiceDetailsPage /> },
      { path: 'categories', element: <AllCategoriesPage /> },
      { path: 'professionals', element: <ProfessionalsPage /> },
      { path: 'professionals/:id', element: <ProDetailsPage /> },
      // { path: 'pros/:id', element: <ProDetailsPage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard/user" replace /> },

      {
        path: 'user',
        element: (
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'user/bookings',
        element: (
          <ProtectedRoute allowedRoles={['user']}>
            <MyBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: 'user/saved',
        element: (
          <ProtectedRoute allowedRoles={['user']}>
            <SavedPros />
          </ProtectedRoute>
        ),
      },

      {
        path: 'provider',
        element: (
          <ProtectedRoute allowedRoles={['serviceProvider']}>
            <ProviderDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'provider/leads',
        element: (
          <ProtectedRoute allowedRoles={['serviceProvider']}>
            <Leads />
          </ProtectedRoute>
        ),
      },
      {
        path: 'provider/jobs',
        element: (
          <ProtectedRoute allowedRoles={['serviceProvider']}>
            <MyJobs />
          </ProtectedRoute>
        ),
      },

      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/approvals',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminApprovals />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/moderation',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <Moderation />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/manage/trades',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <TradesManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/manage/professionals',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <ProfessionalsManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/manage/before-after',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <BeforeAfterManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/manage/testimonials',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <TestimonialsManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/manage/bookings',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <BookingManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/manage/payments',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminPaymentHistory />
          </ProtectedRoute>
        ),
      },

      {
        path: 'super-admin',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'super-admin/admin-approvals',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <SuperAdminApprovals />
          </ProtectedRoute>
        ),
      },
      {
        path: 'super-admin/user-approvals',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <SuperAdminProviderApprovals />
          </ProtectedRoute>
        ),
      },
      {
        path: 'super-admin/users',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'super-admin/system',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <SystemPage />
          </ProtectedRoute>
        ),
      },

      {
        path: 'user/apply-provider',
        element: (
          <ProtectedRoute allowedRoles={['user']}>
            <ProviderApplicationForm />
          </ProtectedRoute>
        ),
      },

      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
]);
