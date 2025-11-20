// src/staff/StaffLogs.jsx
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Clock } from "lucide-react";
import { getLogs } from "../services/fakeBackend";

export default function StaffLogs() {
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return logs.filter((l) => l.name.toLowerCase().includes(q));
  }, [logs, query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-sky-100 px-6 py-10">
      <h1 className="text-3xl font-bold text-sky-900 mb-6">Visitor Logs</h1>

      {/* Search Bar */}
      <div className="mb-6 flex items-center bg-white/90 border border-sky-100 rounded-xl shadow-sm px-4 py-2 gap-2">
        <Search className="text-sky-700" size={18} />
        <input
          className="flex-1 bg-transparent outline-none text-sky-900 placeholder-sky-500"
          placeholder="Search visitor name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white/90 border border-sky-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-sky-50 text-sky-900">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((l) => (
              <motion.tr
                key={l.id}
                whileHover={{ backgroundColor: "rgba(191,219,254,0.35)" }}
                className="border-b border-sky-50"
              >
                <td className="px-6 py-3 font-medium">{l.name}</td>
                <td className="px-6 py-3">{l.status}</td>
                <td className="px-6 py-3">{l.action}</td>
                <td className="px-6 py-3">
                  {new Date(l.timestamp).toLocaleString()}
                </td>
              </motion.tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-sky-700/70">
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
