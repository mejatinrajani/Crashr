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
    <div className="max-w-4xl mx-auto p-8 animate-in slide-in-from-bottom-4">
      <h1 className="text-4xl font-black text-gray-900 mb-2">My Tickets.</h1>
      <p className="text-gray-500 mb-8">Manage your upcoming events and entry passes.</p>

      {tickets.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100">
          <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Tickets Yet</h3>
          <p className="text-gray-500 mb-6">You haven't requested to join any parties.</p>
          <Link to="/"><Button variant="rounded" color="lavender">Explore Parties</Button></Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
              {ticket.parties.cover_image_url ? (
                <img src={ticket.parties.cover_image_url} alt="Cover" className="w-full md:w-32 h-32 rounded-2xl object-cover" />
              ) : (
                <div className="w-full md:w-32 h-32 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#E9D5FF]"></div>
              )}
              
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{ticket.parties.title}</h3>
                  {ticket.status === 'confirmed' ? (
                    <span className="bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1"><CheckCircle2 size={14}/> Confirmed</span>
                  ) : ticket.status === 'approved' ? (
                    <span className="bg-blue-50 text-blue-500 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1"><Clock size={14}/> Action Needed</span>
                  ) : (
                    <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1"><Clock size={14}/> Pending</span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p className="flex items-center gap-2"><Calendar size={14} className="text-[#10B981]"/> {formatDateTime(ticket.parties.event_time)}</p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#10B981]"/> 
                    {ticket.status === 'confirmed' ? <span className="font-bold">{ticket.parties.exact_address}</span> : <span>{ticket.parties.location} (Address Hidden)</span>}
                  </p>
                </div>
              </div>

              <div className="w-full md:w-auto shrink-0">
                <Link to={`/party/${ticket.parties.id}`}>
                  <Button variant="rectangular" color={ticket.status === 'approved' ? 'green' : 'lavender'} className="w-full">
                    {ticket.status === 'approved' ? 'Pay Now' : 'View Details'}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}