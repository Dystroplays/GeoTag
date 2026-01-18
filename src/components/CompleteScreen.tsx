"use client";

import { CheckCircle, Download, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface CompleteScreenProps {
  photoCount: number;
  onDownload: () => void;
  onStartOver: () => void;
}

export function CompleteScreen({
  photoCount,
  onDownload,
  onStartOver,
}: CompleteScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-slate-900 mb-2">All done!</h1>
        <p className="text-slate-600 mb-8">
          {photoCount} photo{photoCount !== 1 ? "s have" : " has"} been
          processed and {photoCount !== 1 ? "are" : "is"} ready to download.
        </p>

        <div className="space-y-3">
          <Button onClick={onDownload} className="w-full" size="lg">
            <Download className="h-5 w-5 mr-2" />
            Download ZIP
          </Button>
          <Button
            onClick={onStartOver}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
}
