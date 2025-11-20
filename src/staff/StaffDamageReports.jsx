// src/staff/StaffDamageReports.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Plus } from "lucide-react";

export default function StaffDamageReports() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    title: "",
    severity: "",
    notes: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("damage_reports") || "[]");
    setReports(saved);
  }, []);

  const saveReports = (arr) => {
    setReports(arr);
    localStorage.setItem("damage_reports", JSON.stringify(arr));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.title || !form.severity) {
      alert("Please complete required fields.");
      return;
    }

    const entry = {
      id: Date.now(),
      ...form,
      timestamp: new Date().toISOString(),
    };

    saveReports([entry, ...reports]);

    setForm({ title: "", severity: "", notes: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-sky-100 px-6 py-10">
      <h1 className="text-3xl font-bold text-sky-900 mb-6">Report Damaged Books</h1>

      {/* Form */}
      <form
        onSubmit={submit}
        className="bg-white/90 border border-sky-100 rounded-2xl shadow-md p-6 max-w-2xl mb-10"
      >
        <div className="mb-4">
          <label className="block text-sky-800 font-medium mb-1">
            Book Title *
          </label>
          <input
            type="text"
            className="w-full p-3 rounded-xl bg-white/70 border border-white/40 text-sky-900"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sky-800 font-medium mb-1">
            Severity *
          </label>
          <select
            className="w-full p-3 rounded-xl bg-white/70 border border-white/40 text-sky-900"
            value={form.severity}
            onChange={(e) => setForm({ ...form, severity: e.target.value })}
          >
            <option value="">Select severity</option>
            <option>Minor Damage</option>
            <option>Moderate Damage</option>
            <option>Severe Damage</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sky-800 font-medium mb-1">
            Notes (Optional)
          </label>
          <textarea
            className="w-full p-3 rounded-xl bg-white/70 border border-white/40 text-sky-900"
            rows={4}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus size={18} /> Submit Report
        </motion.button>
      </form>

      {/* Reports list */}
      <div className="bg-white/90 border border-sky-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-sky-50 text-sky-900">
            <tr>
              <th className="px-6 py-3">Book</th>
              <th className="px-6 py-3">Severity</th>
              <th className="px-6 py-3">Notes</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((r) => (
              <motion.tr
                key={r.id}
                whileHover={{ backgroundColor: "rgba(254,226,226,0.45)" }}
                className="border-b border-sky-50"
              >
                <td className="px-6 py-3">{r.title}</td>
                <td className="px-6 py-3">{r.severity}</td>
                <td className="px-6 py-3">{r.notes || "-"}</td>
                <td className="px-6 py-3">
                  {new Date(r.timestamp).toLocaleString()}
                </td>
              </motion.tr>
            ))}

            {reports.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-sky-700/70">
                  No damage reports yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
