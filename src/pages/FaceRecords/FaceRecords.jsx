import React, { useEffect, useState } from "react";
import { getUsers } from "../../services/fakeBackend";
import { Search, User, IdCard, Calendar, Users } from "lucide-react";

export default function FaceRecords() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const data = getUsers();
    setUsers(data);
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName || ""} ${u.lastName || ""} ${u.name || ""}`;
    return fullName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#EAF2FB] via-[#D8ECF8] to-[#CFE4F7] text-[#1E3A5F] overflow-x-hidden px-6 sm:px-12 lg:px-24 py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-sky-700 drop-shadow-md">
            Face Records
          </h1>
          <p className="text-sky-900/70 text-sm mt-1">
            Manage all registered patrons with facial data.
          </p>
        </div>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-sky-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search patron..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/50 border border-white/20 rounded-lg text-[#1E3A5F] placeholder-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 w-64 transition"
          />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-tr from-[#D0E8FF] to-[#A8D4FF] backdrop-blur-sm rounded-2xl border border-white/20 p-6 flex items-center gap-4 shadow-md">
          <Users className="text-sky-700" size={26} />
          <div>
            <p className="text-sm text-sky-900/70">Total Patrons</p>
            <h3 className="text-2xl font-bold text-[#1E3A5F]">{users.length}</h3>
          </div>
        </div>
        <div className="bg-gradient-to-tr from-[#E0F2FF] to-[#B0DAFF] backdrop-blur-sm rounded-2xl border border-white/20 p-6 flex items-center gap-4 shadow-md">
          <User className="text-sky-700" size={26} />
          <div>
            <p className="text-sm text-sky-900/70">With Membership</p>
            <h3 className="text-2xl font-bold text-[#1E3A5F]">
              {users.filter((u) => u.membership && u.membership !== "Guest").length}
            </h3>
          </div>
        </div>
        <div className="bg-gradient-to-tr from-[#D6E8FF] to-[#A8D4FF] backdrop-blur-sm rounded-2xl border border-white/20 p-6 flex items-center gap-4 shadow-md">
          <IdCard className="text-sky-700" size={26} />
          <div>
            <p className="text-sm text-sky-900/70">Guests</p>
            <h3 className="text-2xl font-bold text-[#1E3A5F]">
              {users.filter((u) => !u.membership || u.membership === "Guest").length}
            </h3>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-gradient-to-tr from-[#F0FAFF]/90 to-[#D8ECF8]/90 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl">
  <div className="overflow-x-auto">
    <table className="w-full text-left border-separate border-spacing-y-2">
      <thead>
        <tr className="text-xs uppercase text-sky-700 tracking-wider">
          <th className="px-4 py-2">#</th>
          <th className="px-4 py-2">Full Name</th>
          <th className="px-4 py-2">Membership</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Phone</th>
          <th className="px-4 py-2">Date Registered</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u, i) => (
            <tr
              key={u.id}
              className="bg-white/20 hover:bg-white/30 transition-all rounded-md"
            >
              <td className="px-4 py-3 text-sm text-sky-900 font-mono">
                {String(u.id).padStart(5, "0")}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-sky-700">
                {u.firstName ? `${u.firstName} ${u.lastName}` : u.name || "—"}
              </td>
              <td className="px-4 py-3 text-sm text-sky-900/70">
                {u.membership || "Guest"}
              </td>
              <td className="px-4 py-3 text-sm text-sky-900/70">{u.email || "—"}</td>
              <td className="px-4 py-3 text-sm text-sky-900/70">{u.phone || "—"}</td>
              <td className="px-4 py-3 text-sm text-sky-900/70 flex items-center gap-2">
                <Calendar size={14} /> {u.dateRegistered || "Unknown"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center py-6 text-sky-900/70 text-sm">
              No registered patrons found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


      {/* Footer */}
      <footer className="w-full py-8 text-sky-700 text-sm text-center mt-10 border-t border-white/20">
        © {new Date().getFullYear()} Rizal Provincial Library and Information System
      </footer>
    </div>
  );
}
