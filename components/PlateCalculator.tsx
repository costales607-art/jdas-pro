"use client";

import React, { useState } from "react";

export default function PlateCalculator() {
  const [targetWeight, setTargetWeight] = useState<string>("100");

  // Standard Olympic Barbell weight = 20kg
  const barbellWeight = 20;
  const target = parseFloat(targetWeight) || 0;

  // Calculate weight needed per side
  const weightPerSide = Math.max(0, (target - barbellWeight) / 2);

  // Available plates (kg)
  const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];

  // Calculate breakdown per side
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
    <div className="max-w-md mx-auto p-4 bg-zinc-950 text-zinc-100 font-sans">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Plate Calculator</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Enter your total target weight. Standard barbell (20kg) is
          automatically deducted.
        </p>
      </div>

      {/* Target Input Box */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl mb-6">
        <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
          Total Target Weight (kg)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-2xl font-bold text-white focus:outline-none focus:border-emerald-500"
          />
          <span className="text-lg font-semibold text-zinc-400">kg</span>
        </div>
      </div>

      {/* Visual Breakdown Result Card */}
      <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl">
        <div className="text-center pb-4 border-b border-zinc-800">
          <span className="text-xs text-zinc-400 uppercase tracking-widest">
            Load on EACH side
          </span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">
            {weightPerSide > 0 ? `${weightPerSide} kg` : "0 kg"}
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Plates needed per side:
          </p>
          {target < barbellWeight ? (
            <p className="text-sm text-amber-400 py-2">
              Target weight must be greater than the 20kg barbell.
            </p>
          ) : breakdown.length === 0 ? (
            <p className="text-sm text-zinc-400 py-2">
              Just the empty barbell!
            </p>
          ) : (
            breakdown.map((item) => (
              <div
                key={item.plate}
                className="flex items-center justify-between bg-zinc-950 px-4 py-2.5 rounded-xl border border-zinc-800"
              >
                <span className="text-sm font-bold text-white">
                  {item.plate} kg plate
                </span>
                <span className="text-sm font-semibold text-emerald-400">
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
