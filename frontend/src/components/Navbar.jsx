import { Link } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, login, logout } = useAuth();

  return (
    <nav className="w-full py-4 px-8 flex justify-between items-center border-b border-gray-200/50 bg-[#F9F9F8]/80 backdrop-blur-md sticky top-0 z-50">
      <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900">
        CRASHR.
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/host">
              <Button variant="rounded" color="lavender">Host a Party</Button>
            </Link>
            <button onClick={logout} className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              Log Out
            </button>
          </>
        ) : (
          <Button onClick={login} variant="rectangular" color="green">Log In</Button>
        )}
      </div>
    </nav>
  );
}