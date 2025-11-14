import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react"; // Burger icon

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition-colors ${
      isActive ? "bg-white/6 text-white" : "text-slate-300 hover:bg-white/3"
    }`;

  const sidebarVariants = {
    open: { width: "16rem", transition: { type: "spring", stiffness: 200, damping: 25 } },
    closed: { width: "4rem", transition: { type: "spring", stiffness: 200, damping: 25 } },
  };

  const contentVariants = {
    open: { opacity: 1, x: 0, transition: { delay: 0.1 } },
    closed: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white/10 hover:bg-white/20 text-white"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <motion.aside
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="h-screen p-6 bg-transparent glass flex flex-col gap-6 overflow-hidden relative"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={contentVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-bold">
                RL
              </div>
              <div>
                <div className="text-white font-semibold">Rizal Library</div>
                <div className="text-sm text-slate-400">Admin Panel</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="flex-1 flex flex-col gap-2">
          {["Dashboard", "Register Face", "Borrow / Return", "Add Book", "Face Records", "Reports", "Logs"].map(
            (item, i) => (
              <NavLink
                key={i}
                to={`/${item.toLowerCase().replace(/ /g, "-")}`}
                className={linkClass}
              >
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      variants={contentVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      {item}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            )
          )}
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={contentVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="text-sm text-slate-400"
            >
              <div>© Rizal Library</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  );
}
