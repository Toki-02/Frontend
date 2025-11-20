// src/components/QRScannerModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { X, QrCode } from "lucide-react";

/**
 * QRScannerModal
 * - Simple, professional QR scanner simulation
 * - Uses webcam + fake detection timer
 *
 * Props:
 *  - open (bool)
 *  - onClose()
 *  - onResult(qrText)  // demo string, your page can ignore it if needed
 */
export default function QRScannerModal({ open, onClose, onResult }) {
  const videoRef = useRef(null);
  const [message, setMessage] = useState(
    "Position the book’s QR code inside the frame…"
  );
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!open) return;

    let stream;
    let timer;

    const startCamera = async () => {
      try {
        setScanning(false);
        setMessage("Starting camera…");

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) videoRef.current.srcObject = stream;

        setScanning(true);
        setMessage("Scanning QR code…");

        // DEMO: simulate detection after 3 seconds
        timer = setTimeout(() => {
          setScanning(false);
          setMessage("QR code detected ✅");
          const fakeCode = "BOOK-QR-" + Math.floor(Math.random() * 10000);
          onResult?.(fakeCode);
        }, 3000);
      } catch (err) {
        console.error("Camera error:", err);
        setScanning(false);
        setMessage("Camera not available or permission denied.");
      }
    };

    startCamera();

    return () => {
      if (timer) clearTimeout(timer);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [open, onResult]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="relative w-full max-w-md bg-slate-900/85 backdrop-blur-xl rounded-2xl p-4 border border-sky-500/40 shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-sky-300" />
            <h3 className="text-sm md:text-base font-semibold text-sky-100">
              Book QR Scanner
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-200 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video area with scan frame */}
        <div className="relative w-full flex justify-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="rounded-xl bg-black w-full max-h-72 object-cover"
          />

          {/* overlay frame */}
          <div className="pointer-events-none absolute inset-6 border-2 border-sky-400/80 rounded-xl shadow-[0_0_0_999px_rgba(15,23,42,0.6)]">
            {/* corner accents */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-sky-300 rounded-tl-xl" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-sky-300 rounded-tr-xl" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-sky-300 rounded-bl-xl" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-sky-300 rounded-br-xl" />

            {/* scanning line */}
            {scanning && (
              <div className="absolute inset-x-0 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-pulse" />
            )}
          </div>
        </div>

        <div className="text-center mt-4 text-xs md:text-sm text-slate-200">
          {message}
        </div>
        {scanning && (
          <div className="mt-2 text-center text-[11px] text-sky-300">
            Hold the QR code steady for a moment…
          </div>
        )}
      </div>
    </div>
  );
}
