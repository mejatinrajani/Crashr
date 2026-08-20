import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Clock, Users, Music } from 'lucide-react';
import Button from '../components/Button';

export default function PartyDetails() {
  const { id } = useParams();
  // In production, you'd fetch the specific party data using this ID via Axios
  
  return (
    <div className="max-w-4xl mx-auto p-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#10B981] to-[#E9D5FF]"></div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Midnight Rooftop Chill</h1>
        <p className="text-xl text-[#6B21A8] font-medium mb-8">Hosted by Alex Mitchell</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-600">
          <div className="flex flex-col gap-2">
            <Calendar className="text-[#10B981]" />
            <span className="font-semibold text-gray-900">Date</span>
            <span className="text-sm">Oct 24, 2026</span>
          </div>
          <div className="flex flex-col gap-2">
            <Clock className="text-[#10B981]" />
            <span className="font-semibold text-gray-900">Time</span>
            <span className="text-sm">10:00 PM</span>
          </div>
          <div className="flex flex-col gap-2">
            <MapPin className="text-[#10B981]" />
            <span className="font-semibold text-gray-900">Location</span>
            <span className="text-sm">Downtown (Address revealed on purchase)</span>
          </div>
          <div className="flex flex-col gap-2">
            <Users className="text-[#10B981]" />
            <span className="font-semibold text-gray-900">Capacity</span>
            <span className="text-sm">50 Guests Max</span>
          </div>
        </div>
      </div>

      {/* About & Checkout Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">The Vibe</h2>
            <p className="text-gray-600 leading-relaxed">
              Join us for an exclusive rooftop gathering overlooking the city skyline. Expect good music, great company, and a relaxed atmosphere. BYOB is encouraged, but basic mixers and snacks will be provided. 
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Music size={24} className="text-[#6B21A8]" /> Sounds Like
            </h2>
            <div className="flex gap-2 flex-wrap">
              {['House', 'Lo-Fi', 'R&B'].map(genre => (
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
              <span className="text-3xl font-black text-[#10B981]">$15</span>
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