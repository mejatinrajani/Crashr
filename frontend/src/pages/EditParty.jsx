import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { toast } from 'sonner';

export default function EditParty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_time: '',
    capacity: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const response = await api.get(`/parties/${id}`);
        if (response.data.host_id !== user?.id) {
          toast.error("Not authorized");
          navigate('/dashboard');
          return;
        }
        setFormData({
          title: response.data.title,
          description: response.data.description,
          event_time: response.data.event_time.slice(0, 16), // Format for datetime-local input
          capacity: response.data.capacity,
        });
      } catch (err) {
        toast.error("Failed to load party details.");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchParty();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/parties/${id}`, formData);
      toast.success("Party updated successfully!");
      navigate('/dashboard');
    } catch (err) {
      toast.error("Failed to update party.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-6 pt-20">
        <Loader2 className="animate-spin text-[#D97706]" size={56} strokeWidth={1.5} />
        <p className="text-[#D97706] font-bold tracking-[0.2em] uppercase text-sm animate-pulse">
          Fetching party details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 animate-in fade-in duration-700">
      <div className="max-w-2xl mx-auto px-6 md:px-8">
        
        {/* Cinematic Header */}
        <div className="mb-12 relative">
          <h1 className="text-5xl md:text-6xl font-black text-[#292524] tracking-tighter mb-4">
            Edit Party.
          </h1>
          <p className="text-xl text-[#78716C] font-medium tracking-tight">
            Tweak the details and perfect the vibe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-lg p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_32px_rgba(217,119,6,0.05)] border border-white/60 space-y-8 relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D97706]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

          <div className="relative z-10">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">
              Title
            </label>
            <input 
              type="text" 
              required 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm" 
            />
          </div>
          
          <div className="relative z-10">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">
              Date & Time
            </label>
            <input 
              type="datetime-local" 
              required 
              value={formData.event_time} 
              onChange={(e) => setFormData({...formData, event_time: e.target.value})} 
              className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm" 
            />
          </div>
          
          <div className="relative z-10">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">
              Capacity
            </label>
            <input 
              type="number" 
              required 
              value={formData.capacity} 
              onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})} 
              className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm" 
            />
          </div>
          
          <div className="relative z-10">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">
              The Vibe (Description)
            </label>
            <textarea 
              rows="5" 
              required 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-medium leading-relaxed transition-all shadow-sm resize-none"
            ></textarea>
          </div>
          
          <div className="pt-4 relative z-10">
            <Button 
              type="submit" 
              variant="rectangular" 
              color="gold" 
              disabled={saving} 
              className="w-full py-5 text-lg shadow-amber-900/20"
            >
              {saving ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Save Changes"}
            </Button>
          </div>
          
        </form>
      </div>
    </div>
  );
}