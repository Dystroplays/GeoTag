"use client";

import { Coordinates } from "@/types";

interface CoordinateInputsProps {
  coordinates: Coordinates | null;
  onChange: (coordinates: Coordinates) => void;
}

export function CoordinateInputs({
  coordinates,
  onChange,
}: CoordinateInputsProps) {
  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lat = parseFloat(e.target.value);
    if (!isNaN(lat) && lat >= -90 && lat <= 90) {
      onChange({
        latitude: lat,
        longitude: coordinates?.longitude ?? 0,
      });
    }
  };

  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lng = parseFloat(e.target.value);
    if (!isNaN(lng) && lng >= -180 && lng <= 180) {
      onChange({
        latitude: coordinates?.latitude ?? 0,
        longitude: lng,
      });
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Latitude
        </label>
        <input
          type="number"
          step="any"
          min="-90"
          max="90"
          value={coordinates?.latitude ?? ""}
          onChange={handleLatChange}
          placeholder="e.g., 40.7128"
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Longitude
        </label>
        <input
          type="number"
          step="any"
          min="-180"
          max="180"
          value={coordinates?.longitude ?? ""}
          onChange={handleLngChange}
          placeholder="e.g., -74.0060"
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    </div>
  );
}
