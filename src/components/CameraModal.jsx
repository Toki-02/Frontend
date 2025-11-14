// src/components/CameraModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { X } from "lucide-react";

/**
 * CameraModal - subtle, realistic-looking face scanner UI
 * - draws meaningful landmarks on actual face position
 * - auto-captures after a short stable detection period
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
  const [status, setStatus] = useState("Position face inside the guide");
  const [captured, setCaptured] = useState(false);

  // refs for cleanup & stable detection state (avoid stale closures)
  const mediaCameraRef = useRef(null);
  const faceMeshRef = useRef(null);
  const streamRef = useRef(null);
  const stableCountRef = useRef(0);
  const countdownTimerRef = useRef(null);
  const capturedRef = useRef(false);

  useEffect(() => {
    if (!open) return;

    // Important indices — now includes eyebrow nodes (8 eyebrow/important indices total)
    // left eye (33), right eye (263), nose tip (1),
    // mouth corners (61, 291), jaw/ears (234, 454),
    // eyebrow-ish indices (added group) -> (63, 65, 70, 105) and (282, 285, 295, 300)
    // We'll include an 8-index eyebrow set (some may overlap with other points).
    const eyebrowIndices = [63, 65, 70, 105, 282, 285, 295, 300];
    const importantIndices = [33, 263, 1, 61, 291, 234, 454, ...eyebrowIndices];

    let mounted = true;

    const start = async () => {
      try {
        setCaptured(false);
        capturedRef.current = false;
        setCountdown(0);
        setStatus("Starting camera...");

        // request camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // instantiate FaceMesh
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

        // reset stable counter
        stableCountRef.current = 0;

        fm.onResults((results) => {
          if (!mounted) return;
          const canvas = canvasRef.current;
          const video = videoRef.current;
          if (!canvas || !video) return;
          const ctx = canvas.getContext("2d");

          // size canvas to video
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;

          // clear
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // draw video frame (use results.image if available because MediaPipe may provide processed image)
          if (results.image) ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
          else ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // improved, slightly smaller & clearly oval guide
          ctx.beginPath();
          const cx = canvas.width / 2;
          const cy = canvas.height / 2 - canvas.height * 0.03; // slightly up for natural framing
          const ox = canvas.width * 0.20; // narrower horizontally (smaller)
          const oy = canvas.height * 0.37; // taller relative -> more oval
          const rotation = -0.03; // small tilt for a natural look
          ctx.ellipse(cx, cy, ox, oy, rotation, 0, Math.PI * 2);
          ctx.lineWidth = 2.4;
          ctx.strokeStyle = "rgba(160,140,255,0.30)";
          ctx.stroke();

          // draw faint inner ring for guidance
          ctx.beginPath();
          ctx.ellipse(cx, cy, ox - 6, oy - 8, rotation, 0, Math.PI * 2);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(160,140,255,0.12)";
          ctx.stroke();

          // draw detection helpers only if a face is found
          const hasFace = results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0;

          if (hasFace) {
            const lm = results.multiFaceLandmarks[0];

            // subtle connecting line between left eye -> nose -> right eye
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
            ctx.strokeStyle = "rgba(160,140,255,0.22)";
            ctx.stroke();

            // draw nodes at important indices (including eyebrow cluster)
            importantIndices.forEach((i) => {
              const p = lm[i];
              if (!p) return;
              const x = p.x * canvas.width;
              const y = p.y * canvas.height;

              // subtle outer glow
              ctx.beginPath();
              ctx.arc(x, y, 5.8, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(160,140,255,0.06)";
              ctx.fill();

              // inner dot
              ctx.beginPath();
              ctx.arc(x, y, 2.6, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(160,140,255,0.95)";
              ctx.fill();

              // subtle stroke
              ctx.lineWidth = 0.8;
              ctx.strokeStyle = "rgba(255,255,255,0.16)";
              ctx.stroke();
            });

            // face is present — update stable counter (cap to avoid runaway)
            stableCountRef.current = Math.min(99, stableCountRef.current + 1);

            // If face is stable for several frames, start countdown (unless already capturing)
            if (stableCountRef.current >= 3 && !capturedRef.current) {
              if (countdownTimerRef.current == null) {
                // start 3-second countdown for snappier UX
                setCountdown(3);
                setStatus("Stable face detected — capturing soon");
                countdownTimerRef.current = setInterval(() => {
                  setCountdown((prev) => {
                    if (prev <= 1) {
                      // final capture
                      clearInterval(countdownTimerRef.current);
                      countdownTimerRef.current = null;
                      // guard against double-capture
                      if (!capturedRef.current) captureNow();
                      return 0;
                    }
                    return prev - 1;
                  });
                }, 1000);
              }
            }

            setStatus("Face detected — hold still");
          } else {
            // no face: reset stable counter and cancel countdown
            stableCountRef.current = 0;
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
              countdownTimerRef.current = null;
            }
            setCountdown(0);
            setStatus("No face detected — align within guide");
          }
        }); // fm.onResults

        // camera processing via MediaPipe Camera util
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
    }; // start()

    start();

    // cleanup when modal closes or unmounts
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
        // ignore minor cleanup errors
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const captureNow = () => {
    const v = videoRef.current;
    if (!v) return;
    // guard to prevent re-entry
    if (capturedRef.current) return;
    capturedRef.current = true;
    setCaptured(true);

    const c = document.createElement("canvas");
    c.width = v.videoWidth || 640;
    c.height = v.videoHeight || 480;
    const ctx = c.getContext("2d");
    // draw current frame from video element (non-mirrored)
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const dataUrl = c.toDataURL("image/jpeg", 0.9);
    setStatus("Captured");

    // stop/cleanup sources safely
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

    // give a short delay for UX then return the capture
    setTimeout(() => {
      onCapture?.(dataUrl);
      onClose?.();
    }, 350);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/65">
      <div className="w-full max-w-2xl bg-black/45 rounded-2xl p-4 border border-violet-800/30">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-violet-300 font-semibold">Face Scanner</h3>
          <button
            onClick={() => {
              // ensure cleanup then close
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
              } catch (e) {}
              onClose?.();
            }}
            className="text-gray-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-lg">
          {/* hidden raw video (processing source) */}
          <video ref={videoRef} autoPlay playsInline muted style={{ display: "none" }} />

          {/* canvas shows both video and overlay */}
          <canvas
            ref={canvasRef}
            className="w-full rounded-md bg-black"
            style={{ aspectRatio: "4/3" }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-300">{status}</div>
          {!captured ? (
            <div className="text-sm text-violet-300 font-medium">{countdown > 0 ? `${countdown}s` : "—"}</div>
          ) : (
            <div className="text-sm text-green-400 font-medium">Captured ✓</div>
          )}
        </div>
      </div>
    </div>
  );
}
