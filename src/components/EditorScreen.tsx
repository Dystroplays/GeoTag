"use client";

import { useEffect, useCallback } from "react";
import { Photo, Coordinates } from "@/types";
import { PhotoQueue } from "./PhotoQueue";
import { PhotoPreview } from "./PhotoPreview";
import { MapPicker } from "./MapPicker";
import { CoordinateInputs } from "./CoordinateInputs";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

interface EditorScreenProps {
  photos: Photo[];
  currentIndex: number;
  onSelectPhoto: (index: number) => void;
  onCoordinatesChange: (photoId: string, coords: Coordinates) => void;
  onClearAll: () => void;
  onProcess: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function EditorScreen({
  photos,
  currentIndex,
  onSelectPhoto,
  onCoordinatesChange,
  onClearAll,
  onProcess,
  onPrevious,
  onNext,
}: EditorScreenProps) {
  const currentPhoto = photos[currentIndex];
  const taggedCount = photos.filter((p) => p.coordinates !== null).length;
  const canProcess = taggedCount > 0;

  const handleCoordinatesChange = (coords: Coordinates) => {
    if (currentPhoto) {
      onCoordinatesChange(currentPhoto.id, coords);
    }
  };

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "ArrowLeft" && currentIndex > 0) {
        e.preventDefault();
        onPrevious();
      } else if (e.key === "ArrowRight" && currentIndex < photos.length - 1) {
        e.preventDefault();
        onNext();
      }
    },
    [currentIndex, photos.length, onPrevious, onNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-slate-900">GeoTag</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <PhotoQueue
            photos={photos}
            currentIndex={currentIndex}
            onSelectPhoto={onSelectPhoto}
            onClearAll={onClearAll}
          />
        </div>

        {/* Main Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {currentPhoto ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Photo Preview */}
              <PhotoPreview photo={currentPhoto} />

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={onPrevious}
                  disabled={currentIndex === 0}
                  title="Previous (Left Arrow)"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="text-center">
                  <span className="text-sm text-slate-500 block">
                    Photo {currentIndex + 1} of {photos.length}
                  </span>
                  <span className="text-xs text-slate-400">
                    Use arrow keys to navigate
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={onNext}
                  disabled={currentIndex === photos.length - 1}
                  title="Next (Right Arrow)"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {/* Map */}
              <div>
                <h3 className="font-medium text-slate-900 mb-2">
                  Set Location
                </h3>
                <p className="text-sm text-slate-500 mb-3">
                  Click on the map to set GPS coordinates for this photo
                </p>
                <MapPicker
                  coordinates={currentPhoto.coordinates}
                  onCoordinatesChange={handleCoordinatesChange}
                />
              </div>

              {/* Coordinate Inputs */}
              <CoordinateInputs
                coordinates={currentPhoto.coordinates}
                onChange={handleCoordinatesChange}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-500">No photo selected</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {taggedCount} of {photos.length} photos tagged
        </p>
        <Button onClick={onProcess} disabled={!canProcess}>
          Process All Photos
        </Button>
      </footer>
    </div>
  );
}
