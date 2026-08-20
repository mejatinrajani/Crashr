import Button from '../components/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateParty() {
  const [formData, setFormData] = useState({
    title: '', description: '', event_time: '', location: '', price: 0
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/parties', formData);
      console.log("Party created!", response.data);
      navigate('/'); // Redirect to home
    } catch (error) {
      console.error("Error creating party:", error);
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-3">Host a Party</h1>
        <p className="text-gray-500">Fill in the details to list your event on Crashr.</p>
      </div>

      <form className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Party Title</label>
          <input 
            type="text" 
            placeholder="e.g., Neon Basement Rave"
            className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Date & Time</label>
            <input 
              type="datetime-local" 
              className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Ticket Price ($)</label>
            <input 
              type="number" 
              placeholder="15"
              className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Description / Vibe</label>
          <textarea 
            rows="4"
            placeholder="Tell your guests what to expect..."
            className="w-full p-4 bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all resize-none"
          ></textarea>
        </div>

        <div className="pt-4">
          <Button variant="rectangular" color="lavender" className="w-full py-4 text-lg">
            Publish Party
          </Button>
        </div>
      </form>
    </div>
  );
}