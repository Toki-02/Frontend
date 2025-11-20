// src/librarian/LibrarianHome.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Users,
  Activity,
  ArrowRightCircle,
  PlusSquare,
  UserPlus,
  AlertTriangle,
  FileText,
  Sparkles,
} from "lucide-react";
import {
  getUsers,
  readBooks,
  readTransactions,
  readReservations,
} from "../services/fakeBackend";

export default function LibrarianHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalUsers: 0,
    activeReservations: 0,
    todayTransactions: 0,
    overdueCount: 0,
  });
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const users = getUsers();
      const books = readBooks();
      const tx = readTransactions();
      const reservations = readReservations();

      const today = new Date().toDateString();
      const todayTransactions = tx.filter(
        (t) => new Date(t.timestamp).toDateString() === today
      );

      const overdue = tx.filter(
        (t) => t.type === "borrow" && t.dueDate && new Date(t.dueDate) < new Date()
      );

      setStats({
        totalBooks: books.length,
        availableBooks: books.filter((b) => b.available !== false).length,
        totalUsers: users.length,
        activeReservations: reservations.length,
        todayTransactions: todayTransactions.length,
        overdueCount: overdue.length,
      });

      setRecentTx(tx.slice(-5).reverse());
    } catch (err) {
      console.error("LibrarianHome stats error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const overviewCards = [
    {
      label: "Total Books",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "from-sky-400/90 via-sky-500/90 to-sky-600/90",
      onClick: () => navigate("/librarian/inventory"),
    },
    {
      label: "Available",
      value: stats.availableBooks,
      icon: Sparkles,
      color: "from-emerald-400/90 via-emerald-500/90 to-emerald-600/90",
      onClick: () => navigate("/lib/inventory"),
    },
    {
      label: "Registered Borrowers",
      value: stats.totalUsers,
      icon: Users,
      color: "from-indigo-400/90 via-indigo-500/90 to-indigo-600/90",
      onClick: () => navigate("/lib/users"),
    },
    {
      label: "Active Reservations",
      value: stats.activeReservations,
      icon: Clock,
      color: "from-amber-400/90 via-amber-500/90 to-amber-600/90",
      onClick: () => navigate("/lib/reports"),
    },
  ];

  const quickActions = [
    {
      label: "Borrow / Return",
      icon: ArrowRightCircle,
      onClick: () => navigate("/lib/borrow-return"),
      desc: "Scan face + QR to process transactions quickly.",
    },
    {
      label: "Add Single Book",
      icon: PlusSquare,
      onClick: () => navigate("/lib/add-book"),
      desc: "Encode a new title with QR code.",
    },
    {
      label: "Bulk Upload",
      icon: FileText,
      onClick: () => navigate("/lib/bulk-upload"),
      desc: "Upload many titles from a CSV template.",
    },
    {
      label: "Manage Borrowers",
      icon: UserPlus,
      onClick: () => navigate("/lib/users"),
      desc: "Review and update borrower records.",
    },
  ];

  const guidance = [
    {
      title: "Monitor usage in real-time",
      text: "Use the dashboard cards and Reports to see which sections are most active and which titles are frequently borrowed.",
    },
    {
      title: "Keep due & overdue lists updated",
      text: "Run Due Books and Overdue tabs before submitting monthly reports to the National Library and Capitol.",
    },
    {
      title: "Digitize manual forms gradually",
      text: "Start with logbooks for daily visitors, then migrate to full digital logging with face recognition and QR scanning.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-sky-200/60 text-slate-900 flex flex-col">
      {/* Top gradient overlay strip */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-br from-sky-500/30 via-sky-400/20 to-emerald-300/20 blur-3xl opacity-80 -z-10" />

      {/* Header */}
      <header className="w-full px-6 md:px-12 py-6 flex items-center justify-between border-b border-sky-100 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white shadow-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-sky-900 tracking-tight">
              Librarian Control Panel
            </h1>
            <p className="text-xs md:text-sm text-sky-800/70">
              Rizal Provincial Library • Web-based Management with Facial Recognition
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sky-900/80 bg-white/70 px-3 py-2 rounded-xl border border-sky-100 shadow-sm">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <span className="text-xs md:text-sm">
            Prototype dashboard • Frontend connected to demo data
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full px-6 md:px-12 py-8 space-y-8">
        {/* Stats cards */}
        <section>
          <h2 className="text-lg font-semibold text-sky-900 mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600" />
            Today’s Overview
          </h2>
          {loading ? (
            <div className="text-sm text-sky-700">Loading summary…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {overviewCards.map((card) => (
                <motion.button
                  key={card.label}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={card.onClick}
                  className="relative overflow-hidden rounded-2xl bg-white/80 shadow-sm border border-sky-100 text-left focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-15`}
                  />
                  <div className="relative p-4 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-sky-800/80">
                        {card.label}
                      </span>
                      <card.icon className="w-5 h-5 text-sky-700" />
                    </div>
                    <div className="text-2xl font-bold text-sky-950 mt-1">
                      {card.value}
                    </div>
                    <span className="text-[11px] text-sky-700/80 mt-1">
                      Click to view details
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </section>

        {/* Two columns: Quick actions + recent activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick actions */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-sky-900 flex items-center gap-2">
              <ArrowRightCircle className="w-5 h-5 text-sky-600" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.onClick}
                  className="rounded-2xl p-4 flex flex-col items-start gap-2 text-left bg-white/80 border border-sky-100 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sky-950">
                      {action.label}
                    </span>
                  </div>
                  <p className="text-xs text-sky-800/80 leading-relaxed">
                    {action.desc}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Alerts / due / overdue */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-sky-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Alerts & Deadlines
            </h2>
            <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-50 via-amber-50 to-orange-50 border border-amber-100 shadow-sm">
              <p className="text-sm text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  <strong>{stats.overdueCount}</strong> books marked as overdue.
                  Review them in{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/lib/due-books")}
                    className="underline font-semibold"
                  >
                    Due Books
                  </button>
                  .
                </span>
              </p>
              <p className="text-xs text-amber-800/80 mt-2 leading-relaxed">
                Overdue items affect inventory accuracy and accountability stats for
                your monthly reports.
              </p>
            </div>

            <div className="rounded-2xl p-4 bg-white/90 border border-sky-100 shadow-sm">
              <h3 className="text-sm font-semibold text-sky-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                Recent Transactions
              </h3>
              {recentTx.length === 0 ? (
                <p className="text-xs text-sky-700/80">
                  No demo transactions yet.
                </p>
              ) : (
                <ul className="space-y-2 max-h-52 overflow-auto pr-1">
                  {recentTx.map((t) => (
                    <li
                      key={t.id}
                      className="text-xs border-b last:border-b-0 border-sky-100 pb-2 flex justify-between gap-3"
                    >
                      <div>
                        <div className="font-semibold text-sky-900">
                          {t.userName} •{" "}
                          <span className="capitalize text-sky-700">
                            {t.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-sky-700/80">
                          {t.bookTitle}
                        </div>
                      </div>
                      <span className="text-[10px] text-sky-500">
                        {new Date(t.timestamp).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Guidance / notes for librarians */}
        <section className="mt-4">
          <h2 className="text-lg font-semibold text-sky-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            Librarian Notes & Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guidance.map((g) => (
              <motion.div
                key={g.title}
                whileHover={{ y: -2 }}
                className="rounded-2xl bg-white/80 border border-sky-100 p-4 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-sky-900 flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  {g.title}
                </h3>
                <p className="text-xs text-sky-800/80 leading-relaxed">
                  {g.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full py-6 bg-sky-50/90 text-sky-900/70 text-xs text-center border-t border-sky-100">
        © {new Date().getFullYear()} Rizal Provincial Library • Prototype dashboard
      </footer>
    </div>
  );
}
