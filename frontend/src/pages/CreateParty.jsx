import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertCircle, Shield, EyeOff, Users, Image as ImageIcon } from 'lucide-react';
import Button from '../components/Button';
import api from '../services/api';
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
    cover_image_url: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center pt-20">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Host Access Only</h2>
          <p className="text-gray-500 mb-8">You need to log in to create and host a party.</p>
          <Link to="/">
            <Button variant="rectangular" color="green">Go Back</Button>
          </Link>
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

    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      capacity: parseInt(formData.capacity) || 26,
    };

    try {
      const response = await api.post('/parties', payload);
      navigate(`/party/${response.data.id}`);
    } catch (err) {
      console.error("Error creating party:", err);
      setError("Failed to create your party. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-3">Host a Party</h1>
        <p className="text-gray-500">Set the vibe, control the guest list, and manage logistics.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 flex items-center gap-2 font-medium">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        
        {/* Basic Details */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">1. The Basics</h3>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Party Title</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g., Neon Basement Rave" className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date & Time</label>
              <input type="datetime-local" name="event_time" required value={formData.event_time} onChange={handleChange} className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all text-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ticket Price ($)</label>
              <input type="number" name="price" min="0" step="0.01" required value={formData.price} onChange={handleChange} placeholder="15.00" className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all" />
            </div>
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <ImageIcon size={16} /> Cover Image URL
            </label>
            <input type="url" name="cover_image_url" value={formData.cover_image_url} onChange={handleChange} placeholder="https://example.com/image.jpg" className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description / Vibe</label>
            <textarea name="description" rows="3" required value={formData.description} onChange={handleChange} placeholder="Tell your guests what to expect..." className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all resize-none"></textarea>
          </div>
        </div>

        {/* Logistics & Privacy */}
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">2. Logistics & Privacy</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Public Location</label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g., Downtown Brooklyn" className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all" />
              <p className="text-xs text-gray-500 mt-2">Visible to everyone on the feed.</p>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <EyeOff size={16} className="text-[#6B21A8]" /> Exact Address
              </label>
              <input type="text" name="exact_address" required value={formData.exact_address} onChange={handleChange} placeholder="123 Main St, Apt 4B" className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all" />
              <p className="text-xs text-gray-500 mt-2">Only revealed to confirmed guests.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <Users size={16} /> Max Capacity
              </label>
              <input type="number" name="capacity" min="1" required value={formData.capacity} onChange={handleChange} className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all" />
            </div>
            
            <div className="flex flex-col justify-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" name="requires_approval" checked={formData.requires_approval} onChange={handleChange} className="sr-only" />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${formData.requires_approval ? 'bg-[#10B981]' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.requires_approval ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <div>
                  <div className="font-bold text-gray-700 flex items-center gap-2">
                    <Shield size={16} className="text-[#10B981]" /> Require Approval
                  </div>
                  <p className="text-xs text-gray-500">Manually approve guests before they buy.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <Button type="submit" variant="rectangular" color="lavender" disabled={isSubmitting} className="w-full py-4 text-lg disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} /> Publishing...
              </span>
            ) : "Publish Party"}
          </Button>
        </div>
      </form>
    </div>
  );
}