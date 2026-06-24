import useAuthStore from '../../store/authStore';

export default function EmployeeSettings() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Account Settings</h1>
          <p className="text-outline mt-1.5">Manage your personal profile.</p>
        </div>
      </div>

      <div className="card max-w-2xl p-8 space-y-6">
        <h3 className="text-title-lg font-bold border-b border-outline-variant/30 pb-4">Personal Details</h3>
        <div className="space-y-4">
          <div>
            <label className="input-label">Full Name</label>
            <input type="text" className="input-field" defaultValue={user?.name || ''} disabled />
            <p className="text-label-sm text-outline mt-1">Contact your admin to change your name.</p>
          </div>
          <div>
            <label className="input-label">Email Address</label>
            <input type="email" className="input-field" defaultValue={user?.email || ''} disabled />
          </div>
        </div>

        <h3 className="text-title-lg font-bold border-b border-outline-variant/30 pb-4 mt-8">Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary" defaultChecked />
            <span className="text-body-md">Receive email alerts for new client assignments</span>
          </label>
        </div>

        <div className="pt-6">
          <button className="btn-primary px-8">Save Preferences</button>
        </div>
      </div>
    </div>
  );
}
