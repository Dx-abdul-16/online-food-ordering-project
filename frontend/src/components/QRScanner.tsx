import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, CheckCircle2, AlertCircle } from "lucide-react";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Start scanning loop
      intervalRef.current = setInterval(() => {
        scanFrame();
      }, 500);
    } catch (err) {
      setError(
        "Camera access denied. Please allow camera permissions to scan QR codes."
      );
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for QR code detection
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Simple check for QR-like patterns (we'll use prompt-based scanning)
    // In production, use a library like jsQR
    // For now, we'll use a text input fallback
  };

  const handleManualInput = () => {
    const code = prompt("Enter QR Code / Order Hash:");
    if (code) {
      stopCamera();
      setScanning(false);
      onScan(code.trim().toUpperCase());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
        <h2 className="text-white font-black text-lg flex items-center gap-2">
          <Camera className="h-5 w-5 text-[#c9a84c]" />
          QR Scanner
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="text-white hover:text-red-500 rounded-full h-10 w-10 p-0"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {error ? (
        <div className="text-center p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 font-bold mb-6">{error}</p>
          <Button
            onClick={handleManualInput}
            className="bg-[#c9a84c] text-black hover:bg-[#b8943d] rounded-2xl h-14 px-8 font-black"
          >
            ENTER CODE MANUALLY
          </Button>
        </div>
      ) : (
        <>
          {/* Camera view */}
          <div className="relative w-[320px] h-[320px] rounded-3xl overflow-hidden border-2 border-[#c9a84c]/50">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {/* Scan overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#c9a84c] rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#c9a84c] rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#c9a84c] rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#c9a84c] rounded-br-2xl" />
              {/* Scan line animation */}
              <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent animate-pulse top-1/2" />
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <p className="text-gray-400 text-sm mt-4 font-medium text-center max-w-xs">
            Point your camera at the QR code to scan
          </p>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleManualInput}
              variant="outline"
              className="border-[#2a2a2a] text-white hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/50 rounded-xl h-12 px-6 font-bold"
            >
              ENTER CODE MANUALLY
            </Button>
            <Button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              variant="destructive"
              className="rounded-xl h-12 px-6 font-bold"
            >
              CANCEL
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
