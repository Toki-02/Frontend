import React, { useState } from "react";
import { Camera, QrCode, BookOpen, RefreshCcw } from "lucide-react";
import CameraModalFake from "../../components/CameraModal";
import QRScannerModal from "../../components/QRScannerModal";

export default function BorrowReturn() {
  const [faceScanned, setFaceScanned] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [bookScanned, setBookScanned] = useState(false);
  const [bookInfo, setBookInfo] = useState(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [qrOpen, setQROpen] = useState(false);

  const demoUsers = [
    { name: "Francis Polosco", studentId: "020358950" },
    { name: "Gerald Venico", studentId: "020358949" },
  ];

  const handleFaceCapture = (dataUrl) => {
    if (!faceScanned) {
      const chosen = demoUsers[1]; // Default to Gerald
      setUserInfo({ ...chosen, image: dataUrl, manual: false });
      setFaceScanned(true);
    } else {
      setUserInfo({ name: "", manual: true });
      setFaceScanned(false);
    }

    setCameraOpen(false);
  };

  const handleQRResult = (qrText) => {
    const book = {
      title: qrText ? `Book (${qrText})` : "Introduction to AI",
      qrCode: qrText || "BOOK-QR-000",
    };
    setBookScanned(true);
    setBookInfo(book);
    setQROpen(false);
  };

  const handleAction = (actionType) => {
    const selectedUser = actionType === "borrow" ? demoUsers[1] : demoUsers[0]; 

    if (!bookScanned) return alert("Please scan a book first.");

    const LS_TRANSACTIONS = "lib_transactions_v1";
    const all = JSON.parse(localStorage.getItem(LS_TRANSACTIONS) || "[]");
    all.unshift({
      id: Date.now(),
      type: actionType,
      userName: selectedUser.name,
      userId: selectedUser.studentId,
      bookTitle: bookInfo.title,
      bookQr: bookInfo.qrCode,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(LS_TRANSACTIONS, JSON.stringify(all));

    alert(`${selectedUser.name} ${actionType === "borrow" ? "borrowed" : "returned"} "${bookInfo.title}".`);

    setFaceScanned(false);
    setBookScanned(false);
    setUserInfo(null);
    setBookInfo(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start gap-8 bg-gradient-to-b from-[#EAF2FB] via-[#E2ECFA] to-[#D8E6F8] text-[#1E3A5F] px-6 py-10">
      <h1 className="text-3xl font-bold text-sky-700">Borrow / Return Books</h1>
      <p className="text-sky-900/70 mb-6 text-center max-w-xl">
        Scan the borrower’s face first, then scan the book QR code. Demo mode: uses fixed users or manual input.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Face Section */}
        <div className="bg-white/50 border border-white/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-sky-700">Patron</h2>
          <div className="w-64 h-48 border-2 border-dashed border-sky-300/50 rounded-xl flex items-center justify-center mb-4 bg-white/20 backdrop-blur-sm">
            {!faceScanned ? (
              <Camera size={64} className="text-sky-600 opacity-80" />
            ) : (
              <div className="text-center">
                {userInfo?.image && <img src={userInfo.image} alt="patron" className="w-20 h-20 rounded-full mx-auto mb-2 object-cover" />}
                <p className="text-sky-600 font-semibold">{userInfo.manual ? "Manual Mode" : "Face Recognized ✅"}</p>
                <p className="text-sm text-sky-800 mt-1">{userInfo.name}</p>
              </div>
            )}
          </div>

          {userInfo?.manual && (
            <input
              type="text"
              placeholder="Enter name"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              className="w-full max-w-xs p-2 mb-3 rounded-lg bg-white/50 border border-white/30 text-sky-900 placeholder-sky-500 focus:outline-none focus:border-sky-500 backdrop-blur-sm transition"
            />
          )}

          <button onClick={() => setCameraOpen(true)} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-2 transition mb-2 text-white">
            <Camera size={18} /> Scan Face
          </button>
        </div>

        {/* Book Section */}
        <div className="bg-white/50 border border-white/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-sky-700">Book QR</h2>
          <div className="w-64 h-48 border-2 border-dashed border-sky-300/50 rounded-xl flex items-center justify-center mb-4 bg-white/20 backdrop-blur-sm">
            {!bookScanned ? (
              <QrCode size={64} className="text-sky-600 opacity-80" />
            ) : (
              <div className="text-center">
                <p className="text-sky-600 font-semibold">QR Scanned ✅</p>
                <p className="text-sm text-sky-800 mt-1">{bookInfo?.title}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setQROpen(true)}
            disabled={!faceScanned}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition text-white ${faceScanned ? "bg-sky-600 hover:bg-sky-700" : "bg-gray-400 cursor-not-allowed"}`}
          >
            <QrCode size={18} /> Scan Book
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-6 mt-6">
        <button
          onClick={() => handleAction("borrow")}
          disabled={!bookScanned}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition text-white ${bookScanned ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          <BookOpen size={18} /> Borrow
        </button>

        <button
          onClick={() => handleAction("return")}
          disabled={!bookScanned}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition text-white ${bookScanned ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          <RefreshCcw size={18} /> Return
        </button>
      </div>

      {/* Modals */}
      <CameraModalFake open={cameraOpen} onClose={() => setCameraOpen(false)} onCapture={handleFaceCapture} />
      <QRScannerModal open={qrOpen} onClose={() => setQROpen(false)} onResult={handleQRResult} />
    </div>
  );
}
