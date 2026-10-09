import { useState, useEffect } from 'react';
import {Link,useLocation,useNavigate,useSearchParams} from 'react-router-dom';
import {MapPin,Search,Menu,X,Ticket,LayoutDashboard,UserRound,LogOut,Plus,Sparkles} from 'lucide-react';

import Button from './Button';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchCity, setSearchCity] = useState(
    searchParams.get('city') || ''
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setSearchCity(searchParams.get('city') || '');
  }, [searchParams]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();

    const city = searchCity.trim();

    navigate(
      city ? `/?city=${encodeURIComponent(city)}` : '/'
    );

    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      label: 'Tickets',
      path: '/my-tickets',
      icon: Ticket,
    },
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: UserRound,
    },
  ];

  const navLinkClass = (path) =>
    `relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold transition-all duration-200 ${
      isActive(path)
        ? 'bg-[#D97706]/10 text-[#B45309]'
        : 'text-[#57534E] hover:bg-white/70 hover:text-[#B45309]'
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#292524]/[0.07] bg-[#FDFBF7]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-76px max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2"
          aria-label="Crashr home"
        >
          <span className="relative text-[27px] font-black tracking-[-1.8px] text-[#292524] transition-transform duration-200 group-hover:scale-[1.03] sm:text-3xl">
            CRASHR
            <span className="text-[#F97316]">.</span>
          </span>

          <span className="hidden rounded-full bg-[#F97316]/10 px-2 py-1 text-[9px] font-black uppercase tracking-[1.2px] text-[#C2410C] sm:inline-block">
            Find your crowd
          </span>
        </Link>

        {/* Desktop city search */}
        <form
          onSubmit={handleSearch}
          className="group relative hidden w-full max-w-300px sm:block lg:max-w-340px"
        >
          <MapPin
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E] transition-colors group-focus-within:text-[#D97706]"
          />

          <input
            type="text"
            placeholder="Which city are we crashing?"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            aria-label="Search parties by city"
            className="w-full rounded-full border border-[#292524]/10 bg-white/70 py-3 pl-11 pr-12 text-sm font-semibold text-[#292524] outline-none transition-all duration-200 placeholder:font-medium placeholder:text-[#A8A29E] hover:border-[#D97706]/30 focus:border-[#D97706]/50 focus:bg-white focus:ring-4 focus:ring-[#D97706]/10"
          />

          <button
            type="submit"
            aria-label="Search city"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#292524] text-white transition-all duration-200 hover:scale-105 hover:bg-[#D97706] active:scale-95"
          >
            <Search size={15} />
          </button>
        </form>

        {/* Desktop navigation */}
        <div className="hidden shrink-0 items-center gap-1 lg:flex">
          {user ? (
            <>
              {navItems.map(({ label, path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={navLinkClass(path)}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}

              <button
                type="button"
                onClick={logout}
                className="ml-1 flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-[#78716C] transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={16} />
                Log out
              </button>

              <Link
                to="/host"
                className="ml-2"
              >
                <Button
                  variant="rectangular"
                  color="espresso"
                  className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Plus size={17} />
                  Host a Party
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="rounded-full px-4 py-2.5 text-sm font-bold text-[#57534E] transition-colors hover:bg-white hover:text-[#D97706]"
              >
                Log in
              </Link>

              <Link to="/auth">
                <Button
                  variant="rectangular"
                  color="espresso"
                  className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Sparkles size={16} />
                  Join the fun
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Compact navigation for mobile and tablet */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          {user && (
            <Link
              to="/host"
              aria-label="Host a party"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#292524] text-white shadow-sm transition-all hover:scale-105 hover:bg-[#D97706] active:scale-95"
            >
              <Plus size={20} />
            </Link>
          )}

          {!user && (
            <Link
              to="/auth"
              className="rounded-full bg-[#292524] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#D97706]"
            >
              Join
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#292524]/10 bg-white/70 text-[#292524] transition-colors hover:bg-white"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-[#292524]/10 bg-[#FDFBF7] px-4 pb-5 pt-3 shadow-xl lg:hidden">
          <div className="mx-auto max-w-7xl space-y-4">

            <form onSubmit={handleSearch} className="relative sm:hidden">
              <MapPin
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"
              />

              <input
                type="text"
                placeholder="Search by city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                aria-label="Search parties by city"
                className="w-full rounded-full border border-[#292524]/10 bg-white py-3 pl-11 pr-12 text-sm font-semibold text-[#292524] outline-none focus:border-[#D97706]/50 focus:ring-4 focus:ring-[#D97706]/10"
              />

              <button
                type="submit"
                aria-label="Search city"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#292524] text-white hover:bg-[#D97706]"
              >
                <Search size={15} />
              </button>
            </form>

            {user ? (
              <>
                <div className="space-y-1">
                  {navItems.map(({ label, path, icon: Icon }) => (
                    <Link
                      key={path}
                      to={path}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                        isActive(path)
                          ? 'bg-[#D97706]/10 text-[#B45309]'
                          : 'text-[#57534E] hover:bg-white hover:text-[#B45309]'
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </Link>
                  ))}
                </div>

                <Link
                  to="/host"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#292524] px-4 py-3 font-bold text-white transition-colors hover:bg-[#D97706]"
                >
                  <Plus size={18} />
                  Host a Party
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Log out
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/auth"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#292524] px-4 py-3 font-bold text-white transition-colors hover:bg-[#D97706]"
                >
                  <Sparkles size={17} />
                  Join the fun
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}