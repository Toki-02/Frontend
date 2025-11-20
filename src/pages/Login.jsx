import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();

    const res = login(email, password, role);

    if (!res.success) {
      setError("Invalid credentials.");
      return;
    }

    if (role === "user") nav("/user/home");
    else if (role === "staff") nav("/staff/dashboard");
    else nav("/lib/home"); // Librarian redirect
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#DFF3FF] via-[#D5EBFF] to-[#C9E3FF] px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md bg-white/40 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-xl border border-white/20"
      >
        <div className="flex flex-col items-center">
          <img src="/logo.library.png" className="w-24 h-24 mb-2 drop-shadow-xl" />
          <h1 className="text-3xl font-extrabold text-sky-700 text-center">
            Rizal Provincial Library
          </h1>
        </div>

        <div className="mt-6 flex bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
          {["user", "staff", "librarian"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`w-1/3 py-2 text-sm font-semibold transition
                ${role === r ? "bg-sky-500 text-white shadow-md" : "text-sky-700 hover:bg-sky-200/50"}
              `}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-gray-700 text-sm font-medium">Email</label>
            <input
              type="email"
              autoComplete="email"
              className="w-full mt-1 p-3 rounded-xl bg-white/80 border border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-300 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
            <label className="text-gray-700 text-sm font-medium">Password</label>
            <input
              type={show ? "text" : "password"}
              autoComplete="current-password"
              className="w-full mt-1 p-3 rounded-xl bg-white/80 border border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-300 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <div
              className="absolute right-4 top-10 text-gray-400 cursor-pointer hover:text-sky-600"
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <motion.button
            whileTap={{ scale: 0.96 }}
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold shadow-md transition"
          >
            Login
          </motion.button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-700">
          No account?{" "}
          <span
            onClick={() => nav("/signup")}
            className="text-sky-600 font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </motion.div>
    </div>
  );
}
