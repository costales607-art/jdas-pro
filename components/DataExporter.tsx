"use client";

import React from "react";

export default function DataExporter() {
  const exportToCSV = () => {
    const profile = localStorage.getItem("jdas_user_profile");
    const history = localStorage.getItem("jdas_progress_history");

    const csvRows = [
      ["JDAS PRO - EXPORTED DATA"],
      ["Export Date", new Date().toLocaleDateString()],
      [""],
      ["USER PROFILE"],
      [profile || "No profile recorded"],
      [""],
      ["PROGRESS HISTORY"],
      [history || "No progress entries recorded"],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jdas_pro_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-xs font-black uppercase text-emerald-400">
            📊 Export Training Data
          </h4>
          <p className="text-[10px] text-zinc-400">
            Download workout logs & weight history as .CSV
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-3 py-2 rounded-xl transition uppercase"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
