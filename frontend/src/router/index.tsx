import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/types';

import LoginPage from '@/pages/LoginPage';

import TenantLayout from '@/pages/tenant/TenantLayout';
import TenantDashboard from '@/pages/tenant/TenantDashboard';
import NewRequest from '@/pages/tenant/NewRequest';
import MyRequests from '@/pages/tenant/MyRequests';
import TenantRequestDetail from '@/pages/tenant/RequestDetail';
import Help from '@/pages/tenant/Help';

import StaffLayout from '@/pages/staff/StaffLayout';
import StaffDashboard from '@/pages/staff/StaffDashboard';
import MyAssignments from '@/pages/staff/MyAssignments';
import StaffRequestDetail from '@/pages/staff/RequestDetail';

import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AllRequests from '@/pages/admin/AllRequests';
import Technicians from '@/pages/admin/Technicians';
import AdminRequestDetail from '@/pages/admin/RequestDetail';

function RequireAuth({ role }: { role: Role }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}

export function AppRouter() {
  return useRoutes([
    { path: '/', element: <LoginPage /> },

    {
      element: <RequireAuth role="TENANT" />,
      children: [{
        element: <TenantLayout />,
        children: [
          { path: '/tenant',              element: <TenantDashboard /> },
          { path: '/tenant/new-request',  element: <NewRequest /> },
          { path: '/tenant/my-requests',  element: <MyRequests /> },
          { path: '/tenant/requests/:id', element: <TenantRequestDetail /> },
          { path: '/tenant/help',         element: <Help /> },
        ],
      }],
    },

    {
      element: <RequireAuth role="STAFF" />,
      children: [{
        element: <StaffLayout />,
        children: [
          { path: '/staff',               element: <StaffDashboard /> },
          { path: '/staff/assignments',   element: <MyAssignments /> },
          { path: '/staff/requests/:id',  element: <StaffRequestDetail /> },
        ],
      }],
    },

    {
      element: <RequireAuth role="ADMIN" />,
      children: [{
        element: <AdminLayout />,
        children: [
          { path: '/admin',               element: <AdminDashboard /> },
          { path: '/admin/all-requests',  element: <AllRequests /> },
          { path: '/admin/technicians',   element: <Technicians /> },
          { path: '/admin/requests/:id',  element: <AdminRequestDetail /> },
        ],
      }],
    },

    { path: '*', element: <Navigate to="/" replace /> },
  ]);
}
