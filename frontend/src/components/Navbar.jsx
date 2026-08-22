import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { MapPin, Search } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Keep local state in sync with the URL
  const [searchCity, setSearchCity] = useState(searchParams.get('city') || '');

  // Update local state if URL changes externally
  useEffect(() => {
    setSearchCity(searchParams.get('city') || '');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/?city=${encodeURIComponent(searchCity.trim())}`);
    } else {
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 w-full z-50 bg-[#FDFBF7]/80 backdrop-blur-xl border-b border-[#292524]/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center gap-4">
        
        {/* Logo & Search Container */}
        <div className="flex items-center gap-6 md:gap-10 flex-1">
          <Link to="/" className="text-3xl font-black tracking-tighter text-[#292524] hover:text-[#D97706] transition-colors shrink-0">
            CRASHR.
          </Link>
          
          {/* Location Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center relative w-full max-w-xs group">
            <MapPin size={16} className="absolute left-4 text-[#78716C] group-focus-within:text-[#D97706] transition-colors" />
            <input 
              type="text" 
              placeholder="Search your town..." 
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full bg-white/60 border border-white/80 rounded-full py-2.5 pl-10 pr-10 text-sm font-bold text-[#292524] placeholder:text-[#78716C]/50 focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 shadow-sm transition-all"
            />
            <button type="submit" className="absolute right-3 p-1 text-[#78716C] hover:text-[#D97706] transition-colors">
              <Search size={14} strokeWidth={3} />
            </button>
          </form>
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-2 md:gap-6 shrink-0">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-6 mr-2">
                <Link to="/my-tickets" className={`text-sm font-bold transition-all duration-300 hover:text-[#D97706] ${isActive('/my-tickets') ? 'text-[#D97706]' : 'text-[#78716C]'}`}>
                  Tickets
                </Link>
                <Link to="/dashboard" className={`text-sm font-bold transition-all duration-300 hover:text-[#D97706] ${isActive('/dashboard') ? 'text-[#D97706]' : 'text-[#78716C]'}`}>
                  Dashboard
                </Link>
                <Link to="/profile" className={`text-sm font-bold transition-all duration-300 hover:text-[#D97706] ${isActive('/profile') ? 'text-[#D97706]' : 'text-[#78716C]'}`}>
                  Profile
                </Link>
                <button onClick={logout} className="text-sm font-bold text-[#78716C] hover:text-red-500 transition-all duration-300">
                  Log Out
                </button>
              </div>
              
              <Link to="/host" className="hover:scale-105 active:scale-95 transition-transform duration-300">
                <Button variant="rectangular" color="espresso" className="shadow-lg py-2 md:py-2.5 px-4 md:px-6 text-sm md:text-base">
                  Host a Party
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/auth" className="hover:scale-105 active:scale-95 transition-transform duration-300">
              <Button variant="rectangular" color="espresso" className="shadow-lg py-2.5">
                Log In
              </Button>
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}