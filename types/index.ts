export type Gender = "male" | "female";
export type PrimaryGoal = "muscle_gain" | "fat_loss" | "recomp";
export type ProgramMode = "ai_generated" | "custom_coach";

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  goal: PrimaryGoal;
  activityLevel: string;
  focusMuscles: string[];
  programMode: ProgramMode;
  trainingDaysPerWeek: number; // Selected weekly frequency (2, 3, 4, 5, or 6 days)
  physiquePhotoUrl?: string;
  medicalNotes?: string; // Active medical/injury notes (e.g. Sciatica, Lower back pain)
}

export interface MacroTargets {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}
