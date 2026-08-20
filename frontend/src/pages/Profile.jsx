import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, User, Mail, Music, FileText } from 'lucide-react';
import Button from '../components/Button';
import api from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    bio: '',
    favorite_genres: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profiles/me');
        const data = response.data;
        setFormData({
          email: data.email || user?.email, // Pre-filled from DB/Auth
          full_name: data.full_name || '',
          bio: data.bio || '',
          favorite_genres: data.favorite_genres ? data.favorite_genres.join(', ') : ''
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Convert comma-separated string back to an array for the backend
    const genresArray = formData.favorite_genres
      .split(',')
      .map(g => g.trim())
      .filter(g => g.length > 0);

    try {
      await api.put('/profiles/me', {
        full_name: formData.full_name,
        bio: formData.bio,
        favorite_genres: genresArray
      });
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="p-8 text-center mt-20">Please log in.</div>;
  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-[#10B981]" size={48} /></div>;

  return (
    <div className="max-w-2xl mx-auto p-8 animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Your Identity.</h1>
        <p className="text-gray-500">How other guests and hosts see you on Crashr.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl border font-medium ${message.includes('success') ? 'bg-green-50 text-[#10B981] border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <Mail size={16} /> Email Address (Private)
          </label>
          <input type="email" disabled value={formData.email} className="w-full p-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
          <p className="text-xs text-gray-400 mt-2">Your email is tied to your account and cannot be changed here.</p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <User size={16} /> Full Name
          </label>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Alex Mitchell" className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981]" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <Music size={16} /> Favorite Vibes
          </label>
          <input type="text" name="favorite_genres" value={formData.favorite_genres} onChange={handleChange} placeholder="House, Lo-Fi, Acoustic" className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981]" />
          <p className="text-xs text-gray-400 mt-2">Comma separated.</p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <FileText size={16} /> Bio
          </label>
          <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} placeholder="Tell people what kind of energy you bring to a party..." className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] resize-none"></textarea>
        </div>

        <Button type="submit" variant="rectangular" color="green" disabled={saving} className="w-full py-4 text-lg mt-4">
          {saving ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Save Profile'}
        </Button>
      </form>
    </div>
  );
}