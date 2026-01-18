import { Photo, Coordinates } from "@/types";
import { writeGpsExif } from "./exifWriter";
import { isHeic, convertHeicToJpeg } from "./heicConverter";

export async function compressImage(file: File | Blob): Promise<Blob> {
  // Dynamic import to avoid SSR issues
  const imageCompression = (await import("browser-image-compression")).default;

  const options = {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: "image/jpeg" as const,
    initialQuality: 0.85,
  };

  return await imageCompression(file as File, options);
}

export async function processPhoto(photo: Photo): Promise<Blob> {
  let blob: Blob = photo.file;

  // Step 1: Convert HEIC to JPEG if needed
  if (isHeic(photo.file)) {
    blob = await convertHeicToJpeg(photo.file);
  }

  // Step 2: Compress and resize
  const compressed = await compressImage(blob);

  // Step 3: Write EXIF GPS data if coordinates exist
  if (photo.coordinates) {
    return await writeGpsExif(compressed, photo.coordinates);
  }

  return compressed;
}

export async function processAllPhotos(
  photos: Photo[],
  onProgress: (current: number, total: number) => void
): Promise<Map<string, Blob>> {
  const results = new Map<string, Blob>();
  const photosWithCoords = photos.filter((p) => p.coordinates !== null);

  for (let i = 0; i < photosWithCoords.length; i++) {
    const photo = photosWithCoords[i];
    onProgress(i + 1, photosWithCoords.length);

    try {
      const processed = await processPhoto(photo);
      results.set(photo.id, processed);
    } catch (error) {
      console.error(`Failed to process ${photo.name}:`, error);
      // Continue with other photos
    }
  }

  return results;
}
