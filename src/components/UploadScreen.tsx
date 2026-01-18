"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon, MapPin, Loader2 } from "lucide-react";

interface UploadScreenProps {
  onFilesSelected: (files: File[]) => void;
  isLoading?: boolean;
}

export function UploadScreen({ onFilesSelected, isLoading = false }: UploadScreenProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <MapPin className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-slate-900">GeoTag</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Bulk GPS tagging for Google Business Profile photos
          </p>
        </div>

        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-12 bg-white transition-colors ${
            isLoading
              ? "border-slate-200 cursor-wait"
              : isDragging
              ? "border-primary bg-primary/5"
              : "border-slate-300 hover:border-primary hover:bg-slate-50 cursor-pointer"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isLoading && document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif"
            className="hidden"
            onChange={handleFileInput}
            disabled={isLoading}
          />
          {isLoading ? (
            <>
              <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-lg font-medium text-slate-700 mb-2">
                Processing photos...
              </p>
              <p className="text-sm text-slate-500">
                Converting HEIC files if needed
              </p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-700 mb-2">
                Drag photos here or click to browse
              </p>
              <p className="text-sm text-slate-500">
                Supports JPEG, PNG, and HEIC formats
              </p>
            </>
          )}
        </div>

        {/* Features List */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg">
            <ImageIcon className="h-6 w-6 text-primary" />
            <span>Batch Upload</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg">
            <MapPin className="h-6 w-6 text-primary" />
            <span>Map Tagging</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg">
            <Upload className="h-6 w-6 text-primary" />
            <span>ZIP Download</span>
          </div>
        </div>

        {/* Privacy Note */}
        <p className="mt-8 text-xs text-slate-400">
          Photos are processed locally in your browser. Nothing is uploaded to any server.
        </p>
      </div>
    </div>
  );
}
