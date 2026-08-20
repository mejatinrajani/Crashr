import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Music, Loader2, ArrowLeft, Lock, Ticket, CheckCircle2, Clock } from 'lucide-react';
import Button from '../components/Button';
import api from '../services/api';
import { toast } from 'sonner';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, formatCurrency } from '../utils/formatters';

export default function PartyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [party, setParty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [ticketStatus, setTicketStatus] = useState(null); 

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

    // 1. Supabase Realtime Subscription
    const channel = supabase.channel('custom-ticket-channel')
      .on(
        'postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'tickets',
          filter: `party_id=eq.${id}` 
        }, 
        (payload) => {
          // If the host just approved THIS user's ticket on the dashboard
          if (payload.new.guest_id === user?.id) {
            setTicketStatus(payload.new.status);
            
            if (payload.new.status === 'confirmed') {
              toast.success("You're in! Your ticket was just approved.");
            } else if (payload.new.status === 'denied') {
              toast.error("Your ticket request was declined.");
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user]);

  const handlePurchaseTicket = async () => {
    if (!user) {
      toast.error("Please log in to purchase a ticket!");
      return;
    }

    setIsPurchasing(true);
    try {
      const response = await api.post('/tickets', { party_id: id });
      setTicketStatus(response.data.status);
      
      if (response.data.status === 'pending') {
        toast.success("Request sent! Waiting for host approval.");
      } else {
        toast.success("Ticket secured successfully!");
      }
    } catch (err) {
      console.error("Purchase error:", err);
      toast.error("Could not process ticket. You might already be on the list!"); 
    } finally {
      setIsPurchasing(false);
    }
  };

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

      {/* Cover Image */}
      {party.cover_image_url && (
        <div className="w-full h-64 md:h-80 rounded-3xl mb-8 overflow-hidden bg-gray-200">
          <img 
            src={party.cover_image_url} 
            alt={party.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
        {!party.cover_image_url && (
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#10B981] to-[#E9D5FF]"></div>
        )}
        
        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900">{party.title}</h1>
          {party.requires_approval && (
            <span className="bg-[#E9D5FF]/30 text-[#6B21A8] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Lock size={12} /> Approval Required
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3 mb-8">
          {party.profiles?.avatar_url ? (
            <img src={party.profiles.avatar_url} alt="Host" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#E9D5FF] flex items-center justify-center text-[#6B21A8] font-bold">
              {party.profiles?.full_name?.charAt(0) || '?'}
            </div>
          )}
          <p className="text-xl text-[#6B21A8] font-medium">
            Hosted by {party.profiles?.full_name || 'Anonymous Host'}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-600">
          <div className="flex flex-col gap-2">
            <Calendar className="text-[#10B981]" />
            <span className="font-semibold text-gray-900">When</span>
            <span className="text-sm">{formatDateTime(party.event_time)}</span>
          </div>
          
          <div className="flex flex-col gap-2">
            <MapPin className="text-[#10B981]" />
            <span className="font-semibold text-gray-900">Location</span>
            {ticketStatus === 'confirmed' ? (
              <span className="text-sm font-bold text-[#10B981]">{party.exact_address}</span>
            ) : (
              <span className="text-sm flex flex-col">
                {party.location}
                <span className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Lock size={10} /> Address hidden until confirmed
                </span>
              </span>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <Users className="text-[#10B981]" />
            <span className="font-semibold text-gray-900">Capacity</span>
            <span className="text-sm">{party.capacity} Guests Max</span>
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
        </div>

        {/* Sticky Ticket Box */}
        <div className="relative">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-24">
            <div className="flex justify-between items-end mb-6">
              <span className="text-3xl font-black text-[#10B981]">{formatCurrency(party.price)}</span>
              <span className="text-sm text-gray-500 font-medium">per guest</span>
            </div>

            {/* Dynamic Ticket Button Based on Status */}
            {!ticketStatus ? (
              <Button 
                onClick={handlePurchaseTicket} 
                variant="rounded" 
                color="green" 
                disabled={isPurchasing}
                className="w-full text-lg py-3 mb-3 disabled:opacity-70"
              >
                {isPurchasing ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Get Ticket"}
              </Button>
            ) : ticketStatus === 'confirmed' ? (
              <div className="bg-[#10B981]/10 text-[#10B981] p-4 rounded-xl flex items-center justify-center gap-2 font-bold mb-3">
                <CheckCircle2 size={20} /> You're Going!
              </div>
            ) : ticketStatus === 'pending' ? (
              <div className="bg-amber-50 text-amber-600 p-4 rounded-xl flex items-center justify-center gap-2 font-bold mb-3 border border-amber-200">
                <Clock size={20} /> Request Pending
              </div>
            ) : (
              <div className="bg-gray-100 text-gray-600 p-4 rounded-xl flex items-center justify-center gap-2 font-bold mb-3">
                <Ticket size={20} /> On Waitlist
              </div>
            )}

            {!user && !ticketStatus && (
              <p className="text-xs text-center text-red-400 font-medium mb-2">You must log in to buy a ticket.</p>
            )}
            <p className="text-xs text-center text-gray-400">Secure transaction via Crashr</p>
          </div>
        </div>
      </div>
    </div>
  );
}