"use client";

import React, { useState } from "react";

// Accept any props passed from page.tsx so TypeScript never complains
export default function WorkoutLogger(props: {
  routine?: any;
  onFinish?: () => void;
  onComplete?: () => void;
  [key: string]: any;
}) {
  const { routine, onFinish, onComplete } = props;

  const [exercise] = useState({
    name: routine?.name || "Incline Dumbbell Press",
    targetSets: 4,
    targetRepRange: "8 - 10 reps",
    lastWeek: { weight: "32 kg", reps: "9" },
  });

  const [sets, setSets] = useState([
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

  const handleNext = () => {
    if (onFinish) onFinish();
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      {/* Minimalist Header */}
      <div className="mb-6">
        <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
          Exercise 1 of 4
        </span>
        <h1 className="text-2xl font-bold mt-1 text-white">{exercise.name}</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Target:{" "}
          <span className="text-zinc-200 font-medium">
            {exercise.targetSets} sets
          </span>{" "}
          × {exercise.targetRepRange}
        </p>

        {/* Progressive Overload Hint Card */}
        {exercise.lastWeek && (
          <div className="mt-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between text-xs text-zinc-300">
            <span>🔥 Last week&apos;s best:</span>
            <span className="font-semibold text-emerald-400">
              {exercise.lastWeek.weight} × {exercise.lastWeek.reps} reps
            </span>
          </div>
        )}
      </div>

      {/* Set Rows Container */}
      <div className="space-y-3">
        {sets.map((set, index) => (
          <div
            key={set.setNumber}
            className={`p-4 rounded-2xl border transition-all ${
              set.completed
                ? "bg-emerald-950/20 border-emerald-500/30"
                : "bg-zinc-900/60 border-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-zinc-300">
                SET {set.setNumber}
              </span>
              <button
                onClick={() => toggleComplete(index)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                  set.completed
                    ? "bg-emerald-500 text-zinc-950"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {set.completed ? "Done ✓" : "Mark Done"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={set.weight}
                  onChange={(e) => updateSet(index, "weight", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-lg font-semibold text-white focus:outline-none focus:border-emerald-500 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                  Reps Completed
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={set.reps}
                  onChange={(e) => updateSet(index, "reps", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-lg font-semibold text-white focus:outline-none focus:border-emerald-500 text-center"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Navigation Action */}
      <button
        onClick={handleNext}
        className="w-full mt-6 bg-white text-zinc-950 font-bold py-3.5 rounded-2xl hover:bg-zinc-200 transition-colors"
      >
        Next Exercise →
      </button>
    </div>
  );
}
