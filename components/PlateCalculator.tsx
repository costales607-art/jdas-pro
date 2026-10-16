"use client";

import React, { useState } from "react";

export default function PlateCalculator() {
  const [targetWeight, setTargetWeight] = useState<string>("100");

  const barbellWeight = 20;
  const target = parseFloat(targetWeight) || 0;
  const weightPerSide = Math.max(0, (target - barbellWeight) / 2);

  const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
  let remaining = weightPerSide;
  const breakdown: { plate: number; count: number }[] = [];

  for (const plate of availablePlates) {
    if (remaining <= 0) break;
    const count = Math.floor(remaining / plate);
    if (count > 0) {
      breakdown.push({ plate, count });
      remaining = parseFloat((remaining - count * plate).toFixed(2));
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md">
          Utility Tool
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-3">
          Plate Calculator
        </h2>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Enter your total target weight. The 20kg standard barbell is
          automatically deducted.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Total Target Weight (kg)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-3xl font-black text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-center"
          />
          <span className="text-xl font-black text-slate-400">kg</span>
        </div>
      </div>

      {/* Breakdown Result Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div className="text-center pb-5 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Load on EACH side
          </span>
          <div className="text-4xl font-black text-emerald-600 mt-2">
            {weightPerSide > 0 ? `${weightPerSide} kg` : "0 kg"}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Plates needed per side:
          </p>
          {target < barbellWeight ? (
            <p className="text-sm font-semibold text-rose-600 py-3 text-center bg-rose-50 rounded-2xl">
              Target weight must be at least 20kg (barbell weight).
            </p>
          ) : breakdown.length === 0 ? (
            <p className="text-sm font-semibold text-slate-600 py-3 text-center bg-slate-50 rounded-2xl">
              Just the empty 20kg barbell!
            </p>
          ) : (
            breakdown.map((item) => (
              <div
                key={item.plate}
                className="flex items-center justify-between bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-200/80"
              >
                <span className="text-sm font-black text-slate-800">
                  {item.plate} kg plate
                </span>
                <span className="text-base font-black text-emerald-600">
                  × {item.count}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
