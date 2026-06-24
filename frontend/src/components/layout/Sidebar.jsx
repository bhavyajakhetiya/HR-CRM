import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Menu, ChevronLeft } from 'lucide-react';

export default function Sidebar({ links, isCollapsed, onToggle }) {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`fixed left-0 top-0 h-full flex flex-col p-6 gap-y-4 glass-sidebar z-30 transition-all duration-300 ${isCollapsed ? 'w-[80px] px-2' : 'w-[280px]'}`}>
      <div className={`flex items-center mb-8 relative ${isCollapsed ? 'justify-center w-full' : 'gap-3 px-2'}`}>
        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain flex-shrink-0" />
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap opacity-100 transition-opacity">
            <h1 className="text-xl font-bold text-primary leading-none">HR CRM</h1>
            <p className="text-[10px] tracking-wider uppercase text-outline font-semibold">Elevate HR</p>
          </div>
        )}

        {/* Toggle Button */}
        <button 
          onClick={onToggle}
          className={`absolute flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md border border-outline-variant/50 text-outline hover:text-primary transition-all z-40 ${
            isCollapsed ? '-right-5 top-14' : '-right-9 top-1/2 -translate-y-1/2'
          }`}
          title="Toggle Sidebar"
        >
          {isCollapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 space-y-2 w-full">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            title={isCollapsed ? link.label : undefined}
            className={({ isActive }) => {
              const base = `flex items-center rounded-xl transition-all duration-150 cursor-pointer overflow-hidden ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}`;
              const active = isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-outline hover:bg-primary-fixed hover:text-primary';
              return `${base} ${active}`;
            }}
          >
            <span className="material-symbols-outlined flex-shrink-0">{link.icon}</span>
            {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto w-full">
        <button 
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={`flex items-center text-outline hover:text-error transition-colors rounded-xl font-medium text-sm w-full overflow-hidden ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}`}
        >
          <span className="material-symbols-outlined flex-shrink-0">logout</span>
          {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
