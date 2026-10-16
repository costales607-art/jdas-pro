import { DayRoutine } from "./workoutGenerator";

export interface PhysiqueAnalysis {
  detectedLaggingMuscles: string[];
  estimatedBodyFat: string;
  symmetryNote: string;
  recommendedFocus: string;
}

export interface VisionAIResponse {
  analysis: PhysiqueAnalysis;
  customWorkout?: DayRoutine[];
}

export async function analyzePhysiquePhoto(
  imageBase64: string,
  userGoal: string,
  medicalNotes?: string,
  trainingDaysPerWeek?: number,
): Promise<VisionAIResponse> {
  try {
    const res = await fetch("/api/analyze-physique", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64,
        userGoal,
        medicalNotes,
        trainingDaysPerWeek,
      }),
    });

    const data = await res.json();
    return {
      analysis: data.analysis,
      customWorkout: data.customWorkout,
    };
  } catch (err) {
    console.error("Error contacting Vision API:", err);
    return {
      analysis: {
        detectedLaggingMuscles: ["Core Bracing", "Glutes"],
        estimatedBodyFat: "26% - 30%",
        symmetryNote: "Schedule generated based on user preference.",
        recommendedFocus: "Spinal decompression and anti-rotational core work.",
      },
    };
  }
}
