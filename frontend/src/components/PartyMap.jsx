import { useState } from 'react';
// Notice the /maplibre import path!
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from 'lucide-react';

export default function PartyMap({ lat, lng, isExact = false }) {
  const [viewState, setViewState] = useState({
    longitude: lng,
    latitude: lat,
    zoom: isExact ? 14 : 12
  });

  // A sleek, minimal, no-API-key map style using Carto Positron tiles
  const minimalistStyle = {
    version: 8,
    sources: {
      'carto-light': {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
          'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
          'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'
        ],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap contributors, &copy; CARTO'
      }
    },
    layers: [
      {
        id: 'carto-light-layer',
        type: 'raster',
        source: 'carto-light',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  };

  return (
    <div className="w-full h-[300px] rounded-[2rem] overflow-hidden border border-white/60 shadow-inner relative group">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={minimalistStyle}
      >
        <NavigationControl position="bottom-right" showCompass={false} />
        
        {isExact ? (
          <Marker longitude={lng} latitude={lat} anchor="bottom">
            <div className="animate-bounce">
              <MapPin size={32} className="text-[#D97706] drop-shadow-md" fill="#FDFBF7" />
            </div>
          </Marker>
        ) : (
          /* Blurred Privacy Radius for unconfirmed guests */
          <Marker longitude={lng} latitude={lat} anchor="center">
            <div className="w-32 h-32 bg-[#D97706]/10 rounded-full border-2 border-[#D97706]/40 flex items-center justify-center animate-pulse backdrop-blur-sm">
              <div className="bg-white/90 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#D97706] shadow-sm">
                General Area
              </div>
            </div>
          </Marker>
        )}
      </Map>
    </div>
  );
}