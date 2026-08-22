import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Loader2, Ticket, CheckCircle2, Clock, MapPin, Calendar } from 'lucide-react';
import Button from '../components/Button';
import { formatDateTime } from '../utils/formatters';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const response = await api.get('/my-tickets');
        setTickets(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTickets();
  }, []);

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-[#10B981]" size={48} /></div>;

  return (
    <div className="min-h-screen pt-32 pb-24 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        
        {/* Cinematic Header */}
        <header className="mb-16 relative">
          <h1 className="text-5xl md:text-7xl font-black text-[#292524] tracking-tighter mb-4">
            My Tickets.
          </h1>
          <p className="text-xl text-[#78716C] font-medium tracking-tight">
            Manage your upcoming events and entry passes.
          </p>
        </header>

        {tickets.length === 0 ? (
          <div className="text-center py-32 border border-[#292524]/5 rounded-[2.5rem] bg-white/40 backdrop-blur-md shadow-sm flex flex-col items-center">
            <Ticket size={48} className="text-[#D97706]/40 mb-6" />
            <h3 className="text-[#292524] text-2xl font-black tracking-tight mb-2">No Tickets Yet</h3>
            <p className="text-[#78716C] font-medium mb-8">You haven't requested to join any parties.</p>
            <Link to="/">
              <Button variant="rounded" color="gold">Explore Parties</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {tickets.map(ticket => (
              <div 
                key={ticket.id} 
                className="bg-white/40 backdrop-blur-lg rounded-[2.5rem] p-6 md:p-8 shadow-[0_8px_32px_rgba(217,119,6,0.05)] border border-white/60 flex flex-col md:flex-row items-center gap-8 group hover:-translate-y-1 transition-transform duration-500"
              >
                
                {/* Immersive Cover Image */}
                {ticket.parties.cover_image_url ? (
                  <img src={ticket.parties.cover_image_url} alt="Cover" className="w-full md:w-40 h-48 md:h-40 rounded-[2rem] object-cover shadow-sm" />
                ) : (
                  <div className="w-full md:w-40 h-48 md:h-40 rounded-[2rem] bg-gradient-to-br from-[#D97706]/20 to-[#292524]/10 border border-white/50"></div>
                )}
                
                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-5 gap-4">
                    <h3 className="text-3xl font-black tracking-tight text-[#292524] group-hover:text-[#D97706] transition-colors">
                      {ticket.parties.title}
                    </h3>
                    
                    {/* VIP Status Badges */}
                    <div className="shrink-0">
                      {ticket.status === 'confirmed' ? (
                        <span className="bg-[#292524] text-[#FDFBF7] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                          <CheckCircle2 size={14}/> Confirmed
                        </span>
                      ) : ticket.status === 'approved' ? (
                        <span className="bg-[#D97706] text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-md shadow-amber-900/20 animate-pulse">
                          <Clock size={14}/> Action Needed
                        </span>
                      ) : (
                        <span className="bg-white/60 text-[#78716C] border border-white/80 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <Clock size={14}/> Pending
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Event Details */}
                  <div className="flex flex-col gap-3 text-[#78716C] font-bold text-sm">
                    <p className="flex items-center gap-3">
                      <Calendar size={18} className="text-[#D97706]"/> {formatDateTime(ticket.parties.event_time)}
                    </p>
                    <p className="flex items-center gap-3">
                      <MapPin size={18} className="text-[#D97706]"/> 
                      {ticket.status === 'confirmed' ? (
                        <span className="text-[#292524]">{ticket.parties.exact_address}</span>
                      ) : (
                        <span>
                          {ticket.parties.location} 
                          <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-[#D97706]/60">
                            (Address Hidden)
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="w-full md:w-auto shrink-0 mt-4 md:mt-0 border-t border-[#292524]/5 pt-6 md:border-t-0 md:pt-0">
                  <Link to={`/party/${ticket.parties.id}`}>
                    <Button 
                      variant="rectangular" 
                      color={ticket.status === 'approved' ? 'gold' : 'espresso'} 
                      className="w-full md:w-auto"
                    >
                      {ticket.status === 'approved' ? 'Pay Now' : 'View Details'}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}