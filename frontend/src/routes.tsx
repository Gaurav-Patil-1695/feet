import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const VehiclesPage = lazy(() => import('./pages/VehiclesPage'));
const VehicleDetailPage = lazy(() => import('./pages/VehicleDetailPage'));
const VehicleNewPage = lazy(() => import('./pages/VehicleNewPage'));
const WorkOrdersPage = lazy(() => import('./pages/WorkOrdersPage'));
const WorkOrderDetailPage = lazy(() => import('./pages/WorkOrderDetailPage'));
const WorkOrderNewPage = lazy(() => import('./pages/WorkOrderNewPage'));
const SchedulesPage = lazy(() => import('./pages/SchedulesPage'));
const ScheduleDetailPage = lazy(() => import('./pages/ScheduleDetailPage'));
const ScheduleNewPage = lazy(() => import('./pages/ScheduleNewPage'));
const ServiceDuePage = lazy(() => import('./pages/ServiceDuePage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Vehicles */}
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/vehicles/new" element={<VehicleNewPage />} />
        <Route path="/vehicles/:vehicleId" element={<VehicleDetailPage />} />

        {/* Work Orders */}
        <Route path="/work-orders" element={<WorkOrdersPage />} />
        <Route path="/work-orders/new" element={<WorkOrderNewPage />} />
        <Route path="/work-orders/:workOrderId" element={<WorkOrderDetailPage />} />

        {/* Schedules */}
        <Route path="/schedules" element={<SchedulesPage />} />
        <Route path="/schedules/new" element={<ScheduleNewPage />} />
        <Route path="/schedules/:scheduleId" element={<ScheduleDetailPage />} />

        {/* Service Due */}
        <Route path="/service-due" element={<ServiceDuePage />} />

        {/* Users */}
        <Route path="/users" element={<UsersPage />} />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
