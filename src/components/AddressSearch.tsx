"use client";

import { useState, useRef, useEffect } from "react";

interface AddressSearchProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  place_id: number;
}

export function AddressSearch({ onLocationSelect }: AddressSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("Please enter an address to search");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);
    setShowResults(false);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: trimmedQuery,
          format: "json",
          limit: "5",
          countrycodes: "us",
        }),
        {
          headers: {
            "User-Agent": "GeoTag-App/1.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network error");
      }

      const data: NominatimResult[] = await response.json();

      if (data.length === 0) {
        setError("No results found. Try a more specific address.");
        return;
      }

      if (data.length === 1) {
        handleSelect(data[0]);
      } else {
        setResults(data);
        setShowResults(true);
      }
    } catch {
      setError("Search failed. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (result: NominatimResult) => {
    onLocationSelect(parseFloat(result.lat), parseFloat(result.lon));
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
    if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search address or place..."
          className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md
                     bg-white focus:outline-none focus:ring-2
                     focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : "Search"}
        </button>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200
                        rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.place_id}
              onClick={() => handleSelect(result)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100
                         border-b border-slate-100 last:border-b-0"
            >
              {result.display_name}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md
                        text-xs text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
