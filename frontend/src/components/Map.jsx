
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function Map() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!MAPBOX_TOKEN) {
      console.error(
        'Mapbox token is missing. Check frontend/.env'
      );
      return;
    }

    const map = new mapboxgl.Map({
      accessToken: MAPBOX_TOKEN,
      container: mapContainerRef.current,
      center: [-71.06776, 42.35816],
      zoom: 9,
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      id="map-container"
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '400px',
      }}
    />
  );
}

export default Map;
