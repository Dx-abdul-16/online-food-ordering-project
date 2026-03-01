import { useEffect, useRef } from "react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
}

/**
 * Simple QR Code display using a canvas-based generator
 * Renders a QR-like visual using the hash value
 */
export default function QRCodeDisplay({ value, size = 200, label }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const moduleCount = 21; // Standard QR modules
    const moduleSize = size / moduleCount;

    canvas.width = size;
    canvas.height = size;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Generate a deterministic pattern from the hash
    const seed = value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Draw QR-like pattern
    ctx.fillStyle = "#000000";

    // Position patterns (corners)
    const drawPositionPattern = (x: number, y: number) => {
      // Outer
      ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
      ctx.fillStyle = "#000000";
      ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
    };

    drawPositionPattern(0, 0);
    drawPositionPattern(moduleCount - 7, 0);
    drawPositionPattern(0, moduleCount - 7);

    // Data modules (deterministic from hash)
    let hashIndex = 0;
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        // Skip position patterns
        if (
          (row < 8 && col < 8) ||
          (row < 8 && col > moduleCount - 9) ||
          (row > moduleCount - 9 && col < 8)
        ) continue;

        // Use hash characters to determine fill
        const charCode = value.charCodeAt(hashIndex % value.length);
        hashIndex++;

        if ((charCode + row * col + seed) % 3 === 0) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  }, [value, size]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-white p-4 rounded-2xl shadow-xl shadow-[#c9a84c]/10 border border-[#2a2a2a]">
        <canvas ref={canvasRef} style={{ width: size, height: size }} />
      </div>
      {label && (
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">
          {label}
        </p>
      )}
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-2">
        <p className="text-xs font-mono text-[#c9a84c] font-black tracking-wider text-center">
          {value}
        </p>
      </div>
    </div>
  );
}
