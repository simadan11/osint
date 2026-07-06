import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearchResult: (lat: number, lng: number, title: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResult }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        onSearchResult(parseFloat(lat), parseFloat(lon), display_name);
        setQuery('');
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching for location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] w-full max-w-md px-4">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search coordinates or address..."
          className="w-full bg-zinc-900/90 backdrop-blur-md border border-zinc-700 text-white pl-10 pr-4 py-3 rounded-xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-500"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-zinc-500" />
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;