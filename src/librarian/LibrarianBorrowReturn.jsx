// src/pages/BorrowReturn.jsx
import React, { useState, useRef } from "react";
import { Camera, QrCode, BookOpen, RefreshCcw } from "lucide-react";
import CameraModalFake from "../components/CameraModal";
import QRScannerModal from "../components/QRScannerModal";

export default function BorrowReturn() {
  const [faceScanned, setFaceScanned] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [scannedBooks, setScannedBooks] = useState([]); // multiple books
  const [cameraOpen, setCameraOpen] = useState(false);
  const [qrOpen, setQROpen] = useState(false);

  // Counter to alternate fake data between sessions
  const scanCounter = useRef(0);

  // Demo users (same as your old one)
  const demoUsers = [
    { name: "Gerald Venico", studentId: "020358949", address: "Angono" },
    { name: "Francis Polosco", studentId: "020358950", address: "Binangonan" },
  ];

  // Demo books (extended so you can see up to 5 distinct titles)
  const demoBooks = [
    {
      qr: "BOOK-VENUS",
      title: "Venus",
      author: "Sally MacEachern",
      publisher: "Scholastic Library Publishing",
      year: 2004,
    },
    {
      qr: "BOOK-TASTE",
      title: "Taste and Smell",
      author: "Sally MacEachern",
      publisher: "Scholastic Library Publishing",
      year: 2004,
    },
    {
      qr: "BOOK-EARTH",
      title: "Planet Earth",
      author: "Jane Doe",
      publisher: "RPL Demo Press",
      year: 2012,
    },
    {
      qr: "BOOK-MOON",
      title: "Moon Phases",
      author: "Juan Dela Cruz",
      publisher: "RPL Demo Press",
      year: 2015,
    },
    {
      qr: "BOOK-STARS",
      title: "Stars and Galaxies",
      author: "Maria Santos",
      publisher: "RPL Demo Press",
      year: 2018,
    },
  ];

  // FACE CAPTURE — same concept, just cleaned a bit
  const handleFaceCapture = (dataUrl) => {
    const index = scanCounter.current % demoUsers.length; // rotate demo users
    const chosen = demoUsers[index];

    setUserInfo({ ...chosen, image: dataUrl, manual: false });
    setFaceScanned(true);
    setCameraOpen(false);
  };

  // BOOK QR — can scan up to 5 books for the same borrower
  const handleQRResult = (qrText) => {
    if (!faceScanned || !userInfo) {
      alert("Please scan the patron’s face first.");
      return;
    }

    if (scannedBooks.length >= 5) {
      alert("You can only scan a maximum of 5 books for one transaction.");
      return;
    }

    // For the demo, ignore qrText and just pick next demo book
    const index = scannedBooks.length % demoBooks.length;
    const book = demoBooks[index];

    // Optional: prevent the exact same QR from being added twice
    const alreadyAdded = scannedBooks.some((b) => b.qr === book.qr);
    if (alreadyAdded) {
      alert("This book is already in the scanned list.");
      return;
    }

    setScannedBooks((prev) => [...prev, book]);
    setQROpen(false);
  };

  // BORROW / RETURN — process all scanned books in one go
  const handleAction = (actionType) => {
    if (!faceScanned || !userInfo) {
      alert("Please scan a face first.");
      return;
    }

    if (scannedBooks.length === 0) {
      alert("Please scan at least one book QR code.");
      return;
    }

    const LS_TRANSACTIONS = "lib_transactions_v1";
    const all = JSON.parse(localStorage.getItem(LS_TRANSACTIONS) || "[]");
    const now = new Date().toISOString();

    const newTransactions = scannedBooks.map((book) => ({
      id: Date.now() + Math.random(),
      type: actionType,
      userName: userInfo.name,
      userAddress: userInfo.address,
      userId: userInfo.studentId,
      bookTitle: book.title,
      author: book.author,
      publisher: book.publisher,
      year: book.year,
      bookQr: book.qr,
      timestamp: now,
    }));

    const updated = [...newTransactions, ...all];
    localStorage.setItem(LS_TRANSACTIONS, JSON.stringify(updated));

    alert(
      `${userInfo.name} (${userInfo.address}) ${
        actionType === "borrow" ? "borrowed" : "returned"
      } ${scannedBooks.length} book(s):\n\n` +
        scannedBooks.map((b) => `• "${b.title}" by ${b.author}`).join("\n")
    );

    // Next session: alternate demo user & reset everything
    scanCounter.current += 1;
    setFaceScanned(false);
    setUserInfo(null);
    setScannedBooks([]);
  };

  // Optional manual reset for librarian
  const handleReset = () => {
    setFaceScanned(false);
    setUserInfo(null);
    setScannedBooks([]);
  };

  const hasBooks = scannedBooks.length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start gap-8 bg-gradient-to-b from-[#EAF2FB] via-[#E2ECFA] to-[#D8E6F8] text-[#1E3A5F] px-6 py-10">
      <h1 className="text-3xl font-bold text-sky-700">Borrow / Return Books</h1>
      <p className="text-sky-900/70 mb-6 text-center max-w-xl">
        Scan the borrower’s face once, then scan up to five book QR codes. All
        scanned books will be processed together in one Borrow or Return action
        for this patron (demo mode).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* FACE SECTION (almost same as old, with small improvements) */}
        <div className="bg-white/50 border border-white/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-sky-700">Patron</h2>
          <div className="w-64 h-48 border-2 border-dashed border-sky-300/50 rounded-xl flex items-center justify-center mb-4 bg-white/20 backdrop-blur-sm">
            {!faceScanned ? (
              <Camera size={64} className="text-sky-600 opacity-80" />
            ) : (
              <div className="text-center">
                {userInfo?.image && (
                  <img
                    src={userInfo.image}
                    alt="patron"
                    className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
                  />
                )}
                <p className="text-sky-600 font-semibold">
                  Face Recognized ✅
                </p>
                <p className="text-sm text-sky-800 mt-1">{userInfo.name}</p>
                <p className="text-xs text-sky-700/70">{userInfo.address}</p>
                <p className="text-[10px] text-sky-700/60 mt-1">
                  ID: {userInfo.studentId}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCameraOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-2 transition mb-2 text-white"
          >
            <Camera size={18} /> Scan Face
          </button>

          {faceScanned && (
            <button
              onClick={handleReset}
              className="mt-2 text-xs flex items-center gap-1 text-sky-700/80 underline"
            >
              <RefreshCcw size={14} /> Reset Session
            </button>
          )}
        </div>

        {/* BOOK SECTION (same layout but now handles multiple books) */}
        <div className="bg-white/50 border border-white/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-sky-700">Book QR</h2>
          <div className="w-64 h-48 border-2 border-dashed border-sky-300/50 rounded-xl mb-4 bg-white/20 backdrop-blur-sm p-3 flex flex-col justify-center">
            {!hasBooks ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <QrCode size={64} className="text-sky-600 opacity-80 mb-2" />
                <p className="text-sm text-sky-800">
                  No books scanned yet. Scan a QR code to add a book.
                </p>
                <p className="text-xs text-sky-700/70 mt-1">
                  You can scan up to 5 books.
                </p>
              </div>
            ) : (
              <div className="h-full overflow-y-auto">
                <p className="text-xs text-sky-700/80 mb-1">
                  Scanned Books ({scannedBooks.length} / 5)
                </p>
                <ul className="space-y-1 text-xs text-sky-900">
                  {scannedBooks.map((book, index) => (
                    <li
                      key={book.qr}
                      className="bg-white/90 rounded-lg px-2 py-1 shadow-sm"
                    >
                      <span className="font-semibold">
                        {index + 1}. {book.title}
                      </span>
                      <div className="text-[11px] text-sky-700/90">
                        {book.author} • {book.publisher} ({book.year})
                      </div>
                      <div className="text-[10px] text-sky-600">
                        QR: {book.qr}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button
            onClick={() => setQROpen(true)}
            disabled={!faceScanned || scannedBooks.length >= 5}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition text-white ${
              !faceScanned
                ? "bg-gray-400 cursor-not-allowed"
                : scannedBooks.length >= 5
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            <QrCode size={18} />{" "}
            {scannedBooks.length >= 5 ? "Maximum Reached" : "Scan Book"}
          </button>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-6 mt-6">
        <button
          onClick={() => handleAction("borrow")}
          disabled={!faceScanned || !hasBooks}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition text-white ${
            faceScanned && hasBooks
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <BookOpen size={18} /> Borrow All
        </button>

        <button
          onClick={() => handleAction("return")}
          disabled={!faceScanned || !hasBooks}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition text-white ${
            faceScanned && hasBooks
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <RefreshCcw size={18} /> Return All
        </button>
      </div>

      {/* MODALS */}
      <CameraModalFake
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleFaceCapture}
      />
      <QRScannerModal
        open={qrOpen}
        onClose={() => setQROpen(false)}
        onResult={handleQRResult}
      />
    </div>
  );
}
