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

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-[#10B981]" size={48} /></div>;

  return (
    <div className="max-w-2xl mx-auto p-8 animate-in slide-in-from-bottom-4">
      <h1 className="text-4xl font-black text-gray-900 mb-2">Your Identity.</h1>
      <p className="text-gray-500 mb-8">Set up your profile so hosts and guests know who you are.</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        
        <div className="flex items-center gap-6 mb-8">
          <div className="relative w-24 h-24 rounded-full bg-[#E9D5FF] flex items-center justify-center border-4 border-white shadow-md overflow-hidden shrink-0">
            {avatarFile ? (
              <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full object-cover" />
            ) : formData.avatar_url ? (
              <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-[#6B21A8]" />
            )}
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white">
              <Camera size={24} />
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setAvatarFile(e.target.files[0])} />
            </label>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Profile Picture</h3>
            <p className="text-sm text-gray-500">Click the circle to upload a new image.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
          <input type="text" required value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} placeholder="e.g. Alex Chen" className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:ring-[#10B981]" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Bio (Optional)</label>
          <textarea rows="3" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="A little about yourself..." className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:ring-[#10B981] resize-none"></textarea>
        </div>

        <Button type="submit" variant="rectangular" color="green" disabled={saving} className="w-full py-4 text-lg mt-4">
          {saving ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}