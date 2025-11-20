// src/librarian/LibrarianQRBulkGenerator.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { QrCode, BookOpen, Filter, CheckSquare, Square } from "lucide-react";
import { getBooks } from "../services/fakeBackend";
import QRGenerator from "../components/QRGenerator";

export default function LibrarianQRBulkGenerator() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    setBooks(getBooks());
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    books.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [books]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return books.filter((b) => {
      const matchesText =
        !q ||
        (b.title || "").toLowerCase().includes(q) ||
        (b.author || "").toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "all" || b.category === categoryFilter;
      return matchesText && matchesCategory;
    });
  }, [books, query, categoryFilter]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = filtered.map((b) => b.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const selectedBooks = books.filter((b) => selectedIds.includes(b.id));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-slate-50 to-sky-100 px-6 md:px-10 lg:px-14 py-10 text-sky-950">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-sky-900">
              Bulk QR Code Generator
            </h1>
            <p className="text-sky-700/75 text-sm">
              Select multiple books and generate QR codes for printing or
              labeling in one place.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end text-xs md:text-sm">
          <span>
            Total books: <strong>{books.length}</strong>
          </span>
          <span>
            Selected for QR: <strong>{selectedBooks.length}</strong>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col lg:flex-row gap-3 lg:items-center">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 bg-white/90 border border-sky-100 rounded-xl shadow-sm px-4 py-2 backdrop-blur">
          <BookOpen className="text-sky-600" size={18} />
          <input
            className="flex-1 bg-transparent outline-none text-sky-900 placeholder-sky-500 text-sm"
            placeholder="Search by title or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <Filter className="w-4 h-4 text-sky-600" />
          <span className="text-sky-800/80">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/90 border border-sky-100 text-sky-900 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400"
          >
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Select all visible */}
        <button
          type="button"
          onClick={toggleSelectAllVisible}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 border border-sky-100 text-sky-800 text-xs md:text-sm shadow-sm hover:bg-sky-50"
        >
          {filtered.length &&
          filtered.every((b) => selectedIds.includes(b.id)) ? (
            <>
              <CheckSquare size={16} className="text-sky-600" />
              Unselect visible
            </>
          ) : (
            <>
              <Square size={16} className="text-sky-600" />
              Select all visible ({filtered.length})
            </>
          )}
        </button>
      </div>

      {/* Table + QR preview */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_minmax(260px,0.9fr)] gap-6">
        {/* Book list table */}
        <div className="w-full bg-white/90 border border-sky-100 shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="px-4 md:px-6 py-3 border-b border-sky-100 text-xs md:text-sm text-sky-700/80 flex items-center justify-between">
            <span>
              Showing <strong>{filtered.length}</strong> book
              {filtered.length !== 1 && "s"} matching filters
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs md:text-sm">
              <thead className="bg-sky-50 text-sky-900 text-[10px] md:text-xs uppercase">
                <tr>
                  <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                    Select
                  </th>
                  <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                    Title
                  </th>
                  <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                    Author
                  </th>
                  <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                    Category
                  </th>
                  <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                    Year
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-6 text-sky-700/70 text-sm"
                    >
                      No books found with the current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => {
                    const checked = selectedIds.includes(b.id);
                    return (
                      <motion.tr
                        key={b.id}
                        whileHover={{
                          backgroundColor: "rgba(191, 219, 254, 0.45)",
                        }}
                        className="border-b border-sky-50"
                      >
                        <td className="px-4 md:px-6 py-2">
                          <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleSelect(b.id)}
                              className="accent-sky-600"
                            />
                          </label>
                        </td>
                        <td className="px-4 md:px-6 py-2 font-medium text-sky-900">
                          {b.title}
                        </td>
                        <td className="px-4 md:px-6 py-2 text-sky-800">
                          {b.author}
                        </td>
                        <td className="px-4 md:px-6 py-2 text-sky-700">
                          {b.category || "-"}
                        </td>
                        <td className="px-4 md:px-6 py-2 text-sky-700">
                          {b.year || "-"}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* QR preview panel */}
        <div className="w-full bg-white/90 border border-sky-100 shadow-sm rounded-2xl p-4 md:p-5 flex flex-col">
          <h2 className="text-sm md:text-base font-semibold text-sky-900 mb-3 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-sky-600" />
            QR Preview ({selectedBooks.length})
          </h2>

          {selectedBooks.length === 0 ? (
            <p className="text-xs md:text-sm text-sky-700/80">
              Select one or more books from the list to see QR codes ready for
              printing.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-1 overflow-auto max-h-[480px] pr-1">
              {selectedBooks.map((b) => (
                <div
                  key={b.id}
                  className="bg-white border border-sky-100 rounded-xl p-3 flex flex-col items-center justify-between shadow-sm text-center"
                >
                  <div className="w-24 h-24 flex items-center justify-center">
                    <QRGenerator value={`BOOK:${b.id}`} />
                  </div>
                  <div className="mt-2">
                    <div className="text-[11px] font-semibold text-sky-900 line-clamp-2">
                      {b.title}
                    </div>
                    <div className="text-[10px] text-sky-700/80">
                      ID: {b.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedBooks.length > 0 && (
            <p className="mt-3 text-[11px] text-sky-700/70">
              For the prototype, you can right-click → “Save image” on each QR
              code, or use the browser’s Print dialog to print this section for
              shelf and book labeling.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
