import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PartyCard from '../components/PartyCard';
import Button from '../components/Button';
import api from '../services/api';
import { formatDateTime, formatCurrency } from '../utils/formatters';
import { Loader2, MapPinOff, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Connect to the URL Search Params
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchCity = searchParams.get('city') || '';

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

  // --- FILTERING LOGIC ---
  const filteredParties = searchCity
    ? parties.filter(p => p.location.toLowerCase().includes(searchCity.toLowerCase()))
    : parties;

  // --- FALLBACK LOGIC ---
  const noMatchesFound = searchCity && filteredParties.length === 0;
  // If no matches, grab the first 3 parties from the general list
  const fallbackParties = noMatchesFound ? parties.slice(0, 3) : [];
  const hasMoreFallbacks = noMatchesFound && parties.length > 3;

  const clearSearch = () => {
    navigate('/');
  };

  // Framer Motion Variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen pt-8 pb-24">
      
      {/* Dynamic Marquee Band */}
      <div className="w-full overflow-hidden whitespace-nowrap py-3 mb-12 border-y border-[#292524]/5 bg-white/40 backdrop-blur-md">
        <div className="inline-block font-black tracking-[0.2em] text-[#D97706]/40 uppercase text-xs sm:text-sm" style={{ animation: 'marquee 25s linear infinite' }}>
          LIVE PARTIES • EXCLUSIVE GUEST LISTS • FIND YOUR VIBE • NO BORING NIGHTS • LIVE PARTIES • EXCLUSIVE GUEST LISTS • FIND YOUR VIBE • NO BORING NIGHTS •
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Cinematic Hero Section */}
        <header className="mb-12 relative">
          <h1 className="text-6xl md:text-8xl font-black text-[#292524] mb-4 tracking-tighter leading-[0.9]">
            {searchCity ? (
              <>Parties in <br className="hidden md:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-[#92400E] capitalize">{searchCity}.</span></>
            ) : (
              <>Find your <br className="hidden md:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-[#92400E]">vibe.</span></>
            )}
          </h1>
        </header>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-6">
            <Loader2 className="animate-spin text-[#D97706]" size={56} strokeWidth={1.5} />
            <p className="text-[#D97706] font-bold tracking-[0.2em] uppercase text-sm animate-pulse">Curating the night...</p>
          </div>
        ) : error ? (
          <div className="bg-[#292524] text-[#FDFBF7] p-8 rounded-3xl text-center font-bold tracking-tight shadow-xl">{error}</div>
        ) : parties.length === 0 ? (
          <div className="text-center py-32 border border-[#292524]/5 rounded-[2.5rem] bg-white/40 backdrop-blur-md shadow-sm">
            <p className="text-[#78716C] text-xl font-bold tracking-tight mb-4">The city is quiet tonight.</p>
          </div>
        ) : noMatchesFound ? (
          /* NO MATCHES FOUND - THE FALLBACK UI */
          <div className="animate-in fade-in duration-500">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 md:p-12 rounded-[2.5rem] shadow-sm mb-12 text-center">
              <MapPinOff size={48} className="mx-auto text-[#D97706]/40 mb-6" />
              <h3 className="text-3xl font-black text-[#292524] tracking-tight mb-3">
                No parties found in <span className="capitalize text-[#D97706]">{searchCity}</span>
              </h3>
              <p className="text-[#78716C] font-medium text-lg mb-8 max-w-xl mx-auto">
                Be the first to host an event in your town, or check out what's happening in other areas below.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button onClick={clearSearch} variant="rectangular" color="espresso" className="w-full sm:w-auto px-8">
                  View All Cities
                </Button>
                <Button onClick={() => alert("Geolocation feature coming soon!")} variant="rectangular" color="white" className="w-full sm:w-auto px-8 gap-2 border border-[#292524]/10 bg-white">
                  <Compass size={18} className="text-[#D97706]" /> Search Nearby Areas
                </Button>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[#78716C]">Trending in other towns</h4>
            </div>

            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {fallbackParties.map((party) => (
                <motion.div key={party.id} variants={item} className="col-span-1 h-full">
                  <PartyCard party={{ ...party, time: formatDateTime(party.event_time), price: formatCurrency(party.price) }} />
                </motion.div>
              ))}
            </motion.div>

            {hasMoreFallbacks && (
              <div className="mt-12 text-center">
                <Button onClick={clearSearch} variant="rectangular" color="gold" className="px-12 py-4 shadow-xl shadow-amber-900/20">
                  View More Parties
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* NORMAL BENTO GRID - MATCHES FOUND */
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {filteredParties.map((party, index) => {
              const isHero = index === 0;
              const isWide = index === 3 || index === 6;
              return (
                <motion.div key={party.id} variants={item} className={`relative ${isHero ? 'md:col-span-2 md:row-span-2' : isWide ? 'md:col-span-2' : 'col-span-1'} h-full`}>
                  <PartyCard party={{ ...party, time: formatDateTime(party.event_time), price: formatCurrency(party.price) }} />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}