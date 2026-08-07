import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Marker, Polygon, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

// Fix for default marker icons in React Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function IncidentReportModal({ data, onClose }) {
  const [animValue, setAnimValue] = useState(0);

  // General animation loop (0 to 100)
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimValue(v => (v >= 100 ? 0 : v + 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const classification = data?.classification || {};
  const agents = data?.agents || {};

  const incidentType = (classification.incident_type || 'Fire').toLowerCase();
  const severity = classification.severity || 'High';
  const locationName = classification.location || 'Unknown Location';
  const casualties = classification.estimated_casualties || 'Unknown';

  const [mapCenter, setMapCenter] = useState([13.0827, 80.2707]); // Default Chennai

  useEffect(() => {
    // Dynamically fetch coordinates from Nominatim
    if (locationName && locationName !== 'Unknown Location') {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
        })
        .catch(err => console.error('Geocoding error:', err));
    }
  }, [locationName]);

  // --- Map Animation Logic ---
  const renderMapOverlay = () => {
    if (incidentType.includes('tsunami') || incidentType.includes('wave')) {
      // Tsunami: Polygon pushing inland from east coast, relative to mapCenter
      const lat = mapCenter[0];
      const lon = mapCenter[1];
      const coast = [
        [lat + 0.02, lon + 0.02],
        [lat, lon + 0.01],
        [lat - 0.03, lon],
        [lat - 0.06, lon - 0.01]
      ];
      // Push inland based on animValue (0 to 100)
      const surgeOffset = animValue * 0.0005;
      const surgePolygon = [
        ...coast,
        [lat - 0.06, lon - 0.01 - surgeOffset],
        [lat - 0.03, lon - surgeOffset],
        [lat, lon + 0.01 - surgeOffset],
        [lat + 0.02, lon + 0.02 - surgeOffset]
      ];

      return (
        <>
          <Polyline positions={coast} pathOptions={{ color: 'var(--cyan)', weight: 4 }} />
          <Polygon positions={surgePolygon} pathOptions={{ color: 'var(--cyan)', fillColor: 'var(--cyan)', fillOpacity: 0.4 }} />
        </>
      );
    }

    if (incidentType.includes('flood') || incidentType.includes('river') || incidentType.includes('rain')) {
      // Flood: Polyline representing a river, pulsing thickness, relative to mapCenter
      const lat = mapCenter[0];
      const lon = mapCenter[1];
      const riverPath = [
        [lat - 0.01, lon - 0.07],
        [lat, lon - 0.04],
        [lat - 0.01, lon - 0.02],
        [lat - 0.02, lon],
        [lat - 0.01, lon + 0.01]
      ];
      const pulseWeight = 5 + (Math.sin(animValue * Math.PI / 50) * 15); // Pulsing from 5 to 20

      return (
        <>
          <Polyline positions={riverPath} pathOptions={{ color: '#3b82f6', weight: 4 }} />
          <Polyline positions={riverPath} pathOptions={{ color: 'var(--cyan)', weight: pulseWeight, opacity: 0.4 }} />
        </>
      );
    }

    if (incidentType.includes('spill') || incidentType.includes('gas') || incidentType.includes('chemical')) {
      // Chemical Spill: Skewed/drifting polygon (wind)
      const driftX = (animValue / 100) * 0.02;
      const driftY = (animValue / 100) * 0.01;
      const plume = [
        [mapCenter[0], mapCenter[1]],
        [mapCenter[0] + 0.01 + driftY, mapCenter[1] + 0.01 + driftX],
        [mapCenter[0] + 0.02 + driftY, mapCenter[1] + 0.03 + driftX],
        [mapCenter[0] - 0.01 + driftY, mapCenter[1] + 0.02 + driftX],
      ];
      return (
        <Polygon positions={plume} pathOptions={{ color: 'var(--orange)', fillColor: 'var(--orange)', fillOpacity: 0.3 }} />
      );
    }

    // Default Fire/Explosion/Earthquake: Expanding circular blast
    const expandingRadius = 100 + (animValue * 10);
    return (
      <Circle
        center={mapCenter}
        radius={expandingRadius}
        pathOptions={{ color: 'var(--red)', fillColor: 'var(--red)', fillOpacity: 0.2, weight: 2 }}
      />
    );
  };

  // --- Dynamic Stats Logic ---
  const activeAgencies = Object.keys(agents).filter(a => a !== 'Dispatcher').length;
  const totalAgencies = 5;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-active)',
        borderRadius: '16px',
        width: '90%', maxWidth: '1000px',
        height: '85vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-glow-cyan)',
        overflow: 'hidden'
      }}>
        {/* HEADER */}
        <div style={{
          padding: '20px', borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <div>
            <h2 style={{ color: 'var(--cyan)', margin: 0, textTransform: 'uppercase' }}>LIVE {classification.incident_type || 'INCIDENT'} SUMMARY REPORT</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 0 0' }}>Generated by MINDWEAVERS AI • Level 4 Clearance</p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--red)', color: 'var(--red)',
            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
          }}>CLOSE</button>
        </div>

        {/* CONTENT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>

          {/* MAP SECTION */}
          <div style={{ borderRight: '1px solid var(--border-subtle)', position: 'relative' }}>
            <MapContainer key={mapCenter.join(',')} center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={mapCenter}>
                <Popup>Reported Origin</Popup>
              </Marker>

              {renderMapOverlay()}

            </MapContainer>

            <div style={{
              position: 'absolute', top: '10px', left: '10px', zIndex: 1000,
              background: 'rgba(0,0,0,0.8)', border: '1px solid var(--cyan)',
              padding: '10px', borderRadius: '8px', color: 'white', fontSize: '11px'
            }}>
              📍 <strong>LOCATION:</strong> {locationName}<br />
              ⚠️ <strong>INCIDENT:</strong> {classification.incident_type || 'Unknown'}<br />
              📊 <strong>SEVERITY:</strong> {severity}
            </div>
          </div>

          {/* DATA SECTION */}
          <div style={{ padding: '24px', overflowY: 'auto' }}>
            <h3 style={{ color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '20px' }}>
              EXECUTIVE BRIEFING
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ color: 'var(--red)', fontSize: '24px', fontWeight: 'bold' }}>{severity.toUpperCase()}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Threat Level</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ color: 'var(--emerald)', fontSize: '24px', fontWeight: 'bold' }}>{activeAgencies} / {totalAgencies}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Agencies Deployed</div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: 'var(--cyan)', marginBottom: '10px', fontSize: '12px', textTransform: 'uppercase' }}>Situation Overview</h4>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid var(--orange)' }}>
                <strong>Est. Casualties:</strong> {casualties}<br />
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  This incident requires immediate multi-agency coordination. {activeAgencies > 0 ? `${activeAgencies} agencies have already been dispatched.` : 'Awaiting dispatch confirmation.'}
                </p>
              </div>
            </div>

            <div>
              <h4 style={{ color: 'var(--emerald)', marginBottom: '10px', fontSize: '12px', textTransform: 'uppercase' }}>Strategic Priority</h4>
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
                {classification.strategic_priority || 'Awaiting strategic assessment...'}
              </div>
            </div>

            {Object.keys(agents).length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ color: 'var(--cyan)', marginBottom: '10px', fontSize: '12px', textTransform: 'uppercase' }}>Agency Actions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.keys(agents).filter(a => a !== 'Dispatcher').map(agency => (
                    <div key={agency} style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{agency}:</strong> {agents[agency].action_description}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
