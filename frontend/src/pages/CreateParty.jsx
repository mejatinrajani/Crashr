import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertCircle, Shield, EyeOff, Users, Image as ImageIcon, MapPin, Map as MapIcon, Crosshair, Check, Search, X, LocateFixed } from 'lucide-react';
import Button from '../components/Button';
import api from '../services/api';
import { toast } from 'sonner';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import Map, { NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

// ==========================================
// 1. PUBLIC LOCATION SEARCH (Indian Cities)
// ==========================================
function CitySearch({ value, onChangeText, onCoordinatesSelect, placeholder }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchNominatim = async (text) => {
    onChangeText(text);
    if (text.length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      // Nominatim API: Free, crowdsourced, restricted to India
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&countrycodes=in&limit=5`);
      const data = await response.json();
      setResults(data || []);
      setIsOpen(true);
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (feature) => {
    const cleanName = feature.display_name.split(',').slice(0, 3).join(',');
    onChangeText(cleanName);
    setIsOpen(false);
    onCoordinatesSelect(parseFloat(feature.lat), parseFloat(feature.lon));
  };

  return (
    <div ref={wrapperRef} className="relative w-full z-[60]">
      <div className="relative">
        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
        <input 
          type="text" value={value} onChange={(e) => searchNominatim(e.target.value)} placeholder={placeholder}
          className="w-full p-5 pl-12 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm"
        />
        {loading && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#D97706]" />}
      </div>
      {isOpen && results.length > 0 && (
        <ul className="absolute top-full left-0 w-full mt-2 bg-white/90 backdrop-blur-2xl border border-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] overflow-hidden">
          {results.map((feature, idx) => (
            <li key={idx} onClick={() => handleSelect(feature)} className="px-6 py-4 hover:bg-[#D97706]/10 cursor-pointer border-b border-[#292524]/5 last:border-none">
              <p className="font-bold text-[#292524] text-sm">{feature.name || feature.display_name.split(',')[0]}</p>
              <p className="text-xs font-medium text-[#78716C] truncate">{feature.display_name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ==========================================
// 2. EXACT LOCATION PICKER (Rich Map & Geolocation)
// ==========================================
function ExactLocationPicker({ value, onChangeText, onCoordinatesSelect, placeholder }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const wrapperRef = useRef(null);
  const mapRef = useRef(null);

  const [modalSearch, setModalSearch] = useState("");
  const [modalResults, setModalResults] = useState([]);
  const [isModalSearching, setIsModalSearching] = useState(false);

  // Default to Mathura
  const [viewState, setViewState] = useState({ latitude: 27.4924, longitude: 77.6737, zoom: 14 });
  const [isPanning, setIsPanning] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState("Locating...");
  const [isLocatingMe, setIsLocatingMe] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMapModalOpen) {
      performReverseGeocode(viewState.latitude, viewState.longitude);
    }
  }, [isMapModalOpen]);

  const executeSmartSearch = async (text, setLoader, setResultState) => {
    if (text.length < 3) { setResultState([]); return; }
    setLoader(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&countrycodes=in&limit=5&addressdetails=1`);
      const data = await res.json();
      setResultState(data || []);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoader(false); 
    }
  };

  const searchAddress = (text) => {
    onChangeText(text);
    executeSmartSearch(text, setLoading, setResults);
    setIsOpen(true);
  };

  const handleModalSearch = (text) => {
    setModalSearch(text);
    executeSmartSearch(text, setIsModalSearching, setModalResults);
  };

  const handleSelectDropdown = (feature) => {
    onChangeText(feature.display_name);
    onCoordinatesSelect(parseFloat(feature.lat), parseFloat(feature.lon));
    setViewState({ latitude: parseFloat(feature.lat), longitude: parseFloat(feature.lon), zoom: 16 });
    setIsOpen(false);
  };

  const handleModalSelect = (feature) => {
    setModalSearch("");
    setModalResults([]);
    const lat = parseFloat(feature.lat);
    const lon = parseFloat(feature.lon);
    setViewState({ latitude: lat, longitude: lon, zoom: 16 });
    performReverseGeocode(lat, lon);
  };

  const performReverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data && data.display_name) {
        const cleanAddress = data.display_name.split(', ').slice(0, 4).join(', ');
        setResolvedAddress(cleanAddress);
      } else {
        setResolvedAddress("Unknown Location");
      }
    } catch (error) { 
      console.error(error); 
      setResolvedAddress("Location found");
    }
  };

  const handleMapMoveEnd = () => {
    setIsPanning(false);
    const currentLat = mapRef.current ? mapRef.current.getCenter().lat : viewState.latitude;
    const currentLng = mapRef.current ? mapRef.current.getCenter().lng : viewState.longitude;
    performReverseGeocode(currentLat, currentLng);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsLocatingMe(true);
    setResolvedAddress("Detecting your location...");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setViewState({ latitude, longitude, zoom: 16 });
        performReverseGeocode(latitude, longitude);
        setIsLocatingMe(false);
      },
      (error) => {
        toast.error("Unable to retrieve your location. Please check browser permissions.");
        console.error(error);
        setIsLocatingMe(false);
        setResolvedAddress("Location access denied.");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleConfirmPin = () => {
    onChangeText(resolvedAddress);
    const finalLat = mapRef.current ? mapRef.current.getCenter().lat : viewState.latitude;
    const finalLng = mapRef.current ? mapRef.current.getCenter().lng : viewState.longitude;
    onCoordinatesSelect(finalLat, finalLng);
    setIsMapModalOpen(false);
  };

  // Upgraded to Voyager: High detail, streets, buildings, and colors (Google Maps feel)
  const detailedMapStyle = {
    version: 8,
    sources: { 'carto-voyager': { type: 'raster', tiles: ['https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'], tileSize: 256 } },
    layers: [{ id: 'carto-voyager-layer', type: 'raster', source: 'carto-voyager', minzoom: 0, maxzoom: 22 }]
  };

  return (
    <div ref={wrapperRef} className="relative w-full z-[50]">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
          <input 
            type="text" value={value} onChange={(e) => searchAddress(e.target.value)} placeholder={placeholder}
            className="w-full p-5 pl-12 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm"
          />
          {loading && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#D97706]" />}
        </div>
        <button
          type="button" onClick={() => setIsMapModalOpen(true)}
          className="shrink-0 w-[60px] h-[60px] md:h-[68px] bg-[#292524] text-[#FDFBF7] rounded-2xl flex items-center justify-center hover:bg-[#D97706] transition-colors shadow-sm"
        >
          <MapIcon size={24} />
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute top-full left-0 w-full mt-2 bg-white/90 backdrop-blur-2xl border border-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] overflow-hidden z-[9999]">
          {results.map((place, idx) => (
            <li key={idx} onClick={() => handleSelectDropdown(place)} className="px-6 py-4 hover:bg-[#D97706]/10 cursor-pointer border-b border-[#292524]/5">
              <p className="font-bold text-[#292524] text-sm">{place.name || place.display_name.split(',')[0]}</p>
              <p className="text-xs font-medium text-[#78716C] truncate">{place.display_name}</p>
            </li>
          ))}
        </ul>
      )}

      {isMapModalOpen && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 md:p-8">
          <div className="w-full max-w-3xl bg-[#FDFBF7] sm:rounded-[2.5rem] rounded-t-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[85vh] md:h-[80vh] animate-in slide-in-from-bottom-8 md:fade-in duration-300">
            
            <div className="p-6 bg-white flex justify-between items-center z-10 shadow-sm relative">
              <h3 className="font-black text-xl text-[#292524] tracking-tight">Select Location</h3>
              <button type="button" onClick={() => setIsMapModalOpen(false)} className="text-[#78716C] hover:text-red-500 font-bold bg-gray-100 px-4 py-2 rounded-full text-sm transition-colors">
                Close
              </button>
            </div>

            <div className="flex-1 relative bg-gray-200 w-full h-full">
              
              <div className="absolute top-4 left-4 right-14 md:left-1/2 md:-translate-x-1/2 md:w-[400px] z-30 pointer-events-auto">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" value={modalSearch} onChange={(e) => handleModalSearch(e.target.value)} placeholder="Search an area to jump to..."
                    className="w-full bg-white/95 backdrop-blur-md py-3 pl-12 pr-10 rounded-2xl shadow-lg border border-white/50 focus:outline-none focus:ring-2 focus:ring-[#D97706] text-[#292524] font-bold"
                  />
                  {modalSearch && (
                    <button onClick={() => { setModalSearch(""); setModalResults([]); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  )}
                  {isModalSearching && <Loader2 size={16} className="absolute right-10 top-1/2 -translate-y-1/2 animate-spin text-[#D97706]" />}
                </div>

                {modalResults.length > 0 && (
                  <ul className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-white rounded-2xl shadow-xl overflow-hidden">
                    {modalResults.map((place, idx) => (
                      <li key={idx} onClick={() => handleModalSelect(place)} className="px-5 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none">
                        <p className="font-bold text-[#292524] text-sm truncate">{place.name || place.display_name.split(',')[0]}</p>
                        <p className="text-xs font-medium text-[#78716C] truncate">{place.display_name}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* LOCATE ME BUTTON */}
              <div className="absolute bottom-6 right-4 z-30 pointer-events-auto">
                <button 
                  type="button"
                  onClick={handleLocateMe}
                  className="w-12 h-12 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center text-[#292524] hover:text-[#D97706] transition-colors border border-gray-100"
                  title="Detect my current location"
                >
                  {isLocatingMe ? <Loader2 size={20} className="animate-spin text-[#D97706]" /> : <LocateFixed size={20} />}
                </button>
              </div>

              <div className="absolute inset-0 z-0 touch-none">
                <Map
                  ref={mapRef}
                  {...viewState}
                  onMove={evt => setViewState(evt.viewState)}
                  onMoveStart={() => setIsPanning(true)}
                  onMoveEnd={handleMapMoveEnd}
                  mapStyle={detailedMapStyle}
                  style={{ width: '100%', height: '100%' }}
                  dragPan={true}
                  scrollZoom={true}
                  interactive={true}
                >
                  <NavigationControl position="bottom-right" showCompass={false} style={{ marginBottom: '60px' }} />
                </Map>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center">
                <div className={`transition-transform duration-200 ${isPanning ? '-translate-y-4' : 'translate-y-0'}`}>
                  <MapPin size={48} className="text-[#D97706] drop-shadow-2xl" fill="#292524" strokeWidth={1} />
                </div>
                <div className={`w-4 h-1.5 bg-black/30 rounded-full blur-[2px] mt-1 transition-all duration-200 ${isPanning ? 'scale-50 opacity-30' : 'scale-100 opacity-100'}`}></div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 z-10 shadow-[0_-15px_30px_rgba(0,0,0,0.06)] rounded-t-3xl -mt-4 relative">
              <div className="flex gap-4 items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-[#D97706]/10 flex items-center justify-center shrink-0 mt-1">
                  <MapPin size={20} className="text-[#D97706]" />
                </div>
                <div>
                  <h4 className="text-[#292524] font-black text-lg mb-1">Location Details</h4>
                  <p className="text-sm font-medium text-[#78716C] leading-snug line-clamp-2">
                    {isPanning || isLocatingMe ? "Locating..." : resolvedAddress}
                  </p>
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={handleConfirmPin}
                disabled={isPanning || isLocatingMe}
                className="w-full py-4 bg-[#D97706] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-[#B45309] transition-all shadow-xl shadow-amber-900/20 disabled:opacity-50"
              >
                {isPanning || isLocatingMe ? <Loader2 className="animate-spin" size={20} /> : "Confirm Location"}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
// ==========================================
// 3. MAIN CREATE PARTY PAGE
// ==========================================
export default function CreateParty() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '', event_time: '', price: '', location: '', exact_address: '', lat: null, lng: null, description: '', capacity: 26, requires_approval: false,
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
          <div className="flex justify-center"><Link to="/"><Button variant="rounded" color="gold">Back to the Feed</Button></Link></div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let finalImageUrl = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('party-covers').upload(fileName, imageFile);
        if (uploadError) throw new Error("Failed to upload image.");
        const { data } = supabase.storage.from('party-covers').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const payload = { ...formData, price: parseFloat(formData.price) || 0, capacity: parseInt(formData.capacity) || 26, cover_image_url: finalImageUrl };
      const response = await api.post('/parties', payload);
      toast.success("Party published successfully!");
      navigate(`/party/${response.data.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create your party. Please check details and try again.");
      toast.error("Failed to publish party.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 animate-in fade-in duration-700">
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <div className="mb-12 relative text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black text-[#292524] tracking-tighter mb-4">Host a Party.</h1>
          <p className="text-xl text-[#78716C] font-medium tracking-tight">Set the vibe, control the list, and manage the night.</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 text-red-600 p-5 rounded-2xl border border-red-500/20 flex items-center gap-3 font-bold tracking-tight">
            <AlertCircle size={20} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-lg p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_32px_rgba(217,119,6,0.05)] border border-white/60 space-y-12 relative">
          
          <div className="space-y-8 relative z-30">
            <h3 className="text-sm font-black text-[#D97706] uppercase tracking-[0.2em] border-b border-[#292524]/5 pb-4">1. The Basics</h3>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">Party Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g., Midnight Rooftop Session" className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">Date & Time</label>
                <input type="datetime-local" name="event_time" required value={formData.event_time} onChange={handleChange} className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">Ticket Price ($)</label>
                <input type="number" name="price" min="0" step="0.01" required value={formData.price} onChange={handleChange} placeholder="15.00" className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm" />
              </div>
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3"><ImageIcon size={14} /> Cover Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full p-4 bg-white/60 border border-white/80 rounded-2xl file:mr-5 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-[#292524] file:text-[#FDFBF7] hover:file:bg-[#1C1917] cursor-pointer text-[#78716C] font-bold" />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">Description / Vibe</label>
              <textarea name="description" rows="4" required value={formData.description} onChange={handleChange} placeholder="What should guests expect?" className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-medium resize-none shadow-sm"></textarea>
            </div>
          </div>

          <div className="space-y-8 relative z-20 pt-4">
            <h3 className="text-sm font-black text-[#D97706] uppercase tracking-[0.2em] border-b border-[#292524]/5 pb-4">2. Logistics & Privacy</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative z-[60]">
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3">Public Location (City)</label>
                <CitySearch 
                  value={formData.location}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                  onCoordinatesSelect={(lat, lng) => { if (!formData.lat && !formData.lng) setFormData(prev => ({ ...prev, lat, lng })); }}
                  placeholder="e.g., Dwarka, Delhi"
                />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]/60 mt-3">Visible to everyone on the feed.</p>
              </div>

              <div className="relative z-[50]">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3"><EyeOff size={14} /> Exact Address</label>
                <ExactLocationPicker 
                  value={formData.exact_address}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, exact_address: text }))}
                  onCoordinatesSelect={(lat, lng) => setFormData(prev => ({ ...prev, lat, lng }))}
                  placeholder="e.g., Sector 24, Apt 4B"
                />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]/60 mt-3">Only revealed to confirmed guests.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-[#292524]/5 pt-8 relative z-10">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#78716C] mb-3"><Users size={14} /> Max Capacity</label>
                <input type="number" name="capacity" min="1" required value={formData.capacity} onChange={handleChange} className="w-full p-5 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 text-[#292524] font-bold text-lg shadow-sm" />
              </div>
              
              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-4 cursor-pointer group p-4 rounded-2xl hover:bg-white/40 transition-colors">
                  <div className="relative">
                    <input type="checkbox" name="requires_approval" checked={formData.requires_approval} onChange={handleChange} className="sr-only" />
                    <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${formData.requires_approval ? 'bg-[#D97706]' : 'bg-[#292524]/10'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-sm ${formData.requires_approval ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div>
                    <div className="font-black text-[#292524] tracking-tight flex items-center gap-2 mb-1"><Shield size={16} className={formData.requires_approval ? 'text-[#D97706]' : 'text-[#78716C]'} /> Require Approval</div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#78716C]">Review guests before they buy.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-8 relative z-10 border-t border-[#292524]/5">
            <Button type="submit" variant="rectangular" color="gold" disabled={isSubmitting} className="w-full py-5 text-lg shadow-amber-900/20 disabled:opacity-70">
              {isSubmitting ? <span className="flex items-center gap-3"><Loader2 className="animate-spin" size={20} /> Publishing...</span> : "Publish Party"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}