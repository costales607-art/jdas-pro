"use client";

import React, { useState } from "react";

export default function PlateCalculator() {
  const [targetWeight, setTargetWeight] = useState<number>(60);
  const [barWeight, setBarWeight] = useState<number>(20); // Standard Olympic Barbell = 20kg

  const calculatePlates = (target: number, bar: number) => {
    let weightPerSide = (target - bar) / 2;
    if (weightPerSide <= 0) return [];

    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const platesNeeded: number[] = [];

    for (const plate of availablePlates) {
      while (weightPerSide >= plate) {
        platesNeeded.push(plate);
        weightPerSide -= plate;
      }
    }

    return platesNeeded;
  };

  const plates = calculatePlates(targetWeight, barWeight);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3 text-xs">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
        <h4 className="font-extrabold text-emerald-400 uppercase tracking-wider">
          🏋️ Plate Load Calculator
        </h4>
        <span className="text-zinc-400 text-[10px]">Per Side Loading</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-zinc-400 font-bold mb-1">
            Target Weight (kg)
          </label>
          <input
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(Number(e.target.value))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 font-bold text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-zinc-400 font-bold mb-1">
            Barbell Weight
          </label>
          <select
            value={barWeight}
            onChange={(e) => setBarWeight(Number(e.target.value))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 font-bold text-white text-xs"
          >
            <option value={20}>20 kg (Olympic Bar)</option>
            <option value={15}>15 kg (Women's Bar)</option>
            <option value={10}>10 kg (EZ-Curl Bar)</option>
            <option value={0}>0 kg (Dumbbell / Machine)</option>
          </select>
        </div>
      </div>

      {/* Visual Plates Rendering */}
      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 flex items-center justify-center gap-1.5 min-h-[60px]">
        {plates.length > 0 ? (
          plates.map((p, idx) => (
            <div
              key={idx}
              className="bg-emerald-500 text-black font-black text-[10px] rounded-md px-2 py-3 border border-emerald-300 shadow"
            >
              {p}k
            </div>
          ))
        ) : (
          <span className="text-zinc-500 font-medium">
            Barbell only (or target below bar weight)
          </span>
        )}
      </div>
    </div>
  );
}
