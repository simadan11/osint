import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ScaleControl, LayersControl, GeoJSON, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ConflictEvent } from '../services/IntelService';

// Fix for default marker icon in Leaflet + React using CDN
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  center: [number, number];
  zoom: number;
  markers: any[];
  conflicts: ConflictEvent[];
  bordersData: any;
  showBorders: boolean;
  showConflicts: boolean;
  visionMode: 'standard' | 'infrared' | 'high-contrast' | 'night-vision';
  onMapClick: (e: L.LeafletMouseEvent) => void;
  onMouseMove: (lat: number, lng: number) => void;
}

const LocationMarker = ({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e);
    },
  });
  return null;
};

const MouseCoordinateTracker = ({ onMouseMove }: { onMouseMove: (lat: number, lng: number) => void }) => {
  useMapEvents({
    mousemove(e) {
      onMouseMove(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const Map: React.FC<MapProps> = ({ 
  center, 
  zoom, 
  markers, 
  conflicts, 
  bordersData, 
  showBorders, 
  showConflicts, 
  visionMode,
  onMapClick, 
  onMouseMove 
}) => {
  const borderStyle = {
    color: "#4f46e5",
    weight: 1,
    fillOpacity: 0.05,
    fillColor: "#4f46e5"
  };

  const getFilterClass = () => {
    switch(visionMode) {
      case 'infrared': return 'sepia(1) hue-rotate(300deg) saturate(3) brightness(0.8)';
      case 'high-contrast': return 'contrast(1.5) brightness(1.1) saturate(1.2)';
      case 'night-vision': return 'grayscale(1) brightness(0.7) sepia(1) hue-rotate(70deg) saturate(4) contrast(1.2)';
      default: return 'none';
    }
  };

  return (
    <div className="w-full h-full relative" style={{ filter: getFilterClass() }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
        maxZoom={22}
      >
        {showBorders && bordersData && (
          <GeoJSON data={bordersData} style={borderStyle} />
        )}

        {showConflicts && conflicts.map(event => (
          <React.Fragment key={event.id}>
            <Circle
              center={[event.lat, event.lng]}
              radius={50000}
              pathOptions={{
                color: event.severity === 'High' ? '#ef4444' : '#f97316',
                fillColor: event.severity === 'High' ? '#ef4444' : '#f97316',
                fillOpacity: 0.2,
                weight: 1
              }}
            />
            <Marker 
              position={[event.lat, event.lng]}
              icon={L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="w-3 h-3 bg-red-600 rounded-full border-2 border-white animate-pulse"></div>`,
                iconSize: [12, 12]
              })}
            >
              <Popup>
                <div className="bg-zinc-900 text-zinc-100 p-2 rounded border border-zinc-700">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Conflict</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{event.id}</span>
                  </div>
                  <h3 className="font-bold text-sm">{event.country}</h3>
                  <p className="text-xs mt-1 text-zinc-300">{event.description}</p>
                  <div className="mt-2 pt-2 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                    <span>Severity: {event.severity}</span>
                    <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Vantor Ultra (2026 High-Res)">
            <TileLayer
              attribution='&copy; <a href="https://www.vantor.com/">Vantor/Maxar</a> 2026 Intelligence Imagery'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={22}
              maxNativeZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Sentinel-2 (5-Day Fresh)">
            <TileLayer
              attribution='&copy; <a href="https://www.sentinel-hub.com/">Sentinel Hub</a> / ESA'
              url="https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2023_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="NASA VIIRS (Fire/Thermal)">
            <TileLayer
              attribution='&copy; <a href="https://nasa.gov/">NASA FIRMS</a>'
              url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_Thermal_Anomalies_375m_All/default/2026-01-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Night Lights (Black Marble)">
            <TileLayer
              attribution='&copy; <a href="https://nasa.gov/">NASA</a>'
              url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2026-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name="OSINT Grid">
             <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.Overlay>
        </LayersControl>

        <MapController center={center} zoom={zoom} />
        <LocationMarker onMapClick={onMapClick} />
        <MouseCoordinateTracker onMouseMove={onMouseMove} />
        <ScaleControl position="bottomleft" />
        
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position}>
            <Popup>
              <div className="text-sm font-sans">
                <p className="font-bold">{marker.title || 'Pinned Location'}</p>
                <p className="text-xs text-gray-500">{marker.position[0].toFixed(6)}, {marker.position[1].toFixed(6)}</p>
                {marker.description && <p className="mt-1">{marker.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;