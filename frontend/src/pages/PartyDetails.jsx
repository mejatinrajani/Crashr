import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Music, Loader2, ArrowLeft, Lock, Ticket, CheckCircle2, Clock } from 'lucide-react';
import Button from '../components/Button';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { supabase } from '../services/supabase';
import { motion, AnimatePresence } from 'framer-motion';
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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);  

  useEffect(() => {
  const fetchPartyDetails = async () => {
    try {
      const response = await api.get(`/parties/${id}`);

      console.log("PARTY DETAILS:", response.data);

      setParty(response.data);
    } catch (err) {
      console.error("Error fetching party details:", err);
      setError(
        "We couldn't find this party. It may have been canceled or removed."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchPartyDetails();

  // Keep your existing Supabase subscription code here.

  return () => {
    supabase.removeChannel(channel);
  };
}, [id, user]);

const isHost = user?.id === party?.host_id;

const handlePayment = async () => {
  setIsPurchasing(true);

  try {
    const { data: ticketData } = await api.get(
      `/tickets/my-ticket/${id}`
    );

    await api.post(`/tickets/${ticketData.id}/pay`);

    setTicketStatus("confirmed");
    toast.success("Payment successful! You are on the list.");
  } catch (err) {
    console.error(err);
    toast.error("Payment failed. Please try again.");
  } finally {
    setIsPurchasing(false);
  }
};

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
      <div className="flex flex-col justify-center items-center min-h-screen gap-6 pt-20">
        <Loader2 className="animate-spin text-[#D97706]" size={56} strokeWidth={1.5} />
        <p className="text-[#D97706] font-bold tracking-[0.2em] uppercase text-sm animate-pulse">
          Locating the party...
        </p>
      </div>
    );
  }

  if (error || !party) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-40 text-center">
        <div className="bg-[#292524] text-[#FDFBF7] p-8 rounded-3xl font-bold tracking-tight shadow-xl shadow-[#292524]/10 border border-[#1C1917] mb-8">
          {error || "We couldn't find this party. It may have been canceled or removed."}
        </div>
        <Link to="/">
          <Button variant="rounded" color="gold">Back to the Feed</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden animate-in fade-in duration-700 selection:bg-amber-500/30">
      
      {/* 1. FULL SCREEN IMMERSIVE BACKGROUND */}
      <div className="fixed inset-0 z-0">
        {party.cover_image_url ? (
          <img 
            src={party.cover_image_url} 
            alt={party.title} 
            className="h-full w-full object-cover opacity-80 scale-105 transition-transform duration-[12000ms] ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#292524] to-[#1C1917]"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/20" />
<div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />
      </div>

      {/* 2. TOP FLOATING NAVIGATION */}
      <div className="fixed top-8 left-6 z-20">
        <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors shadow-lg">
          <ArrowLeft size={20} strokeWidth={3} />
        </Link>
      </div>

      {/* 3. THE FLOATING BOTTOM DOCK */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end p-4 md:p-8 pointer-events-none">
        
        
<div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-[2rem] border border-white/20 bg-black/35 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 md:rounded-[2.5rem] md:p-10 lg:flex lg:items-end lg:gap-10 pointer-events-auto">

          
          {/* Info Section */}
          <div className="flex-1 w-full text-white">
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              {party.requires_approval && (
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Lock size={12} /> Approval Required
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/20 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-amber-100">
  <Users size={12} />
  {party.capacity} Guest Limit
</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 leading-none">
              {party.title}
            </h1>
            
            <p className="text-white/70 font-medium text-lg mb-6 max-w-xl line-clamp-2">
              {party.description || "No description provided."}
            </p>

            <div className="flex flex-wrap gap-6 text-sm font-bold text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="text-[#D97706]" size={18} /> {formatDateTime(party.event_time)}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-[#D97706]" size={18} /> 
                {ticketStatus === 'confirmed' ? party.exact_address : `${party.location} (Hidden)`}
              </div>
            </div>
          </div>

          {/* Trigger Button (Replaces the massive checkout box) */}
          <div className="w-full md:w-auto shrink-0">
             <Button 
                onClick={() => setIsDrawerOpen(true)} 
                variant="rectangular" 
                color="gold" 
                className="w-full md:w-[240px] py-5 text-lg shadow-2xl shadow-amber-900/40"
              >
                Access Tickets
              </Button>
          </div>

        </div>
      </div>

      {/* 4. THE BOTTOM SHEET DRAWER (Framer Motion) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Darkened Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 cursor-pointer"
            />
            
            {/* The Drawer Panel */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 w-full z-50 flex justify-center pointer-events-none"
            >
              <div className="bg-[#FDFBF7] w-full max-w-2xl rounded-t-[2.5rem] p-8 pb-12 shadow-[0_-8px_32px_rgba(0,0,0,0.5)] pointer-events-auto border-t border-white/20">
                
                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-[#292524]/20 rounded-full mx-auto mb-8" />
                
                <div className="flex justify-between items-end mb-8 pb-8 border-b border-[#292524]/5">
                  <span className="text-5xl font-black tracking-tighter text-[#D97706] leading-none">
                    {formatCurrency(party.price)}
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-[#78716C] mb-1">
                    per guest
                  </span>
                </div>

                {/* Ticket Logic Gate */}
                <div className="w-full space-y-4">
                  {isHost ? (
                    <Link to="/dashboard">
                      <Button variant="rectangular" color="espresso" className="w-full py-5 text-lg">
                        Manage Guest List
                      </Button>
                    </Link>
                  ) : !ticketStatus ? (
                    <Button 
                      onClick={handlePurchaseTicket} 
                      variant="rectangular" 
                      color="gold" 
                      disabled={isPurchasing}
                      className="w-full py-5 text-lg shadow-amber-900/20 disabled:opacity-70"
                    >
                      {isPurchasing ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Request Ticket"}
                    </Button>
                  ) : ticketStatus === 'pending' ? (
                    <div className="bg-[#D97706]/10 text-[#D97706] p-5 rounded-2xl flex items-center justify-center gap-2 font-black tracking-wide border border-[#D97706]/20">
                      <Clock size={24} /> Request Pending
                    </div>
                  ) : ticketStatus === 'approved' ? (
                    <Button 
                      onClick={handlePayment} 
                      variant="rectangular" 
                      color="gold" 
                      disabled={isPurchasing}
                      className="w-full py-5 text-lg shadow-amber-900/20 animate-pulse disabled:opacity-70 disabled:animate-none"
                    >
                      {isPurchasing ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Pay to Confirm Spot"}
                    </Button>
                  ) : ticketStatus === 'confirmed' ? (
                    <div className="bg-[#292524] text-[#FDFBF7] p-5 rounded-2xl flex items-center justify-center gap-2 font-black tracking-wide shadow-md">
                      <CheckCircle2 size={24} /> You're Going!
                    </div>
                  ) : (
                    <div className="bg-gray-100 text-[#78716C] p-5 rounded-2xl flex items-center justify-center gap-2 font-black tracking-wide">
                      <Ticket size={24} /> On Waitlist
                    </div>
                  )}

                  {!user && !ticketStatus && (
                    <p className="text-[10px] text-center font-black uppercase tracking-widest text-red-400 mt-4">
                      Log in to join the list.
                    </p>
                  )}
                  
                  <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#78716C]/60">
                    <Lock size={10} /> Secure transaction via Crashr
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}