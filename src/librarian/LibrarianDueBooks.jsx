// src/librarian/DueBooks.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getTransactions } from "../services/fakeBackend";

export default function DueBooks() {
  const [tx, setTx] = useState([]);

  useEffect(() => {
    setTx(getTransactions());
  }, []);

  const now = new Date();

  const activeBorrows = useMemo(() => {
    const borrows = tx.filter((t) => t.type === "borrow");
    const returns = tx.filter((t) => t.type === "return");

    return borrows
      .filter((b) => {
        const returned = returns.some(
          (r) =>
            r.userId === b.userId &&
            r.bookQr === b.bookQr &&
            new Date(r.timestamp) > new Date(b.timestamp)
        );
        return !returned;
      })
      .map((b) => {
        const borrowedAt = new Date(b.timestamp);
        const dueDate = new Date(
          borrowedAt.getTime() + 14 * 24 * 60 * 60 * 1000
        ); // 14 days
        const overdue = now > dueDate;
        return { ...b, borrowedAt, dueDate, overdue };
      })
      .sort((a, b) => a.dueDate - b.dueDate);
  }, [tx, now]);

  const overdueCount = activeBorrows.filter((b) => b.overdue).length;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-slate-50 to-sky-100 px-4 md:px-8 lg:px-12 py-8 text-slate-900">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white shadow-md">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-sky-900">
              Due & Overdue Books
            </h1>
            <p className="text-xs md:text-sm text-sky-800/70">
              Automatically computed from Borrow / Return transactions.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start lg:items-end text-xs md:text-sm">
          <span className="text-sky-800/80">
            Active borrowed items:{" "}
            <strong>{activeBorrows.length}</strong>
          </span>
          <span className="text-amber-700 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-4 h-4" />
            Overdue: <strong>{overdueCount}</strong>
          </span>
        </div>
      </div>

      {/* Wide table card */}
      <div className="bg-white/90 rounded-2xl border border-sky-100 shadow-sm overflow-hidden w-full">
        <div className="px-4 md:px-6 py-3 border-b border-sky-100 flex items-center justify-between text-xs md:text-sm text-sky-800/80">
          <span>
            For this prototype, loans are assumed to have a{" "}
            <strong>14-day due date</strong> from the day of borrowing.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs md:text-sm">
            <thead className="bg-sky-50 text-sky-900 uppercase text-[10px] md:text-xs">
              <tr>
                <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                  Borrower
                </th>
                <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                  Book
                </th>
                <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                  Borrowed
                </th>
                <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                  Due Date
                </th>
                <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {activeBorrows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-sky-700/70 text-sm"
                  >
                    No active borrowed books detected from transactions.
                  </td>
                </tr>
              ) : (
                activeBorrows.map((b) => (
                  <motion.tr
                    key={b.id}
                    whileHover={{
                      backgroundColor: b.overdue
                        ? "rgba(248, 113, 113, 0.14)"
                        : "rgba(191, 219, 254, 0.45)",
                    }}
                    className="border-b border-sky-50"
                  >
                    <td className="px-4 md:px-6 py-3 align-top">
                      <div className="font-semibold text-sky-950">
                        {b.userName}
                      </div>
                      <div className="text-[11px] text-sky-700/80">
                        ID: {b.userId}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 align-top">
                      <div className="font-medium text-sky-900">
                        {b.bookTitle}
                      </div>
                      <div className="text-[11px] text-sky-700/80">
                        {b.author}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 text-sky-800/90 align-top">
                      {b.borrowedAt.toLocaleDateString()}
                      <span className="text-[11px] block text-sky-600/80">
                        {b.borrowedAt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 text-sky-800/90 align-top">
                      {b.dueDate.toLocaleDateString()}
                      <span className="text-[11px] block text-sky-600/80">
                        {b.dueDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 align-top">
                      {b.overdue ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-700 text-[11px] border border-red-200">
                          <AlertTriangle className="w-3 h-3" />
                          Overdue
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          On Time
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
