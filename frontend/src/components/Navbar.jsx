import { Link } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, login, logout } = useAuth();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50">
      <nav className="glass-panel w-full flex justify-between items-center px-6 py-3 rounded-full">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-black tracking-tighter text-[#292524] hover:text-[#D97706] transition-colors"
        >
          CRASHR.
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center">
          {user ? (
            <div className="flex items-center gap-6">
              <Link 
                to="/my-tickets" 
                className="text-sm font-bold text-[#78716C] hover:text-[#D97706] transition-all duration-300 hover:-translate-y-0.5"
              >
                Tickets
              </Link>
              <Link 
                to="/dashboard" 
                className="text-sm font-bold text-[#78716C] hover:text-[#D97706] transition-all duration-300 hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                className="text-sm font-bold text-[#78716C] hover:text-[#D97706] transition-all duration-300 hover:-translate-y-0.5"
              >
                Profile
              </Link>
              <button 
                onClick={logout} 
                className="text-sm font-bold text-[#78716C] hover:text-[#D97706] transition-all duration-300 hover:-translate-y-0.5"
              >
                Log Out
              </button>
              
              {/* Wrapped the button in a div with a scale animation for that satisfying tactile feel */}
              <Link to="/host" className="ml-2 hover:scale-105 active:scale-95 transition-transform duration-300">
                <Button variant="rounded" color="lavender">Host a Party</Button>
              </Link>
            </div>
          ) : (
            <Link to="/auth" className="hover:scale-105 active:scale-95 transition-transform duration-300">
              <Button variant="rectangular" color="green">Log In</Button>
            </Link>
          )}
        </div>
        
      </nav>
    </div>
  );
}