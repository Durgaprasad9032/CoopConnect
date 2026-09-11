import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Common components
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

// Pages
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RoleSelectPage } from '../pages/auth/RoleSelectPage';

// Layouts
import { CustomerLayout } from '../layouts/CustomerLayout';
import { WorkerLayout } from '../layouts/WorkerLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Customer Pages
import { CustomerDashboard } from '../pages/customer/CustomerDashboard';
import { FindServicesPage } from '../pages/customer/FindServicesPage';
import { BookingWizardPage } from '../pages/customer/BookingWizardPage';
import { MyBookingsPage } from '../pages/customer/MyBookingsPage';
import { TrackWorkerPage } from '../pages/customer/TrackWorkerPage';
import { InvoicesPage } from '../pages/customer/InvoicesPage';
import { ReviewsPage } from '../pages/customer/ReviewsPage';
import { CustomerProfilePage } from '../pages/customer/CustomerProfilePage';

// Worker Pages
import { WorkerDashboard } from '../pages/worker/WorkerDashboard';
import { JobRequestsPage } from '../pages/worker/JobRequestsPage';
import { MyJobsPage } from '../pages/worker/MyJobsPage';
import { AvailabilityPage } from '../pages/worker/AvailabilityPage';
import { SkillPassportPage } from '../pages/worker/SkillPassportPage';
import { WorkerEarningsPage } from '../pages/worker/WorkerEarningsPage';
import { WelfarePage } from '../pages/worker/WelfarePage';
import { WorkerRatingsPage } from '../pages/worker/WorkerRatingsPage';
import { WorkerProfilePage } from '../pages/worker/WorkerProfilePage';

// Admin Pages
import { AdminOverviewPage } from '../pages/admin/AdminOverviewPage';
import { AdminWorkersPage } from '../pages/admin/AdminWorkersPage';
import { AdminCustomersPage } from '../pages/admin/AdminCustomersPage';
import { AdminCooperativesPage } from '../pages/admin/AdminCooperativesPage';
import { AdminServicesPage } from '../pages/admin/AdminServicesPage';
import { AdminBookingsPage } from '../pages/admin/AdminBookingsPage';
import { AdminDisputesPage } from '../pages/admin/AdminDisputesPage';
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing & Authentication */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <LandingPage />
            <Footer />
          </>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/role-select" element={<RoleSelectPage />} />

      {/* Customer Routes (Protected: customer role only) */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="services" element={<FindServicesPage />} />
        <Route path="book" element={<BookingWizardPage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="track" element={<TrackWorkerPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="profile" element={<CustomerProfilePage />} />
      </Route>

      {/* Worker Routes (Protected: worker role only) */}
      <Route
        path="/worker"
        element={
          <ProtectedRoute allowedRoles={['worker']}>
            <WorkerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/worker/dashboard" replace />} />
        <Route path="dashboard" element={<WorkerDashboard />} />
        <Route path="requests" element={<JobRequestsPage />} />
        <Route path="jobs" element={<MyJobsPage />} />
        <Route path="availability" element={<AvailabilityPage />} />
        <Route path="skill-passport" element={<SkillPassportPage />} />
        <Route path="earnings" element={<WorkerEarningsPage />} />
        <Route path="welfare" element={<WelfarePage />} />
        <Route path="ratings" element={<WorkerRatingsPage />} />
        <Route path="profile" element={<WorkerProfilePage />} />
      </Route>

      {/* Admin Routes (Protected: admin role only) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminOverviewPage />} />
        <Route path="workers" element={<AdminWorkersPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="cooperatives" element={<AdminCooperativesPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="disputes" element={<AdminDisputesPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
