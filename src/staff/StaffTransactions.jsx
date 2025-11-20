// src/staff/StaffTransactions.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Search, Calendar } from "lucide-react";
import { getTransactions } from "../services/fakeBackend";

export default function StaffTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    try {
      const tx = getTransactions() || [];
      const sorted = tx.sort((a, b) =>
        a.timestamp < b.timestamp ? 1 : -1
      );
      setTransactions(sorted);
    } catch (e) {
      console.error("Error loading transactions:", e);
    }
  }, []);

  const filtered = useMemo(() => {
    let arr = transactions.slice();

    const q = query.toLowerCase().trim();
    if (q) {
      arr = arr.filter(
        (t) =>
          (t.userName || "").toLowerCase().includes(q) ||
          (t.bookTitle || "").toLowerCase().includes(q)
      );
    }

    if (dateFrom) {
      arr = arr.filter(
        (t) =>
          new Date(t.timestamp) >= new Date(dateFrom + "T00:00:00")
      );
    }

    if (dateTo) {
      arr = arr.filter(
        (t) =>
          new Date(t.timestamp) <= new Date(dateTo + "T23:59:59")
      );
    }

    arr.sort((a, b) =>
      sort === "recent"
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    );

    return arr;
  }, [transactions, query, dateFrom, dateTo, sort]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-sky-100 px-6 py-10 text-sky-950">
      <h1 className="text-3xl font-bold text-sky-900 mb-6">
        Borrow / Return Transactions
      </h1>

      {/* Filters */}
      <div className="bg-white/90 border border-sky-100 rounded-2xl shadow-sm p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-white/70 border border-sky-100 rounded-xl px-4 py-2">
            <Search className="text-sky-600" size={18} />
            <input
              className="flex-1 bg-transparent outline-none text-sky-900 placeholder-sky-500"
              placeholder="Search borrower or book..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Date Filters */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600" />
            <label className="text-xs text-sky-700/80">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/70 border border-sky-100"
            />

            <label className="text-xs text-sky-700/80">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/70 border border-sky-100"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/70 border border-sky-100 text-sky-900 text-sm"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/90 border border-sky-100 rounded-2xl shadow-sm p-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sky-50 text-sky-900 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 border-b">Borrower</th>
              <th className="px-4 py-3 border-b">Book</th>
              <th className="px-4 py-3 border-b">Type</th>
              <th className="px-4 py-3 border-b">Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-sky-700/70"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <motion.tr
                  key={t.id}
                  whileHover={{
                    backgroundColor: "rgba(191, 219, 254, 0.45)",
                  }}
                  className="border-b border-sky-50"
                >
                  <td className="px-4 py-3">{t.userName}</td>
                  <td className="px-4 py-3">{t.bookTitle}</td>
                  <td className="px-4 py-3">
                    {t.type === "borrow" ? (
                      <span className="text-green-600 font-semibold">
                        Borrowed
                      </span>
                    ) : (
                      <span className="text-blue-600 font-semibold">
                        Returned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(t.timestamp).toLocaleString()}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
