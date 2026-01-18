# GeoTag — Product Requirements Document

**Version:** 1.0  
**Last Updated:** January 17, 2026  
**Status:** Ready for Development  
**Owner:** Internal Tools Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [User Persona](#4-user-persona)
5. [Functional Requirements](#5-functional-requirements)
6. [Technical Specifications](#6-technical-specifications)
7. [UI/UX Specifications](#7-uiux-specifications)
8. [Implementation Phases](#8-implementation-phases)
9. [Error Handling](#9-error-handling)
10. [Testing Requirements](#10-testing-requirements)
11. [Deployment](#11-deployment)
12. [Future Considerations](#12-future-considerations)
13. [Appendix](#13-appendix)

---

## 1. Executive Summary

GeoTag is an internal web application that enables bulk processing of photos for Google Business Profile optimization. The tool allows users to upload multiple photos, assign GPS coordinates via an interactive map, compress images to meet Google's requirements, write EXIF location data, and download all processed photos as a single ZIP file.

**Key Value Proposition:** Reduce photo processing time from ~5 minutes per photo (current manual workflow) to ~30 seconds per photo through batch processing and streamlined UX.

---

## 2. Problem Statement

### Current Workflow (Pain Points)

1. Take/select a photo
2. Compress the photo individually (large iPhone photos exceed optimal size)
3. Upload to a third-party EXIF editing tool
4. Manually find and input GPS coordinates for the location
5. Wait for the tool to write EXIF data
6. Download the processed photo
7. Repeat for each photo

**Problems:**
- Time-consuming: Each photo takes ~5 minutes to process
- Context switching: Multiple tools required
- No batch processing: Must handle photos one at a time
- Error-prone: Manual coordinate entry leads to mistakes
- Inconsistent output: Different tools produce varying quality/sizes

### Desired Workflow

1. Upload multiple photos (batch)
2. Click on map to assign coordinates to each photo
3. Press "Process"
4. Download ZIP of all processed photos

**Target:** Process 50 photos in under 15 minutes (vs. current ~4+ hours)

---

## 3. Goals & Success Metrics

### Primary Goals

| Goal | Metric | Target |
|------|--------|--------|
| Reduce processing time | Time per photo | < 30 seconds average |
| Enable batch processing | Photos per session | 10-50 photos |
| Ensure Google compatibility | Output compliance | 100% meet GBP specs |
| Simplify coordinate assignment | Clicks per photo | 1 click (map) |

### Success Criteria

- [ ] User can upload 50 photos without browser crash
- [ ] HEIC files are automatically converted to JPEG
- [ ] GPS coordinates are correctly written to EXIF data
- [ ] Output files meet Google Business Profile requirements
- [ ] All processing happens client-side (no server storage)
- [ ] ZIP download works in Chrome

---

## 4. User Persona

**Primary User:** Internal team member  
**Technical Level:** Moderate (comfortable with web apps, not a developer)  
**Usage Pattern:** Weekly batches of 10-50 photos  
**Environment:** Desktop Chrome browser  
**Concurrent Users:** 1 (single user tool)

---

## 5. Functional Requirements

### 5.1 Photo Upload

| ID | Requirement | Priority |
|----|-------------|----------|
| F-UP-01 | Drag-and-drop upload zone | Must Have |
| F-UP-02 | Click-to-browse file picker | Must Have |
| F-UP-03 | Accept JPEG, PNG, HEIC formats | Must Have |
| F-UP-04 | Support multiple file selection | Must Have |
| F-UP-05 | Display upload progress/status | Should Have |
| F-UP-06 | Validate file types on selection | Must Have |

### 5.2 HEIC Conversion

| ID | Requirement | Priority |
|----|-------------|----------|
| F-HC-01 | Detect HEIC files automatically | Must Have |
| F-HC-02 | Convert HEIC to JPEG client-side | Must Have |
| F-HC-03 | Preserve image quality during conversion | Must Have |
| F-HC-04 | Show conversion progress | Should Have |

### 5.3 Queue Management

| ID | Requirement | Priority |
|----|-------------|----------|
| F-QU-01 | Display all uploaded photos in sidebar list | Must Have |
| F-QU-02 | Show thumbnail preview for each photo | Must Have |
| F-QU-03 | Indicate coordinate assignment status per photo | Must Have |
| F-QU-04 | Allow navigation between photos (prev/next) | Must Have |
| F-QU-05 | Allow clicking thumbnail to select photo | Must Have |
| F-QU-06 | Display current position (e.g., "3 of 15") | Must Have |
| F-QU-07 | Provide "Clear All" functionality | Should Have |

### 5.4 Map & Coordinate Assignment

| ID | Requirement | Priority |
|----|-------------|----------|
| F-MA-01 | Display interactive map (Leaflet + OpenStreetMap) | Must Have |
| F-MA-02 | Click map to set coordinates | Must Have |
| F-MA-03 | Display marker at selected location | Must Have |
| F-MA-04 | Show latitude/longitude in input fields | Must Have |
| F-MA-05 | Allow manual coordinate entry | Should Have |
| F-MA-06 | Update marker when manual coordinates entered | Should Have |
| F-MA-07 | Persist coordinates when navigating between photos | Must Have |

### 5.5 Image Processing

| ID | Requirement | Priority |
|----|-------------|----------|
| F-IP-01 | Compress images to target size (< 2MB) | Must Have |
| F-IP-02 | Resize to max 1200px on longest edge | Must Have |
| F-IP-03 | Output as JPEG format | Must Have |
| F-IP-04 | Maintain reasonable quality (0.85 quality setting) | Must Have |
| F-IP-05 | Write GPS coordinates to EXIF data | Must Have |
| F-IP-06 | Overwrite existing EXIF GPS data | Must Have |

### 5.6 Export

| ID | Requirement | Priority |
|----|-------------|----------|
| F-EX-01 | Generate ZIP file containing all processed photos | Must Have |
| F-EX-02 | Preserve original filenames (with .jpg extension) | Must Have |
| F-EX-03 | Trigger browser download of ZIP | Must Have |
| F-EX-04 | Show processing progress | Must Have |
| F-EX-05 | Display success state with download button | Must Have |
| F-EX-06 | Provide "Start Over" to reset application | Must Have |

---

## 6. Technical Specifications

### 6.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 14 (App Router) | Vercel-native, React-based, good DX |
| Language | TypeScript | Type safety, better maintainability |
| Styling | Tailwind CSS | Rapid UI development, consistent design |
| UI Components | shadcn/ui | Clean, accessible, customizable |
| Map | Leaflet + React-Leaflet | Free, no API key, lightweight |
| Map Tiles | OpenStreetMap | Free, no usage limits |
| HEIC Conversion | heic2any | Client-side HEIC→JPEG |
| Image Compression | browser-image-compression | Client-side resize/compress |
| EXIF Writing | piexifjs | Pure JS EXIF manipulation |
| ZIP Generation | JSZip | Client-side ZIP creation |
| State Management | React useState/useReducer | Simple app, no need for external state |

### 6.2 Output Image Specifications

Based on Google Business Profile requirements:

| Specification | Value |
|---------------|-------|
| Format | JPEG |
| Max Dimensions | 1200px (longest edge) |
| Target File Size | 500KB - 1.5MB |
| Min File Size | > 10KB (Google requirement) |
| Max File Size | < 5MB (Google requirement) |
| Quality Setting | 0.85 |
| Color Space | sRGB |

### 6.3 EXIF GPS Data Format

The following EXIF tags will be written:

```
GPSLatitude: [degrees, minutes, seconds]
GPSLatitudeRef: "N" or "S"
GPSLongitude: [degrees, minutes, seconds]
GPSLongitudeRef: "E" or "W"
```

### 6.4 Browser Support

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | Latest | Full (Primary) |
| Safari | Latest | Not tested |
| Firefox | Latest | Not tested |
| Edge | Latest | Not tested |

### 6.5 Performance Requirements

| Metric | Target |
|--------|--------|
| Max photos per batch | 50 |
| HEIC conversion time | < 3 seconds per photo |
| Image compression time | < 1 second per photo |
| Total processing (50 photos) | < 3 minutes |
| No browser crashes | Required |

### 6.6 Client-Side Architecture

All processing happens in the browser. No server-side image handling.

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐     │
│  │ Upload  │ → │  HEIC   │ → │ Compress│ → │  EXIF   │     │
│  │ (Files) │   │ Convert │   │ & Resize│   │  Write  │     │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘     │
│                                                 │            │
│                                                 ↓            │
│                                           ┌─────────┐       │
│                                           │   ZIP   │       │
│                                           │ Generate│       │
│                                           └─────────┘       │
│                                                 │            │
│                                                 ↓            │
│                                           [Download]         │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. UI/UX Specifications

### 7.1 Design System

| Element | Specification |
|---------|---------------|
| Color Palette | Slate/gray base with teal accent |
| Typography | System fonts (Inter or similar) |
| Border Radius | Rounded corners (8px standard) |
| Shadows | Subtle elevation for cards |
| Spacing | 8px grid system |

### 7.2 Screen Inventory

#### Screen 1: Upload Screen (Landing)
- App name "GeoTag" with tagline
- Large drag-and-drop zone with dashed border
- "Drag photos here or click to browse" text
- Supported formats note
- Privacy note: "Photos are processed locally in your browser"

#### Screen 2: Queue & Map Screen (Main Editor)
- **Left Sidebar (30% width):**
  - Header showing "Photos (X of Y)"
  - Scrollable list of square thumbnail previews
  - Visual indicator for assigned/unassigned coordinates
  - Currently selected photo highlighted
  - "Clear All" link at bottom

- **Main Content Area (70% width):**
  - Selected photo preview (max 400px height)
  - Interactive Leaflet map (400px height)
  - Latitude/Longitude input fields (side by side)
  - Helper text: "Click on the map to set coordinates"
  - Previous/Next navigation buttons

- **Footer Bar (fixed):**
  - Progress text: "12 of 15 photos tagged"
  - "Process All Photos" button (primary, teal)

#### Screen 3: Processing Screen
- Modal overlay or full-screen takeover
- Circular progress spinner or progress bar
- "Processing your photos..." heading
- "Converting, compressing, and writing location data" subtext
- Current progress: "Photo 3 of 15"

#### Screen 4: Complete Screen
- Centered success state
- Large green checkmark icon
- "All done!" heading
- "15 photos have been processed and are ready to download"
- "Download ZIP" primary button
- "Start Over" secondary/text button

### 7.3 Responsive Behavior

Desktop-first design. Minimum supported width: 1024px. No mobile optimization for v1.

---

## 8. Implementation Phases

Each phase should be implemented and tested before moving to the next. Phases are designed to produce working, testable increments.

---

### Phase 1: Project Setup

**Objective:** Initialize project with all dependencies and folder structure.

**Tasks:**

1. Create Next.js 14 project with App Router
   ```bash
   npx create-next-app@latest geotag --typescript --tailwind --eslint --app --src-dir
   ```

2. Install dependencies
   ```bash
   npm install leaflet react-leaflet @types/leaflet
   npm install heic2any
   npm install browser-image-compression
   npm install piexifjs
   npm install jszip
   npm install lucide-react
   npx shadcn@latest init
   ```

3. Configure shadcn/ui components
   ```bash
   npx shadcn@latest add button card progress
   ```

4. Create folder structure
   ```
   src/
   ├── app/
   │   ├── layout.tsx
   │   ├── page.tsx
   │   └── globals.css
   ├── components/
   │   ├── ui/           # shadcn components
   │   ├── UploadScreen.tsx
   │   ├── EditorScreen.tsx
   │   ├── ProcessingScreen.tsx
   │   ├── CompleteScreen.tsx
   │   ├── PhotoQueue.tsx
   │   ├── PhotoPreview.tsx
   │   ├── MapPicker.tsx
   │   └── CoordinateInputs.tsx
   ├── lib/
   │   ├── imageProcessing.ts
   │   ├── exifWriter.ts
   │   ├── heicConverter.ts
   │   └── zipGenerator.ts
   ├── hooks/
   │   └── usePhotoQueue.ts
   └── types/
       └── index.ts
   ```

5. Set up TypeScript types
   ```typescript
   // src/types/index.ts
   export interface Photo {
     id: string;
     file: File;
     name: string;
     preview: string;        // Object URL for thumbnail
     coordinates: Coordinates | null;
     status: 'pending' | 'processing' | 'complete' | 'error';
     processedBlob?: Blob;
     error?: string;
   }

   export interface Coordinates {
     latitude: number;
     longitude: number;
   }

   export type AppScreen = 'upload' | 'editor' | 'processing' | 'complete';
   ```

**Deliverable:** Empty Next.js app that runs with all dependencies installed.

**Verification:** `npm run dev` starts without errors.

---

### Phase 2: UI Shell

**Objective:** Build all 4 screens with static/placeholder content and navigation.

**Tasks:**

1. Create main layout with app header
   - GeoTag logo/wordmark
   - Minimal header (only shown on screens 2-4)

2. Implement screen state management in `page.tsx`
   ```typescript
   const [currentScreen, setCurrentScreen] = useState<AppScreen>('upload');
   ```

3. Build UploadScreen component
   - Centered layout
   - Drag-and-drop zone (visual only, no functionality)
   - Styling per design spec

4. Build EditorScreen component
   - Split layout (sidebar + main)
   - Placeholder thumbnail list
   - Placeholder map area (gray box)
   - Coordinate input fields (non-functional)
   - Navigation buttons (Previous/Next)
   - Footer with progress and "Process" button

5. Build ProcessingScreen component
   - Modal/overlay design
   - Spinner animation
   - Progress text

6. Build CompleteScreen component
   - Success state with checkmark
   - Download button (non-functional)
   - Start Over button (returns to upload)

7. Wire up basic navigation
   - Upload → Editor (on placeholder button)
   - Editor → Processing (on Process button)
   - Processing → Complete (auto after 2 seconds for testing)
   - Complete → Upload (on Start Over)

**Deliverable:** All 4 screens navigable with placeholder content.

**Verification:** Can click through all screens in sequence.

---

### Phase 3: Upload & HEIC Conversion

**Objective:** Implement file upload with drag-and-drop and HEIC→JPEG conversion.

**Tasks:**

1. Implement drag-and-drop in UploadScreen
   - Handle `onDragOver`, `onDragLeave`, `onDrop`
   - Visual feedback on drag hover
   - File input as fallback

2. Create file validation utility
   ```typescript
   const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
   
   function validateFiles(files: FileList): File[] {
     return Array.from(files).filter(file => 
       ACCEPTED_TYPES.includes(file.type) || 
       file.name.toLowerCase().endsWith('.heic') ||
       file.name.toLowerCase().endsWith('.heif')
     );
   }
   ```

3. Implement HEIC detection and conversion
   ```typescript
   // src/lib/heicConverter.ts
   import heic2any from 'heic2any';

   export async function convertHeicToJpeg(file: File): Promise<Blob> {
     const result = await heic2any({
       blob: file,
       toType: 'image/jpeg',
       quality: 0.92
     });
     return Array.isArray(result) ? result[0] : result;
   }
   
   export function isHeic(file: File): boolean {
     return file.type === 'image/heic' || 
            file.type === 'image/heif' ||
            file.name.toLowerCase().endsWith('.heic') ||
            file.name.toLowerCase().endsWith('.heif');
   }
   ```

4. Create Photo objects from uploaded files
   - Generate unique IDs
   - Create preview URLs with `URL.createObjectURL()`
   - Handle HEIC conversion before creating preview
   - Set initial status to 'pending'

5. Implement usePhotoQueue hook
   ```typescript
   // src/hooks/usePhotoQueue.ts
   export function usePhotoQueue() {
     const [photos, setPhotos] = useState<Photo[]>([]);
     const [currentIndex, setCurrentIndex] = useState(0);
     
     const addPhotos = async (files: File[]) => { /* ... */ };
     const setCoordinates = (id: string, coords: Coordinates) => { /* ... */ };
     const clearAll = () => { /* ... */ };
     const goToNext = () => { /* ... */ };
     const goToPrevious = () => { /* ... */ };
     
     return { photos, currentIndex, currentPhoto, addPhotos, setCoordinates, clearAll, goToNext, goToPrevious };
   }
   ```

6. Show upload progress
   - Processing indicator while converting HEIC files
   - Transition to editor when all files processed

**Deliverable:** Can upload JPEG/PNG/HEIC files, see them in queue.

**Verification:** 
- Upload 5 JPEG files → appear in queue
- Upload 5 HEIC files → converted and appear in queue
- Upload mixed batch → all appear correctly

---

### Phase 4: Map Integration

**Objective:** Integrate Leaflet map with click-to-set-coordinates functionality.

**Tasks:**

1. Create MapPicker component
   ```typescript
   // src/components/MapPicker.tsx
   'use client';
   
   import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
   import { Coordinates } from '@/types';
   
   interface MapPickerProps {
     coordinates: Coordinates | null;
     onCoordinatesChange: (coords: Coordinates) => void;
   }
   ```

2. Handle Leaflet CSS import (Next.js specific)
   - Import Leaflet CSS in layout or component
   - Fix marker icon issue (common Leaflet + webpack problem)
   ```typescript
   import 'leaflet/dist/leaflet.css';
   import L from 'leaflet';
   
   // Fix default marker icon
   delete (L.Icon.Default.prototype as any)._getIconUrl;
   L.Icon.Default.mergeOptions({
     iconRetinaUrl: '/marker-icon-2x.png',
     iconUrl: '/marker-icon.png',
     shadowUrl: '/marker-shadow.png',
   });
   ```

3. Implement click handler
   ```typescript
   function MapClickHandler({ onClick }: { onClick: (coords: Coordinates) => void }) {
     useMapEvents({
       click: (e) => {
         onClick({ latitude: e.latlng.lat, longitude: e.latlng.lng });
       },
     });
     return null;
   }
   ```

4. Display marker at selected coordinates

5. Create CoordinateInputs component
   - Two number inputs for lat/lng
   - Update on map click
   - Allow manual entry
   - Validate ranges (-90 to 90 for lat, -180 to 180 for lng)

6. Sync map and inputs bidirectionally
   - Map click → update inputs
   - Input change → update marker position

7. Set sensible default map center
   - Center on US (39.8283, -98.5795) or last used location

**Deliverable:** Interactive map where clicking sets coordinates shown in inputs.

**Verification:**
- Click map → marker appears, inputs update
- Type coordinates → marker moves
- Invalid coordinates → validation error

---

### Phase 5: Queue State Management

**Objective:** Complete the editor screen with full photo queue management.

**Tasks:**

1. Implement PhotoQueue sidebar component
   - Render list of photo thumbnails
   - Show filename (truncated)
   - Show status indicator (dot: gray=pending, green=has coordinates)
   - Highlight selected photo
   - Handle click to select

2. Implement photo preview display
   - Show larger preview of selected photo
   - Handle various aspect ratios
   - Max height constraint (400px)

3. Wire up Previous/Next navigation
   - Update currentIndex
   - Disable Previous on first photo
   - Disable Next on last photo

4. Persist coordinates per photo
   - When navigating away, coords are saved
   - When navigating back, coords are restored
   - Map re-centers to photo's coords (or default if none)

5. Implement "Clear All" functionality
   - Confirm dialog (optional for v1)
   - Reset to upload screen
   - Clean up object URLs to prevent memory leaks

6. Update footer progress display
   - Count photos with coordinates assigned
   - Format: "12 of 15 photos tagged"

7. Disable "Process All Photos" button if:
   - No photos uploaded
   - Zero photos have coordinates

**Deliverable:** Fully functional editor with queue navigation and coordinate assignment.

**Verification:**
- Navigate through 10 photos with Previous/Next
- Assign coordinates to 5 photos
- Navigate back → coordinates persisted
- Progress shows "5 of 10 photos tagged"
- Clear All → returns to upload

---

### Phase 6: Image Processing Pipeline

**Objective:** Implement compression and EXIF writing.

**Tasks:**

1. Create image compression utility
   ```typescript
   // src/lib/imageProcessing.ts
   import imageCompression from 'browser-image-compression';

   export async function compressImage(file: File | Blob): Promise<Blob> {
     const options = {
       maxSizeMB: 1.5,
       maxWidthOrHeight: 1200,
       useWebWorker: true,
       fileType: 'image/jpeg',
       initialQuality: 0.85,
     };
     return await imageCompression(file as File, options);
   }
   ```

2. Create EXIF writing utility
   ```typescript
   // src/lib/exifWriter.ts
   import piexif from 'piexifjs';

   export async function writeGpsExif(imageBlob: Blob, coords: Coordinates): Promise<Blob> {
     // Convert blob to base64
     const base64 = await blobToBase64(imageBlob);
     
     // Create GPS EXIF data
     const gpsIfd = {
       [piexif.GPSIFD.GPSLatitudeRef]: coords.latitude >= 0 ? 'N' : 'S',
       [piexif.GPSIFD.GPSLatitude]: degreesToDMS(Math.abs(coords.latitude)),
       [piexif.GPSIFD.GPSLongitudeRef]: coords.longitude >= 0 ? 'E' : 'W',
       [piexif.GPSIFD.GPSLongitude]: degreesToDMS(Math.abs(coords.longitude)),
     };
     
     const exifObj = { GPS: gpsIfd };
     const exifStr = piexif.dump(exifObj);
     
     // Insert EXIF and return blob
     const newBase64 = piexif.insert(exifStr, base64);
     return base64ToBlob(newBase64, 'image/jpeg');
   }
   
   function degreesToDMS(decimal: number): [[number, number], [number, number], [number, number]] {
     const degrees = Math.floor(decimal);
     const minutesFloat = (decimal - degrees) * 60;
     const minutes = Math.floor(minutesFloat);
     const seconds = Math.round((minutesFloat - minutes) * 60 * 100);
     return [[degrees, 1], [minutes, 1], [seconds, 100]];
   }
   ```

3. Create main processing pipeline
   ```typescript
   // src/lib/imageProcessing.ts
   export async function processPhoto(photo: Photo): Promise<Blob> {
     // Step 1: Get the image blob (already converted from HEIC if needed)
     let blob = photo.file;
     
     // Step 2: Compress and resize
     const compressed = await compressImage(blob);
     
     // Step 3: Write EXIF GPS data
     if (photo.coordinates) {
       return await writeGpsExif(compressed, photo.coordinates);
     }
     
     return compressed;
   }
   ```

4. Implement batch processing with progress
   ```typescript
   export async function processAllPhotos(
     photos: Photo[],
     onProgress: (current: number, total: number) => void
   ): Promise<Map<string, Blob>> {
     const results = new Map<string, Blob>();
     const photosWithCoords = photos.filter(p => p.coordinates);
     
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
   ```

**Deliverable:** Processing functions that compress images and write EXIF data.

**Verification:**
- Process a JPEG → output is smaller
- Process with coordinates → EXIF contains GPS data
- Verify GPS data with online EXIF viewer

---

### Phase 7: Export System

**Objective:** Generate ZIP file and enable download.

**Tasks:**

1. Create ZIP generation utility
   ```typescript
   // src/lib/zipGenerator.ts
   import JSZip from 'jszip';

   export async function generateZip(
     photos: Photo[],
     processedBlobs: Map<string, Blob>
   ): Promise<Blob> {
     const zip = new JSZip();
     
     for (const photo of photos) {
       const blob = processedBlobs.get(photo.id);
       if (blob) {
         // Ensure .jpg extension
         const filename = photo.name.replace(/\.(heic|heif|png)$/i, '') + '.jpg';
         zip.file(filename, blob);
       }
     }
     
     return await zip.generateAsync({ 
       type: 'blob',
       compression: 'DEFLATE',
       compressionOptions: { level: 6 }
     });
   }
   ```

2. Implement download trigger
   ```typescript
   export function downloadBlob(blob: Blob, filename: string) {
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = filename;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     URL.revokeObjectURL(url);
   }
   ```

3. Wire up ProcessingScreen
   - Start processing when screen mounts
   - Update progress display
   - Transition to CompleteScreen when done
   - Store ZIP blob in state

4. Wire up CompleteScreen
   - Display success message with count
   - Download ZIP on button click
   - Generate filename with date: `geotag-photos-2026-01-17.zip`

5. Implement Start Over
   - Clear all state
   - Clean up object URLs
   - Return to upload screen

**Deliverable:** Full end-to-end flow from upload to ZIP download.

**Verification:**
- Upload 10 photos
- Assign coordinates to all
- Process → download ZIP
- Extract ZIP → verify 10 JPEG files with GPS data

---

### Phase 8: Error Handling & Polish

**Objective:** Handle edge cases and improve UX.

**Tasks:**

1. Implement error boundaries
   - Catch rendering errors
   - Show friendly error message
   - Provide recovery option

2. Handle processing errors gracefully
   - If single photo fails, continue with others
   - Show error toast/notification
   - Mark failed photos in queue
   - Include count in completion: "14 of 15 photos processed (1 failed)"

3. Add loading states
   - Upload screen: "Processing uploads..."
   - HEIC conversion indicator
   - Map loading state

4. Add validation feedback
   - Invalid file type message
   - No photos with coordinates warning
   - Empty upload warning

5. Memory management
   - Revoke object URLs when photos removed
   - Clean up on unmount
   - Monitor memory usage with large batches

6. Improve keyboard navigation
   - Arrow keys for prev/next photo
   - Enter to confirm coordinate selection
   - Escape to cancel/go back

7. Add subtle animations
   - Page transitions
   - Progress bar animation
   - Success checkmark animation

8. Final styling polish
   - Consistent spacing
   - Hover states
   - Focus states for accessibility

**Deliverable:** Production-ready application with proper error handling.

**Verification:**
- Upload corrupt file → graceful error
- Process with one bad file → others succeed
- Upload 50 photos → no memory issues
- All interactive elements have hover/focus states

---

### Phase 9: Deployment

**Objective:** Deploy to Vercel and verify production functionality.

**Tasks:**

1. Create Vercel project
   - Connect GitHub repository
   - Configure build settings

2. Configure `next.config.js` for production
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'standalone',
     // Disable image optimization (not needed for this app)
     images: {
       unoptimized: true,
     },
   };
   module.exports = nextConfig;
   ```

3. Add required static assets
   - Leaflet marker icons in `/public`
   - Favicon
   - OpenGraph image (optional)

4. Environment setup
   - No environment variables needed (client-side only)

5. Production testing checklist
   - [ ] Upload screen loads
   - [ ] Drag-and-drop works
   - [ ] HEIC conversion works
   - [ ] Map loads and is interactive
   - [ ] Coordinates save correctly
   - [ ] Processing completes
   - [ ] ZIP downloads successfully
   - [ ] ZIP contains valid images with GPS data

6. Performance verification
   - Test with 50 photos
   - Verify no timeouts
   - Check memory usage

**Deliverable:** Live application at `geotag.vercel.app` (or similar).

**Verification:**
- Full workflow works in production
- No console errors
- Reasonable performance

---

## 9. Error Handling

### Error Categories

| Category | Handling Strategy |
|----------|-------------------|
| Invalid file type | Reject at upload, show message |
| Corrupt image file | Skip during processing, notify user |
| HEIC conversion failure | Show error, allow retry or skip |
| Processing failure | Continue with other photos, mark as failed |
| ZIP generation failure | Show error, offer retry |
| Browser out of memory | Catch, suggest smaller batch |

### Error Messages

| Scenario | Message |
|----------|---------|
| Wrong file type | "Only JPEG, PNG, and HEIC files are supported." |
| Corrupt file | "'{filename}' could not be processed and was skipped." |
| No coordinates | "Please assign coordinates to at least one photo before processing." |
| Processing failed | "Some photos could not be processed. You can download the successful ones." |
| Memory error | "Too many photos at once. Try processing in smaller batches." |

---

## 10. Testing Requirements

### Manual Testing Checklist

**Upload Screen:**
- [ ] Drag-and-drop single file
- [ ] Drag-and-drop multiple files (10+)
- [ ] Click to browse and select files
- [ ] Reject non-image files
- [ ] Handle HEIC files
- [ ] Handle PNG files
- [ ] Handle JPEG files
- [ ] Handle mixed file types

**Editor Screen:**
- [ ] Thumbnails display correctly
- [ ] Click thumbnail selects photo
- [ ] Previous/Next navigation works
- [ ] Previous disabled on first photo
- [ ] Next disabled on last photo
- [ ] Map click sets coordinates
- [ ] Marker appears at click location
- [ ] Input fields update on map click
- [ ] Manual coordinate entry works
- [ ] Coordinates persist when navigating
- [ ] Progress counter is accurate
- [ ] Clear All works

**Processing Screen:**
- [ ] Progress updates correctly
- [ ] Spinner/animation displays
- [ ] Transitions to complete when done

**Complete Screen:**
- [ ] Success message shows correct count
- [ ] Download button triggers download
- [ ] ZIP file is valid
- [ ] ZIP contains expected files
- [ ] Files have GPS EXIF data
- [ ] Start Over resets app

**Edge Cases:**
- [ ] 50 photos batch (performance)
- [ ] All HEIC files
- [ ] Very large files (>20MB)
- [ ] Coordinates at edge of world (-90, 180)
- [ ] Photos with existing EXIF data

### Automated Testing (Optional for v1)

- Unit tests for utility functions
- Integration test for processing pipeline
- E2E test with Playwright (future)

---

## 11. Deployment

### Vercel Configuration

**Build Settings:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Deployment:**
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically on push to `main`

**Domain:**
- Primary: `geotag.vercel.app`
- Custom domain: Optional (configure in Vercel dashboard)

---

## 12. Future Considerations

### v2 Features (Not in Scope for v1)

| Feature | Description | Priority |
|---------|-------------|----------|
| Mobile support | Responsive design, camera capture | High |
| Batch coordinates | Apply same coords to multiple photos | Medium |
| Location search | Search address instead of clicking map | Medium |
| Recent locations | Save and reuse previous coordinates | Medium |
| Authentication | Login for team use | Low |
| Cloud storage | Save processing history | Low |
| Preset profiles | Different output specs for different uses | Low |
| Drag to reorder | Reorder photos in queue | Low |

### Technical Debt to Address

- Add comprehensive error logging
- Add analytics (optional)
- Implement proper loading skeletons
- Add progressive image loading for thumbnails
- Consider Web Workers for processing

---

## 13. Appendix

### A. Google Business Profile Image Requirements

| Specification | Requirement |
|---------------|-------------|
| Format | JPG or PNG |
| File Size | 10 KB – 5 MB |
| Recommended Resolution | 720 × 720 px minimum |
| Maximum Resolution | 5200 × 5300 px |
| Quality | Well-lit, in focus, no heavy filters |

Source: Google Business Profile Help Documentation

### B. Library Documentation Links

- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [React-Leaflet](https://react-leaflet.js.org)
- [heic2any](https://github.com/nickreese/heic2any)
- [browser-image-compression](https://github.com/nickreese/browser-image-compression)
- [piexifjs](https://github.com/nickreese/piexifjs)
- [JSZip](https://stuk.github.io/jszip/)

### C. Coordinate Reference

| Location | Latitude | Longitude |
|----------|----------|-----------|
| New York City | 40.7128 | -74.0060 |
| Los Angeles | 34.0522 | -118.2437 |
| London | 51.5074 | -0.1278 |
| Sydney | -33.8688 | 151.2093 |
| US Center | 39.8283 | -98.5795 |

### D. File Naming Convention

**Source files:** Original names preserved  
**Output files:** `{original_name}.jpg` (extension normalized to .jpg)  
**ZIP file:** `geotag-photos-YYYY-MM-DD.zip`

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-17 | — | Initial PRD |

---

*End of Document*
