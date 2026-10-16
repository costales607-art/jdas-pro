"use client";

import React, { useState } from "react";

interface SetData {
  setNumber: number;
  weight: string;
  reps: string;
  completed: boolean;
}

export default function WorkoutLogger(props: {
  routine?: any;
  onFinish?: () => void;
  [key: string]: any;
}) {
  const { routine, onFinish } = props;

  const [exercise] = useState({
    name: routine?.name || "Incline Dumbbell Press",
    targetSets: 4,
    targetRepRange: "8 - 10 reps",
    lastWeek: { weight: "32 kg", reps: "9" },
  });

  const [sets, setSets] = useState<SetData[]>([
    { setNumber: 1, weight: "", reps: "", completed: false },
    { setNumber: 2, weight: "", reps: "", completed: false },
    { setNumber: 3, weight: "", reps: "", completed: false },
    { setNumber: 4, weight: "", reps: "", completed: false },
  ]);

  const updateSet = (
    index: number,
    field: "weight" | "reps",
    value: string,
  ) => {
    const updated = [...sets];
    updated[index][field] = value;
    setSets(updated);
  };

  const toggleComplete = (index: number) => {
    const updated = [...sets];
    updated[index].completed = !updated[index].completed;
    setSets(updated);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-12">
      {/* Minimalist Exercise Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md">
          Exercise 1 of 4
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-3">
          {exercise.name}
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Target:{" "}
          <span className="text-slate-800 font-semibold">
            {exercise.targetSets} sets
          </span>{" "}
          × {exercise.targetRepRange}
        </p>

        {/* Progressive Overload Hint */}
        {exercise.lastWeek && (
          <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              🔥 Last session best:
            </span>
            <span className="font-bold text-emerald-600 text-sm">
              {exercise.lastWeek.weight} × {exercise.lastWeek.reps} reps
            </span>
          </div>
        )}
      </div>

      {/* Set-by-Set Cards (No Cramped Grids) */}
      <div className="space-y-4">
        {sets.map((set, index) => (
          <div
            key={set.setNumber}
            className={`p-5 rounded-3xl border transition-all shadow-xs ${
              set.completed
                ? "bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-300"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black tracking-wider text-slate-400 uppercase">
                SET {set.setNumber}
              </span>
              <button
                onClick={() => toggleComplete(index)}
                className={`text-xs px-4 py-1.5 rounded-xl font-bold transition-all ${
                  set.completed
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {set.completed ? "Completed ✓" : "Mark Done"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={set.weight}
                  onChange={(e) => updateSet(index, "weight", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xl font-black text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-center transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Reps Done
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={set.reps}
                  onChange={(e) => updateSet(index, "reps", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xl font-black text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-center transition-all"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Finish Exercise Button */}
      <button
        onClick={onFinish}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-md transition-all text-base flex items-center justify-center gap-2"
      >
        <span>Complete Exercise & Next</span>
        <span className="text-lg">→</span>
      </button>
    </div>
  );
}
