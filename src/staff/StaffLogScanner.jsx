// src/staff/StaffLogScanner.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import CameraModal from "../components/CameraModal";
import { saveLog } from "../services/fakeBackend";

export default function StaffLogScanner() {
  const [open, setOpen] = useState(false);

  const handleCapture = (photo) => {
    const name = "Visitor " + Math.floor(Math.random() * 1000);
    saveLog(name, "Visitor", "Time In / Out", { photo });
    alert(`Log recorded for ${name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-sky-100 px-6 py-10">
      <h1 className="text-3xl font-bold text-sky-900 mb-6">Record Visitor Log</h1>

      <div className="bg-white/90 border border-sky-100 rounded-2xl shadow-md p-8 max-w-lg">
        <p className="text-sky-700/80 mb-6">
          Press the button below to scan a face and automatically record a log.
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md flex items-center gap-2"
          onClick={() => setOpen(true)}
        >
          <Camera size={20} /> Start Face Scan
        </motion.button>
      </div>

      <CameraModal open={open} onClose={() => setOpen(false)} onCapture={handleCapture} />
    </div>
  );
}
