declare module "piexifjs" {
  interface GPSIFD {
    GPSLatitudeRef: number;
    GPSLatitude: number;
    GPSLongitudeRef: number;
    GPSLongitude: number;
  }

  interface ExifObject {
    "0th": Record<number, any>;
    Exif: Record<number, any>;
    GPS: Record<number, any>;
    Interop: Record<number, any>;
    "1st": Record<number, any>;
    thumbnail: string | null;
  }

  const piexif: {
    GPSIFD: GPSIFD;
    load: (base64: string) => ExifObject;
    dump: (exifObj: ExifObject | Record<string, any>) => string;
    insert: (exifStr: string, base64: string) => string;
  };

  export default piexif;
}
