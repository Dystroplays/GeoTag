"use client";

import { useState } from "react";

interface ZipCodeSearchProps {
  onLocationFound: (lat: number, lng: number) => void;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export function ZipCodeSearch({ onLocationFound }: ZipCodeSearchProps) {
  const [zipCode, setZipCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const trimmedZip = zipCode.trim();
    if (!/^\d{5}$/.test(trimmedZip)) {
      setError("Enter a valid 5-digit zip code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${trimmedZip}&country=USA&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "GeoTag-App/1.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network error");
      }

      const results: NominatimResult[] = await response.json();

      if (results.length === 0) {
        setError("Zip code not found");
        return;
      }

      const { lat, lon } = results[0];
      onLocationFound(parseFloat(lat), parseFloat(lon));
      setZipCode("");
    } catch {
      setError("Search failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
  };

  return (
    <div className="absolute top-3 left-3 z-[1000]">
      <div className="flex gap-2">
        <input
          type="text"
          value={zipCode}
          onChange={(e) => {
            setZipCode(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Zip code"
          maxLength={5}
          className="w-24 px-3 py-2 text-sm border border-slate-300 rounded-md
                     bg-white shadow-md focus:outline-none focus:ring-2
                     focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !zipCode.trim()}
          className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md shadow-md
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : "Go"}
        </button>
      </div>

      {error && (
        <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md
                        shadow-md text-xs text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
