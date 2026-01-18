"use client";

import { Loader2 } from "lucide-react";
import { Progress } from "./ui/progress";

interface ProcessingScreenProps {
  current: number;
  total: number;
}

export function ProcessingScreen({ current, total }: ProcessingScreenProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Processing your photos...
        </h2>
        <p className="text-slate-500 mb-6">
          Converting, compressing, and writing location data
        </p>
        <Progress value={progress} className="mb-3" />
        <p className="text-sm text-slate-600">
          Photo {current} of {total}
        </p>
      </div>
    </div>
  );
}
