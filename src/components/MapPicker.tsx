"use client";

import { useEffect, useState, useRef } from "react";
import { Coordinates } from "@/types";
import dynamic from "next/dynamic";

interface MapPickerProps {
  coordinates: Coordinates | null;
  onCoordinatesChange: (coords: Coordinates) => void;
}

// Dynamically import the actual map to avoid SSR issues
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-slate-200 rounded-lg flex items-center justify-center">
      <p className="text-slate-500">Loading map...</p>
    </div>
  ),
});

export function MapPicker({ coordinates, onCoordinatesChange }: MapPickerProps) {
  return (
    <LeafletMap
      coordinates={coordinates}
      onCoordinatesChange={onCoordinatesChange}
    />
  );
}
