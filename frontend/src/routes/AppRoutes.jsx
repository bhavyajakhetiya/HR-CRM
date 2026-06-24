import { Routes, Route, Navigate } from 'react-router-dom'
import UnifiedLogin from '../pages/public/UnifiedLogin'
import DashboardLayout from '../layouts/DashboardLayout'

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard'
import AdminClients from '../pages/admin/Clients'
import AdminEmployees from '../pages/admin/Employees'
import Candidates from '../pages/shared/Candidates'
import AdminReports from '../pages/admin/Reports'
import AdminNotices from '../pages/admin/Notices'
import AdminSettings from '../pages/admin/Settings'

// Employee Pages
import EmployeeDashboard from '../pages/employee/Dashboard'
import EmployeeClients from '../pages/employee/Clients'
import EmployeeActivities from '../pages/employee/Activities'
import EmployeeSettings from '../pages/employee/Settings'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<UnifiedLogin />} />

      {/* Auth */}
      {/* (Old login routes removed, unified at root) */}

      {/* Admin Dashboard */}
      <Route path="/admin/dashboard"     element={<DashboardLayout requiredRole="admin"><AdminDashboard /></DashboardLayout>} />
      <Route path="/admin/clients"       element={<DashboardLayout requiredRole="admin"><AdminClients /></DashboardLayout>} />
      <Route path="/admin/employees"     element={<DashboardLayout requiredRole="admin"><AdminEmployees /></DashboardLayout>} />
      <Route path="/admin/candidates"    element={<DashboardLayout requiredRole="admin"><Candidates /></DashboardLayout>} />
      <Route path="/admin/activities"    element={<DashboardLayout requiredRole="admin"><EmployeeActivities /></DashboardLayout>} />
      <Route path="/admin/reports"       element={<DashboardLayout requiredRole="admin"><AdminReports /></DashboardLayout>} />
      <Route path="/admin/notices"       element={<DashboardLayout requiredRole="admin"><AdminNotices /></DashboardLayout>} />
      <Route path="/admin/settings"      element={<DashboardLayout requiredRole="admin"><AdminSettings /></DashboardLayout>} />

      {/* Employee Dashboard */}
      <Route path="/employee/dashboard"  element={<DashboardLayout requiredRole="employee"><EmployeeDashboard /></DashboardLayout>} />
      <Route path="/employee/clients"    element={<DashboardLayout requiredRole="employee"><EmployeeClients /></DashboardLayout>} />
      <Route path="/employee/candidates" element={<DashboardLayout requiredRole="employee"><Candidates /></DashboardLayout>} />
      <Route path="/employee/activities" element={<DashboardLayout requiredRole="employee"><EmployeeActivities /></DashboardLayout>} />
      <Route path="/employee/settings"   element={<DashboardLayout requiredRole="employee"><EmployeeSettings /></DashboardLayout>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
