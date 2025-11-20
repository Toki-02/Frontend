// src/staff/StaffHome.jsx
import React from "react";
import { motion } from "framer-motion";
import { UserCheck, BookX, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StaffHome() {
  const navigate = useNavigate();

  const cards = [
    {
      label: "Record Time In / Time Out",
      desc: "Use the face scanner to log visitors entering or leaving.",
      icon: <UserCheck className="w-8 h-8 text-sky-600" />,
      to: "/staff/log-scanner",
    },
    {
      label: "View Visitor Logs",
      desc: "See all daily logs with timestamps, status, and filters.",
      icon: <Clock className="w-8 h-8 text-sky-600" />,
      to: "/staff/logs",
    },
    {
      label: "Report Damaged Book",
      desc: "Submit damaged book reports for librarian review.",
      icon: <BookX className="w-8 h-8 text-red-500" />,
      to: "/staff/damage-reports",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-sky-100 px-6 py-10">
      <h1 className="text-3xl font-bold text-sky-900 mb-8">
        Staff Control Panel
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <motion.div
            key={c.label}
            whileHover={{ scale: 1.02 }}
            className="bg-white/90 border border-sky-100 rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg"
            onClick={() => navigate(c.to)}
          >
            <div>{c.icon}</div>
            <h2 className="text-xl font-semibold text-sky-900 mt-4">
              {c.label}
            </h2>
            <p className="text-sm text-sky-700/80 mt-2">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
