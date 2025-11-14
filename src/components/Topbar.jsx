import React from "react";

export default function Topbar(){
  return (
    <header className="h-16 flex items-center justify-between px-6 glass">
      <div className="flex items-center gap-4">
        <input
          placeholder="Search library, book id, user..."
          className="bg-transparent border border-white/6 text-slate-200 rounded-full px-4 py-2 w-96 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-slate-300">Admin User</div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-semibold">A</div>
      </div>
    </header>
  );
}
