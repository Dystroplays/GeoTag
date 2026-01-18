"use client";

import { useState, useCallback } from "react";
import { AppScreen, Photo, Coordinates } from "@/types";
import { UploadScreen } from "@/components/UploadScreen";
import { EditorScreen } from "@/components/EditorScreen";
import { ProcessingScreen } from "@/components/ProcessingScreen";
import { CompleteScreen } from "@/components/CompleteScreen";
import { isHeic, convertHeicToJpeg } from "@/lib/heicConverter";
import { processAllPhotos } from "@/lib/imageProcessing";
import { generateZip, downloadBlob, generateZipFilename } from "@/lib/zipGenerator";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("upload");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0 });
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 15);

  // Handle file selection from upload screen
  const handleFilesSelected = useCallback(async (files: File[]) => {
    const validFiles = files.filter((file) => {
      const isValidType =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif");
      return isValidType;
    });

    if (validFiles.length === 0) {
      alert("No valid image files selected. Please select JPEG, PNG, or HEIC files.");
      return;
    }

    setIsUploading(true);

    try {
      // Create Photo objects with HEIC conversion
      const newPhotos: Photo[] = await Promise.all(
        validFiles.map(async (file) => {
          let previewBlob: Blob = file;

          // Convert HEIC to JPEG for preview
          if (isHeic(file)) {
            try {
              previewBlob = await convertHeicToJpeg(file);
            } catch (error) {
              console.error(`Failed to convert ${file.name}:`, error);
              // Fall back to original file if conversion fails
              previewBlob = file;
            }
          }

          const preview = URL.createObjectURL(previewBlob);
          return {
            id: generateId(),
            file,
            name: file.name,
            preview,
            coordinates: null,
            status: "pending" as const,
          };
        })
      );

      setPhotos(newPhotos);
      setCurrentIndex(0);
      setCurrentScreen("editor");
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Handle coordinate changes
  const handleCoordinatesChange = useCallback(
    (photoId: string, coords: Coordinates) => {
      setPhotos((prev) =>
        prev.map((p) => (p.id === photoId ? { ...p, coordinates: coords } : p))
      );
    },
    []
  );

  // Navigation
  const handleSelectPhoto = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(photos.length - 1, prev + 1));
  }, [photos.length]);

  // Clear all photos
  const handleClearAll = useCallback(() => {
    // Clean up preview URLs
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setPhotos([]);
    setCurrentIndex(0);
    setCurrentScreen("upload");
  }, [photos]);

  // Process photos
  const handleProcess = useCallback(async () => {
    const photosToProcess = photos.filter((p) => p.coordinates !== null);
    if (photosToProcess.length === 0) return;

    setProcessingProgress({ current: 0, total: photosToProcess.length });
    setCurrentScreen("processing");

    try {
      // Process all photos with real compression and EXIF writing
      const processedBlobs = await processAllPhotos(photos, (current, total) => {
        setProcessingProgress({ current, total });
      });

      // Generate ZIP file
      const zip = await generateZip(photos, processedBlobs);
      setZipBlob(zip);
      setProcessedCount(processedBlobs.size);
      setCurrentScreen("complete");
    } catch (error) {
      console.error("Processing failed:", error);
      alert("Failed to process photos. Please try again.");
      setCurrentScreen("editor");
    }
  }, [photos]);

  // Download ZIP
  const handleDownload = useCallback(() => {
    if (!zipBlob) return;
    downloadBlob(zipBlob, generateZipFilename());
  }, [zipBlob]);

  // Start over
  const handleStartOver = useCallback(() => {
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setPhotos([]);
    setCurrentIndex(0);
    setZipBlob(null);
    setCurrentScreen("upload");
  }, [photos]);

  // Render current screen
  switch (currentScreen) {
    case "upload":
      return <UploadScreen onFilesSelected={handleFilesSelected} isLoading={isUploading} />;

    case "editor":
      return (
        <EditorScreen
          photos={photos}
          currentIndex={currentIndex}
          onSelectPhoto={handleSelectPhoto}
          onCoordinatesChange={handleCoordinatesChange}
          onClearAll={handleClearAll}
          onProcess={handleProcess}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      );

    case "processing":
      return (
        <>
          <EditorScreen
            photos={photos}
            currentIndex={currentIndex}
            onSelectPhoto={handleSelectPhoto}
            onCoordinatesChange={handleCoordinatesChange}
            onClearAll={handleClearAll}
            onProcess={handleProcess}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
          <ProcessingScreen
            current={processingProgress.current}
            total={processingProgress.total}
          />
        </>
      );

    case "complete":
      return (
        <CompleteScreen
          photoCount={processedCount}
          onDownload={handleDownload}
          onStartOver={handleStartOver}
        />
      );

    default:
      return <UploadScreen onFilesSelected={handleFilesSelected} />;
  }
}
