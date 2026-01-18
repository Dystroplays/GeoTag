"use client";

import { Photo } from "@/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PhotoQueueProps {
  photos: Photo[];
  currentIndex: number;
  onSelectPhoto: (index: number) => void;
  onClearAll: () => void;
}

export function PhotoQueue({
  photos,
  currentIndex,
  onSelectPhoto,
  onClearAll,
}: PhotoQueueProps) {
  const taggedCount = photos.filter((p) => p.coordinates !== null).length;

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-slate-900">
          Photos ({currentIndex + 1} of {photos.length})
        </h2>
        <p className="text-sm text-slate-500">
          {taggedCount} of {photos.length} tagged
        </p>
      </div>

      {/* Photo List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                index === currentIndex
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-transparent hover:border-slate-300"
              )}
              onClick={() => onSelectPhoto(index)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.preview}
                alt={photo.name}
                className="w-full h-full object-cover"
              />
              {/* Coordinate indicator */}
              {photo.coordinates && (
                <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              {/* Filename tooltip */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                {photo.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <button
          className="text-sm text-slate-500 hover:text-red-500 transition-colors"
          onClick={onClearAll}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
