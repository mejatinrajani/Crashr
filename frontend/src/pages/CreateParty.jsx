import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertCircle, Shield, EyeOff, Users, Image as ImageIcon } from 'lucide-react';
import Button from '../components/Button';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export default function CreateParty() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    event_time: '',
    price: '',
    location: '',
    exact_address: '',
    description: '',
    capacity: 26,
    requires_approval: false,
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-40 text-center">
        <div className="bg-[#292524] text-[#FDFBF7] p-12 rounded-[2.5rem] shadow-xl shadow-[#292524]/10 border border-[#1C1917] mb-8">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Host Access Only.</h2>
          <p className="text-[#A8A29E] font-medium mb-8 text-lg">You need to log in to curate and host an event.</p>
          <div className="flex justify-center">
            <Link to="/">
              <Button variant="rounded" color="gold">Back to the Feed</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let finalImageUrl = '';

      // 1. Upload image to Supabase Storage if one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('party-covers')
          .upload(fileName, imageFile);

        if (uploadError) {
          throw new Error("Failed to upload image.");
        }

        const { data } = supabase.storage.from('party-covers').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      // 2. Prepare the payload for FastAPI
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        capacity: parseInt(formData.capacity) || 26,
        cover_image_url: finalImageUrl 
      };

      // 3. Submit to backend
      const response = await api.post('/parties', payload);
      toast.success("Party published successfully!");
      navigate(`/party/${response.data.id}`);
    } catch (err) {
      console.error("Error creating party:", err);
      setError("Failed to create your party. Please check your details and try again.");
      toast.error("Failed to publish party.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 animate-in fade-in duration-700">
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        
        {/* Cinematic Header */}
        <div className="mb-12 relative text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black text-[#292524] tracking-tighter mb-4">
            Host a Party.
          </h1>
          <p className="text-xl text-[#78716C] font-medium tracking-tight">
            Set the vibe, control the list, and manage the night.
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 text-red-600 p-5 rounded-2xl border border-red-500/20 flex items-center gap-3 font-bold tracking-tight">
            <AlertCircle size={20} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-lg p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_32px_rgba(217,119,6,0.05)] border border-white/60 space-y-12 relative overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D97706]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

          {/* Section 1: Basic Details */}
          <div className="space-y-8 relative z-10">
            <h3 className="text-sm font-black text-[#D97706] uppercase tracking-[0.2em] border-b border-[#292524]/5 pb-4">
              1. The Basics
            </h3>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">Party Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g., Midnight Rooftop Session" className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm placeholder:text-[#292524]/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">Date & Time</label>
                <input type="datetime-local" name="event_time" required value={formData.event_time} onChange={handleChange} className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">Ticket Price ($)</label>
                <input type="number" name="price" min="0" step="0.01" required value={formData.price} onChange={handleChange} placeholder="15.00" className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm placeholder:text-[#292524]/20" />
              </div>
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">
                <ImageIcon size={14} /> Cover Image
              </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full p-4 bg-white/60 border border-white/80 rounded-2xl file:mr-5 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-[#292524] file:text-[#FDFBF7] hover:file:bg-[#1C1917] file:cursor-pointer transition-all shadow-sm cursor-pointer text-sm font-bold text-[#78716C]" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">Description / Vibe</label>
              <textarea name="description" rows="4" required value={formData.description} onChange={handleChange} placeholder="What should guests expect? What's the dress code?" className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-medium leading-relaxed transition-all shadow-sm resize-none placeholder:text-[#292524]/20"></textarea>
            </div>
          </div>

          {/* Section 2: Logistics & Privacy */}
          <div className="space-y-8 relative z-10 pt-4">
            <h3 className="text-sm font-black text-[#D97706] uppercase tracking-[0.2em] border-b border-[#292524]/5 pb-4">
              2. Logistics & Privacy
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">Public Location</label>
                <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g., Downtown Brooklyn" className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm placeholder:text-[#292524]/20" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]/60 mt-3">Visible to everyone on the feed.</p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">
                  <EyeOff size={14} /> Exact Address
                </label>
                <input type="text" name="exact_address" required value={formData.exact_address} onChange={handleChange} placeholder="123 Main St, Apt 4B" className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm placeholder:text-[#292524]/20" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]/60 mt-3">Only revealed to confirmed guests.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-[#292524]/5 pt-8">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">
                  <Users size={14} /> Max Capacity
                </label>
                <input type="number" name="capacity" min="1" required value={formData.capacity} onChange={handleChange} className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm" />
              </div>
              
              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-4 cursor-pointer group p-4 rounded-2xl hover:bg-white/40 transition-colors">
                  <div className="relative">
                    <input type="checkbox" name="requires_approval" checked={formData.requires_approval} onChange={handleChange} className="sr-only" />
                    <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${formData.requires_approval ? 'bg-[#D97706]' : 'bg-[#292524]/10'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-sm ${formData.requires_approval ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div>
                    <div className="font-black text-[#292524] tracking-tight flex items-center gap-2 mb-1">
                      <Shield size={16} className={formData.requires_approval ? 'text-[#D97706]' : 'text-[#78716C]'} /> 
                      Require Approval
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#78716C]">Review guests before they buy.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-8 relative z-10 border-t border-[#292524]/5">
            <Button 
              type="submit" 
              variant="rectangular" 
              color="gold" 
              disabled={isSubmitting} 
              className="w-full py-5 text-lg shadow-amber-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="animate-spin" size={20} /> Publishing...
                </span>
              ) : "Publish Party"}
            </Button>
          </div>
          
        </form>
      </div>
    </div>
  );
}