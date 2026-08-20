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

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-[#10B981]" size={48} /></div>;

  return (
    <div className="max-w-2xl mx-auto p-8 animate-in slide-in-from-bottom-4">
      <h1 className="text-4xl font-black text-gray-900 mb-8">Edit Party</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
          <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:ring-[#10B981]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Date & Time</label>
          <input type="datetime-local" required value={formData.event_time} onChange={(e) => setFormData({...formData, event_time: e.target.value})} className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:ring-[#10B981]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Capacity</label>
          <input type="number" required value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})} className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:ring-[#10B981]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
          <textarea rows="4" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:ring-[#10B981] resize-none"></textarea>
        </div>
        <Button type="submit" variant="rectangular" color="green" disabled={saving} className="w-full py-4 text-lg">
          {saving ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}