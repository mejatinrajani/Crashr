import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import Button from './Button';

export default function PartyCard({ party }) {
  // Fallback name if the user hasn't set one up yet
  const hostName = party.profiles?.full_name || 'Anonymous Host';

  return (
    <div className="bg-white/40 backdrop-blur-lg p-6 md:p-8 rounded-3xl border border-white/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_4px_20px_rgba(217,119,6,0.03)] hover:shadow-[0_8px_30px_rgba(217,119,6,0.08)] hover:-translate-y-1.5 transition-all duration-500 ease-out group relative overflow-hidden">
      
      {/* Subtle ambient glow effect on hover */}
      <div className="absolute -inset-24 bg-gradient-to-br from-[#D97706]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-full blur-3xl"></div>

      <div className="flex-1 relative z-10">
        <h3 className="text-2xl md:text-3xl font-black tracking-tight text-[#292524] mb-3 group-hover:text-[#D97706] transition-colors duration-300">
          {party.title}
        </h3>
        
        {/* Dynamic Host Section */}
        <div className="flex items-center gap-3 mb-5">
          {party.profiles?.avatar_url ? (
            <img src={party.profiles.avatar_url} alt={hostName} className="w-8 h-8 rounded-full object-cover shadow-sm border border-white" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#D97706]/10 flex items-center justify-center text-[#D97706] text-xs font-bold border border-[#D97706]/20">
              {hostName.charAt(0)}
            </div>
          )}
          <p className="text-[#57534E] font-bold text-xs tracking-wider uppercase">Hosted by {hostName}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 text-sm font-bold text-[#78716C]">
          <span className="flex items-center gap-2">
            <Calendar size={18} className="text-[#D97706]" /> {party.time}
          </span>
          <span className="hidden sm:inline text-[#D97706]/30">•</span>
          <span className="flex items-center gap-2">
            <MapPin size={18} className="text-[#D97706]" /> {party.location}
          </span>
        </div>
      </div>
      
      {/* Price & Action Section */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 border-t border-[#292524]/5 md:border-t-0 pt-5 md:pt-0 mt-4 md:mt-0 relative z-10">
        <span className="text-3xl font-black tracking-tighter text-[#D97706]">{party.price}</span>
        <Link to={`/party/${party.id}`} className="w-full md:w-auto">
          <Button variant="rectangular" color="gold" className="w-full md:w-auto">
            View Details
          </Button>
        </Link>
      </div>
      
    </div>
  );
}