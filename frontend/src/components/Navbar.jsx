import { Link } from 'react-router-dom';
import Button from './Button';

export default function Navbar() {
  return (
    <nav className="w-full py-4 px-8 flex justify-between items-center border-b border-gray-200/50 bg-[#F9F9F8]/80 backdrop-blur-md sticky top-0 z-50">
      <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900">
        CRASHR.
      </Link>
      <div className="flex gap-4">
        <Button variant="rounded" color="lavender">Host a Party</Button>
        <Button variant="rectangular" color="green">Log In</Button>
      </div>
    </nav>
  );
}