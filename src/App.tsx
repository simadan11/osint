import { useState, useCallback, useEffect } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import { Crosshair, ZoomIn, ZoomOut, Compass, ShieldAlert, Globe } from 'lucide-react';
import { fetchConflictData, fetchBorders, ConflictEvent } from './services/IntelService';

function App() {
  const [viewState, setViewState] = useState({
    center: [20, 0] as [number, number],
    zoom: 3,
  });
  
  const [mouseCoords, setMouseCoords] = useState({ lat: 0, lng: 0 });
  const [markers, setMarkers] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<ConflictEvent[]>([]);
  const [bordersData, setBordersData] = useState<any>(null);
  const [showBorders, setShowBorders] = useState(true);
  const [showConflicts, setShowConflicts] = useState(true);
  const [visionMode, setVisionMode] = useState<'standard' | 'infrared' | 'high-contrast' | 'night-vision'>('standard');
  const [isScanning, setIsScanning] = useState(false);

  const handleJumpTo = useCallback((lat: number, lng: number, zoom: number) => {
    setViewState({ center: [lat, lng], zoom });
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1500);
  }, []);

  useEffect(() => {
    // Initial data load
    const loadData = async () => {
      try {
        const [conflictData, borders] = await Promise.all([
          fetchConflictData(),
          fetchBorders()
        ]);
        setConflicts(conflictData);
        setBordersData(borders);
      } catch (err) {
        console.error("Failed to load map intel:", err);
      }
    };
    loadData();

    // Auto-update conflicts every 60 seconds
    const interval = setInterval(async () => {
      setIsScanning(true);
      const data = await fetchConflictData();
      setConflicts(data);
      setTimeout(() => setIsScanning(false), 2000);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleMapClick = useCallback((e: any) => {
    const newMarker = {
      position: [e.latlng.lat, e.latlng.lng],
      title: `Point ${markers.length + 1}`,
      timestamp: new Date().toISOString(),
    };
    setMarkers((prev) => [...prev, newMarker]);
  }, [markers.length]);

  const handleMouseMove = useCallback((lat: number, lng: number) => {
    setMouseCoords({ lat, lng });
  }, []);

  const handleSearchResult = useCallback((lat: number, lng: number, title: string) => {
    setViewState({ center: [lat, lng], zoom: 16 });
    setMarkers((prev) => [...prev, { position: [lat, lng], title }]);
  }, []);

  const clearMarkers = () => {
    setMarkers([]);
  };

  const exportData = () => {
    const data = {
      type: "FeatureCollection",
      features: markers.map((m) => ({
        type: "Feature",
        properties: { name: m.title, timestamp: m.timestamp },
        geometry: {
          type: "Point",
          coordinates: [m.position[1], m.position[0]]
        }
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `osint_export_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-white font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <Sidebar 
        currentCoords={{ lat: viewState.center[0], lng: viewState.center[1] }}
        mouseCoords={mouseCoords}
        markers={markers}
        visionMode={visionMode}
        setVisionMode={setVisionMode}
        onJumpTo={handleJumpTo}
        onClearMarkers={clearMarkers}
        onExportData={exportData}
      />

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        <SearchBar onSearchResult={handleSearchResult} />
        
        {/* HUD Elements */}
        <div className="absolute top-4 right-4 z-[1001] flex flex-col gap-2">
           <button 
            onClick={() => setShowBorders(!showBorders)}
            className={`p-2 backdrop-blur-md border rounded-lg transition-colors shadow-lg ${showBorders ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-zinc-900/90 border-zinc-700 text-zinc-400'}`} 
            title="Toggle Borders"
           >
            <Globe className="w-5 h-5" />
           </button>
           <button 
            onClick={() => setShowConflicts(!showConflicts)}
            className={`p-2 backdrop-blur-md border rounded-lg transition-colors shadow-lg ${showConflicts ? 'bg-red-600/20 border-red-500 text-red-400' : 'bg-zinc-900/90 border-zinc-700 text-zinc-400'}`} 
            title="Toggle Conflict Zones"
           >
            <ShieldAlert className="w-5 h-5" />
           </button>
           <button 
            className="p-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors shadow-lg text-blue-400"
            onClick={() => setViewState({ ...viewState, center: [mouseCoords.lat, mouseCoords.lng] })}
            title="Recenter"
           >
            <Crosshair className="w-5 h-5" />
           </button>
        </div>

        <div className="absolute bottom-10 right-4 z-[1001] flex flex-col gap-2">
           <button 
            className="p-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors shadow-lg"
            onClick={() => setViewState(v => ({ ...v, zoom: v.zoom + 1 }))}
           >
            <ZoomIn className="w-5 h-5" />
           </button>
           <button 
            className="p-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors shadow-lg"
            onClick={() => setViewState(v => ({ ...v, zoom: v.zoom - 1 }))}
           >
            <ZoomOut className="w-5 h-5" />
           </button>
        </div>

        <div className="absolute bottom-4 left-4 z-[1001] bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 px-4 py-2 rounded-lg shadow-2xl text-[10px] font-mono text-zinc-400 flex flex-col gap-1">
           <div className="flex items-center gap-2">
              <Compass className={`w-3 h-3 text-blue-500 ${isScanning ? 'animate-spin' : 'animate-spin-slow'}`} />
              <span className="text-zinc-500">SYSTEM_STATUS: <span className={isScanning ? "text-blue-400 animate-pulse" : "text-green-500"}>{isScanning ? "SCANNING..." : "ONLINE"}</span></span>
           </div>
           <div className="flex gap-4 border-t border-zinc-800 pt-1 mt-1">
              <span>LAT: {mouseCoords.lat.toFixed(6)}</span>
              <span>LNG: {mouseCoords.lng.toFixed(6)}</span>
              <span className="text-blue-500/50">REF_ID: 2026-XQ-ALPHA</span>
           </div>
        </div>

        {/* Map Component */}
        <Map 
          center={viewState.center}
          zoom={viewState.zoom}
          markers={markers}
          conflicts={conflicts}
          bordersData={bordersData}
          showBorders={showBorders}
          showConflicts={showConflicts}
          visionMode={visionMode}
          onMapClick={handleMapClick}
          onMouseMove={handleMouseMove}
        />
      </main>
    </div>
  );
}

export default App;