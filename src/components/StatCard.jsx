import React from "react";

export default function StatCard({label, value, color="bg-blue-500", icon}){
  return (
    <div className="glass p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-400">{label}</div>
          <div className="text-2xl font-bold mt-2">{value}</div>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>{icon}</div>
      </div>
    </div>
  );
}
