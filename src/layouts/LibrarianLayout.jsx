import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Users, ClipboardList, PlusSquare, FileText, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function LibrarianLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Home", path: "/lib/home", icon: <BookOpen size={18} /> },
    { name: "Add Book", path: "/lib/add-book", icon: <PlusSquare size={18} /> },
    { name: "Bulk Upload", path: "/lib/bulk-upload", icon: <FileText size={18} /> },
    { name: "QR Bulk", path: "/lib/qr-bulk", icon: <FileText size={18} /> },
    { name: "Borrow / Return", path: "/lib/borrow-return", icon: <ClipboardList size={18} /> },
    { name: "Users", path: "/lib/users", icon: <Users size={18} /> },
    { name: "Reports", path: "/lib/reports", icon: <FileText size={18} /> },
    { name: "Due Books", path: "/lib/due-books", icon: <BookOpen size={18} /> },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 250, damping: 25 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 250, damping: 25 } },
  };

  const itemVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    closed: { opacity: 0, x: -20, transition: { duration: 0.1 } },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 via-blue-100 to-white text-blue-900 flex flex-col relative">

      {/* Hamburger Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white/60 backdrop-blur-md text-blue-900 hover:bg-white/80 transition"
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Top Navbar */}
      <nav className="relative flex items-center p-4 backdrop-blur-lg bg-white/60 border-b border-blue-200">
        <h1
          onClick={() => navigate("/lib/home")}
          className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-blue-700 cursor-pointer hover:text-blue-600 transition"
        >
          Library Face Recognition System
        </h1>

        <div className="ml-auto">
          <button
            onClick={handleLogout}
            className="text-blue-900/80 hover:text-blue-700 transition"
            title="Logout"
          >
            <LogOut size={22} />
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 left-0 h-full w-64 bg-white/70 backdrop-blur-2xl border-r border-blue-200 z-40"
          >
            <div className="p-4 mt-16 space-y-3">
              {menuItems.map((item) => (
                <motion.div
                  key={item.path}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                      location.pathname === item.path
                        ? "bg-blue-100/50 text-blue-700 font-semibold"
                        : "hover:bg-blue-50/50 hover:text-blue-700 text-blue-900/80"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <main className="flex-1 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
