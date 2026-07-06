import React from 'react';
import { Crosshair, Info, List, Trash2, Download } from 'lucide-react';

interface SidebarProps {
  currentCoords: { lat: number; lng: number };
  mouseCoords: { lat: number; lng: number };
  markers: any[];
  visionMode: string;
  setVisionMode: (mode: any) => void;
  onJumpTo: (lat: number, lng: number, zoom: number) => void;
  onClearMarkers: () => void;
  onExportData: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentCoords, 
  mouseCoords, 
  markers, 
  visionMode,
  setVisionMode,
  onJumpTo,
  onClearMarkers, 
  onExportData 
}) => {
  return (
    <div className="w-80 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full text-zinc-300 overflow-hidden shadow-2xl z-[1000]">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 flex items-center gap-2">
        <div className="p-2 bg-red-600 rounded-lg animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]">
          <Crosshair className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight flex items-center gap-2">
            OSINT INTEL v4.5 <span className="bg-red-600 text-[8px] px-1 rounded">2026 LIVE</span>
          </h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Quantum-Resistant Analysis</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* Intelligence Feed */}
        <section className="bg-red-950/20 border border-red-900/30 p-3 rounded-lg">
          <h2 className="text-[10px] font-bold text-red-500 uppercase mb-2 flex items-center gap-2 text-glow-red">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> Real-time Events (2026)
          </h2>
          <div className="space-y-2 text-[11px]">
            <div className="border-l-2 border-red-800 pl-2">
              <p className="text-zinc-400 font-mono">09:42 UTC - Satellite VNT-9 active over AOI-4</p>
            </div>
            <div className="border-l-2 border-zinc-800 pl-2 cursor-pointer hover:bg-zinc-800 p-1 rounded transition-colors" onClick={() => onJumpTo(48.46, 35.04, 15)}>
              <p className="text-zinc-500 font-mono italic underline">Intercepting Dnipro comms link...</p>
            </div>
          </div>
        </section>

        {/* Hotspots Section */}
        <section>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase mb-3 flex items-center gap-2">
             Jump to AOIs
          </h2>
          <div className="grid grid-cols-2 gap-2">
             {[
               { name: 'Kyiv, UA', pos: [50.45, 30.52] },
               { name: 'Gaza City', pos: [31.5, 34.46] },
               { name: 'Khartoum, SD', pos: [15.5, 32.55] },
               { name: 'Taipei, TW', pos: [25.03, 121.56] }
             ].map((aoi) => (
               <button 
                key={aoi.name}
                onClick={() => onJumpTo(aoi.pos[0], aoi.pos[1], 15)}
                className="text-[10px] bg-zinc-900 border border-zinc-800 py-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-400"
               >
                 {aoi.name}
               </button>
             ))}
          </div>
        </section>

        {/* Vision Processing */}
        <section>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase mb-3 flex items-center gap-2">
             Vision Filters
          </h2>
          <div className="flex flex-wrap gap-2">
             {['standard', 'infrared', 'high-contrast', 'night-vision'].map((mode) => (
               <button 
                key={mode}
                onClick={() => setVisionMode(mode)}
                className={`text-[9px] px-2 py-1 rounded border uppercase font-bold transition-all ${visionMode === mode ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
               >
                 {mode.replace('-', ' ')}
               </button>
             ))}
          </div>
        </section>
        {/* Intelligence Feed */}
        <section className="bg-red-950/20 border border-red-900/30 p-3 rounded-lg">
          <h2 className="text-[10px] font-bold text-red-500 uppercase mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> Real-time Events (2026)
          </h2>
          <div className="space-y-2 text-[11px]">
            <div className="border-l-2 border-red-800 pl-2">
              <p className="text-zinc-400 font-mono">09:42 UTC - Satellite VNT-9 active over AOI-4</p>
            </div>
            <div className="border-l-2 border-zinc-800 pl-2">
              <p className="text-zinc-500 font-mono italic">Searching for thermal anomalies...</p>
            </div>
          </div>
        </section>

        {/* Coordinates Section */}
        <section>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase mb-3 flex items-center gap-2">
            <Info className="w-3 h-3" /> Signal Data
          </h2>
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 shadow-inner">
              <label className="text-[10px] text-zinc-600 uppercase block mb-1">Center Datum</label>
              <div className="font-mono text-sm flex justify-between">
                <span>{currentCoords.lat.toFixed(6)}N</span>
                <span>{currentCoords.lng.toFixed(6)}E</span>
              </div>
            </div>
            <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 shadow-inner">
              <label className="text-[10px] text-zinc-600 uppercase block mb-1">Intercept Pos</label>
              <div className="font-mono text-sm flex justify-between text-blue-500">
                <span>{mouseCoords.lat.toFixed(6)}</span>
                <span>{mouseCoords.lng.toFixed(6)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Markers List */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-2">
              <List className="w-3 h-3" /> Pinned Locations
            </h2>
            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">{markers.length}</span>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {markers.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-600 italic">Click on map to add markers</p>
              </div>
            ) : (
              markers.map((m, i) => (
                <div key={i} className="bg-zinc-800/30 p-2 rounded border border-zinc-700/30 hover:bg-zinc-800 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-zinc-200">Marker #{i + 1}</span>
                    <span className="text-[9px] text-zinc-500 font-mono">{m.position[0].toFixed(4)}, {m.position[1].toFixed(4)}</span>
                  </div>
                  {m.title && <p className="text-[10px] text-zinc-400 mt-1">{m.title}</p>}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Action Controls */}
        <section className="pt-4 space-y-2">
          <button 
            onClick={onExportData}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-all"
          >
            <Download className="w-4 h-4" /> Export GeoJSON
          </button>
          <button 
            onClick={onClearMarkers}
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-red-900/40 text-zinc-400 hover:text-red-400 py-2 rounded-lg text-sm font-medium transition-all border border-zinc-700"
          >
            <Trash2 className="w-4 h-4" /> Clear All Markers
          </button>
        </section>
      </div>

      <div className="p-4 border-t border-zinc-800 text-[10px] text-zinc-600 bg-zinc-900/80">
        <p>© 2026 OSINT SOLUTIONS INTEL</p>
        <p>Satellite Data Source: ESRI / DigitalGlobe</p>
      </div>
    </div>
  );
};

export default Sidebar;