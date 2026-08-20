import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Loader2, Users, Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

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
    <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-300">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Host Dashboard.</h1>
        <p className="text-gray-500">Manage your events and guest lists.</p>
      </div>

      {parties.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Parties Yet</h3>
          <p className="text-gray-500">You haven't hosted any events. Time to start planning!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {parties.map(party => {
            const confirmedCount = party.tickets.filter(t => t.status === 'confirmed').length;
            const pendingTickets = party.tickets.filter(t => t.status === 'pending');
            const otherTickets = party.tickets.filter(t => t.status !== 'pending');

            return (
              <div key={party.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Party Header */}
                <div className="bg-[#F9F9F8] p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{party.title}</h2>
                    <p className="text-gray-500 text-sm mt-1">{formatDateTime(party.event_time)}</p>
                  </div>
                  
                  {/* Updated Action Container */}
                  <div className="flex items-center gap-3">
                    <div className="bg-[#10B981]/10 text-[#10B981] px-4 py-2 rounded-full font-bold flex items-center gap-2">
                      <Users size={18} /> {confirmedCount} / {party.capacity} Confirmed
                    </div>
                    <button 
                      onClick={() => handleCancelParty(party.id)}
                      className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm"
                      title="Cancel Party"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {/* Guest List */}
                <div className="p-6">
                  {party.tickets.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No guests have requested tickets yet.</p>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Pending Approvals */}
                      {pendingTickets.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2 mb-4">
                            <Clock size={16} /> Needs Approval
                          </h3>
                          <div className="grid gap-3">
                            {pendingTickets.map(ticket => (
                              <div key={ticket.id} className="flex justify-between items-center p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold">
                                    {ticket.profiles?.full_name?.charAt(0) || '?'}
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900">{ticket.profiles?.full_name || 'Anonymous'}</p>
                                    <p className="text-xs text-amber-600">Requested a spot</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => handleUpdateStatus(party.id, ticket.id, 'confirmed')} className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center hover:bg-emerald-600 transition-colors">
                                    <Check size={20} />
                                  </button>
                                  <button onClick={() => handleUpdateStatus(party.id, ticket.id, 'denied')} className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors">
                                    <X size={20} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Confirmed & Waitlisted */}
                      {otherTickets.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Guest List</h3>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {otherTickets.map(ticket => (
                              <div key={ticket.id} className="flex items-center gap-3 p-3 bg-[#F9F9F8] rounded-xl border border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-[#E9D5FF] flex items-center justify-center text-[#6B21A8] font-bold text-xs">
                                  {ticket.profiles?.full_name?.charAt(0) || '?'}
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold text-gray-900 text-sm">{ticket.profiles?.full_name || 'Anonymous'}</p>
                                  <span className={`text-xs font-semibold ${ticket.status === 'confirmed' ? 'text-[#10B981]' : ticket.status === 'denied' ? 'text-red-400' : 'text-gray-400'}`}>
                                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
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
  );
}