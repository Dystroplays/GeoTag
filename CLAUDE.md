# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GeoTag is a client-side Next.js 14 web application for bulk GPS tagging of photos for Google Business Profile. All image processing happens in the browser—no server uploads. Users upload photos, assign coordinates via an interactive map, and download processed images as a ZIP file.

## Build & Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint check
```

## Architecture

### Application Flow

The app uses a simple screen-based state machine managed in `src/app/page.tsx`:
1. **Upload** → User drops/selects photos (HEIC auto-converted for previews)
2. **Editor** → User assigns GPS coordinates via map clicks or manual input
3. **Processing** → Photos are compressed and GPS EXIF data is written
4. **Complete** → User downloads ZIP of processed photos

### Directory Structure

```
src/
├── app/page.tsx          # Root component with all state management
├── components/           # Screen and UI components
│   ├── ui/              # Shadcn/Radix UI primitives (button, card, progress)
│   ├── UploadScreen.tsx # Drag-drop file upload
│   ├── EditorScreen.tsx # Main editing interface (photo queue + map)
│   ├── MapPicker.tsx    # Dynamic import wrapper for Leaflet (SSR-safe)
│   └── LeafletMap.tsx   # Actual Leaflet implementation
├── lib/                  # Processing utilities
│   ├── heicConverter.ts # HEIC → JPEG conversion
│   ├── imageProcessing.ts # Compression pipeline
│   ├── exifWriter.ts    # GPS EXIF data writing with piexifjs
│   └── zipGenerator.ts  # ZIP creation with JSZip
└── types/index.ts        # Core interfaces (Photo, Coordinates, AppScreen)
```

### Key Technical Patterns

- **State Management**: All state lives in `page.tsx` using React hooks (no Redux/Zustand)
- **Dynamic Imports**: Leaflet is dynamically imported in `MapPicker.tsx` to avoid SSR issues
- **Image Pipeline**: HEIC detection → conversion (heic2any) → compression (browser-image-compression) → EXIF writing (piexifjs)
- **GPS Format**: Coordinates stored as decimal, converted to DMS (Degrees/Minutes/Seconds) for EXIF

### Core Types

```typescript
interface Photo {
  id: string;
  file: File;
  preview: string;  // Object URL
  coordinates: Coordinates | null;
  status: "pending" | "processing" | "complete" | "error";
  processedBlob?: Blob;
}

interface Coordinates {
  latitude: number;   // -90 to 90
  longitude: number;  // -180 to 180
}
```

### Output Specifications

- Format: JPEG
- Max dimensions: 1200px (longest edge)
- Target file size: 500KB - 1.5MB
- Quality: 0.85
- ZIP filename: `geotag-photos-YYYY-MM-DD.zip`

## Key Dependencies

- **leaflet/react-leaflet**: Interactive map with OpenStreetMap tiles
- **heic2any**: Client-side HEIC to JPEG conversion
- **browser-image-compression**: Image resizing and compression
- **piexifjs**: Reading/writing EXIF metadata
- **jszip**: ZIP file generation
