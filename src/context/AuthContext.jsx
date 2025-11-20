import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom"; // ⚡ Add this import

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load session on refresh
  useEffect(() => {
    const saved = localStorage.getItem("auth-user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Save user session
  function saveUser(u) {
    localStorage.setItem("auth-user", JSON.stringify(u));
    setUser(u);
  }

  // SIGNUP FUNCTION
  function createAccount(email, password, role) {
    const db = JSON.parse(localStorage.getItem("accounts-db") || "[]");

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim();

    if (db.find((u) => u.email === cleanEmail)) {
      return { success: false, message: "Email already registered." };
    }

    const newUser = {
      email: cleanEmail,
      password,
      role: cleanRole,
    };

    db.push(newUser);
    localStorage.setItem("accounts-db", JSON.stringify(db));

    return { success: true };
  }

  // LOGIN FUNCTION
  function login(email, password) {
    const db = JSON.parse(localStorage.getItem("accounts-db") || "[]");

    const found = db.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) return { success: false };

    saveUser(found);
    return { success: true, role: found.role };
  }

  // LOGOUT FUNCTION
  function logout() {
    localStorage.removeItem("auth-user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, createAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

// Protect route based on role
export function RequireRole({ role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />; // ⚡ fix: add replace
  if (user.role !== role) return <Navigate to="/login" replace />;

  return children;
}
