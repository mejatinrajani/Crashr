// src/Map.jsx
import { useRef, useEffect } from 'react'
import * as mapboxgl from 'mapbox-gl/esm'
import 'mapbox-gl/dist/mapbox-gl.css';

function Map() {
  const mapRef = useRef()
  const mapContainerRef = useRef()

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoibmloYWx0cmlwYXRoaSIsImEiOiJjbXV6aXBwYTUwam9yMndzaHZ5azc4ZHcyIn0.3eHslye6bClItG27IOSkgA',
      container: mapContainerRef.current,
      center: [-71.06776, 42.35816],
      zoom: 9
    });

    return () => { mapRef.current.remove() }
  }, [])

  return <div id='map-container' ref={mapContainerRef}/>
}

export default Map