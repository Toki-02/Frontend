// src/pages/Login.jsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const success = login(email, password);
    if (success) {
      navigate("/home"); // keep your routing as before
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-[#E0F7FF] via-[#D0ECFF] to-[#C0E2FF] px-6 sm:px-12">
      <div className="w-full max-w-md bg-white/50 backdrop-blur-md border border-white/30 rounded-3xl shadow-xl p-10 flex flex-col items-center">
        
        {/* Logo */}
        <img
          src="/logo.library.png"
          alt="Logo"
          className="w-36 h-36 object-contain mb-6 drop-shadow-lg"
        />

        <h2 className="text-3xl font-extrabold text-sky-700 mb-6 drop-shadow-sm text-center">
        Rizal Provincial Library
        </h2>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          {/* Email Input */}
          <div>
            <label className="block mb-2 text-gray-700 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/80 border border-gray-300 text-gray-900 placeholder-gray-500 shadow-md focus:ring-2 focus:ring-sky-300 focus:border-sky-500 outline-none transition"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block mb-2 text-gray-700 text-sm font-medium">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/80 border border-gray-300 text-gray-900 placeholder-gray-500 shadow-md focus:ring-2 focus:ring-sky-300 focus:border-sky-500 outline-none transition"
              required
            />
            <div
              className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-sky-600 transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm font-medium text-center">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
          >
            Login
          </button>
        </form>

        {/* Forgot Password */}
        <p className="text-sm text-gray-700 mt-4 text-center">
          Forgot your password?{" "}
          <span className="text-sky-600 font-semibold cursor-pointer hover:underline">
            Reset
          </span>
        </p>
      </div>
    </div>
  );
}
