"use client";

import React, { useState, useEffect } from "react";
import { DayRoutine } from "../lib/workoutGenerator";
import PlateCalculator from "./PlateCalculator";
import { calculateNextTargetWeight } from "../lib/overloadEngine";

interface WorkoutLoggerProps {
  routine: DayRoutine;
  onClose: () => void;
}

export default function WorkoutLogger({
  routine,
  onClose,
}: WorkoutLoggerProps) {
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [weightInput, setWeightInput] = useState("");
  const [repsInput, setRepsInput] = useState("");
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentExercise = routine.exercises[activeExerciseIdx];

  // Rest Timer Countdown with Audio & Haptics
  useEffect(() => {
    if (restTimer === null) return;
    if (restTimer <= 0) {
      // Audio Alert
      const audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);

      // Haptic Feedback
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }

      setRestTimer(null);
      return;
    }

    const timer = setInterval(() => {
      setRestTimer((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [restTimer]);

  // Voice-to-Text Speech Recognition
  const startVoiceLogging = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported on this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);

      // Parse numbers from transcript (e.g., "30 kg 10 reps")
      const numbers = transcript.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        setWeightInput(numbers[0]);
        setRepsInput(numbers[1]);
      } else if (numbers && numbers.length === 1) {
        setRepsInput(numbers[0]);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const handleLogSet = () => {
    if (!repsInput) return;

    const loggedSet = (completedSets[activeExerciseIdx] || 0) + 1;
    const updated = [...completedSets];
    updated[activeExerciseIdx] = loggedSet;
    setCompletedSets(updated);

    // Auto-Regulator Feedback
    const overloadResult = calculateNextTargetWeight({
      exerciseName: currentExercise.name,
      weightKg: Number(weightInput) || 20,
      repsCompleted: Number(repsInput),
      targetReps: 10,
    });

    setFeedback(overloadResult.recommendation);

    // Trigger Rest Timer (90s)
    setRestTimer(90);
    setRepsInput("");
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/95 backdrop-blur-md text-white z-50 p-5 flex flex-col justify-between max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
        <div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">
            {routine.dayName}
          </span>
          <h2 className="text-lg font-black text-white">{routine.focus}</h2>
        </div>
        <button
          onClick={onClose}
          className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-bold text-xs px-3 py-1.5 rounded-xl"
        >
          ✕ Close
        </button>
      </div>

      {/* Rest Timer Banner */}
      {restTimer !== null && (
        <div className="bg-emerald-950 border border-emerald-500/50 rounded-2xl p-3 text-center animate-pulse">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">
            ⏳ Rest Interval Active
          </span>
          <span className="text-2xl font-black text-white font-mono">
            {restTimer}s
          </span>
        </div>
      )}

      {/* Current Exercise View */}
      <div className="space-y-4 my-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-zinc-400 uppercase">
              Exercise {activeExerciseIdx + 1} of {routine.exercises.length}
            </span>
            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              {currentExercise.sets} Sets × {currentExercise.reps}
            </span>
          </div>
          <h3 className="text-xl font-black text-white">
            {currentExercise.name}
          </h3>

          {/* Form & Rest Cues */}
          <div className="text-xs text-zinc-400 flex justify-between pt-1 border-t border-zinc-800/80">
            <span>
              ⏱️ Tempo: <strong className="text-zinc-200">3-1-1-0</strong>
            </span>
            <span>
              ⏳ Target Rest: <strong className="text-zinc-200">90s</strong>
            </span>
          </div>

          {feedback && (
            <div className="p-3 bg-zinc-950 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-medium">
              {feedback}
            </div>
          )}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder="e.g. 30"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-base font-black text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1">
              Reps Completed
            </label>
            <input
              type="number"
              value={repsInput}
              onChange={(e) => setRepsInput(e.target.value)}
              placeholder="e.g. 10"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-base font-black text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Voice Logging Button */}
        <button
          type="button"
          onClick={startVoiceLogging}
          className={`w-full py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
            isListening
              ? "bg-red-950 border-red-500 text-red-400 animate-pulse"
              : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          <span>🎙️</span>
          <span>
            {isListening ? "Listening for weight/reps..." : "Voice-to-Text Log"}
          </span>
        </button>

        {/* Embedded Plate Calculator */}
        <PlateCalculator />
      </div>

      {/* Action Controls */}
      <div className="space-y-2">
        <button
          onClick={handleLogSet}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition"
        >
          ✓ Log Completed Set
        </button>

        <div className="flex gap-2">
          <button
            disabled={activeExerciseIdx === 0}
            onClick={() =>
              setActiveExerciseIdx((prev) => Math.max(0, prev - 1))
            }
            className="w-1/2 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl text-xs uppercase disabled:opacity-40"
          >
            ← Previous
          </button>
          <button
            disabled={activeExerciseIdx === routine.exercises.length - 1}
            onClick={() =>
              setActiveExerciseIdx((prev) =>
                Math.min(routine.exercises.length - 1, prev + 1),
              )
            }
            className="w-1/2 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl text-xs uppercase disabled:opacity-40"
          >
            Next Exercise →
          </button>
        </div>
      </div>
    </div>
  );
}
