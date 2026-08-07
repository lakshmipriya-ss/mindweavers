import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

export function LiveGlobe({ latitude, longitude }: { latitude?: number, longitude?: number }) {
  const globeRef = useRef<any>();
  const [countries, setCountries] = useState<any>({ features: [] });

  useEffect(() => {
    // Load GeoJSON for the globe's landmass
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => setCountries(data));
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      // Auto-rotate setup
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;

      // Focus on the specific coordinates if they exist
      if (latitude !== undefined && longitude !== undefined && latitude !== 0) {
        globeRef.current.pointOfView({ lat: latitude, lng: longitude, altitude: 1.5 }, 1500);
      }
    }
  }, [latitude, longitude]);

  // Data for the marker pin
  const markerData = (latitude !== undefined && longitude !== undefined && latitude !== 0) 
    ? [{ lat: latitude, lng: longitude }]
    : [];

  return (
    <div className="w-full h-full flex items-center justify-center rounded-2xl overflow-hidden relative" style={{ minHeight: '400px' }}>
      <Globe
        ref={globeRef}
        width={380}
        height={380}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-water.png"
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.7}
        hexPolygonColor={() => '#a855f7'} // Purple dotted look
        labelsData={markerData}
        labelLat={d => d.lat}
        labelLng={d => d.lng}
        labelText={() => '🔴'}
        labelSize={4}
        labelDotRadius={1}
        labelColor={() => '#06b6d4'} // Cyan marker
        labelResolution={2}
        animateIn={true}
      />
    </div>
  );
}
