export function isHeic(file: File): boolean {
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  );
}

export async function convertHeicToJpeg(file: File): Promise<Blob> {
  try {
    // Dynamic import to avoid SSR issues
    const heic2any = (await import("heic2any")).default;
    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.92,
    });
    return Array.isArray(result) ? result[0] : result;
  } catch (error) {
    console.error("HEIC conversion failed:", error);
    throw new Error(`Failed to convert HEIC file: ${file.name}`);
  }
}

export async function processFileForPreview(file: File): Promise<Blob> {
  if (isHeic(file)) {
    return convertHeicToJpeg(file);
  }
  return file;
}
