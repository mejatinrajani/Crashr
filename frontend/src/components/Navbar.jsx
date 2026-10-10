import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Search, Menu, X, Ticket, LayoutDashboard, UserRound, LogOut, Plus, Sparkles, Compass } from 'lucide-react';

import Button from './Button';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchCity, setSearchCity] = useState(searchParams.get('city') || '');
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
    navigate(city ? `/?city=${encodeURIComponent(city)}` : '/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Tickets', path: '/my-tickets', icon: Ticket },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/profile', icon: UserRound },
  ];

  const navLinkClass = (path) =>
    `relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
      isActive(path)
        ? 'bg-[#D97706]/10 text-[#B45309]'
        : 'text-[#57534E] hover:bg-black/5 hover:text-[#292524]'
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full p- 3 sm:p-4 transition-all duration-300">
      {/* Removed the background, shadow, and borders I added earlier */}
      <div className="mx-auto flex h-[72px] max-w- items-center justify-between gap-4 rounded-[2rem] px-5 backdrop-blur-xl sm:px-8">

        {/* Brand */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="Crashr home"
        >
          {/* Logo: h-12 on mobile, scales back to your original h-32 on laptops */}
          <img 
            src="/crashr_logo.png" 
            alt="Crashr Logo" 
            className="h-12 md:h-20 lg:h-32 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />

          {/* Tagline: Hidden on mobile/tablets, uses your exact margins and sizing on laptops */}
          <span className="hidden lg:inline-block text-md -ml-16 mt-12 font-medium italic text-[#FD691D]">
            find your people........
          </span>
        </Link>

        {/* Desktop city search */}
        <form
          onSubmit={handleSearch}
          className="group relative mt-6 hidden w-full max-w-[280px] lg:block xl:max-w-[340px]"
        >
          <MapPin
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E] transition-colors group-focus-within:text-[#D97706]"
          />

          <input
            type="text"
            placeholder="Which city are we crashing?"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            aria-label="Search parties by city"
            className="w-full rounded-full border border-transparent bg-[FDFBF7] py-2.5 pl-11 pr-12 text-sm font-medium text-[#292524] outline-none placeholder:text-[#A8A29E] focus:border-[#D97706]/30 focus:bg-white focus:ring-4 focus:ring-[#D97706]/10"
          />

          <button
            type="submit"
            aria-label="Search city"
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#FDFBF7] text-white transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Search size={18} className='text-[#FD691D]' />
          </button>
        </form>

        {/* Desktop navigation */}
        <div className="hidden shrink-0 mt-6 items-center gap-4 lg:flex">
          {user ? (
            <>
              {navItems.map(({ label, path, icon: Icon }) => (
                <Link key={path} to={path} className={navLinkClass(path)}>
                  <Icon size={16} />
                  {label}
                </Link>
              ))}

              <div className="mx-2 h-6 w-px bg-black/10" />

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 rounded-full p-2 text-[#78716C] transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label="Log out"
              >
                <LogOut size={18} />
              </button>

              <Link to="/host" className="ml-1">
                <Button
                  variant="rectangular"
                  color="espresso"
                  className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Plus size={18} />
                  Host
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="rounded-full px-5 py-2.5 text-md font-bold text-[#57534E] transition-all"
              >
                Log in
              </Link>

              <Link to="/auth">
                <button
                  className="flex items-center !text-[#FD691D] bg-[#FDFBF7] gap-2 px-6 py-2.5 font-bold !shadow-none !transition-none !border-none"
                >
                  Join the fun
                  <Sparkles size={16} />
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Compact navigation for mobile and tablet */}
        <div className="flex shrink-0 items-center gap-3 lg:hidden">
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
              className="rounded-full bg-[#292524] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#D97706]"
            >
              Join
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-[#292524] transition-colors hover:bg-black/10"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute left-4 right-4 top-[88px] z-50 mt-2 rounded-[2rem] border border-[#292524]/10 bg-[#FDFBF7] p-5 shadow-2xl lg:hidden">
          <div className="flex flex-col space-y-4">
            
            <form onSubmit={handleSearch} className="relative w-full">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
              <input
                type="text"
                placeholder="Search by city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full rounded-full border border-black/10 bg-white py-3 pl-11 pr-12 text-sm font-medium text-[#292524] outline-none focus:border-[#D97706]/50 focus:ring-4 focus:ring-[#D97706]/10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#292524] text-white hover:bg-[#D97706]"
              >
                <Search size={15} />
              </button>
            </form>

            {user ? (
              <div className="flex flex-col gap-1 pt-2">
                {navItems.map(({ label, path, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-colors ${
                      isActive(path) ? 'bg-[#D97706]/10 text-[#B45309]' : 'text-[#57534E] hover:bg-black/5'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                ))}
                
                <div className="my-2 h-px w-full bg-black/5" />

                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Log out
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  to="/auth"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#292524] py-3 text-sm font-bold text-white transition-colors hover:bg-[#D97706]"
                >
                  <Sparkles size={18} />
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