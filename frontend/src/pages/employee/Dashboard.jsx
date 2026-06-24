import { useState, useEffect } from 'react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import { Building, Activity, Bell } from 'lucide-react';
import heroImg from '../../assets/hero.png';
import { Link } from 'react-router-dom';
import illustration from "../../assets/illustration.png";



export default function EmployeeDashboard() {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, noticesRes] = await Promise.all([
          api.get('/dashboard/employee'),
          api.get('/notices')
        ]);
        setData(dashRes.data);
        setNotices(noticesRes.data);
      } catch (err) {
        console.error('Failed to load employee dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="py-20 text-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
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
      {getGreeting()}, {user?.name || 'Recruiter'}
    </h2>
    <p className="text-white/80 text-body-md leading-relaxed">
      Let's find some great talent today. Your pipeline is moving — keep the momentum going.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 flex flex-col justify-center">
          <div>
            <p className="text-label-md font-semibold text-outline uppercase tracking-wider">My Assigned Clients</p>
            <h3 className="text-4xl font-bold text-on-surface mt-1">{metrics.myClientsCount || 0}</h3>
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-center">
          <div>
            <p className="text-label-md font-semibold text-outline uppercase tracking-wider">Recent Actions</p>
            <h3 className="text-4xl font-bold text-on-surface mt-1">{recentActivities.length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notices Board */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <Bell className="text-warning" size={24} /> System Notices
          </h2>
          <div className="space-y-4">
            {notices.length === 0 ? (
              <div className="card p-6 text-center text-outline">No current notices.</div>
            ) : (
              notices.slice(0, 5).map(notice => (
                <div key={notice.id} className="card p-5 border-l-4 border-l-warning">
                  <h4 className="font-bold text-on-surface">{notice.title}</h4>
                  <p className="text-body-sm text-on-surface-variant mt-2 line-clamp-3">{notice.content}</p>
                  <span className="text-label-xs text-outline block mt-3">
                    {new Date(notice.createdAt).toLocaleDateString()} by {notice.admin?.name || 'Admin'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <Activity className="text-primary" size={24} /> My Recent Activity
            </h2>
            <Link to="/employee/activities" className="text-primary hover:underline text-sm font-semibold flex items-center gap-1">
              View All <span className="material-symbols-outlined text-[16px] leading-none">arrow_forward</span>
            </Link>
          </div>
          <div className="card p-0 overflow-hidden">
            {recentActivities.length === 0 ? (
              <div className="p-10 text-center text-outline">No recent activities found.</div>
            ) : (
              <div className="divide-y divide-outline-variant/30">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div>
                        <p className="text-body-lg font-semibold text-on-surface">
                          {activity.action}
                          {activity.candidate && <span className="font-bold"> ({activity.candidate.name})</span>}
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
      </div>
    </div>
  );
}
