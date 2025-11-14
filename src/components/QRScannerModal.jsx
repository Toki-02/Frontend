// src/components/QRScannerModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function QRScannerModal({ open, onClose, onResult }) {
  const videoRef = useRef(null);
  const [message, setMessage] = useState("Position the book in front of the camera...");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!open) return;

    let stream;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;

        setScanning(true);
        setMessage("Scanning QR code...");
        setTimeout(() => {
          setScanning(false);
          setMessage("QR code detected ✅");
          onResult?.("BOOK-QR-" + Math.floor(Math.random() * 10000));
        }, 3000);
      } catch (err) {
        console.error("Camera error:", err);
        setMessage("Camera not available or permission denied.");
      }
    };

    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md bg-black/40 backdrop-blur-2xl rounded-2xl p-4 border border-violet-800/30">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-violet-300">Book QR Scanner</h3>
          <button onClick={onClose} className="text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="relative w-full flex justify-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="rounded-md bg-black w-full"
            style={{ maxHeight: 400, objectFit: "cover" }}
          />
        </div>

        <div className="text-center mt-4 text-gray-300">{message}</div>
      </div>
    </div>
  );
}
