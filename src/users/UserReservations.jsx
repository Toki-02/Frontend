import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CameraModal from "../components/CameraModal"; // Import CameraModal

const CART_KEY = "rp_cart";
const RES_KEY = "rp_reservations";
const BOOKS_KEY = "rp_books"; // optional if you want to persist availability changes

// helper: read/write reservations
function readReservations() {
  try {
    return JSON.parse(localStorage.getItem(RES_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeReservations(arr) {
  localStorage.setItem(RES_KEY, JSON.stringify(arr));
}

function cleanupExpiredReservations() {
  const now = Date.now();
  const all = readReservations();
  const still = all.filter((r) => new Date(r.expiresAt).getTime() > now);
  if (still.length !== all.length) writeReservations(still);
  return still;
}

export default function UserReservations() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const [transactions, setTransactions] = useState(() => cleanupExpiredReservations());
  const [cameraOpen, setCameraOpen] = useState(false);  // Camera modal state
  const [fakeScanInProgress, setFakeScanInProgress] = useState(false);  // For simulating the scan

  // User Email - You can replace this with actual user data if available
  const userEmail = "user@example.com";

  // Remove from cart
  const removeFromCart = (bookId) => {
    const next = cart.filter((c) => c.id !== bookId);
    setCart(next);
    toast.info("Removed from cart");
  };

  // Start a fake scan process
  const startFakeScan = () => {
    if (!cart.length) {
      toast.warn("Cart is empty — add some books first.");
      return;
    }

    // Simulate a face scan
    setFakeScanInProgress(true);

    setTimeout(() => {
      setFakeScanInProgress(false); // End fake scan after 3 seconds
      handleReserve(); // Proceed to reservation after the fake scan
    }, 3000); // Simulate the face scan duration of 3 seconds
  };

  // Proceed to reserve books after the fake scan
  const handleReserve = () => {
    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h expiration

    let existing = readReservations();

    // Filter out cart books that are already reserved by this user
    const cartToReserve = cart.filter(
      (b) => !existing.some((r) => r.userEmail === userEmail && r.bookId === b.id)
    );

    if (cartToReserve.length === 0) {
      toast.info("Selected books are already reserved.");
      setCart([]); // Clear cart
      localStorage.removeItem(CART_KEY);
      return;
    }

    const newRes = cartToReserve.map((b) => ({
      id: Date.now() + Math.floor(Math.random() * 999),
      userEmail,
      bookId: b.id,
      reservedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      book: b,
    }));

    const all = [...newRes, ...existing];
    writeReservations(all);
    setTransactions(all);

    // Mark books unavailable in persisted books if present
    try {
      const savedBooks = JSON.parse(localStorage.getItem(BOOKS_KEY) || "[]");
      if (savedBooks.length) {
        const updated = savedBooks.map((sb) => {
          if (cartToReserve.find((c) => c.id === sb.id)) return { ...sb, available: false };
          return sb;
        });
        localStorage.setItem(BOOKS_KEY, JSON.stringify(updated));
      }
    } catch (e) {}

    // Clear cart after reservation
    setCart([]);
    localStorage.removeItem(CART_KEY);

    toast.success(`Reserved ${newRes.length} book(s). Pick up within 24 hours.`);
  };

  // Cancel Reservation
  const cancelReservation = (resId) => {
    const all = readReservations();
    const idx = all.findIndex((r) => r.id === resId && r.userEmail === userEmail);
    if (idx === -1) {
      toast.error("Reservation not found.");
      return;
    }
    const removed = all.splice(idx, 1)[0];
    writeReservations(all);
    setTransactions(all);

    // Mark book available again in persisted books if present
    try {
      const savedBooks = JSON.parse(localStorage.getItem(BOOKS_KEY) || "[]");
      if (savedBooks.length) {
        const updated = savedBooks.map((sb) => {
          if (sb.id === removed.bookId) return { ...sb, available: true };
          return sb;
        });
        localStorage.setItem(BOOKS_KEY, JSON.stringify(updated));
      }
    } catch (e) {}

    toast.info(`Cancelled reservation for "${removed.book.title}"`);
  };

  const hr = (iso) => new Date(iso).toLocaleString();

  return (
    <div className="p-6 min-h-screen">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-sky-700 mb-4">Reservations</h2>

      <div className="mb-6">
        <div className="text-sm text-sky-600">Selected (Cart) — pick books on Browse page</div>
        <div className="mt-3 flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {cart.length === 0 && <div className="text-sky-600">No selected books.</div>}
          {cart.map((b) => (
            <div key={b.id} className="min-w-[220px] bg-white/90 rounded-lg p-3 flex flex-col gap-2 shadow">
              <img src={b.cover} alt={b.title} className="w-full h-28 object-cover rounded-md" />
              <div className="flex-1">
                <div className="font-semibold">{b.title}</div>
                <div className="text-sm text-sky-600">{b.category}</div>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => removeFromCart(b.id)} className="px-3 py-1 rounded-md bg-red-600 text-white">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button onClick={startFakeScan} className="px-4 py-2 rounded-md bg-sky-600 text-white font-semibold">
            {fakeScanInProgress ? "Scanning..." : `Scan Face to Reserve (${cart.length} item${cart.length !== 1 ? "s" : ""})`}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-sky-700 mb-3">Active Reservations</h3>
        {transactions.length === 0 && <div className="text-sky-600">No active reservations.</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {transactions.map((r) => (
            <div key={r.id} className="bg-white rounded-lg p-3 shadow flex gap-3 items-start">
              <img src={r.book.cover} alt={r.book.title} className="w-20 h-28 object-cover rounded-md" />
              <div className="flex-1">
                <div className="font-semibold">{r.book.title}</div>
                <div className="text-sm text-sky-600">{r.book.category}</div>
                <div className="text-xs text-gray-500 mt-2">Reserved: {hr(r.reservedAt)}</div>
                <div className="text-xs text-gray-500">Expires: {hr(r.expiresAt)}</div>
              </div>
              <div>
                <button onClick={() => cancelReservation(r.id)} className="px-3 py-1 rounded-md bg-red-600 text-white text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {cameraOpen && (
        <CameraModal
          open={cameraOpen}
          onClose={() => setCameraOpen(false)}
          onCapture={onCaptureConfirm}
        />
      )}
    </div>
  );
}
