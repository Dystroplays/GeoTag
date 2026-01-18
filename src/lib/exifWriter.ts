import { Coordinates } from "@/types";

// Convert blob to base64 data URL
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Convert base64 data URL back to blob
function base64ToBlob(base64: string, type: string): Blob {
  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type });
}

// Convert decimal degrees to DMS format for EXIF
// Returns array of [degrees, minutes, seconds] as rational pairs
function degreesToDMS(decimal: number): [[number, number], [number, number], [number, number]] {
  const degrees = Math.floor(Math.abs(decimal));
  const minutesFloat = (Math.abs(decimal) - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60 * 100);
  return [
    [degrees, 1],
    [minutes, 1],
    [seconds, 100],
  ];
}

export async function writeGpsExif(
  imageBlob: Blob,
  coords: Coordinates
): Promise<Blob> {
  // Dynamic import to avoid SSR issues
  const piexif = (await import("piexifjs")).default;

  // Convert blob to base64
  const base64 = await blobToBase64(imageBlob);

  // Create GPS EXIF data
  const gpsIfd: Record<number, any> = {
    [piexif.GPSIFD.GPSLatitudeRef]: coords.latitude >= 0 ? "N" : "S",
    [piexif.GPSIFD.GPSLatitude]: degreesToDMS(coords.latitude),
    [piexif.GPSIFD.GPSLongitudeRef]: coords.longitude >= 0 ? "E" : "W",
    [piexif.GPSIFD.GPSLongitude]: degreesToDMS(coords.longitude),
  };

  // Try to preserve existing EXIF data
  let exifObj: Record<string, any>;
  try {
    exifObj = piexif.load(base64);
    // Update GPS data
    exifObj.GPS = gpsIfd;
  } catch {
    // No existing EXIF, create new
    exifObj = {
      "0th": {},
      Exif: {},
      GPS: gpsIfd,
      Interop: {},
      "1st": {},
      thumbnail: null,
    };
  }

  // Generate EXIF bytes
  const exifStr = piexif.dump(exifObj);

  // Insert EXIF into image
  const newBase64 = piexif.insert(exifStr, base64);

  // Convert back to blob
  return base64ToBlob(newBase64, "image/jpeg");
}
