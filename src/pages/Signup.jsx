import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const nav = useNavigate();
  const { createAccount } = useAuth();

  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [libCode, setLibCode] = useState("");
  const [staffApproval, setStaffApproval] = useState("");

  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    const cleanConfirm = confirm.trim();
    const cleanRole = role.trim();

    if (!cleanEmail || !cleanPass || !cleanConfirm) {
      setError("All fields are required.");
      return;
    }

    if (cleanPass !== cleanConfirm) {
      setError("Passwords do not match.");
      return;
    }

    // Librarian Protection
    if (cleanRole === "librarian") {
      if (libCode.trim() !== "LIB-2025") {
        setError("Invalid librarian authorization code.");
        return;
      }
    }

    // Staff Protection
    if (cleanRole === "staff") {
      if (staffApproval.trim().toUpperCase() !== "ALLOW") {
        setError("Staff requires approval from librarian.");
        return;
      }
    }

    // CREATE ACCOUNT
    const res = createAccount(cleanEmail, cleanPass, cleanRole);
    if (!res.success) {
      setError(res.message);
      return;
    }

    alert("Account successfully created!");
    nav("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#DFF3FF] via-[#D5EBFF] to-[#C9E3FF]">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-lg bg-white/50 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/20 shadow-xl"
      >

        <h1 className="text-3xl font-extrabold text-sky-700 text-center mb-6 drop-shadow-sm">
          Create Account
        </h1>

        <form onSubmit={submit} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-white/80 rounded-xl border border-gray-300 shadow-sm 
                       focus:ring-2 focus:ring-sky-300 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 bg-white/80 rounded-xl border border-gray-300 shadow-sm 
                         focus:ring-2 focus:ring-sky-300 outline-none"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />

            <div
              className="absolute right-4 top-3.5 cursor-pointer text-gray-400 hover:text-sky-600"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
            </div>
          </div>

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 bg-white/80 rounded-xl border border-gray-300 shadow-sm 
                       focus:ring-2 focus:ring-sky-300 outline-none"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          {/* Role Selector */}
          <select
            className="w-full p-3 bg-white/80 rounded-xl border border-gray-300 shadow-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="staff">Staff (needs approval)</option>
            <option value="librarian">Librarian (needs code)</option>
          </select>

          {/* Librarian Code Input */}
          {role === "librarian" && (
            <input
              type="text"
              placeholder="Authorization Code"
              className="w-full p-3 bg-white/80 rounded-xl border border-gray-300 shadow-sm"
              value={libCode}
              onChange={(e) => setLibCode(e.target.value)}
            />
          )}

          {/* Staff Approval Input */}
          {role === "staff" && (
            <input
              type="text"
              placeholder="Type ALLOW (requires librarian permission)"
              className="w-full p-3 bg-white/80 rounded-xl border border-gray-300 shadow-sm"
              value={staffApproval}
              onChange={(e) => setStaffApproval(e.target.value)}
            />
          )}

          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center text-sm"
            >
              {error}
            </motion.p>
          )}

          {/* Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold shadow-md transition"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-700">
          Already have an account?  
          <span
            onClick={() => nav("/login")}
            className="text-sky-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </motion.div>
    </div>
  );
}
