import { Calendar, UserCheck, ClipboardList } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function SidebarStaff() {
  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/40 transition";

  return (
    <div className="w-64 bg-white/50 backdrop-blur-xl border-r border-white/20 p-6">
      <h2 className="text-xl font-bold text-emerald-700 mb-6">Staff Panel</h2>

      <div className="flex flex-col gap-2">
        <NavLink className={linkClass} to="/staff/dashboard"><Calendar size={20}/> Dashboard</NavLink>
        <NavLink className={linkClass} to="/staff/facerec"><UserCheck size={20}/> Face Recognition</NavLink>
        <NavLink className={linkClass} to="/staff/manual"><ClipboardList size={20}/> Manual Log</NavLink>
      </div>
    </div>
  );
}
