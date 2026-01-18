"use client";

import { useEffect, useRef, useState } from "react";
import { Coordinates } from "@/types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

interface LeafletMapProps {
  coordinates: Coordinates | null;
  onCoordinatesChange: (coords: Coordinates) => void;
}

// Default center (US center)
const DEFAULT_CENTER: [number, number] = [39.8283, -98.5795];
const DEFAULT_ZOOM = 4;

export default function LeafletMap({
  coordinates,
  onCoordinatesChange,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map
    const map = L.map(mapContainerRef.current).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    mapRef.current = map;

    // Add tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Handle map click
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onCoordinatesChange({ latitude: lat, longitude: lng });
    });

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onCoordinatesChange]);

  // Update marker when coordinates change
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Add new marker if coordinates exist
    if (coordinates) {
      const marker = L.marker([coordinates.latitude, coordinates.longitude]).addTo(
        mapRef.current
      );
      markerRef.current = marker;

      // Pan to marker
      mapRef.current.panTo([coordinates.latitude, coordinates.longitude]);
    }
  }, [coordinates]);

  return (
    <div
      ref={mapContainerRef}
      className="h-[400px] rounded-lg overflow-hidden border border-slate-200"
      style={{ zIndex: 1 }}
    />
  );
}
