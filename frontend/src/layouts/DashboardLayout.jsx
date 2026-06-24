import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';


const ADMIN_LINKS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/admin/clients', label: 'Clients', icon: 'domain' },
  { path: '/admin/employees', label: 'Employees', icon: 'badge' },
  { path: '/admin/candidates', label: 'Candidates', icon: 'groups' },
  { path: '/admin/activities', label: 'Activities', icon: 'local_activity' },
  { path: '/admin/reports', label: 'Reports', icon: 'analytics' },
  { path: '/admin/notices', label: 'Notices', icon: 'campaign' },
  { path: '/admin/settings', label: 'Settings', icon: 'settings' },
];

const EMPLOYEE_LINKS = [
  { path: '/employee/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/employee/clients', label: 'My Clients', icon: 'domain' },
  { path: '/employee/candidates', label: 'Candidate Pool', icon: 'groups' },
  { path: '/employee/activities', label: 'Activities', icon: 'local_activity' },
  { path: '/employee/settings', label: 'Settings', icon: 'settings' },
];

export default function DashboardLayout({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const currentRole = user?.role || requiredRole;

  // Redirect to login if not authenticated
  if (!isAuthenticated || (user?.role !== requiredRole)) {
    return <Navigate to={`/${requiredRole}/login`} state={{ from: location }} replace />;
  }

  let links = [];
  if (currentRole === 'admin') links = ADMIN_LINKS;
  if (currentRole === 'employee') links = EMPLOYEE_LINKS;

  return (
    <div className="min-h-screen bg-surface overflow-hidden">
      <Sidebar 
        links={links} 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <Header isCollapsed={isSidebarCollapsed} />

      <main 
        className={`pt-20 h-screen overflow-y-auto scrollbar-thin px-8 pb-10 transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-[80px]' : 'ml-[280px]'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
