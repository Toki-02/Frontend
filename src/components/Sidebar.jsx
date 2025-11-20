import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Grid, BookOpen, Clock, Users, LogOut, UserPlus } from "lucide-react";

export default function Sidebar() {
  const nav = useNavigate();
  const sections = [
    { to: "/user/home", label: "Home", icon: <Home size={18} /> },
    { to: "/staff/dashboard", label: "Dashboard", icon: <Grid size={18} /> },
    { to: "/lib/add-book", label: "Add Book", icon: <BookOpen size={18} /> },
    { to: "/lib/borrow-return", label: "Borrow/Return", icon: <Clock size={18} /> },
    { to: "/lib/reports", label: "Logs", icon: <Users size={18} /> },
    { to: "/staff/facerec", label: "Face Records", icon: <UserPlus size={18} /> },
    { to: "/staff/manual", label: "Register Face", icon: <UserPlus size={18} /> },
    { to: "/lib/users", label: "Reports", icon: <Users size={18} /> },
  ];

  return (
    <aside className="w-64 glass-card p-4 space-y-4 h-screen sticky top-0">
      <div className="px-2 py-3 text-lg font-bold text-[#0f172a]">Library System</div>
      <nav className="flex flex-col gap-2">
        {sections.map((s) => (
          <NavLink
            key={s.to}
            to={s.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive ? "bg-[#3B82F6]/20 text-[#1e3a5f]" : "text-[#0f172a]/80 hover:bg-white/10"}`
            }
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={() => nav("/login")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white"
        >
          <LogOut size={16} /> Logout
        </button>
        <p className="text-xs text-gray-500 mt-3">Role: demo (use Login to switch)</p>
      </div>
    </aside>
  );
}
