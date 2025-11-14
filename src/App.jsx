import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddBook from "./pages/AddBook/AddBook";
import BorrowReturn from "./pages/BorrowReturn/BorrowReturn";
import FaceRecognition from "./pages/FaceRecognition/FaceRecognition";
import FaceRecords from "./pages/FaceRecords/FaceRecords";
import Home from "./pages/Home/Home";
import RegisterFace from "./pages/RegisterFace/RegisterFace";
import Reports from "./pages/Reports/Reports";



function ProtectedRoute({ element, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/home" replace />;
  return element;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} roles={["librarian"]} />} />
            <Route path="/add-book" element={<ProtectedRoute element={<AddBook />} roles={["librarian"]} />} />
            <Route path="/borrow-return" element={<ProtectedRoute element={<BorrowReturn />} roles={["librarian", "staff"]} />} />
            <Route path="/face-recognition" element={<ProtectedRoute element={<FaceRecognition />} roles={["librarian", "staff"]} />} />
            <Route path="/face-records" element={<ProtectedRoute element={<FaceRecords />} roles={["librarian"]} />} />
            <Route path="/register-face" element={<ProtectedRoute element={<RegisterFace />} roles={["librarian"]} />} />
            <Route path="/reports" element={<ProtectedRoute element={<Reports />} roles={["librarian"]} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
