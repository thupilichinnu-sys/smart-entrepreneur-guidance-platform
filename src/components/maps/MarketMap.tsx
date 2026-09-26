import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Store, ShoppingBag, Eye, Layers, Compass } from 'lucide-react';
import { DEMO_LOCATION_GEO, DEMO_COMPETITORS, DEMO_LOCAL_HUBS } from '../../data/marketGeoData';
import { useLanguage } from '../../context/LanguageContext';

export const MarketMap: React.FC<{
  centerLat?: number;
  centerLng?: number;
  locationName?: string;
  className?: string;
}> = ({
  centerLat = DEMO_LOCATION_GEO.lat,
  centerLng = DEMO_LOCATION_GEO.lng,
  locationName = DEMO_LOCATION_GEO.name,
  className = 'h-96'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { lowDataMode } = useLanguage();

  const [filter, setFilter] = useState<'all' | 'competitors' | 'hubs'>('all');
  const [selectedPin, setSelectedPin] = useState<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // Tile layer: Clean OpenStreetMap or low-bandwidth
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    map.setView([centerLat, centerLng], 12);

    // Clear existing overlay layers (keep base tile layer)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // 1. Center Village Pin
    const centerIcon = L.divIcon({
      className: 'custom-pin-center',
      html: `<div style="background:#059669; color:white; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 4px 6px -1px rgba(0,0,0,0.2);"><svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'><circle cx='12' cy='12' r='3'/><path d='M12 2v3m0 14v3M2 12h3m14 0h3'/></svg></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const centerMarker = L.marker([centerLat, centerLng], { icon: centerIcon }).addTo(map);
    centerMarker.bindPopup(`<b>${locationName}</b><br/><span style="font-size:11px; color:#059669;">Proposed Business Base Location</span>`);

    // 2. Add 5 km & 10 km Radius Zones
    if (!lowDataMode) {
      // 5 km cluster (Emerald tint)
      L.circle([centerLat, centerLng], {
        radius: 5000,
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '4, 4'
      }).addTo(map).bindTooltip('5 km Direct Consumer Cluster', { permanent: false });

      // 10 km regional radius (Blue tint)
      L.circle([centerLat, centerLng], {
        radius: 10000,
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.05,
        weight: 1.5,
        dashArray: '6, 6'
      }).addTo(map).bindTooltip('10 km Regional Market Radius', { permanent: false });
    }

    // 3. Add Competitors (Red Pins)
    if (filter === 'all' || filter === 'competitors') {
      DEMO_COMPETITORS.forEach((comp) => {
        const compIcon = L.divIcon({
          className: 'custom-pin-comp',
          html: `<div style="background:#dc2626; color:white; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.2);"><svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/></svg></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker(comp.coordinates, { icon: compIcon }).addTo(map);
        marker.on('click', () => setSelectedPin(comp));
        marker.bindPopup(`
          <div style="font-size:12px;">
            <b style="color:#b91c1c;">${comp.name}</b><br/>
            <span style="color:#64748b;">${comp.category} (${comp.distanceKm} km away)</span><br/>
            <div style="margin-top:4px; padding:4px; background:#fef2f2; border-radius:4px;">
              <b>Identified Gap:</b> ${comp.keyGaps}
            </div>
          </div>
        `);
      });
    }

    // 4. Add Local Mandis and Hubs (Blue/Amber Pins)
    if (filter === 'all' || filter === 'hubs') {
      DEMO_LOCAL_HUBS.forEach((hub) => {
        const hubIcon = L.divIcon({
          className: 'custom-pin-hub',
          html: `<div style="background:#2563eb; color:white; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.2);"><svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z'/><line x1='3' y1='6' x2='21' y2='6'/><path d='M16 10a4 4 0 0 1-8 0'/></svg></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker(hub.coordinates as [number, number], { icon: hubIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-size:12px;">
            <b style="color:#1d4ed8;">${hub.name}</b><br/>
            <span style="color:#64748b;">${hub.type} (${hub.distanceKm} km)</span><br/>
            <p style="margin-top:4px; font-size:11px;">${hub.description}</p>
          </div>
        `);
      });
    }

    return () => {
      // Keep map reference stable across fast re-renders
    };
  }, [centerLat, centerLng, filter, lowDataMode]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      
      {/* Top Map Controls Bar */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-emerald-600" /> Filter:
        </span>
        <button
          onClick={() => setFilter('all')}
          className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
            filter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Layers
        </button>
        <button
          onClick={() => setFilter('competitors')}
          className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
            filter === 'competitors' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Competitors (4)
        </button>
        <button
          onClick={() => setFilter('hubs')}
          className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
            filter === 'hubs' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Mandis & Hubs (3)
        </button>
      </div>

      {/* Mandatory Demo Data Notice Tag */}
      <div className="absolute top-3 right-3 z-[400] bg-amber-500/90 text-white font-bold text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-md shadow-sm border border-amber-600 backdrop-blur">
        DEMO DATA
      </div>

      {/* Leaflet Map Canvas Container */}
      <div ref={mapContainerRef} className={`w-full ${className} z-10`} />

      {/* Radius & Marker Legend Footer */}
      <div className="p-3 bg-white border-t border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block border-2 border-white shadow-xs" />
            Your Location
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block border-2 border-white shadow-xs" />
            Competitors
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block border-2 border-white shadow-xs" />
            Mandi / Haat Hubs
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-4 h-2 rounded-sm border border-dashed border-emerald-500 bg-emerald-100/60 inline-block" />
            5 km Immediate Cluster
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Interactive GIS radius view powered by OpenStreetMap
        </p>
      </div>
    </div>
  );
};
