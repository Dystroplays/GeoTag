import { Photo } from "@/types";

export async function generateZip(
  photos: Photo[],
  processedBlobs: Map<string, Blob>
): Promise<Blob> {
  // Dynamic import to avoid SSR issues
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  for (const photo of photos) {
    const blob = processedBlobs.get(photo.id);
    if (blob) {
      // Ensure .jpg extension
      let filename = photo.name;
      // Remove existing extension and add .jpg
      const lastDot = filename.lastIndexOf(".");
      if (lastDot > 0) {
        filename = filename.substring(0, lastDot);
      }
      filename = filename + ".jpg";

      zip.file(filename, blob);
    }
  }

  return await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateZipFilename(): string {
  const date = new Date().toISOString().split("T")[0];
  return `geotag-photos-${date}.zip`;
}
