"use client";

import React, { useState, useEffect } from "react";
import WorkoutLogger from "@/components/WorkoutLogger";
import PlateCalculator from "@/components/PlateCalculator";

export default function Home() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [isOnboarded, setIsOnboarded] = useState(false);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [activeTab, setActiveTab] = useState<"workout" | "plates" | "progress">(
    "workout",
  );
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("jdas_local_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedProfile = localStorage.getItem("jdas_profile");
    if (savedProfile) {
      setIsOnboarded(true);
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      const userData = { username: usernameInput.trim() };
      localStorage.setItem("jdas_local_user", JSON.stringify(userData));
      setUser(userData);
      setIsLoading(false);
    }, 300);
  };

  const handleLogout = () => {
    localStorage.removeItem("jdas_local_user");
    localStorage.removeItem("jdas_profile");
    setUser(null);
    setIsOnboarded(false);
    setUsernameInput("");
    setPasswordInput("");
  };

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const profileData = { fullName, age, height, weight };
    localStorage.setItem("jdas_profile", JSON.stringify(profileData));
    setIsOnboarded(true);
  };

  // --- SCREEN 1: LOGIN / CREATE ACCOUNT ---
  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-center px-6">
        <div className="max-w-sm w-full mx-auto bg-white border border-slate-200/90 p-8 rounded-3xl shadow-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-xl shadow-md mb-3">
              J
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              JDAS PRO
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isRegistering
                ? "Create your local personal account"
                : "Sign in to your private fitness tracker"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                placeholder="Enter username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Password / Passcode
              </label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-md transition-all text-base flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>
                  {isRegistering ? "Create Account & Continue" : "Sign In →"}
                </span>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              {isRegistering
                ? "Already have an account? Sign in"
                : "No account yet? Create one"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --- SCREEN 2: ONBOARDING / PERSONAL METRICS ---
  if (!isOnboarded) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-center px-6 py-12">
        <div className="max-w-md w-full mx-auto bg-white border border-slate-200/90 p-8 rounded-3xl shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              Setup 1/2
            </span>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-rose-600 hover:underline"
            >
              Sign Out
            </button>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">
            Personal Metrics
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Let&apos;s set up your profile for precise tracking.
          </p>

          <form onSubmit={handleCompleteOnboarding} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jake"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  required
                  placeholder="26"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  required
                  placeholder="74"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-center"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Height (cm)
              </label>
              <input
                type="number"
                required
                placeholder="170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-center"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-md transition-all text-base flex items-center justify-center gap-2"
            >
              <span>Continue to Workout Schedule →</span>
            </button>
          </form>
        </div>
      </main>
    );
  }

  // --- SCREEN 3: MAIN WORKOUT DASHBOARD ---
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Prominent Header with Sign Out Button */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
          <h1 className="text-base font-black tracking-tight text-slate-900">
            JDAS PRO
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
            👤 {user.username}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-md mx-auto px-5 pt-6">
        {!sessionStarted && activeTab === "workout" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md">
                Active Routine
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-3">
                Chest & Triceps Hypertrophy
              </h2>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Log your sets, beat your weights from last week, and push
                progressive overload cleanly.
              </p>

              <button
                onClick={() => setSessionStarted(true)}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-md transition-all text-base flex items-center justify-center gap-2"
              >
                <span>Start Workout Session</span>
                <span className="text-lg">→</span>
              </button>
            </div>

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
                  Target Range
                </span>
                <p className="text-xl font-black text-slate-800 mt-1">
                  8 - 10 Reps
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
              Your personal records and progressive overload logs will appear
              here.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
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
