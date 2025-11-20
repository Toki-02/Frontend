// src/components/CameraModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { X } from "lucide-react";

/**
 * CameraModal
 * - Subtle, professional face scanner UI
 * - Uses MediaPipe FaceMesh
 * - Auto-captures after stable detection + short countdown
 *
 * Props:
 *  - open (bool)
 *  - onClose()
 *  - onCapture(dataUrl)
 */
export default function CameraModal({ open, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [countdown, setCountdown] = useState(0);
  const [status, setStatus] = useState("Position the face inside the guide");
  const [captured, setCaptured] = useState(false);

  // internal refs
  const mediaCameraRef = useRef(null);
  const faceMeshRef = useRef(null);
  const streamRef = useRef(null);
  const stableCountRef = useRef(0);
  const countdownTimerRef = useRef(null);
  const capturedRef = useRef(false);

  useEffect(() => {
    if (!open) return;

    const eyebrowIndices = [63, 65, 70, 105, 282, 285, 295, 300];
    const importantIndices = [33, 263, 1, 61, 291, 234, 454, ...eyebrowIndices];

    let mounted = true;

    const start = async () => {
      try {
        setCaptured(false);
        capturedRef.current = false;
        setCountdown(0);
        setStatus("Starting camera…");

        // request camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // setup FaceMesh
        const fm = new FaceMesh({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });
        faceMeshRef.current = fm;

        fm.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        stableCountRef.current = 0;

        fm.onResults((results) => {
          if (!mounted) return;
          const canvas = canvasRef.current;
          const video = videoRef.current;
          if (!canvas || !video) return;
          const ctx = canvas.getContext("2d");

          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.image) {
            ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
          } else {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          }

          // oval guide
          ctx.beginPath();
          const cx = canvas.width / 2;
          const cy = canvas.height / 2 - canvas.height * 0.03;
          const ox = canvas.width * 0.20;
          const oy = canvas.height * 0.37;
          const rotation = -0.03;
          ctx.ellipse(cx, cy, ox, oy, rotation, 0, Math.PI * 2);
          ctx.lineWidth = 2.4;
          ctx.strokeStyle = "rgba(56,189,248,0.35)"; // sky-400
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(cx, cy, ox - 6, oy - 8, rotation, 0, Math.PI * 2);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(56,189,248,0.15)";
          ctx.stroke();

          const hasFace =
            results.multiFaceLandmarks &&
            results.multiFaceLandmarks.length > 0;

          if (hasFace) {
            const lm = results.multiFaceLandmarks[0];

            // soft line: left eye → nose → right eye
            ctx.beginPath();
            const pts = [33, 1, 263];
            pts.forEach((i, idx) => {
              const p = lm[i];
              if (!p) return;
              const x = p.x * canvas.width;
              const y = p.y * canvas.height;
              if (idx === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            });
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(56,189,248,0.25)";
            ctx.stroke();

            // landmark dots
            importantIndices.forEach((i) => {
              const p = lm[i];
              if (!p) return;
              const x = p.x * canvas.width;
              const y = p.y * canvas.height;

              ctx.beginPath();
              ctx.arc(x, y, 5.5, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(56,189,248,0.08)";
              ctx.fill();

              ctx.beginPath();
              ctx.arc(x, y, 2.4, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(56,189,248,0.95)";
              ctx.fill();

              ctx.lineWidth = 0.8;
              ctx.strokeStyle = "rgba(255,255,255,0.18)";
              ctx.stroke();
            });

            // stable detection
            stableCountRef.current = Math.min(
              99,
              stableCountRef.current + 1
            );

            if (stableCountRef.current >= 3 && !capturedRef.current) {
              if (!countdownTimerRef.current) {
                setCountdown(3);
                setStatus("Face detected — hold still for a moment");
                countdownTimerRef.current = setInterval(() => {
                  setCountdown((prev) => {
                    if (prev <= 1) {
                      clearInterval(countdownTimerRef.current);
                      countdownTimerRef.current = null;
                      if (!capturedRef.current) captureNow();
                      return 0;
                    }
                    return prev - 1;
                  });
                }, 1000);
              }
            } else {
              setStatus("Face detected — hold still");
            }
          } else {
            stableCountRef.current = 0;
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
              countdownTimerRef.current = null;
            }
            setCountdown(0);
            setStatus("No face detected — align within the guide");
          }
        });

        // MediaPipe camera utils (dynamic import)
        const mp = await import("@mediapipe/camera_utils");
        const MP_Camera = mp.Camera;
        const mediaCamera = new MP_Camera(videoRef.current, {
          onFrame: async () => {
            if (!faceMeshRef.current) return;
            await faceMeshRef.current.send({ image: videoRef.current });
          },
          width: 640,
          height: 480,
        });
        mediaCameraRef.current = mediaCamera;
        mediaCamera.start();

        setStatus("Camera ready — position face inside the guide");
      } catch (err) {
        console.error("Camera/FaceMesh error:", err);
        setStatus("Camera unavailable or permission denied");
      }
    };

    start();

    return () => {
      mounted = false;
      try {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        if (mediaCameraRef.current) {
          mediaCameraRef.current.stop();
          mediaCameraRef.current = null;
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        if (faceMeshRef.current) {
          faceMeshRef.current.close?.();
          faceMeshRef.current = null;
        }
      } catch (e) {
        // ignore cleanup errors
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const captureNow = () => {
    const v = videoRef.current;
    if (!v) return;
    if (capturedRef.current) return; // prevent double capture

    capturedRef.current = true;
    setCaptured(true);

    const c = document.createElement("canvas");
    c.width = v.videoWidth || 640;
    c.height = v.videoHeight || 480;
    const ctx = c.getContext("2d");
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const dataUrl = c.toDataURL("image/jpeg", 0.9);
    setStatus("Face captured");

    // cleanup
    try {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      if (mediaCameraRef.current) {
        mediaCameraRef.current.stop();
        mediaCameraRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (faceMeshRef.current) {
        faceMeshRef.current.close?.();
        faceMeshRef.current = null;
      }
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      onCapture?.(dataUrl);
      onClose?.();
    }, 350);
  };

  const handleClose = () => {
    // manual close should also clean up
    try {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      if (mediaCameraRef.current) {
        mediaCameraRef.current.stop();
        mediaCameraRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (faceMeshRef.current) {
        faceMeshRef.current.close?.();
        faceMeshRef.current = null;
      }
    } catch (e) {
      // ignore
    }
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-2xl bg-slate-900/80 rounded-2xl p-4 border border-sky-500/40 shadow-xl backdrop-blur">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sky-100 font-semibold text-sm md:text-base">
            Face Scanner
          </h3>
          <button
            onClick={handleClose}
            className="text-slate-200 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-black">
          {/* hidden raw video (source for MediaPipe) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ display: "none" }}
          />
          {/* canvas shows webcam + overlay */}
          <canvas
            ref={canvasRef}
            className="w-full rounded-md bg-black"
            style={{ aspectRatio: "4/3" }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-xs md:text-sm text-slate-200">{status}</div>
          {!captured ? (
            <div className="text-xs md:text-sm text-sky-300 font-medium">
              {countdown > 0 ? `${countdown}s` : " "}
            </div>
          ) : (
            <div className="text-xs md:text-sm text-emerald-400 font-semibold">
              Captured ✓
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
