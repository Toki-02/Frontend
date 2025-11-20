// src/librarian/LibrarianUsers.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Search, UserPlus } from "lucide-react";
import { getUsers } from "../services/fakeBackend";

export default function LibrarianUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.address || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-slate-50 to-sky-100 px-6 md:px-10 lg:px-14 py-10 text-sky-950">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 flex items-center justify-center text-white shadow-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-sky-900">
              Borrower Management
            </h1>
            <p className="text-sky-700/70 text-sm">
              View, search, and manage all registered users.
            </p>
          </div>
        </div>

        <button
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl shadow-md text-sm"
          onClick={() => alert("Demo Only: Add User Form Coming Soon")}
        >
          <UserPlus size={18} /> Add Borrower
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center w-full bg-white/90 border border-sky-100 rounded-xl shadow-sm px-4 py-2 gap-2 backdrop-blur">
        <Search className="text-sky-700" size={18} />
        <input
          className="flex-1 bg-transparent outline-none text-sky-900 placeholder-sky-500 text-sm"
          placeholder="Search borrowers by name or address..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Wide Table Wrapper */}
      <div className="w-full bg-white/90 border border-sky-100 shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="px-4 md:px-6 py-3 border-b border-sky-100 text-xs md:text-sm text-sky-700/80">
          Showing <strong>{filtered.length}</strong> borrower{filtered.length !== 1 && "s"}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-sky-50 text-sky-900 text-[11px] uppercase">
              <tr>
                <th className="px-4 md:px-6 py-3 border-b border-sky-100">Name</th>
                <th className="px-4 md:px-6 py-3 border-b border-sky-100">
                  Membership
                </th>
                <th className="px-4 md:px-6 py-3 border-b border-sky-100">
                  Address
                </th>
                <th className="px-4 md:px-6 py-3 border-b border-sky-100">
                  Face ID
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-sky-700/70 text-sm"
                  >
                    No borrowers found.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <motion.tr
                    key={u.id}
                    whileHover={{ backgroundColor: "rgba(191, 219, 254, 0.35)" }}
                    className="border-b border-sky-50"
                  >
                    <td className="px-4 md:px-6 py-3 font-medium text-sky-900">
                      {u.name}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-sky-700">
                      {u.membership}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-sky-700">
                      {u.address}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-sky-700">
                      {u.faceId || "-"}
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
