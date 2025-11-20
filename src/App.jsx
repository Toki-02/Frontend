// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { RequireRole } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* Layouts */
import UserLayout from "./layouts/UserLayout";
import StaffLayout from "./layouts/StaffLayout";
import LibrarianLayout from "./layouts/LibrarianLayout";

/* USER Pages */
import UserHome from "./users/UserHome";
import UserBrowseBooks from "./users/UserBrowseBooks";
import UserReservations from "./users/UserReservations";
import UserProfile from "./users/UserProfile";

/* STAFF Pages */
import StaffHome from "./staff/StaffHome";
import StaffLogScanner from "./staff/StaffLogScanner";
import StaffLogs from "./staff/StaffLogs";
import StaffTransactions from "./staff/StaffTransactions";
import StaffDamageReports from "./staff/StaffDamageReports";

/* LIBRARIAN Pages */
import LibrarianHome from "./librarian/LibrarianHome";
import LibrarianAddBook from "./librarian/LibrarianAddBook";
import LibrarianBulkUpload from "./librarian/LibrarianBulkUpload";
import LibrarianQRBulkGenerator from "./librarian/LibrarianQRBulkGenerator";
import LibrarianBorrowReturn from "./librarian/LibrarianBorrowReturn";
import LibrarianReports from "./librarian/LibrarianReports";
import LibrarianUsers from "./librarian/LibrarianUsers";
import LibrarianDueBooks from "./librarian/LibrarianDueBooks";

export default function App() {
  return (
    <>
      {/* Toast container for react-toastify */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="colored"
      />

      <Routes>
        {/* Redirect root → login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* USER ROUTES */}
        <Route
          path="/user"
          element={
            <RequireRole role="user">
              <UserLayout />
            </RequireRole>
          }
        >
          <Route path="home" element={<UserHome />} />
          <Route path="browse" element={<UserBrowseBooks />} />
          <Route path="reservations" element={<UserReservations />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* STAFF ROUTES */}
        <Route
          path="/staff"
          element={
            <RequireRole role="staff">
              <StaffLayout />
            </RequireRole>
          }
        >
          {/* Main staff dashboard */}
          <Route path="dashboard" element={<StaffHome />} />

          {/* Attendance / logs */}
          {/* alias: /staff/attendance → StaffLogs (old link support) */}
          <Route path="attendance" element={<StaffLogs />} />
          {/* clearer path: /staff/logs */}
          <Route path="logs" element={<StaffLogs />} />

          {/* Face recognition / scanner */}
          {/* alias: /staff/facerec → StaffLogScanner */}
          <Route path="facerec" element={<StaffLogScanner />} />
          <Route path="log-scanner" element={<StaffLogScanner />} />

          {/* Transactions list */}
          <Route path="transactions" element={<StaffTransactions />} />

          {/* Damaged books reporting */}
          {/* alias: /staff/manual → StaffDamageReports (if old menu points here) */}
          <Route path="manual" element={<StaffDamageReports />} />
          <Route path="damage-reports" element={<StaffDamageReports />} />
        </Route>

        {/* LIBRARIAN ROUTES */}
        <Route
          path="/lib"
          element={
            <RequireRole role="librarian">
              <LibrarianLayout />
            </RequireRole>
          }
        >
          <Route path="home" element={<LibrarianHome />} />
          <Route path="add-book" element={<LibrarianAddBook />} />
          <Route path="bulk-upload" element={<LibrarianBulkUpload />} />
          <Route path="qr-bulk" element={<LibrarianQRBulkGenerator />} />
          <Route path="borrow-return" element={<LibrarianBorrowReturn />} />
          <Route path="reports" element={<LibrarianReports />} />
          <Route path="users" element={<LibrarianUsers />} />
          <Route path="due-books" element={<LibrarianDueBooks />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="p-6">Not Found</div>} />
      </Routes>
    </>
  );
}
