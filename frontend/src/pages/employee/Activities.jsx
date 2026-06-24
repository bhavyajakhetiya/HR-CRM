import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Activity } from 'lucide-react';

export default function EmployeeActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyInput, setDailyInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get('/activities');
        setActivities(res.data);
      } catch (err) {
        console.error('Failed to load activities', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const handleDailyInputSubmit = async () => {
    if (!dailyInput.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post('/activities', {
        action: 'Daily Input',
        details: dailyInput
      });
      setActivities([res.data, ...activities]);
      setDailyInput('');
    } catch (err) {
      console.error('Failed to submit daily input', err);
    } finally {
      setSubmitting(false);
    }
  };

  const hasSubmittedToday = activities.some(activity => {
    if (activity.action !== 'Daily Input') return false;
    const activityDate = new Date(activity.createdAt);
    const now = new Date();
    return activityDate.getDate() === now.getDate() &&
           activityDate.getMonth() === now.getMonth() &&
           activityDate.getFullYear() === now.getFullYear();
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Activity Log</h1>
          <p className="text-outline mt-1.5">A complete timeline of your actions.</p>
        </div>
      </div>

      {!loading && !hasSubmittedToday && (
        <div className="card border-2 border-primary/30 bg-surface-container-lowest p-6 mb-8 rounded-3xl">
          <div className="flex items-center gap-2 text-primary mb-2">
            <span className="material-symbols-outlined">check_circle</span>
            <h2 className="text-title-lg font-bold tracking-tight">Daily Input</h2>
          </div>
          <p className="text-outline text-body-md mb-4">
            Summarize your completed work for the day. You can only submit this once per day!
          </p>
          <textarea
            className="input-field min-h-[120px] resize-y mb-4 w-full bg-surface"
            placeholder="E.g., I screened 5 candidates today, scheduled 2 interviews, and closed the requirement for Client XYZ..."
            value={dailyInput}
            onChange={(e) => setDailyInput(e.target.value)}
          ></textarea>
          <button 
            className="btn-primary py-2.5 px-6 rounded-full"
            onClick={handleDailyInputSubmit}
            disabled={submitting || !dailyInput.trim()}
          >
            {submitting ? 'Submitting...' : (
              <>
                <span className="material-symbols-outlined text-[18px]">send</span>
                Submit Input
              </>
            )}
          </button>
        </div>
      )}

      <div className="card overflow-hidden rounded-3xl">
        {loading ? (
          <div className="py-20 text-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : activities.length === 0 ? (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-4xl text-outline mb-4 block">local_activity</span>
            <p className="text-outline">No activities logged yet.</p>
          </div>
        ) : (
          <div className="p-8">
            <div className="relative border-l border-outline-variant/50 ml-4 space-y-10 py-4">
              {activities.map(activity => (
                <div key={activity.id} className="relative pl-8">
                  <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-surface-container-highest border-2 border-surface flex items-center justify-center text-primary shadow-sm">
                    <Activity size={14} />
                  </div>
                  <div>
                    <h4 className="text-title-md font-bold text-on-surface">
                      {activity.employee?.name && (
                        <span className="text-primary mr-1.5">{activity.employee.name}</span>
                      )}
                      {activity.action}
                      {activity.candidate && <span className="text-primary ml-1">({activity.candidate.name})</span>}
                    </h4>
                    {activity.details && (
                      <p className="text-body-md text-on-surface-variant mt-1.5">{activity.details}</p>
                    )}
                    <p className="text-label-sm text-outline mt-2.5 font-medium">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
