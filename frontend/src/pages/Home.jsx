import { useState, useEffect } from 'react';
import PartyCard from '../components/PartyCard';
import api from '../services/api';
import { formatDateTime, formatCurrency } from '../utils/formatters';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await api.get('/parties');
        setParties(response.data);
      } catch (err) {
        console.error("Error fetching parties:", err);
        setError("Failed to load parties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-500">
      <header className="mb-12 mt-8">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
          Find your <span className="text-[#10B981]">vibe.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          Discover exclusive, vetted house parties happening around you tonight.
        </p>
      </header>

      {/* State Management UI */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#10B981]" size={48} />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 text-center font-medium">
          {error}
        </div>
      ) : parties.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          No parties happening right now. Be the first to host one!
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {parties.map((party) => (
            <PartyCard 
              key={party.id} 
              party={{
                ...party,
                // Formatting data for the PartyCard component
                time: formatDateTime(party.event_time),
                price: formatCurrency(party.price),
                host: "Host" // We can fetch host profiles later if you add a users table
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}