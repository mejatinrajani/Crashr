import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Loader2, Users, Check, X, Clock, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDateTime } from '../utils/formatters';
import { Link } from 'react-router-dom';

export default function HostDashboard() {
  const { user } = useAuth();
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/host/dashboard');
        setParties(response.data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDashboard();
  }, [user]);

  const handleCheckIn = async (partyId, ticketId) => {
  try {
    await api.patch(`/tickets/${ticketId}/checkin`);
    setParties(prevParties => prevParties.map(party => {
      if (party.id === partyId) {
        return {
          ...party,
          tickets: party.tickets.map(ticket => 
            ticket.id === ticketId ? { ...ticket, checked_in: !ticket.checked_in } : ticket
          )
        };
      }
      return party;
    }));
    toast.success("Guest check-in status updated!");
  } catch (err) {
    toast.error("Failed to update check-in status.");
  }
};

  const handleCancelParty = async (partyId) => {
    if (!window.confirm("Are you sure you want to cancel this party? This cannot be undone.")) return;
    
    try {
      await api.delete(`/parties/${partyId}`);
      setParties(prev => prev.filter(p => p.id !== partyId));
      toast.success("Party cancelled successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel party.");
    }
  };

  const handleUpdateStatus = async (partyId, ticketId, newStatus) => {
    try {
      await api.put(`/tickets/${ticketId}/status`, { status: newStatus });
      
      // Update local state to reflect the change instantly
      setParties(prevParties => prevParties.map(party => {
        if (party.id === partyId) {
          return {
            ...party,
            tickets: party.tickets.map(ticket => 
              ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
            )
          };
        }
        return party;
      }));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update guest status.");
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-[#10B981]" size={48} /></div>;

  return (
    <div className="min-h-screen pt-32 pb-24 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        
        {/* Cinematic Header */}
        <div className="mb-16 relative">
          <h1 className="text-5xl md:text-7xl font-black text-[#292524] tracking-tighter mb-4">
            Command Center.
          </h1>
          <p className="text-xl text-[#78716C] font-medium tracking-tight">
            Manage your events and curate the perfect guest list.
          </p>
        </div>

        {parties.length === 0 ? (
          <div className="text-center py-32 border border-[#292524]/5 rounded-3xl bg-white/40 backdrop-blur-md shadow-sm">
            <Users size={48} className="mx-auto text-[#D97706]/40 mb-6" />
            <h3 className="text-[#292524] text-2xl font-black tracking-tight mb-2">No Parties Yet</h3>
            <p className="text-[#78716C] font-medium">You haven't hosted any events. Time to start planning!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {parties.map(party => {
              const confirmedCount = party.tickets.filter(t => t.status === 'confirmed').length;
              const pendingTickets = party.tickets.filter(t => t.status === 'pending');
              const otherTickets = party.tickets.filter(t => t.status !== 'pending');

              return (
                <div key={party.id} className="bg-white/40 backdrop-blur-lg rounded-[2.5rem] shadow-[0_8px_32px_rgba(217,119,6,0.05)] border border-white/60 overflow-hidden group">
                  
                  {/* Premium Party Header */}
                  <div className="p-8 md:p-10 border-b border-[#292524]/5 flex justify-between items-start md:items-center flex-col md:flex-row gap-6 relative overflow-hidden">
                    {/* Subtle glow behind the title */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#D97706]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                      <h2 className="text-3xl font-black tracking-tight text-[#292524] group-hover:text-[#D97706] transition-colors">{party.title}</h2>
                      <p className="text-[#78716C] font-bold tracking-wide text-sm mt-2">{formatDateTime(party.event_time)}</p>
                    </div>
                    
                    {/* Action Container */}
                    <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
                      <div className="bg-[#D97706]/10 text-[#D97706] px-6 py-3 rounded-full font-black text-sm flex items-center gap-2 flex-1 md:flex-none justify-center">
                        <Users size={18} /> {confirmedCount} / {party.capacity} Confirmed
                      </div>
                      <Link 
                        to={`/edit-party/${party.id}`}
                        className="w-12 h-12 rounded-full bg-white/60 text-[#78716C] flex items-center justify-center hover:bg-white hover:text-[#D97706] transition-all shadow-sm active:scale-95 shrink-0"
                        title="Edit Party"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleCancelParty(party.id)}
                        className="w-12 h-12 rounded-full bg-white/60 text-[#78716C] flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shadow-sm active:scale-95 shrink-0"
                        title="Cancel Party"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Guest List Body */}
                  <div className="p-8 md:p-10">
                    {party.tickets.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-[#78716C] font-medium">No guests have requested tickets yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-10">
                        
                        {/* Pending Approvals */}
                        {pendingTickets.length > 0 && (
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D97706] mb-5 flex items-center gap-2">
                              <Clock size={16} /> Needs Approval
                            </h3>
                            <div className="grid gap-3">
                              {pendingTickets.map(ticket => (
                                <div key={ticket.id} className="flex justify-between items-center p-4 bg-white/60 rounded-2xl border border-white/80 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#D97706]/10 flex items-center justify-center text-[#D97706] font-black text-lg">
                                      {ticket.profiles?.full_name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                      <p className="font-bold text-[#292524]">{ticket.profiles?.full_name || 'Anonymous'}</p>
                                      <p className="text-xs font-bold text-[#D97706]">Requested a spot</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => handleUpdateStatus(party.id, ticket.id, 'approved')}
                                      className="w-12 h-12 rounded-xl bg-[#D97706] text-white flex items-center justify-center hover:bg-[#B45309] transition-colors active:scale-95 shadow-sm shadow-amber-900/20"
                                    >
                                      <Check size={20} />
                                    </button>
                                    <button 
                                      onClick={() => handleUpdateStatus(party.id, ticket.id, 'denied')} 
                                      className="w-12 h-12 rounded-xl bg-[#292524]/5 text-[#78716C] flex items-center justify-center hover:bg-[#292524]/10 hover:text-[#292524] transition-colors active:scale-95"
                                    >
                                      <X size={20} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Confirmed Guests & Check-in Mode (DOOR LIST) */}
                        {otherTickets.filter(t => t.status === 'confirmed').length > 0 && (
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#292524] mb-5">
                              Door List (Confirmed)
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                              {otherTickets.filter(t => t.status === 'confirmed').map(ticket => (
                                <div key={ticket.id} className={`flex justify-between items-center p-4 rounded-2xl border transition-all duration-300 ${ticket.checked_in ? 'bg-[#D97706]/5 border-[#D97706]/20' : 'bg-white/60 border-white/80 shadow-sm'}`}>
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#D97706]/10 flex items-center justify-center text-[#D97706] font-bold">
                                      {ticket.profiles?.full_name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                      <p className="font-bold text-[#292524] text-sm">{ticket.profiles?.full_name || 'Anonymous'}</p>
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">TKT-#{ticket.id.slice(0, 6)}</p>
                                    </div>
                                  </div>
                                  
                                  <button 
                                    onClick={() => handleCheckIn(party.id, ticket.id)}
                                    className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all active:scale-95 ${ticket.checked_in ? 'bg-[#D97706] text-white shadow-md shadow-amber-900/20' : 'bg-[#292524] text-[#FDFBF7] hover:bg-[#1C1917]'}`}
                                  >
                                    {ticket.checked_in ? 'Checked In' : 'Check In'}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Other Statuses (Awaiting Payment, Denied, etc.) */}
                        {otherTickets.filter(t => t.status !== 'confirmed').length > 0 && (
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#78716C] mb-5">
                              Other Guests
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {otherTickets.filter(t => t.status !== 'confirmed').map(ticket => (
                                <div key={ticket.id} className="flex items-center gap-3 p-3 bg-white/40 rounded-xl border border-white/50">
                                  <div className="w-8 h-8 rounded-full bg-[#292524]/5 flex items-center justify-center text-[#78716C] font-bold text-xs">
                                    {ticket.profiles?.full_name?.charAt(0) || '?'}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-bold text-[#292524] text-sm">{ticket.profiles?.full_name || 'Anonymous'}</p>
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${ticket.status === 'approved' ? 'text-[#D97706]' : ticket.status === 'denied' ? 'text-red-400' : 'text-[#78716C]'}`}>
                                      {ticket.status === 'approved' ? 'Awaiting Payment' : ticket.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}