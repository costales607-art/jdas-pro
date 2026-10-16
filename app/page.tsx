"use client";

import React, { useState } from "react";
import WorkoutLogger from "@/components/WorkoutLogger";
import PlateCalculator from "@/components/PlateCalculator";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"workout" | "plates" | "progress">(
    "workout",
  );
  const [sessionStarted, setSessionStarted] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Minimalist Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse"></div>
          <h1 className="text-lg font-black tracking-tight text-slate-900">
            JDAS PRO
          </h1>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          Hypertrophy Mode
        </span>
      </header>

      {/* Main Container with generous spacing */}
      <div className="max-w-md mx-auto px-5 pt-6">
        {!sessionStarted && activeTab === "workout" && (
          <div className="space-y-6">
            {/* Welcome & Overview Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md">
                Today&apos;s Focus
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-3">
                Chest & Triceps Hypertrophy
              </h2>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Push for progressive overload. Beat last week&apos;s weight or
                squeeze out an extra rep.
              </p>

              <button
                onClick={() => setSessionStarted(true)}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-md transition-all text-base flex items-center justify-center gap-2"
              >
                <span>Start Workout Session</span>
                <span className="text-lg">→</span>
              </button>
            </div>

            {/* Quick Stats / Overview preview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Exercises
                </span>
                <p className="text-xl font-black text-slate-800 mt-1">
                  4 Movements
                </p>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Estimated Time
                </span>
                <p className="text-xl font-black text-slate-800 mt-1">
                  ~45 mins
                </p>
              </div>
            </div>
          </div>
        )}

        {sessionStarted && activeTab === "workout" && (
          <div>
            <button
              onClick={() => setSessionStarted(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs"
            >
              <span>← Back to Overview</span>
            </button>
            <WorkoutLogger onFinish={() => setSessionStarted(false)} />
          </div>
        )}

        {activeTab === "plates" && <PlateCalculator />}

        {activeTab === "progress" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-xs mt-4">
            <h3 className="text-xl font-bold text-slate-900">
              Progress Tracker
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Your strength history and personal records will appear here
              cleanly.
            </p>
          </div>
        )}
      </div>

      {/* Minimalist Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 shadow-lg z-30">
        <div className="max-w-md mx-auto flex justify-around items-center">
          <button
            onClick={() => {
              setActiveTab("workout");
              setSessionStarted(false);
            }}
            className={`flex flex-col items-center gap-1 text-xs font-bold transition-colors ${
              activeTab === "workout"
                ? "text-emerald-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <span>🏋️‍♂️</span>
            <span>Workout</span>
          </button>
          <button
            onClick={() => setActiveTab("plates")}
            className={`flex flex-col items-center gap-1 text-xs font-bold transition-colors ${
              activeTab === "plates"
                ? "text-emerald-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <span>⚖️</span>
            <span>Plates</span>
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`flex flex-col items-center gap-1 text-xs font-bold transition-colors ${
              activeTab === "progress"
                ? "text-emerald-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <span>📈</span>
            <span>Progress</span>
          </button>
        </div>
      </nav>
    </main>
  );
}
