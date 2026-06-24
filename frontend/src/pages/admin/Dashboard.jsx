import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Briefcase, FileText, Activity } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import heroImg from '../../assets/hero.png';
import { Link } from 'react-router-dom';
import illustration from "../../assets/illustration.png";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/dashboard/admin');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-outline text-body-md">Loading dashboard...</p>
      </div>
    );
  }

  const { metrics, recentActivities } = data || { metrics: {}, recentActivities: [] };

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  return (
   <div className="space-y-8 pb-12">
  {/* Welcome Banner */}
  <div className="relative overflow-hidden rounded-3xl bg-gradient-primary px-6 py-4 flex items-center justify-between">
    <div className="space-y-1 max-w-md relative z-10 text-left">
      <h2 className="text-xl font-extrabold text-white leading-tight">
        {getGreeting()}, Admin
      </h2>
      <p className="text-white/80 text-body-sm leading-relaxed">
        Here's how your agency is running today.
      </p>
    </div>

    <div className="hidden md:block relative h-40 z-10 self-stretch -my-4 -mr-6">
      <img
        src={illustration}
        alt=""
        className="w-full h-full object-contain"
      />
    </div>
    
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-white/5 rounded-full blur-xl -mb-16 pointer-events-none"></div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex flex-col justify-center">
          <div>
            <p className="text-label-md font-semibold text-outline uppercase tracking-wider">Total Clients</p>
            <h3 className="text-4xl font-bold text-on-surface mt-1">{metrics.totalClients || 0}</h3>
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-center">
          <div>
            <p className="text-label-md font-semibold text-outline uppercase tracking-wider">Total Employees</p>
            <h3 className="text-4xl font-bold text-on-surface mt-1">{metrics.totalEmployees || 0}</h3>
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-center">
          <div>
            <p className="text-label-md font-semibold text-outline uppercase tracking-wider">Total Candidates</p>
            <h3 className="text-4xl font-bold text-on-surface mt-1">{metrics.totalCandidates || 0}</h3>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 bg-surface-container-lowest flex items-center justify-between">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <Activity className="text-primary" size={24} /> Recent Activities
          </h2>
          <Link to="/admin/activities" className="text-primary hover:underline text-sm font-semibold flex items-center gap-1">
            View All <span className="material-symbols-outlined text-[16px] leading-none">arrow_forward</span>
          </Link>
        </div>
        
        {recentActivities.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-outline">No recent activities found.</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/30">
            {recentActivities.map(activity => (
              <div key={activity.id} className="p-6 hover:bg-surface-container-low transition-colors">
                <div className="flex items-start gap-4">
                  <div>
                    <p className="text-body-lg font-semibold text-on-surface">
                      <span className="text-primary">{activity.employee?.name || 'Unknown Employee'}</span>
                      {' '} {activity.action} {' '}
                      {activity.candidate && <span className="font-bold">({activity.candidate.name})</span>}
                    </p>
                    {activity.details && (
                      <p className="text-body-md text-on-surface-variant mt-1">{activity.details}</p>
                    )}
                    <p className="text-label-sm text-outline mt-2">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
