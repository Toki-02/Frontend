// src/librarian/Reports.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  BookOpen,
  BookMarked,
  Library,
  Clock,
} from "lucide-react";

import BorrowTrendChart from "../components/charts/BorrowTrendChart";
import CategoryPie from "../components/charts/CategoryPie";

import {
  getReportSummary,
  getBooks,
  getUsers,
  getTopBooks,
  getTopCategories,
  getMonthlyStats,
  getLogs,
  clearLogs,
} from "../services/fakeBackend";

function exportCSV(rows = [], filename = "logs.csv") {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => {
          let val = r[h] ?? "";
          if (typeof val === "string") val = val.replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [summary, setSummary] = useState({});
  const [books, setBooks] = useState([]);
  const [users, setUsersState] = useState([]);
  const [topBooks, setTopBooksState] = useState([]);
  const [topCategories, setTopCategoriesState] = useState([]);
  const [monthlyStats, setMonthlyStatsState] = useState([]);
  const [logs, setLogsState] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSummary(getReportSummary());
    setBooks(getBooks());
    setUsersState(getUsers());
    setTopBooksState(getTopBooks());
    setTopCategoriesState(getTopCategories());
    setMonthlyStatsState(getMonthlyStats());
    setLogsState(getLogs());

    const tx = JSON.parse(localStorage.getItem("lib_transactions_v1") || "[]");
    setTransactions(tx.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)));
  }, []);

  const filteredLogs = useMemo(() => {
    let arr = logs.slice();
    const q = query.trim().toLowerCase();
    if (q)
      arr = arr.filter((r) => (r.name || "").toLowerCase().includes(q));
    if (dateFrom)
      arr = arr.filter(
        (r) => new Date(r.timestamp) >= new Date(dateFrom + "T00:00:00")
      );
    if (dateTo)
      arr = arr.filter(
        (r) => new Date(r.timestamp) <= new Date(dateTo + "T23:59:59")
      );
    return arr.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  }, [logs, query, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / perPage));
  const pageItems = filteredLogs.slice((page - 1) * perPage, page * perPage);

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.6, ease: "easeOut" },
    },
  });

  const borrowChartData = {
    labels: monthlyStats.map((m) => m.month),
    datasets: [
      {
        label: "Books Borrowed",
        data: monthlyStats.map((m) => m.borrowed),
        backgroundColor: "rgba(59,130,246,0.85)",
        borderRadius: 10,
      },
    ],
  };

  const pieData = {
    labels: topCategories.map((c) => c.category),
    datasets: [
      {
        data: topCategories.map((c) => c.count),
        backgroundColor: [
          "rgba(59,130,246,0.9)",
          "rgba(96,165,250,0.8)",
          "rgba(14,165,233,0.8)",
          "rgba(52,211,153,0.8)",
          "rgba(96,165,250,0.6)",
        ],
      },
    ],
  };

  const refreshLogs = () => {
    setLogsState(getLogs());
    setSummary(getReportSummary());
    const tx = JSON.parse(localStorage.getItem("lib_transactions_v1") || "[]");
    setTransactions(tx.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#F0FAFF]/90 to-[#D8ECF8]/90 text-gray-900 overflow-x-hidden pb-12">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp(0.1)}
        className="w-full py-10 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-500 drop-shadow-md">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-2 text-sm uppercase tracking-wide">
          Library System Overview — usage, health, trends & logs
        </p>
      </motion.div>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-10 lg:px-16 pb-10">
        {[
          {
            title: "Total Users",
            value: summary.totalUsers || 0,
            icon: <Users className="text-blue-400" size={28} />,
            subtitle: "Registered patrons",
          },
          {
            title: "Books Borrowed",
            value: summary.borrowedBooks || 0,
            icon: <BookOpen className="text-blue-400" size={28} />,
            subtitle: "Transactions recorded",
          },
          {
            title: "DB Records",
            value: summary.totalBooks || 0,
            icon: <Library className="text-blue-400" size={28} />,
            subtitle: "Books stored",
          },
          {
            title: "Logs",
            value: summary.totalLogs || 0,
            icon: <Clock className="text-blue-400" size={28} />,
            subtitle: "Attendance records",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            variants={fadeUp(idx * 0.08)}
            initial="hidden"
            whileInView="visible"
            className="bg-white/40 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-blue-500 font-semibold">
                  {item.title}
                </h3>
                <p className="text-2xl md:text-3xl font-bold mt-2">
                  {item.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
              </div>
              <div>{item.icon}</div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 md:px-10 lg:px-16 pb-14">
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-blue-500 flex items-center gap-2">
              <BarChart3 size={18} /> Borrow Trend
            </h2>
            <span className="text-sm text-gray-500">Last 6 months</span>
          </div>
          <div className="h-[320px]">
            <BorrowTrendChart chartData={borrowChartData} />
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-blue-500 flex items-center gap-2">
              <BookMarked size={18} /> Category Share
            </h2>
            <span className="text-sm text-gray-500">All time</span>
          </div>
          <div className="h-[320px] flex justify-center items-center">
            <CategoryPie data={pieData} />
          </div>
        </div>
      </section>

      {/* Top Books Table */}
      <section className="px-6 md:px-10 lg:px-16 pb-14">
        <h2 className="text-xl font-semibold text-blue-500 mb-4">
          Top Borrowed Books (Demo)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200 rounded-xl bg-white/40 backdrop-blur-sm">
            <thead className="bg-gray-200/60 text-gray-900 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 border-b border-gray-300">Title</th>
                <th className="px-4 py-2 border-b border-gray-300">Category</th>
                <th className="px-4 py-2 border-b border-gray-300">
                  Times Borrowed
                </th>
              </tr>
            </thead>
            <tbody>
              {topBooks.map((book, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-white/50 transition"
                >
                  <td className="px-4 py-2">{book.title}</td>
                  <td className="px-4 py-2">{book.category}</td>
                  <td className="px-4 py-2">{book.borrowed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Active Users Table */}
      <section className="px-6 md:px-10 lg:px-16 pb-14">
        <h2 className="text-xl font-semibold text-blue-500 mb-4">
          Active Users (Demo)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200 rounded-xl bg-white/40 backdrop-blur-sm">
            <thead className="bg-gray-200/60 text-gray-900 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 border-b border-gray-300">Name</th>
                <th className="px-4 py-2 border-b border-gray-300">Address</th>
                <th className="px-4 py-2 border-b border-gray-300">
                  Last Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-white/50 transition"
                >
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.address}</td>
                  <td className="px-4 py-2">{user.lastAction || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Logs Table */}
      <section className="px-6 md:px-10 lg:px-16 pb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-500">
            Recent Logs / Attendance
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() =>
                exportCSV(
                  filteredLogs.map((r) => {
                    const parts = (r.name || "").split("(");
                    const nameOnly = parts[0].trim();
                    const addr = parts[1]
                      ? parts[1].replace(")", "").trim()
                      : "-";
                    return {
                      Name: nameOnly,
                      Address: addr,
                      Status: r.status,
                      Action: r.action,
                      Timestamp: r.timestamp,
                    };
                  }),
                  "logs-report.csv"
                )
              }
              className="px-3 py-1 bg-blue-500 rounded-md hover:bg-blue-600 text-white text-xs md:text-sm"
            >
              Export CSV
            </button>
            <button
              onClick={() => {
                if (!window.confirm("Clear all logs?")) return;
                clearLogs();
                refreshLogs();
              }}
              className="px-3 py-1 bg-red-500 rounded-md hover:bg-red-600 text-white text-xs md:text-sm"
            >
              Clear Logs
            </button>
          </div>
        </div>

        <div className="bg-white/40 border border-gray-200 rounded-2xl p-4 overflow-x-auto">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-4 items-center">
            <input
              placeholder="Search name..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="p-2 rounded-md bg-white/80 border border-gray-300 text-gray-900 w-full md:w-1/3 text-sm"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                className="p-2 rounded-md bg-white/80 border border-gray-300 text-gray-900 text-sm"
              />
              <label className="text-sm text-gray-600">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
                className="p-2 rounded-md bg-white/80 border border-gray-300 text-gray-900 text-sm"
              />
            </div>
            <div className="md:ml-auto flex items-center gap-2">
              <label className="text-sm text-gray-600">Per page</label>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="p-2 rounded-md bg-white/80 border border-gray-300 text-gray-900 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <button
                onClick={refreshLogs}
                className="px-3 py-2 bg-blue-500 rounded-md hover:bg-blue-600 text-white text-xs md:text-sm"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="text-gray-900 text-sm">
              <tr>
                <th className="py-2 px-3 border-b border-gray-300">#</th>
                <th className="py-2 px-3 border-b border-gray-300">Name</th>
                <th className="py-2 px-3 border-b border-gray-300">Address</th>
                <th className="py-2 px-3 border-b border-gray-300">Status</th>
                <th className="py-2 px-3 border-b border-gray-300">Action</th>
                <th className="py-2 px-3 border-b border-gray-300">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-600 text-sm"
                  >
                    No results
                  </td>
                </tr>
              ) : (
                pageItems.map((r, idx) => {
                  const parts = (r.name || "").split("(");
                  const nameOnly = parts[0].trim();
                  const addr = parts[1]
                    ? parts[1].replace(")", "").trim()
                    : "-";
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-gray-200 hover:bg-white/60 transition"
                    >
                      <td className="py-3 px-3">
                        {(page - 1) * perPage + idx + 1}
                      </td>
                      <td className="py-3 px-3">{nameOnly}</td>
                      <td className="py-3 px-3">{addr}</td>
                      <td className="py-3 px-3">{r.status}</td>
                      <td className="py-3 px-3">{r.action}</td>
                      <td className="py-3 px-3">
                        {new Date(r.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-xs md:text-sm">
            <div className="text-gray-600">
              Showing {(page - 1) * perPage + 1} -{" "}
              {Math.min(page * perPage, filteredLogs.length)} of{" "}
              {filteredLogs.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-60"
              >
                Prev
              </button>
              <div className="px-3 py-1 bg-gray-100 rounded-md text-sm">
                {page} / {totalPages}
              </div>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Borrow / Return Transactions */}
      <section className="px-6 md:px-10 lg:px-16 pb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-500">
            Borrow / Return Transactions
          </h2>
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <label className="text-gray-600">Sort by:</label>
            <select
              onChange={(e) => {
                const choice = e.target.value;
                const tx = JSON.parse(
                  localStorage.getItem("lib_transactions_v1") || "[]"
                );
                const sorted =
                  choice === "recent"
                    ? tx.sort(
                        (a, b) =>
                          new Date(b.timestamp) - new Date(a.timestamp)
                      )
                    : tx.sort(
                        (a, b) =>
                          new Date(a.timestamp) - new Date(b.timestamp)
                      );
                setTransactions(sorted);
              }}
              className="p-2 rounded-md bg-white/80 border border-gray-300 text-gray-900"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="bg-white/40 border border-gray-200 rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="text-gray-900 text-sm">
              <tr>
                <th className="py-2 px-3 border-b border-gray-300">Name</th>
                <th className="py-2 px-3 border-b border-gray-300">Book</th>
                <th className="py-2 px-3 border-b border-gray-300">Type</th>
                <th className="py-2 px-3 border-b border-gray-300">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-600 text-sm"
                  >
                    No transactions
                  </td>
                </tr>
              ) : (
                transactions.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-200 hover:bg-white/60 transition"
                  >
                    <td className="py-3 px-3">{r.userName}</td>
                    <td className="py-3 px-3">{r.bookTitle}</td>
                    <td className="py-3 px-3">
                      {r.type === "borrow" ? (
                        <span className="text-green-600 font-medium">
                          Borrowed
                        </span>
                      ) : (
                        <span className="text-blue-600 font-medium">
                          Returned
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {new Date(r.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="w-full py-6 border-t border-blue-200/40 text-gray-500 text-xs text-center">
        © {new Date().getFullYear()} Rizal Provincial Library and Information System
      </footer>
    </div>
  );
}
