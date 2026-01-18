"use client";

import { Photo } from "@/types";

interface PhotoPreviewProps {
  photo: Photo;
}

export function PhotoPreview({ photo }: PhotoPreviewProps) {
  return (
    <div className="bg-slate-100 rounded-lg overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.preview}
        alt={photo.name}
        className="w-full h-[300px] object-contain"
      />
    </div>
  );
}
