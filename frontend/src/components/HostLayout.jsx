import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, CalendarPlus, Settings, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HostLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/dashboard', label: 'Command Center' },
    { icon: CalendarPlus, path: '/host', label: 'New Party' },
    { icon: Settings, path: '/profile', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex overflow-hidden selection:bg-[#D97706]/20">
      
      {/* VERTICAL SIDEBAR (Glassmorphism) */}
      <nav className="w-20 fixed inset-y-0 left-0 z-50 flex flex-col items-center py-8 bg-white/30 backdrop-blur-2xl border-r border-white/60 shadow-[4px_0_24px_rgba(217,119,6,0.02)]">
        <Link to="/" className="text-xl font-black tracking-tighter text-[#292524] mb-12 hover:text-[#D97706] transition-colors">
          C.
        </Link>
        
        <div className="flex flex-col gap-6 flex-1 w-full px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-[#D97706] text-white shadow-lg shadow-amber-900/20' : 'text-[#78716C] hover:bg-white/60 hover:text-[#D97706]'}`}
                title={item.label}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            );
          })}
        </div>

        <button onClick={logout} className="w-12 h-12 rounded-2xl text-[#78716C] flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all mt-auto" title="Log Out">
          <LogOut size={20} />
        </button>
      </nav>

      {/* HORIZONTAL TOP-BAR (Invisible Background) */}
      <header className="fixed top-0 left-20 right-0 h-24 z-40 flex items-center justify-end px-8 md:px-12 pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          <button className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center text-[#292524] hover:bg-white transition-all shadow-sm">
            <Bell size={20} />
          </button>
          <Link to="/profile" className="w-12 h-12 rounded-full bg-[#D97706]/10 border-2 border-white shadow-sm overflow-hidden hover:scale-105 transition-transform flex items-center justify-center text-[#D97706] font-black">
             {user?.email?.charAt(0).toUpperCase() || '?'}
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT CANVAS */}
      <main className="flex-1 ml-20 pt-24 px-8 md:px-12 pb-24 h-screen overflow-y-auto">
        {/* Outlet renders the nested routes (Dashboard, CreateParty, EditParty) */}
        <Outlet />
      </main>
    </div>
  );
}