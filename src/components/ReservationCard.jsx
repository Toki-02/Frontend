import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReservationCard({ reservation, onCancel }) {
  const [open, setOpen] = useState(false);
  const book = reservation.book;

  const isExpired =
    new Date() > new Date(reservation.expiresAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="bg-white/90 border border-sky-200 rounded-2xl p-4 shadow-sm"
    >
      <div
        className="flex items-start gap-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <img
          src={book.img || "/default-book.png"}
          alt={book.title}
          className="w-16 h-20 object-cover rounded-md"
        />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-sky-800">
                {book.title}
              </h3>
              <p className="text-sm text-sky-600">{book.author}</p>
              <p className="text-xs text-sky-500 mt-1">
                Reserved:{" "}
                {new Date(reservation.reservedAt).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <div
                className={`text-sm font-semibold ${
                  isExpired ? "text-red-500" : "text-green-600"
                }`}
              >
                {isExpired ? "Expired" : "Active"}
              </div>
              <div className="text-xs text-sky-500">
                {new Date(reservation.expiresAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-3 pt-3 border-t border-sky-50"
          >
            <p className="text-sm text-sky-700">{book.desc}</p>

            <div className="mt-4 flex gap-2">
              {!isExpired && (
                <button
                  onClick={() => onCancel(reservation.id)}
                  className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
                >
                  Cancel Reservation
                </button>
              )}

              {isExpired && (
                <div className="text-sm text-red-500 italic">
                  This reservation expired.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
