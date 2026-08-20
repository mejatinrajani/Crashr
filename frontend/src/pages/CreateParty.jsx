import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
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
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // If the user isn't logged in, prompt them to do so
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Format the payload to ensure numbers are passed correctly for FastAPI/Postgres
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
    };

    try {
      const response = await api.post('/parties', payload);
      // On success, instantly redirect the host to their newly created party page
      navigate(`/party/${response.data.id}`);
    } catch (err) {
      console.error("Error creating party:", err);
      setError("Failed to create your party. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-3">Host a Party</h1>
        <p className="text-gray-500">Fill in the details to list your event on Crashr.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 flex items-center gap-2 font-medium">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Party Title</label>
          <input 
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Neon Basement Rave"
            className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="event_time" className="block text-sm font-bold text-gray-700 mb-2">Date & Time</label>
            <input 
              type="datetime-local"
              id="event_time"
              name="event_time"
              required
              value={formData.event_time}
              onChange={handleChange}
              className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all text-gray-600"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-2">Ticket Price ($)</label>
            <input 
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="15.00"
              className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-2">General Location</label>
          <input 
            type="text"
            id="location"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Downtown Brooklyn"
            className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description / Vibe</label>
          <textarea 
            id="description"
            name="description"
            rows="4"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell your guests what to expect..."
            className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all resize-none"
          ></textarea>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            variant="rectangular" 
            color="lavender" 
            disabled={isSubmitting}
            className="w-full py-4 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} /> Publishing...
              </span>
            ) : (
              "Publish Party"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}