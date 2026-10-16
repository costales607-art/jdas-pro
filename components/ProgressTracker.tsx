"use client";

import React, { useState, useEffect } from "react";

interface ProgressEntry {
  date: string;
  weightKg: number;
  frontPhoto?: string;
  sidePhoto?: string;
  backPhoto?: string;
}

const PROGRESS_STORAGE_KEY = "jdas_progress_history";

export default function ProgressTracker() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [weightInput, setWeightInput] = useState("");
  const [frontPhoto, setFrontPhoto] = useState("");
  const [sidePhoto, setSidePhoto] = useState("");
  const [backPhoto, setBackPhoto] = useState("");
  const [selectedBaselineIndex, setSelectedBaselineIndex] = useState(0);
  const [selectedCurrentIndex, setSelectedCurrentIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed: ProgressEntry[] = JSON.parse(saved);
        setEntries(parsed);
        if (parsed.length > 1) {
          setSelectedCurrentIndex(parsed.length - 1);
        }
      } catch (err) {
        console.error("Failed loading progress history:", err);
      }
    }
  }, []);

  const handlePhotoCompress = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 600;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > MAX_DIM) {
            h *= MAX_DIM / w;
            w = MAX_DIM;
          }
        } else {
          if (h > MAX_DIM) {
            w *= MAX_DIM / h;
            h = MAX_DIM;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL("image/jpeg", 0.7));
      };
    };
    reader.readAsDataURL(file);
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightInput) return;

    const newEntry: ProgressEntry = {
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      weightKg: Number(weightInput),
      frontPhoto: frontPhoto || undefined,
      sidePhoto: sidePhoto || undefined,
      backPhoto: backPhoto || undefined,
    };

    const updated = [...entries, newEntry];
    setEntries(updated);
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updated));
    setSelectedCurrentIndex(updated.length - 1);

    // Reset inputs
    setWeightInput("");
    setFrontPhoto("");
    setSidePhoto("");
    setBackPhoto("");
  };

  const baseline = entries[selectedBaselineIndex];
  const current = entries[selectedCurrentIndex];

  const weightDiff =
    baseline && current
      ? (current.weightKg - baseline.weightKg).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-2">
        <h2 className="text-lg font-black text-emerald-400 uppercase tracking-wider">
          📈 Physique & Weight Tracker
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Upload front, side, and back photos to see side-by-side transformation
          comparisons.
        </p>
      </div>

      {/* Log New Entry */}
      <form
        onSubmit={handleAddEntry}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4"
      >
        <h3 className="text-sm font-extrabold text-white">
          Log Today's Weight & Photos
        </h3>

        <div>
          <label className="block text-xs font-bold text-zinc-400 mb-1">
            Current Weight (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder="e.g. 74.5"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-base text-white font-bold focus:border-emerald-500 focus:outline-none"
            required
          />
        </div>

        {/* 3 Angle Uploads */}
        <div className="grid grid-cols-3 gap-2">
          {/* Front Photo */}
          <label className="border border-dashed border-zinc-700 bg-zinc-950 rounded-xl p-2 flex flex-col items-center justify-center text-center cursor-pointer min-h-[80px]">
            {frontPhoto ? (
              <img
                src={frontPhoto}
                alt="Front"
                className="h-14 object-cover rounded"
              />
            ) : (
              <span className="text-[11px] font-bold text-emerald-400">
                + Front
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handlePhotoCompress(f, setFrontPhoto);
              }}
            />
          </label>

          {/* Side Photo */}
          <label className="border border-dashed border-zinc-700 bg-zinc-950 rounded-xl p-2 flex flex-col items-center justify-center text-center cursor-pointer min-h-[80px]">
            {sidePhoto ? (
              <img
                src={sidePhoto}
                alt="Side"
                className="h-14 object-cover rounded"
              />
            ) : (
              <span className="text-[11px] font-bold text-emerald-400">
                + Side
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handlePhotoCompress(f, setSidePhoto);
              }}
            />
          </label>

          {/* Back Photo */}
          <label className="border border-dashed border-zinc-700 bg-zinc-950 rounded-xl p-2 flex flex-col items-center justify-center text-center cursor-pointer min-h-[80px]">
            {backPhoto ? (
              <img
                src={backPhoto}
                alt="Back"
                className="h-14 object-cover rounded"
              />
            ) : (
              <span className="text-[11px] font-bold text-emerald-400">
                + Back
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handlePhotoCompress(f, setBackPhoto);
              }}
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-sm uppercase tracking-wider transition"
        >
          Save Progress Entry
        </button>
      </form>

      {/* Side-by-Side Comparison Section */}
      {entries.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider">
              🔍 Visual Comparison
            </h3>
            <span className="text-xs font-bold text-zinc-300 bg-zinc-800 px-3 py-1 rounded-lg">
              Weight Diff:{" "}
              {Number(weightDiff) <= 0
                ? `${weightDiff} kg`
                : `+${weightDiff} kg`}
            </span>
          </div>

          {/* Select Dates to Compare */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-zinc-400 font-bold mb-1">
                Baseline (Start)
              </label>
              <select
                value={selectedBaselineIndex}
                onChange={(e) =>
                  setSelectedBaselineIndex(Number(e.target.value))
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-bold"
              >
                {entries.map((item, idx) => (
                  <option key={idx} value={idx}>
                    {item.date} ({item.weightKg} kg)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1">
                Current (Progress)
              </label>
              <select
                value={selectedCurrentIndex}
                onChange={(e) =>
                  setSelectedCurrentIndex(Number(e.target.value))
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-bold"
              >
                {entries.map((item, idx) => (
                  <option key={idx} value={idx}>
                    {item.date} ({item.weightKg} kg)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Photos Comparison Grid */}
          {baseline && current && (
            <div className="space-y-4 pt-2">
              {/* Front Comparison */}
              <div>
                <span className="text-xs font-bold text-zinc-400 block mb-2">
                  Front View
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-400 block mb-1">
                      Start: {baseline.date}
                    </span>
                    {baseline.frontPhoto ? (
                      <img
                        src={baseline.frontPhoto}
                        alt="Baseline Front"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-40 flex items-center justify-center text-xs text-zinc-600">
                        No Photo
                      </div>
                    )}
                  </div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-center">
                    <span className="text-[10px] text-emerald-400 block mb-1">
                      Current: {current.date}
                    </span>
                    {current.frontPhoto ? (
                      <img
                        src={current.frontPhoto}
                        alt="Current Front"
                        className="w-full h-40 object-cover rounded-lg border border-emerald-500/40"
                      />
                    ) : (
                      <div className="h-40 flex items-center justify-center text-xs text-zinc-600">
                        No Photo
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Side View */}
              <div>
                <span className="text-xs font-bold text-zinc-400 block mb-2">
                  Side View
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-400 block mb-1">
                      Start: {baseline.date}
                    </span>
                    {baseline.sidePhoto ? (
                      <img
                        src={baseline.sidePhoto}
                        alt="Baseline Side"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-40 flex items-center justify-center text-xs text-zinc-600">
                        No Photo
                      </div>
                    )}
                  </div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-center">
                    <span className="text-[10px] text-emerald-400 block mb-1">
                      Current: {current.date}
                    </span>
                    {current.sidePhoto ? (
                      <img
                        src={current.sidePhoto}
                        alt="Current Side"
                        className="w-full h-40 object-cover rounded-lg border border-emerald-500/40"
                      />
                    ) : (
                      <div className="h-40 flex items-center justify-center text-xs text-zinc-600">
                        No Photo
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
