"use client";

import React, { useState } from "react";
import { UserProfile, Gender, PrimaryGoal, ProgramMode } from "../types";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [goal, setGoal] = useState<PrimaryGoal>("muscle_gain");
  const [programMode, setProgramMode] = useState<ProgramMode>("ai_generated");
  const [trainingDays, setTrainingDays] = useState<number>(3);
  const [medicalNotes, setMedicalNotes] = useState("");
  const [physiquePhoto, setPhysiquePhoto] = useState<string>("");

  const isUnderage = Number(age) > 0 && Number(age) < 18;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setPhysiquePhoto(compressedDataUrl);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const isStep1Valid =
    name.trim() !== "" && age !== "" && heightCm !== "" && weightKg !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Valid) return;

    const profile: UserProfile = {
      name,
      age: Number(age),
      gender,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      goal,
      activityLevel: "moderate",
      focusMuscles: ["Upper Chest", "Lats"],
      programMode,
      trainingDaysPerWeek: trainingDays,
      physiquePhotoUrl: physiquePhoto,
      medicalNotes,
    };

    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 text-white flex flex-col justify-between p-6 z-50 overflow-y-auto">
      {/* Header */}
      <div className="pt-4 text-center space-y-1">
        <div className="inline-block px-3 py-1 bg-emerald-950 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest">
          JDAS PRO • Setup {step}/2
        </div>
        <h1 className="text-2xl font-black uppercase text-emerald-400">
          {step === 1 ? "Personal Metrics" : "Customization & Schedule"}
        </h1>
      </div>

      {/* Form Body */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 my-auto max-w-sm mx-auto w-full"
      >
        {step === 1 && (
          <>
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jake"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm focus:border-emerald-500 focus:outline-none font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="26"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm focus:border-emerald-500 focus:outline-none font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm focus:border-emerald-500 focus:outline-none font-semibold"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {/* Underage Notice */}
            {isUnderage && (
              <div className="bg-amber-950/60 border border-amber-500/50 rounded-xl p-3 text-amber-300 text-xs space-y-1">
                <span className="font-extrabold uppercase tracking-wide block">
                  ⚠️ Youth Guidance Notice
                </span>
                <p className="text-[11px] leading-relaxed text-amber-200">
                  Users under 18 should consult a parent or coach prior to
                  beginning intense calorie restrictions or heavy lifting.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="170"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm focus:border-emerald-500 focus:outline-none font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="74"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm focus:border-emerald-500 focus:outline-none font-semibold"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              disabled={!isStep1Valid}
              onClick={() => setStep(2)}
              className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition shadow-lg ${
                isStep1Valid
                  ? "bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer shadow-emerald-500/20"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              Continue to Schedule →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1">
                Primary Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as PrimaryGoal)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm focus:border-emerald-500 focus:outline-none font-semibold"
              >
                <option value="muscle_gain">Hypertrophy / Muscle Gain</option>
                <option value="recomp">Body Recomposition</option>
                <option value="fat_loss">Fat Loss / Shred</option>
              </select>
            </div>

            {/* Preferred Training Frequency Selector */}
            <div>
              <label className="block text-xs font-bold text-emerald-400 mb-1">
                Preferred Weekly Training Schedule
              </label>
              <select
                value={trainingDays}
                onChange={(e) => setTrainingDays(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-emerald-500/40 rounded-xl p-3.5 text-xs font-bold focus:border-emerald-400 focus:outline-none text-white"
              >
                <option value={2}>
                  2 Days / Week (Full Body Split + 5 Rest Days)
                </option>
                <option value={3}>
                  3 Days / Week (Push/Pull/Legs + 4 Rest Days)
                </option>
                <option value={4}>
                  4 Days / Week (Upper/Lower Split + 3 Rest Days)
                </option>
                <option value={5}>
                  5 Days / Week (PPL + Upper/Lower + 2 Rest Days)
                </option>
                <option value={6}>6 Days / Week (PPL 2x + 1 Rest Day)</option>
              </select>
            </div>

            {/* Medical Limitations / Injuries */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1">
                Medical Notes / Injury Restrictions
              </label>
              <input
                type="text"
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="e.g. Sciatica, lower back pain, shoulder pain"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs focus:border-emerald-500 focus:outline-none text-zinc-200"
              />
              <span className="text-[10px] text-zinc-500 block mt-1">
                The AI will adapt exercises to avoid aggravating listed
                conditions.
              </span>
            </div>

            {/* Workout Mode */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1">
                Workout Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setProgramMode("ai_generated")}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                    programMode === "ai_generated"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-400"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400"
                  }`}
                >
                  <div className="text-white font-extrabold">
                    Auto AI Routine
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1 font-normal">
                    Dynamic split based on days & injuries
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setProgramMode("custom_coach")}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                    programMode === "custom_coach"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-400"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400"
                  }`}
                >
                  <div className="text-white font-extrabold">Coach Program</div>
                  <div className="text-[10px] text-zinc-400 mt-1 font-normal">
                    Use imported protocol
                  </div>
                </button>
              </div>
            </div>

            {/* Physique Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1">
                Physique Photo (for Vision AI Scan)
              </label>
              <label className="border border-dashed border-emerald-500/40 hover:border-emerald-400 bg-zinc-900/60 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition min-h-[85px]">
                {physiquePhoto ? (
                  <img
                    src={physiquePhoto}
                    alt="Physique Preview"
                    className="h-16 object-cover rounded-lg border border-emerald-500"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-emerald-400 font-bold text-xs block">
                      + Upload Photo
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      Scans body fat & posture
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Health Disclaimer */}
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] text-zinc-400 leading-normal">
              ⚖️ <strong className="text-zinc-300">Health Disclaimer:</strong>{" "}
              JDAS Pro recommendations are for educational guidance only.
              Consult a physician prior to taking supplements or initiating
              intensive training.
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 bg-zinc-800 text-zinc-300 font-bold rounded-xl text-xs uppercase hover:bg-zinc-700 transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
              >
                Launch AI App →
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
