"use client";

import React, { useState, useEffect } from "react";
import WorkoutLogger from "@/components/WorkoutLogger";
import PlateCalculator from "@/components/PlateCalculator";

type Tab = "workout" | "plates" | "progress";

const inputClass =
  "w-full rounded-xl border border-yellow-200 bg-yellow-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300";
const labelClass =
  "block text-xs font-bold tracking-wide text-yellow-800 mb-1.5";
const primaryButton =
  "w-full rounded-xl bg-yellow-400 py-3 text-sm font-black text-slate-950 shadow-md transition hover:bg-yellow-300 active:scale-[0.99] disabled:opacity-60";

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

  const [activeTab, setActiveTab] = useState<Tab>("workout");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Restore saved session on first load
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("jdas_local_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        const savedProfile = localStorage.getItem(
          `jdas_profile_${parsed.username}`,
        );
        if (savedProfile) {
          const p = JSON.parse(savedProfile);
          setFullName(p.fullName || "");
          setAge(p.age || "");
          setHeight(p.height || "");
          setWeight(p.weight || "");
          setIsOnboarded(true);
        }
      }
    } catch {
      localStorage.removeItem("jdas_local_user");
    }
    setIsReady(true);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) return;

    const username = usernameInput.trim();
    let accounts: Record<string, string> = {};
    try {
      accounts = JSON.parse(localStorage.getItem("jdas_accounts") || "{}");
    } catch {
      accounts = {};
    }

    if (isRegistering) {
      if (accounts[username]) {
        alert("This username already exists. Please sign in.");
        return;
      }
      accounts[username] = passwordInput;
      localStorage.setItem("jdas_accounts", JSON.stringify(accounts));
    } else {
      if (!accounts[username] || accounts[username] !== passwordInput) {
        alert(
          "Incorrect username or password. If you are new, create an account first.",
        );
        return;
      }
    }

    setIsLoading(true);
    const userData = { username };
    localStorage.setItem("jdas_local_user", JSON.stringify(userData));
    setUser(userData);

    // Load this user's profile if they already have one
    try {
      const savedProfile = localStorage.getItem(`jdas_profile_${username}`);
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        setFullName(p.fullName || "");
        setAge(p.age || "");
        setHeight(p.height || "");
        setWeight(p.weight || "");
        setIsOnboarded(true);
      } else {
        setIsOnboarded(false);
      }
    } catch {
      setIsOnboarded(false);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("jdas_local_user");
    setUser(null);
    setIsOnboarded(false);
    setSessionStarted(false);
    setActiveTab("workout");
    setUsernameInput("");
    setPasswordInput("");
    setFullName("");
    setAge("");
    setHeight("");
    setWeight("");
  };

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const profileData = { fullName, age, height, weight };
    localStorage.setItem(
      `jdas_profile_${user.username}`,
      JSON.stringify(profileData),
    );
    setIsOnboarded(true);
  };

  // Avoid a flash of the login screen before localStorage is read
  if (!isReady) {
    return <main className="min-h-screen bg-yellow-50" />;
  }

  // --- SCREEN 1: LOGIN / CREATE ACCOUNT ---
  if (!user) {
    return (
      <main className="min-h-screen bg-yellow-50 text-slate-900 font-sans flex flex-col justify-center px-6">
        <div className="max-w-sm w-full mx-auto bg-white border border-yellow-200 p-8 rounded-3xl shadow-lg shadow-yellow-200/50">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-yellow-400 rounded-2xl mx-auto flex items-center justify-center text-slate-950 font-black text-xl shadow-md mb-3">
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
              <label className={labelClass}>Username</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                autoComplete={
                  isRegistering ? "new-password" : "current-password"
                }
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={primaryButton}
            >
              {isRegistering ? "Create account" : "Sign in"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="mt-5 w-full text-center text-sm font-semibold text-yellow-700 hover:text-yellow-600"
          >
            {isRegistering
              ? "Already have an account? Sign in"
              : "New here? Create an account"}
          </button>
        </div>
      </main>
    );
  }

  // --- SCREEN 2: ONBOARDING ---
  if (!isOnboarded) {
    return (
      <main className="min-h-screen bg-yellow-50 text-slate-900 font-sans flex flex-col justify-center px-6 py-10">
        <div className="max-w-sm w-full mx-auto bg-white border border-yellow-200 p-8 rounded-3xl shadow-lg shadow-yellow-200/50">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Set up your profile
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Tell us a little about yourself, {user.username}.
            </p>
          </div>

          <form onSubmit={handleCompleteOnboarding} className="space-y-4">
            <div>
              <label className={labelClass}>Full name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Age</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Height (cm)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="170"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Weight (kg)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="70"
                  className={inputClass}
                />
              </div>
            </div>
            <button type="submit" className={primaryButton}>
              Save and continue
            </button>
          </form>
        </div>
      </main>
    );
  }

  // --- SCREEN 3: MAIN APP ---
  const tabs: { id: Tab; label: string }[] = [
    { id: "workout", label: "Workout" },
    { id: "plates", label: "Plates" },
    { id: "progress", label: "Progress" },
  ];

  return (
    <main className="min-h-screen bg-yellow-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-10 border-b border-yellow-300 bg-yellow-400 px-5 py-4 shadow-sm">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-lg font-black text-yellow-400">
              J
            </div>
            <div>
              <h1 className="text-base font-black leading-tight text-slate-950">
                JDAS PRO
              </h1>
              <p className="text-xs font-medium text-yellow-900">
                {fullName || user.username}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-bold text-yellow-400 hover:bg-slate-800"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-md px-5 pb-24 pt-5">
        {activeTab === "workout" && (
          <section>
            {!sessionStarted ? (
              <div className="rounded-3xl border border-yellow-200 bg-white p-6 text-center shadow-sm">
                <h2 className="text-xl font-black text-slate-900">
                  Ready to train?
                </h2>
                <p className="mt-1 mb-5 text-sm text-slate-500">
                  Start a session to begin logging your sets.
                </p>
                <button
                  onClick={() => setSessionStarted(true)}
                  className={primaryButton}
                >
                  Start workout
                </button>
              </div>
            ) : (
              <div>
                <WorkoutLogger />
                <button
                  onClick={() => setSessionStarted(false)}
                  className="mt-4 w-full rounded-xl border border-yellow-400 bg-white py-3 text-sm font-bold text-yellow-800 hover:bg-yellow-100"
                >
                  End session
                </button>
              </div>
            )}
          </section>
        )}

        {activeTab === "plates" && <PlateCalculator />}

        {activeTab === "progress" && (
          <section className="rounded-3xl border border-yellow-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">Your stats</h2>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-yellow-100 p-3">
                <dt className="text-xs font-semibold text-yellow-800">Age</dt>
                <dd className="text-lg font-black text-slate-900">{age}</dd>
              </div>
              <div className="rounded-2xl bg-yellow-100 p-3">
                <dt className="text-xs font-semibold text-yellow-800">
                  Height
                </dt>
                <dd className="text-lg font-black text-slate-900">
                  {height} cm
                </dd>
              </div>
              <div className="rounded-2xl bg-yellow-100 p-3">
                <dt className="text-xs font-semibold text-yellow-800">
                  Weight
                </dt>
                <dd className="text-lg font-black text-slate-900">
                  {weight} kg
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-slate-500">
              Workout history and charts will show up here.
            </p>
          </section>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-yellow-300 bg-white">
        <div className="mx-auto flex max-w-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-sm font-bold transition ${
                activeTab === tab.id
                  ? "border-t-4 border-yellow-400 bg-yellow-100 text-slate-950"
                  : "border-t-4 border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}
