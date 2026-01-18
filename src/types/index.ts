export interface Photo {
  id: string;
  file: File;
  name: string;
  preview: string;
  coordinates: Coordinates | null;
  status: "pending" | "processing" | "complete" | "error";
  processedBlob?: Blob;
  error?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type AppScreen = "upload" | "editor" | "processing" | "complete";
