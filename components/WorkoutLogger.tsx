"use client";

import React, { useState } from "react";

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
    <div className="max-w-md mx-auto p-6 bg-slate-50 text-slate-900 min-h-screen font-sans">
      {/* Airy, Minimalist Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
          Exercise 1 of 4
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-slate-900">
          {exercise.name}
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Goal:{" "}
          <span className="text-slate-800">{exercise.targetSets} sets</span> ×{" "}
          {exercise.targetRepRange}
        </p>

        {/* Clean Overload Card */}
        {exercise.lastWeek && (
          <div className="mt-4 p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">
              Last session best:
            </span>
            <span className="font-bold text-emerald-600">
              {exercise.lastWeek.weight} × {exercise.lastWeek.reps} reps
            </span>
          </div>
        )}
      </div>

      {/* Spacious Set Cards */}
      <div className="space-y-4">
        {sets.map((set, index) => (
          <div
            key={set.setNumber}
            className={`p-5 rounded-2xl border transition-all shadow-sm ${
              set.completed
                ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Set {set.setNumber}
              </span>
              <button
                onClick={() => toggleComplete(index)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                  set.completed
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {set.completed ? "Completed ✓" : "Mark Done"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={set.weight}
                  onChange={(e) => updateSet(index, "weight", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xl font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-center transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Reps Done
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={set.reps}
                  onChange={(e) => updateSet(index, "reps", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xl font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-center transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Spacious Footer Button */}
      <button
        onClick={handleNext}
        className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-slate-800 transition-all text-base"
      >
        Next Exercise →
      </button>
    </div>
  );
}
