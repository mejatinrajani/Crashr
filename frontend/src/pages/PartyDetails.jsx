import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Music, Loader2, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import api from '../services/api';
import { formatDateTime, formatCurrency } from '../utils/formatters';

export default function PartyDetails() {
  const { id } = useParams();
  const [party, setParty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartyDetails = async () => {
      try {
        const response = await api.get(`/parties/${id}`);
        setParty(response.data);
      } catch (err) {
        console.error("Error fetching party details:", err);
        setError("We couldn't find this party. It may have been canceled or removed.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#10B981]" size={48} />
      </div>
    );
  }

  if (error || !party) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center pt-20">
        <div className="bg-red-50 text-red-500 p-8 rounded-2xl border border-red-100 font-medium mb-6">
          {error || "Party not found."}
        </div>
        <Link to="/">
          <Button variant="rounded" color="lavender">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 animate-in slide-in-from-bottom-4 duration-500">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#10B981] transition-colors mb-6 font-medium">
        <ArrowLeft size={20} /> Back to Feed
      </Link>

      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#10B981] to-[#E9D5FF]"></div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{party.title}</h1>
        <p className="text-xl text-[#6B21A8] font-medium mb-8">Hosted by Guest Host</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-600">
          <div className="flex flex-col gap-2">
            <Calendar className="text-[#10B981]" />
            <span className="font-semibold text-gray-900">When</span>
            <span className="text-sm">{formatDateTime(party.event_time)}</span>
          </div>
          <div className="flex flex-col gap-2">
            <MapPin className="text-[#10B981]" />
            <span className="font-semibold text-gray-900">Location</span>
            <span className="text-sm">{party.location}</span>
          </div>
          <div className="flex flex-col gap-2">
            <Users className="text-[#10B981]" />
            <span className="font-semibold text-gray-900">Capacity</span>
            <span className="text-sm">Limited Spots</span>
          </div>
        </div>
      </div>

      {/* About & Checkout Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">The Vibe</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {party.description || "No description provided by the host."}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Music size={24} className="text-[#6B21A8]" /> Sounds Like
            </h2>
            <div className="flex gap-2 flex-wrap">
              {/* You could eventually pull these tags dynamically from the backend */}
              {['House', 'Good Vibes', 'Chill'].map(genre => (
                <span key={genre} className="bg-[#E9D5FF]/30 text-[#6B21A8] px-4 py-1.5 rounded-full text-sm font-semibold">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Ticket Box */}
        <div className="relative">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-24">
            <div className="flex justify-between items-end mb-6">
              <span className="text-3xl font-black text-[#10B981]">{formatCurrency(party.price)}</span>
              <span className="text-sm text-gray-500 font-medium">per guest</span>
            </div>
            <Button variant="rounded" color="green" className="w-full text-lg py-3 mb-3">
              Buy Ticket
            </Button>
            <p className="text-xs text-center text-gray-400">Secure transaction powered by Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
}