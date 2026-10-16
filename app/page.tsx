"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Onboarding from "../components/Onboarding";
import WorkoutLogger from "../components/WorkoutLogger";
import ProgressTracker from "../components/ProgressTracker";
import DataExporter from "../components/DataExporter";
import { calculateMacros } from "../lib/calculations";
import { generateWorkoutProgram, DayRoutine } from "../lib/workoutGenerator";
import { generateNutritionPlan, NutritionPlan } from "../lib/mealGenerator";
import {
  analyzePhysiquePhoto,
  PhysiqueAnalysis,
} from "../lib/aiVisionAnalyzer";
import { checkDeloadStatus, DeloadStatus } from "../lib/deloadEngine";
import { UserProfile, MacroTargets } from "../types";

const STORAGE_KEY = "jdas_user_profile";
const MEAL_COMPLETION_KEY = "jdas_completed_meals";

type TabType = "dash" | "nutrition" | "workouts" | "progress" | "chat";

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [macros, setMacros] = useState<MacroTargets | null>(null);
  const [workoutProgram, setWorkoutProgram] = useState<DayRoutine[] | null>(
    null,
  );
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(
    null,
  );
  const [physiqueScan, setPhysiqueScan] = useState<PhysiqueAnalysis | null>(
    null,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<DayRoutine | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("dash");
  const [isLoaded, setIsLoaded] = useState(false);

  // Date & Deload Engine State
  const [currentDateString, setCurrentDateString] = useState("");
  const [deloadInfo, setDeloadInfo] = useState<DeloadStatus | null>(null);

  // Strict Meal Adherence Tracking
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>(
    {},
  );

  // AI Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Hey! I am your JDAS AI Coach. Ask me anything about workout form, sciatica adjustments, or meal timing!",
    },
  ]);
  const [isChatSending, setIsChatSending] = useState(false);

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDateString(formatted);

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedProfile: UserProfile = JSON.parse(saved);
        applyProfile(parsedProfile);
      } catch (err) {
        console.error("Failed parsing saved profile:", err);
      }
    }

    const savedMealStatus = localStorage.getItem(MEAL_COMPLETION_KEY);
    if (savedMealStatus) {
      try {
        setCompletedMeals(JSON.parse(savedMealStatus));
      } catch (e) {
        console.error("Failed loading meal completion:", e);
      }
    }

    setIsLoaded(true);
  }, []);

  const applyProfile = async (profile: UserProfile) => {
    setUserProfile(profile);
    const calculatedMacros = calculateMacros(profile);
    setMacros(calculatedMacros);

    setWorkoutProgram(generateWorkoutProgram(profile));
    setNutritionPlan(generateNutritionPlan(calculatedMacros, profile.goal));

    // Calculate Deload Cycle Status
    const deload = checkDeloadStatus(new Date().toISOString());
    setDeloadInfo(deload);

    if (profile.physiquePhotoUrl) {
      setIsAnalyzing(true);
      try {
        const scanResult = await analyzePhysiquePhoto(
          profile.physiquePhotoUrl,
          profile.goal,
          profile.medicalNotes,
          profile.trainingDaysPerWeek,
        );
        setPhysiqueScan(scanResult.analysis);

        if (scanResult.customWorkout && scanResult.customWorkout.length > 0) {
          setWorkoutProgram(scanResult.customWorkout);
        }
      } catch (e) {
        console.error("Failed analyzing photo:", e);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const toggleMealCompletion = (mealName: string) => {
    const updated = {
      ...completedMeals,
      [mealName]: !completedMeals[mealName],
    };
    setCompletedMeals(updated);
    localStorage.setItem(MEAL_COMPLETION_KEY, JSON.stringify(updated));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatSending) return;

    const userText = chatInput.trim();
    setChatInput("");
    const updatedMessages: ChatMessage[] = [
      ...chatMessages,
      { role: "user", text: userText },
    ];
    setChatMessages(updatedMessages);
    setIsChatSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          userContext: userProfile,
        }),
      });

      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Network connection issue contacting AI Coach server.",
        },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    applyProfile(profile);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MEAL_COMPLETION_KEY);
    setUserProfile(null);
    setMacros(null);
    setWorkoutProgram(null);
    setNutritionPlan(null);
    setPhysiqueScan(null);
    setActiveWorkout(null);
    setCompletedMeals({});
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 text-emerald-400 flex items-center justify-center text-lg font-black tracking-wider animate-pulse">
        JDAS PRO LOADING...
      </div>
    );
  }

  if (!userProfile || !macros || !workoutProgram || !nutritionPlan) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const completedCount = Object.values(completedMeals).filter(Boolean).length;
  const totalMeals = nutritionPlan.meals.length;

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between max-w-md mx-auto border-x border-zinc-800 shadow-2xl relative pb-24 font-sans">
      {/* Header */}
      <header className="p-4 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 flex justify-between items-center sticky top-0 z-30">
        <div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
            {currentDateString}
          </span>
          <h1 className="text-xl font-black text-white">{userProfile.name}</h1>
        </div>
        <button
          onClick={handleReset}
          className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 rounded-xl text-zinc-300 font-semibold transition"
        >
          Reset Data
        </button>
      </header>

      {/* Deload Phase / Active Limitations Banner */}
      {userProfile.medicalNotes && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 text-[11px] text-amber-300 flex justify-between items-center"
        >
          <span>
            🩺 Active Limitations: <strong>{userProfile.medicalNotes}</strong>
          </span>
          <span className="text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded font-bold">
            Adapted
          </span>
        </motion.div>
      )}

      {/* Main Content Area */}
      <div className="p-5 flex-1 overflow-y-auto space-y-5">
        <AnimatePresence mode="wait">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dash" && (
            <motion.div
              key="dash"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Deload Status Card */}
              {deloadInfo && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                      Cycle Recovery Tracking
                    </span>
                    <span className="text-xs font-black text-emerald-400">
                      {deloadInfo.message}
                    </span>
                  </div>
                  <span className="text-xs bg-emerald-950 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-lg font-bold">
                    Wk {deloadInfo.currentWeekNumber}
                  </span>
                </div>
              )}

              {/* AI Vision Scan Result */}
              {isAnalyzing ? (
                <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-5 text-center animate-pulse space-y-1">
                  <div className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                    AI Coach Scanning Physique...
                  </div>
                  <p className="text-xs text-zinc-400">
                    Evaluating body fat & posture
                  </p>
                </div>
              ) : physiqueScan ? (
                <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                      AI Coach Analysis
                    </span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 font-extrabold px-3 py-1 rounded-full border border-emerald-500/30">
                      Body Fat: {physiqueScan.estimatedBodyFat}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                    {physiqueScan.symmetryNote}
                  </p>
                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-xs font-semibold text-emerald-400">
                    <span className="text-zinc-400">Tactical Focus: </span>
                    {physiqueScan.recommendedFocus}
                  </div>
                </div>
              ) : null}

              {/* Daily Macros Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest">
                    Daily Nutrition Target
                  </span>
                  <span className="text-2xl font-black text-emerald-400">
                    {macros.calories}{" "}
                    <span className="text-xs text-zinc-400 font-semibold">
                      kcal
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                    <div className="text-xs text-zinc-400 font-medium">
                      Protein
                    </div>
                    <div className="text-base font-black text-white mt-0.5">
                      {macros.proteinGrams}g
                    </div>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                    <div className="text-xs text-zinc-400 font-medium">
                      Carbs
                    </div>
                    <div className="text-base font-black text-white mt-0.5">
                      {macros.carbsGrams}g
                    </div>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                    <div className="text-xs text-zinc-400 font-medium">
                      Fats
                    </div>
                    <div className="text-base font-black text-white mt-0.5">
                      {macros.fatsGrams}g
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Scheduled Workout */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
                    Today's Session
                  </span>
                  <span className="text-xs font-bold text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-lg">
                    {workoutProgram[0]?.dayOfWeek || workoutProgram[0]?.dayName}
                  </span>
                </div>
                <div className="text-lg font-black text-white">
                  {workoutProgram[0]?.focus}
                </div>
                <button
                  onClick={() => setActiveWorkout(workoutProgram[0])}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition"
                >
                  {workoutProgram[0]?.isRestDay
                    ? "Start Active Recovery →"
                    : "Launch Workout Logger →"}
                </button>
              </div>

              {/* CSV Data Exporter */}
              <DataExporter />
            </motion.div>
          )}

          {/* TAB 2: MEALS */}
          {activeTab === "nutrition" && (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-black uppercase text-emerald-400 tracking-widest">
                  Daily Meal Checklist
                </h2>
                <span className="text-xs font-bold text-zinc-300 bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
                  {completedCount}/{totalMeals} Consumed
                </span>
              </div>

              <div className="space-y-3">
                {nutritionPlan.meals.map((meal, idx) => {
                  const isDone = !!completedMeals[meal.mealName];
                  const isPreWorkout = meal.mealName
                    .toLowerCase()
                    .includes("pre-workout");

                  return (
                    <div
                      key={idx}
                      className={`border rounded-2xl p-4 transition ${
                        isDone
                          ? "bg-emerald-950/20 border-emerald-500/40"
                          : isPreWorkout
                            ? "bg-amber-950/20 border-amber-500/40"
                            : "bg-zinc-900 border-zinc-800"
                      }`}
                    >
                      <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2 mb-2">
                        <div>
                          <span className="text-sm font-extrabold text-white block">
                            {meal.mealName}
                          </span>
                          {isPreWorkout && (
                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                              ⚡ Consume 60-90m Prior to Lift
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleMealCompletion(meal.mealName)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition ${
                            isDone
                              ? "bg-emerald-500 text-black"
                              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                          }`}
                        >
                          {isDone ? "✓ Eaten" : "Mark Eaten"}
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {meal.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="flex justify-between text-xs"
                          >
                            <span
                              className={
                                isDone
                                  ? "line-through text-zinc-500"
                                  : "text-zinc-200"
                              }
                            >
                              {item.name}
                            </span>
                            <span className="text-emerald-400 font-mono font-bold">
                              {item.portion}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <h2 className="text-xs font-black uppercase text-emerald-400 tracking-widest pt-3">
                Supplement Timings
              </h2>
              <div className="space-y-2">
                {nutritionPlan.supplements.map((supp, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-white">
                        {supp.name}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        {supp.dosage}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{supp.purpose}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: WORKOUT SPLIT */}
          {activeTab === "workouts" && (
            <motion.div
              key="workouts"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-xs font-black uppercase text-emerald-400 tracking-widest">
                Weekly Routine & Rest Day Split
              </h2>
              <div className="space-y-4">
                {workoutProgram.map((day) => (
                  <div
                    key={day.dayName}
                    className={`border rounded-2xl p-5 space-y-4 transition ${
                      day.isRestDay
                        ? "bg-amber-950/10 border-amber-500/30"
                        : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                      <div>
                        <span className="font-black text-white text-base block">
                          {day.dayName}
                        </span>
                        {day.dayOfWeek && (
                          <span className="text-[10px] text-zinc-400 font-bold uppercase">
                            {day.dayOfWeek}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          day.isRestDay
                            ? "text-amber-300 bg-amber-950/60 border-amber-500/40"
                            : "text-emerald-400 bg-emerald-950/50 border-emerald-500/30"
                        }`}
                      >
                        {day.focus}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {day.exercises.map((ex, i) => (
                        <div
                          key={i}
                          className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 space-y-1"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-white">
                              {ex.name}
                            </span>
                            <span className="text-xs text-emerald-400 font-mono font-bold">
                              {ex.sets} × {ex.reps}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveWorkout(day)}
                      className={`w-full py-3 font-extrabold rounded-xl text-xs uppercase tracking-wider transition ${
                        day.isRestDay
                          ? "bg-amber-500 hover:bg-amber-400 text-black"
                          : "bg-emerald-500 hover:bg-emerald-400 text-black"
                      }`}
                    >
                      {day.isRestDay
                        ? "Open Recovery Routine"
                        : "Start Session"}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: PROGRESS */}
          {activeTab === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ProgressTracker />
            </motion.div>
          )}

          {/* TAB 5: AI CHAT */}
          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-[520px] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
            >
              <div className="p-3 bg-zinc-950 border-b border-zinc-800 flex items-center gap-2">
                <span className="text-base">🤖</span>
                <div>
                  <h3 className="text-xs font-black uppercase text-emerald-400">
                    JDAS AI Coach
                  </h3>
                  <span className="text-[10px] text-zinc-400">
                    Form, Sciatica & Nutrition Guidance
                  </span>
                </div>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-emerald-500 text-black font-semibold rounded-br-none"
                          : "bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatSending && (
                  <div className="text-xs text-emerald-400 animate-pulse font-semibold">
                    JDAS AI Coach typing...
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-2 bg-zinc-950 border-t border-zinc-800 flex gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about exercises, sciatica, macros..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 text-xs focus:outline-none focus:border-emerald-500 text-white"
                />
                <button
                  type="submit"
                  disabled={isChatSending}
                  className="bg-emerald-500 text-black px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-emerald-400 transition"
                >
                  Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-800 max-w-md mx-auto grid grid-cols-5 p-2 z-40">
        <button
          onClick={() => setActiveTab("dash")}
          className={`py-2 rounded-xl text-center flex flex-col items-center justify-center transition ${
            activeTab === "dash"
              ? "text-emerald-400 font-black bg-emerald-950/50"
              : "text-zinc-400 font-semibold"
          }`}
        >
          <span className="text-base">📊</span>
          <span className="text-[10px] mt-0.5">Dash</span>
        </button>
        <button
          onClick={() => setActiveTab("nutrition")}
          className={`py-2 rounded-xl text-center flex flex-col items-center justify-center transition ${
            activeTab === "nutrition"
              ? "text-emerald-400 font-black bg-emerald-950/50"
              : "text-zinc-400 font-semibold"
          }`}
        >
          <span className="text-base">🥗</span>
          <span className="text-[10px] mt-0.5">Meals</span>
        </button>
        <button
          onClick={() => setActiveTab("workouts")}
          className={`py-2 rounded-xl text-center flex flex-col items-center justify-center transition ${
            activeTab === "workouts"
              ? "text-emerald-400 font-black bg-emerald-950/50"
              : "text-zinc-400 font-semibold"
          }`}
        >
          <span className="text-base">🏋️</span>
          <span className="text-[10px] mt-0.5">Workouts</span>
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          className={`py-2 rounded-xl text-center flex flex-col items-center justify-center transition ${
            activeTab === "progress"
              ? "text-emerald-400 font-black bg-emerald-950/50"
              : "text-zinc-400 font-semibold"
          }`}
        >
          <span className="text-base">📈</span>
          <span className="text-[10px] mt-0.5">Progress</span>
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`py-2 rounded-xl text-center flex flex-col items-center justify-center transition ${
            activeTab === "chat"
              ? "text-emerald-400 font-black bg-emerald-950/50"
              : "text-zinc-400 font-semibold"
          }`}
        >
          <span className="text-base">💬</span>
          <span className="text-[10px] mt-0.5">AI Chat</span>
        </button>
      </nav>

      {/* Active Workout Logger Modal */}
      {activeWorkout && (
        <WorkoutLogger
          routine={activeWorkout}
          onClose={() => setActiveWorkout(null)}
        />
      )}
    </main>
  );
}
