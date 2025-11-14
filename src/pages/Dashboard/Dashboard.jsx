// Dashboard.jsx
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
} from "lucide-react";
import BorrowTrendChart from "../../components/charts/BorrowTrendChart";
import CategoryPie from "../../components/charts/CategoryPie";
import { getReportSummary, getLogs, initSeed } from "../../services/fakeBackend";

function StatCard({ title, value, subtitle, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
      className="bg-white/80 border border-sky-200 rounded-2xl p-6 flex items-start gap-4 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="flex-none w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-xs text-sky-700 font-semibold">{title}</div>
        <div className="text-2xl md:text-3xl font-bold mt-1">{value}</div>
        <div className="text-xs text-sky-600 mt-1">{subtitle}</div>
      </div>
    </motion.div>
  );
}

function RecentRow({ tx }) {
  return (
    <tr className="hover:bg-white/5 transition">
      <td className="py-3 px-4 text-sm text-sky-200">{tx.name}</td>
      <td className="py-3 px-4 text-sm text-sky-300">{tx.action}</td>
      <td className="py-3 px-4 text-sm text-sky-400 font-medium">{tx.item}</td>
      <td className="py-3 px-4 text-sm text-sky-200">{tx.time}</td>
    </tr>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({});
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    initSeed();
    setSummary(getReportSummary());
    setRecent(getLogs().slice(0, 5));
  }, []);

  const kpis = [
    { title: "Total Books", value: summary.totalBooks || 0, subtitle: "Books in catalog", icon: <BookOpen size={18} /> },
    { title: "Borrowed Books", value: summary.borrowedBooks || 0, subtitle: "Currently loaned out", icon: <Clock size={18} /> },
    { title: "Registered Faces", value: summary.totalUsers || 0, subtitle: "Patrons enrolled", icon: <Users size={18} /> },
    { title: "DB Records", value: summary.totalLogs || 0, subtitle: "Activity logs stored", icon: <Activity size={18} /> },
  ];

  const borrowChartData = {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    datasets: [
      {
        label: "Books Borrowed",
        data: [120, 190, 150, 220, 260, 198],
        backgroundColor: "rgba(14,165,233,0.85)",
        borderColor: "rgba(14,165,233,1)",
        borderWidth: 2,
        borderRadius: 10,
      },
    ],
  };

  return (
<div className="min-h-screen w-full bg-gradient-to-br from-sky-100 via-sky-100 to-sky-100 text-sky-900 overflow-x-hidden">

  <div className="w-full px-6 md:px-12 lg:px-20 pt-10 pb-20">
    {/* Header */}
    <div className="mb-10">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-sky-700 drop-shadow-md"
      >
        Welcome back, Gerald 👋
      </motion.h1>
      <p className="text-sky-800 mt-2 max-w-xl">
        Here’s a snapshot of your library system’s performance and recent activity.
      </p>
      <p className="text-sky-600 text-sm mt-1">
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      </p>
    </div>

    {/* KPIs */}
    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {kpis.map((k, i) => (
        <StatCard key={i} {...k} />
      ))}
    </motion.div>

    {/* Main Layout */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left: Charts */}
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white/80 backdrop-blur-xl border border-sky-200 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-sky-700">📊 Borrowing Trend</h3>
            <p className="text-sm text-sky-600">Last 6 months</p>
          </div>
          <div className="h-[350px]">
            <BorrowTrendChart
              chartData={{
                ...borrowChartData,
                datasets: borrowChartData.datasets.map(d => ({
                  ...d,
                  backgroundColor: "rgba(14,165,233,0.85)",
                  borderColor: "rgba(14,165,233,1)"
                })),
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/80 border border-sky-200 rounded-3xl p-6">
            <h4 className="text-lg font-semibold text-sky-700 mb-4">📚 Book Categories</h4>
            <div className="h-[250px] flex justify-center items-center">
              <CategoryPie />
            </div>
          </div>

          <div className="bg-white/80 border border-sky-200 rounded-3xl p-6">
            <h4 className="text-lg font-semibold text-sky-700 mb-4">Quick Metrics</h4>
            <ul className="text-sm text-sky-800 space-y-3">
              <li>📆 Avg Loan Duration: <span className="font-semibold">6.3 days</span></li>
              <li>🕒 Late Returns (30d): <span className="font-semibold">24</span></li>
              <li>🧑‍🎓 New Registrations: <span className="font-semibold">86</span></li>
            </ul>
          </div>
        </div>
      </div>


<div className="space-y-6">
  {/* Recent Activity */}
  <div className="bg-white/80 border border-sky-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
    <h4 className="text-lg font-semibold text-sky-700 mb-4 border-b border-sky-200 pb-2">
      Recent Activity
    </h4>

    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-sky-50/70 border-b border-sky-200 text-xs text-sky-700 uppercase">
            <th className="py-2 px-4">User Name</th>
            <th className="py-2 px-4">Time In</th>
            <th className="py-2 px-4">Time Out</th>
            <th className="py-2 px-4">Item</th>
            <th className="py-2 px-4">Address</th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              user: "Gerald Venico",
              timeIn: "9:12 AM",
              timeOut: "10:02 AM",
              bookTitle: "Atomic Habits",
              address: "Angono",
            },
            {
              user: "Francis Pollosco",
              timeIn: "10:30 AM",
              timeOut: "11:10 AM",
              bookTitle: "The Pragmatic Programmer",
              address: "Binangonan",
            },
            {
              user: "Gerald Venico",
              timeIn: "12:45 PM",
              timeOut: "1:25 PM",
              bookTitle: "",
              address: "Angono",
            },
            {
              user: "Francis Pollosco",
              timeIn: "2:15 PM",
              timeOut: "2:45 PM",
              bookTitle: "Rich Dad Poor Dad",
              address: "Taytay",
            },
          ].map((r, idx) => (
            <tr
              key={idx}
              className="hover:bg-sky-50/70 transition-all border-b border-sky-100"
            >
              <td className="py-3 px-4 text-sm text-sky-900 font-medium">{r.user}</td>
              <td className="py-3 px-4 text-sm text-sky-700">{r.timeIn}</td>
              <td className="py-3 px-4 text-sm text-sky-700">{r.timeOut}</td>
              <td className="py-3 px-4 text-sm text-sky-600 italic">
                {r.bookTitle && r.bookTitle !== "" ? r.bookTitle : "—"}
              </td>
              <td className="py-3 px-4 text-sm text-sky-700">{r.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>





        {/* Quick Actions */}
        <div className="bg-sky/800 border border-sky-200 rounded-3xl p-6">
          <h4 className="text-lg font-semibold text-sky-700 mb-4">Quick Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/borrow-return")}
              className="py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 flex items-center gap-3 text-white font-medium transition"
            >
              <ArrowRightCircle size={18} /> Borrow Book
            </button>
            <button
              onClick={() => navigate("/borrow-return")}
              className="py-3 px-4 rounded-xl border border-sky-200 text-sky-700 hover:bg-sky-50 flex items-center gap-3 transition"
            >
              <Clock size={18} /> Return Book
            </button>
            <button
              onClick={() => navigate("/add-book")}
              className="py-3 px-4 rounded-xl border border-sky-200 text-sky-700 hover:bg-sky-50 flex items-center gap-3 transition"
            >
              <PlusSquare size={18} /> Add Book (QR)
            </button>
            <button
              onClick={() => navigate("/register-face")}
              className="py-3 px-4 rounded-xl border border-sky-200 text-sky-700 hover:bg-sky-50 flex items-center gap-3 transition"
            >
              <UserPlus size={18} /> Register Face
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white/80 border border-sky-200 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="text-yellow-500" />
            <h4 className="text-lg font-semibold text-yellow-500">System Alerts</h4>
          </div>
          <ul className="text-sm text-sky-700 space-y-2">
            <li>⚠️ <span className="text-sky-600 font-medium">5 books</span> are low in stock.</li>
            <li>💾 Next system backup at <span className="text-sky-600 font-medium">2:00 AM</span>.</li>
            <li>🧠 AI recognition update available — apply when idle.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
