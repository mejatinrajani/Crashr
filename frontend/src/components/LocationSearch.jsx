import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

export default function LocationSearch({ onLocationSelect, placeholder = "Search city or exact address..." }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchPhoton = async (text) => {
    setQuery(text);
    if (text.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Photon is a free, open-source geocoder based on OpenStreetMap
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(text)}&limit=5`);
      const data = await response.json();
      setResults(data.features || []);
      setIsOpen(true);
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (feature) => {
    // Format a nice display name from the OSM data
    const props = feature.properties;
    const displayName = [props.name, props.city, props.state, props.country]
      .filter(Boolean)
      .join(', ');

    setQuery(displayName);
    setIsOpen(false);
    
    // Pass the rich data back up to your form
    onLocationSelect({
      address: displayName,
      lng: feature.geometry.coordinates[0],
      lat: feature.geometry.coordinates[1],
    });
  };

  return (
    <div ref={wrapperRef} className="relative w-full z-50">
      <div className="relative">
        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => searchPhoton(e.target.value)}
          placeholder={placeholder}
          className="w-full p-5 pl-12 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm"
        />
        {loading && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#D97706]" />}
      </div>

      {/* Glassmorphism Dropdown */}
      {isOpen && results.length > 0 && (
        <ul className="absolute top-full left-0 w-full mt-2 bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-[0_8px_32px_rgba(217,119,6,0.1)] overflow-hidden">
          {results.map((feature, index) => {
            const props = feature.properties;
            return (
              <li 
                key={index}
                onClick={() => handleSelect(feature)}
                className="px-6 py-4 hover:bg-[#D97706]/10 cursor-pointer border-b border-[#292524]/5 last:border-none transition-colors"
              >
                <p className="font-bold text-[#292524]">{props.name}</p>
                <p className="text-xs font-medium text-[#78716C]">
                  {[props.city, props.state, props.country].filter(Boolean).join(', ')}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}