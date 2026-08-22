import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import api from '../services/api';
import Button from '../components/Button';
import { Loader2, Camera, User } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    avatar_url: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (error) throw error;
        if (data) setFormData({ full_name: data.full_name || '', bio: data.bio || '', avatar_url: data.avatar_url || '' });
      } catch (err) {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalAvatarUrl = formData.avatar_url;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, avatarFile);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        finalAvatarUrl = data.publicUrl;
      }

      await api.put('/profiles/me', { ...formData, avatar_url: finalAvatarUrl });
      setFormData(prev => ({ ...prev, avatar_url: finalAvatarUrl }));
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-6 pt-20">
        <Loader2 className="animate-spin text-[#D97706]" size={56} strokeWidth={1.5} />
        <p className="text-[#D97706] font-bold tracking-[0.2em] uppercase text-sm animate-pulse">
          Loading identity...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 animate-in fade-in duration-700">
      <div className="max-w-2xl mx-auto px-6 md:px-8">
        
        {/* Cinematic Header */}
        <div className="mb-12 relative text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-black text-[#292524] tracking-tighter mb-4">
            Your Identity.
          </h1>
          <p className="text-xl text-[#78716C] font-medium tracking-tight">
            Set up your profile so hosts and guests know who you are.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-lg p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_32px_rgba(217,119,6,0.05)] border border-white/60 space-y-10 relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D97706]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
            <div className="relative w-32 h-32 rounded-full bg-[#D97706]/5 flex items-center justify-center border-4 border-white/80 shadow-md overflow-hidden shrink-0 group">
              {avatarFile ? (
                <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full object-cover" />
              ) : formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-[#D97706]/40" />
              )}
              
              {/* Hover Overlay for Camera */}
              <label className="absolute inset-0 bg-[#292524]/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer text-[#FDFBF7]">
                <Camera size={28} className="mb-1" />
                <span className="text-[10px] font-black uppercase tracking-widest">Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setAvatarFile(e.target.files[0])} />
              </label>
            </div>
            
            <div className="text-center sm:text-left">
              <h3 className="font-black text-[#292524] text-2xl tracking-tight mb-2">Profile Picture</h3>
              <p className="text-sm font-medium text-[#78716C]">Click the circle to upload a new image.</p>
            </div>
          </div>

          {/* Inputs Section */}
          <div className="space-y-8 relative z-10">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">
                Display Name
              </label>
              <input 
                type="text" 
                required 
                value={formData.full_name} 
                onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
                placeholder="e.g. Alex Chen" 
                className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm placeholder:text-[#292524]/20" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">
                Bio (Optional)
              </label>
              <textarea 
                rows="4" 
                value={formData.bio} 
                onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                placeholder="A little about yourself..." 
                className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-medium leading-relaxed transition-all shadow-sm resize-none placeholder:text-[#292524]/20"
              ></textarea>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 relative z-10 border-t border-[#292524]/5 mt-10">
            <Button 
              type="submit" 
              variant="rectangular" 
              color="gold" 
              disabled={saving} 
              className="w-full py-5 text-lg shadow-amber-900/20 disabled:opacity-70"
            >
              {saving ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Save Profile"}
            </Button>
          </div>
          
        </form>
      </div>
    </div>
  );
}