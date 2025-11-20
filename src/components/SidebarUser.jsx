import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, BookOpen, Bell, User, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function UserLayout() {
  const nav = useNavigate();
  const { logout } = useAuth();

  const links = [
    { to: "/user/home", label: "Home", icon: <Home size={18} /> },
    { to: "/user/browse", label: "Browse Books", icon: <BookOpen size={18} /> },
    { to: "/user/reservations", label: "Reservations", icon: <Bookmark size={18} /> },
    { to: "/user/notifications", label: "Notifications", icon: <Bell size={18} /> },
    { to: "/user/profile", label: "Profile", icon: <User size={18} /> },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#E0F4FF] to-[#C7E4FF]">
      
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="w-64 h-screen bg-white/40 backdrop-blur-xl border-r border-white/30 shadow-lg p-6 flex flex-col"
      >
        <h2 className="text-2xl font-bold text-sky-700 mb-6">User Panel</h2>

        <nav className="flex flex-col gap-3">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl transition ${
                  isActive
                    ? "bg-sky-500 text-white shadow"
                    : "bg-white/50 text-sky-700 hover:bg-sky-100"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => {
            logout();
            nav("/login");
          }}
          className="mt-auto p-3 bg-red-400 hover:bg-red-500 text-white rounded-xl"
        >
          Logout
        </button>
      </motion.aside>

      {/* Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
