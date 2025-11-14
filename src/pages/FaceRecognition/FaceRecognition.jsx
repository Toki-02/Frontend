import React, { useEffect, useState } from "react";
import CameraModal from "../../components/CameraModal";
import { Camera } from "lucide-react";
import { initSeed, saveLog, getLogs, getUsers } from "../../services/fakeBackend";

export default function FaceRecognition() {
  useEffect(() => {
    initSeed();
    refreshLogs();
    setRegisteredUsers(getUsers());
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [scannedImage, setScannedImage] = useState(null);
  const [scannedUser, setScannedUser] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [manualName, setManualName] = useState("");

  function refreshLogs() {
    setRecentLogs(getLogs().slice(0, 20));
  }

  function onCapture(dataUrl) {
    setScannedImage(dataUrl);
    const next = scanCount + 1;
    setScanCount(next);

    if (next === 1) setScannedUser({ name: "Francis Polosco", status: "Registered" });
    else if (next === 2) setScannedUser({ name: "Gerald Venico", status: "Registered" });
    else setScannedUser({ name: null, status: "Unregistered" });

    setModalOpen(false);
  }

  function handleTime(action, source = "face") {
    if (source === "manual") {
      if (!manualName.trim()) return alert("Enter a name for manual log.");
      saveLog(manualName.trim(), "Guest", action);
      setManualName("");
      setScannedImage(null);
      setScannedUser(null);
      refreshLogs();
      return;
    }

    if (!scannedUser || scannedUser.status === "Unregistered") {
      return alert("No registered user scanned. Use manual mode.");
    }
    saveLog(scannedUser.name, "Registered", action);
    setScannedImage(null);
    setScannedUser(null);
    refreshLogs();
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-b from-[#EAF2FB] via-[#E2ECFA] to-[#D8E6F8] text-[#1E3A5F]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SCAN CARD */}
        <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">Time In / Time Out — Scanner</h2>

          <div className="flex flex-col items-center">
            <div className="w-64 h-64 rounded-xl overflow-hidden bg-white/20 border-2 border-sky-300 mb-4 flex items-center justify-center">
              {scannedImage ? (
                <img src={scannedImage} alt="scanned" className="object-cover w-full h-full" />
              ) : (
                <div className="text-center text-sky-700 px-4">
                  <Camera size={48} className="mx-auto mb-2 text-sky-600" />
                  <div className="text-sm">Open camera to capture face</div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-md font-medium text-white"
              >
                Open Camera
              </button>
              <button
                onClick={() => {
                  if (!scannedImage) return alert("Capture an image first.");
                  alert("Image captured. Choose Time In or Time Out below.");
                }}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded-md text-white"
              >
                Captured
              </button>
            </div>

            <div className="mt-6 w-full max-w-md text-center">
              {scannedUser ? (
                scannedUser.status === "Registered" ? (
                  <>
                    <div className="text-sky-700 font-semibold">{scannedUser.name}</div>
                    <div className="text-sm text-sky-900/70 mb-3">Registered user</div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => handleTime("Time In")}
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-white"
                      >
                        Time In
                      </button>
                      <button
                        onClick={() => handleTime("Time Out")}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white"
                      >
                        Time Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-rose-500 font-semibold">Not registered</div>
                    <div className="text-sm text-sky-900/70 mb-3">Use manual mode below, or register user</div>
                  </>
                )
              ) : (
                <div className="text-sm text-sky-900/70">No scan yet</div>
              )}
            </div>
          </div>
        </div>

        {/* MANUAL PANEL */}
        <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-sky-700 mb-4">Manual Log (always available)</h3>

          <div className="space-y-3">
            <label className="block text-sm text-sky-900/70">Visitor / Name</label>
            <input
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="Type full name..."
              className="w-full p-3 rounded-md bg-white/50 border border-white/20 text-[#1E3A5F] placeholder-sky-500 focus:outline-none focus:border-sky-500 transition"
            />

            <div className="flex gap-3">
              <button
                onClick={() => handleTime("Time In", "manual")}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-semibold text-white"
              >
                Time In
              </button>
              <button
                onClick={() => handleTime("Time Out", "manual")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold text-white"
              >
                Time Out
              </button>
              <button
                onClick={() => setManualName("")}
                className="px-3 py-2 bg-gray-400 hover:bg-gray-500 rounded-md text-white"
              >
                Clear
              </button>
            </div>

            <div className="mt-6">
              <h4 className="text-sm text-sky-700 font-medium">Quick actions</h4>
              <p className="text-xs text-sky-900/70">You can scan a face or use manual immediately.</p>
            </div>

            <div className="mt-6">
              <h4 className="text-sm text-sky-700 font-medium mb-2">Recent (preview)</h4>
              <div className="bg-white/20 p-3 rounded-md max-h-48 overflow-auto">
                {recentLogs.length === 0 ? (
                  <div className="text-sky-900/70 text-sm">No logs yet.</div>
                ) : (
                  recentLogs.slice(0, 5).map((l) => (
                    <div key={l.id} className="text-sm text-[#1E3A5F] border-b border-white/10 py-2">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{l.name}</div>
                          <div className="text-xs text-sky-900/70">{l.status} • {l.action}</div>
                        </div>
                        <div className="text-xs text-sky-900/70">{new Date(l.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CameraModal open={modalOpen} onClose={() => setModalOpen(false)} onCapture={onCapture} />
    </div>
  );
}
