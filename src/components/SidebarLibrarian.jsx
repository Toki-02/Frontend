import {
  Home,
  BookPlus,
  Upload,
  QrCode,
  ScanBarcode,
  Users,
  FileBarChart,
  Clock
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function SidebarLibrarian() {
  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/40 transition";

  return (
    <div className="w-64 bg-white/50 backdrop-blur-xl border-r border-white/20 p-6">
      <h2 className="text-xl font-bold text-purple-700 mb-6">Librarian Panel</h2>

      <div className="flex flex-col gap-2">
        <NavLink className={linkClass} to="/lib/dashboard"><Home size={20}/> Dashboard</NavLink>
        <NavLink className={linkClass} to="/lib/add-book"><BookPlus size={20}/> Add Book</NavLink>
        <NavLink className={linkClass} to="/lib/bulk-upload"><Upload size={20}/> Bulk Upload</NavLink>
        <NavLink className={linkClass} to="/lib/qr-bulk"><QrCode size={20}/> QR Bulk Generator</NavLink>
        <NavLink className={linkClass} to="/lib/borrow-return"><ScanBarcode size={20}/> Borrow / Return</NavLink>
        <NavLink className={linkClass} to="/lib/users"><Users size={20}/> Users</NavLink>
        <NavLink className={linkClass} to="/lib/reports"><FileBarChart size={20}/> Reports</NavLink>
        <NavLink className={linkClass} to="/lib/due-books"><Clock size={20}/> Due Books</NavLink>
      </div>
    </div>
  );
}
