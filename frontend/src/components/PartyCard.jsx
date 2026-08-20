import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import Button from './Button';

export default function PartyCard({ party }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all duration-300 group">
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-[#10B981] transition-colors">
          {party.title}
        </h3>
        <p className="text-[#6B21A8] font-medium mb-3">Hosted by {party.host}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar size={16} /> {party.time}
          </span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin size={16} /> {party.location}
          </span>
        </div>
      </div>
      
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 border-t border-gray-50 md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
        <span className="text-2xl font-bold text-[#10B981]">{party.price}</span>
        {/* We link to a dynamic route for the party details */}
        <Link to={`/party/${party.id}`}>
          <Button variant="rectangular" color="green" className="w-full md:w-auto">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}