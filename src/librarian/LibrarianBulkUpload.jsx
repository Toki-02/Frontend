// src/librarian/BulkUpload.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, UploadCloud, CheckCircle2, AlertTriangle } from "lucide-react";
import { addBook } from "../services/fakeBackend";

export default function BulkUpload() {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState(null); // { type: "success" | "error", message: string }
  const [importing, setImporting] = useState(false);

  const handleTemplateDownload = () => {
    const header = "title,author,publisher,year,category,copies,description\n";
    const sample =
      'Sample Book,F. Scott Fitzgerald,Demo Publisher,2023,Fiction,3,"Short description here."\n';
    const blob = new Blob([header + sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "library_bulk_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length <= 1) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const dataLines = lines.slice(1);

    return dataLines.map((line) => {
      const cols = line.split(",");
      const row = {};
      headers.forEach((h, i) => {
        row[h] = (cols[i] || "").trim();
      });
      return row;
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    setStatus(null);
    setRows([]);
    if (!file) return;

    setFileName(file.name);

    const text = await file.text();
    const parsedRows = parseCSV(text);

    if (!parsedRows.length) {
      setStatus({
        type: "error",
        message:
          "No valid rows detected. Check if the CSV has the correct header line.",
      });
    } else {
      setRows(parsedRows);
      setStatus({
        type: "success",
        message: `Loaded ${parsedRows.length} row(s) from file.`,
      });
    }
  };

  const handleImport = () => {
    if (!rows.length) {
      setStatus({
        type: "error",
        message: "No rows to import. Please choose a valid CSV file first.",
      });
      return;
    }

    setImporting(true);
    try {
      let successCount = 0;
      rows.forEach((r) => {
        if (!r.title || !r.author) return;
        addBook({
          title: r.title,
          author: r.author,
          publisher: r.publisher,
          year: r.year,
          category: r.category,
          description: r.description,
          copies: r.copies,
        });
        successCount += 1;
      });

      setStatus({
        type: "success",
        message: `Imported ${successCount} book(s) into the demo database.`,
      });
    } catch (e) {
      console.error(e);
      setStatus({
        type: "error",
        message: "An error occurred while importing. Please try again.",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-slate-50 to-sky-100 px-6 md:px-10 lg:px-14 py-10 text-sky-950">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white shadow-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-sky-900">
              Bulk Book Upload
            </h1>
            <p className="text-sky-700/75 text-sm">
              Upload a CSV file to encode multiple books at once into the
              prototype database.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTemplateDownload}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 border border-sky-200 text-sky-800 text-sm shadow-sm hover:bg-sky-50"
        >
          <FileText size={16} />
          Download CSV Template
        </button>
      </div>

      {/* Upload + Status */}
      <div className="w-full bg-white/90 border border-sky-100 rounded-2xl shadow-sm p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="font-semibold text-sky-900 text-sm">
                Step 1: Choose CSV file
              </p>
              <p className="text-xs text-sky-700/80">
                Required headers:{" "}
                <code className="bg-sky-50 px-1 py-[1px] rounded text-[11px]">
                  title, author, publisher, year, category, copies, description
                </code>
              </p>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm shadow-md cursor-pointer">
            <UploadCloud size={16} />
            <span>{fileName || "Select CSV file"}</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {status && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            {status.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            <span
              className={
                status.type === "success"
                  ? "text-emerald-700"
                  : "text-red-600"
              }
            >
              {status.message}
            </span>
          </div>
        )}
      </div>

      {/* Preview table */}
      <div className="w-full bg-white/90 border border-sky-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 md:px-6 py-3 border-b border-sky-100 flex items-center justify-between text-xs md:text-sm text-sky-700/80">
          <span>
            Step 2: Preview rows{" "}
            {rows.length > 0 && (
              <>
                — <strong>{rows.length}</strong> row
                {rows.length !== 1 && "s"} loaded
              </>
            )}
          </span>
          <button
            type="button"
            disabled={!rows.length || importing}
            onClick={handleImport}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold shadow-sm flex items-center gap-2 ${
              rows.length && !importing
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <CheckCircle2 size={16} />
            {importing ? "Importing…" : "Import Books into Demo"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs md:text-sm">
            <thead className="bg-sky-50 text-sky-900 uppercase text-[10px] md:text-xs">
              <tr>
                <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                  Title
                </th>
                <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                  Author
                </th>
                <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                  Publisher
                </th>
                <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                  Year
                </th>
                <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                  Category
                </th>
                <th className="px-4 md:px-6 py-2 border-b border-sky-100">
                  Copies
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-sky-700/70 text-sm"
                  >
                    No preview yet. Upload a CSV file to see rows here.
                  </td>
                </tr>
              ) : (
                rows.map((r, idx) => (
                  <motion.tr
                    key={idx}
                    whileHover={{
                      backgroundColor: "rgba(191, 219, 254, 0.45)",
                    }}
                    className="border-b border-sky-50"
                  >
                    <td className="px-4 md:px-6 py-2">{r.title}</td>
                    <td className="px-4 md:px-6 py-2">{r.author}</td>
                    <td className="px-4 md:px-6 py-2">{r.publisher}</td>
                    <td className="px-4 md:px-6 py-2">{r.year}</td>
                    <td className="px-4 md:px-6 py-2">{r.category}</td>
                    <td className="px-4 md:px-6 py-2">{r.copies}</td>
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
