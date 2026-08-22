import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Map as MapIcon, Crosshair, Check } from 'lucide-react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function LocationPicker({ 
  value, 
  onChangeText, 
  onCoordinatesSelect, 
  placeholder = "Search or drop a pin..." 
}) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  
  // Default to center of India, will update when pin is dropped
  const [markerPos, setMarkerPos] = useState({ lat: 20.5937, lng: 78.9629 });
  const [viewState, setViewState] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 4
  });

  const wrapperRef = useRef(null);
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN; // Required for highly accurate Indian search

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

  // 1. Search via Mapbox API for maximum accuracy
  const searchAddress = async (text) => {
    onChangeText(text); // Let the user type freely (e.g. adding "Apt 4B" manually)
    
    if (text.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Mapbox Geocoding is far superior for Indian addresses
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`);
      const data = await response.json();
      setResults(data.features || []);
      setIsOpen(true);
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle selecting from dropdown
  const handleSelectDropdown = (feature) => {
    const addressName = feature.place_name;
    const lng = feature.geometry.coordinates[0];
    const lat = feature.geometry.coordinates[1];
    
    onChangeText(addressName);
    onCoordinatesSelect(lat, lng);
    
    // Update map state in case they open the map next
    setMarkerPos({ lat, lng });
    setViewState({ latitude: lat, longitude: lng, zoom: 14 });
    setIsOpen(false);
  };

  // 3. Handle reverse geocoding after dropping a pin
  const handleConfirmPin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${markerPos.lng},${markerPos.lat}.json?access_token=${MAPBOX_TOKEN}`);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        onChangeText(data.features[0].place_name);
      } else {
        onChangeText("Pinned Location");
      }
      
      onCoordinatesSelect(markerPos.lat, markerPos.lng);
      setIsMapModalOpen(false);
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Minimalist Carto Positron Style for MapLibre
  const minimalistStyle = {
    version: 8,
    sources: {
      'carto-light': {
        type: 'raster',
        tiles: ['https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'],
        tileSize: 256,
      }
    },
    layers: [{ id: 'carto-light-layer', type: 'raster', source: 'carto-light', minzoom: 0, maxzoom: 22 }]
  };

  return (
    <div ref={wrapperRef} className="relative w-full z-[100]">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
          <input 
            type="text" 
            value={value}
            onChange={(e) => searchAddress(e.target.value)}
            placeholder={placeholder}
            className="w-full p-5 pl-12 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/10 focus:border-[#D97706]/30 text-[#292524] font-bold text-lg transition-all shadow-sm"
          />
          {loading && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#D97706]" />}
        </div>
        
        {/* Open Map Button */}
        <button
          type="button"
          onClick={() => setIsMapModalOpen(true)}
          className="shrink-0 w-[60px] h-[60px] md:h-[68px] bg-[#292524] text-[#FDFBF7] rounded-2xl flex items-center justify-center hover:bg-[#D97706] transition-colors shadow-sm"
          title="Pin exact location on map"
        >
          <MapIcon size={24} />
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <ul className="absolute top-full left-0 w-full mt-2 bg-white/90 backdrop-blur-2xl border border-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] overflow-hidden z-[9999]">
          {results.map((place) => (
            <li 
              key={place.id}
              onClick={() => handleSelectDropdown(place)}
              className="px-6 py-4 hover:bg-[#D97706]/10 cursor-pointer border-b border-[#292524]/5 last:border-none transition-colors"
            >
              <p className="font-bold text-[#292524]">{place.text}</p>
              <p className="text-xs font-medium text-[#78716C]">{place.place_name}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Full-screen Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
          <div className="w-full max-w-4xl bg-[#FDFBF7] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col relative h-[80vh]">
            
            <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center z-10">
              <div>
                <h3 className="font-black text-2xl text-[#292524] tracking-tight">Drop a Pin</h3>
                <p className="text-sm font-bold text-[#78716C]">Drag the marker to your exact location.</p>
              </div>
              <button type="button" onClick={() => setIsMapModalOpen(false)} className="text-gray-400 hover:text-red-500">
                Cancel
              </button>
            </div>

            <div className="flex-1 relative">
              <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                mapStyle={minimalistStyle}
              >
                <NavigationControl position="bottom-right" showCompass={false} />
                <Marker 
                  longitude={markerPos.lng} 
                  latitude={markerPos.lat} 
                  draggable 
                  onDragEnd={(e) => setMarkerPos({ lat: e.lngLat.lat, lng: e.lngLat.lng })}
                >
                  <Crosshair size={40} className="text-[#D97706] drop-shadow-lg -translate-y-1/2" />
                </Marker>
              </Map>
            </div>

            <div className="p-6 bg-white border-t border-gray-100 z-10">
              <button 
                type="button" 
                onClick={handleConfirmPin}
                className="w-full py-4 bg-[#D97706] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#B45309] transition-colors shadow-lg shadow-amber-900/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} /> Confirm Location</>}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}