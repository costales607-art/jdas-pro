export interface ExerciseLog {
  exerciseName: string;
  weightKg: number;
  repsCompleted: number;
  targetReps: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

export function calculateNextTargetWeight(log: ExerciseLog): {
  nextWeightKg: number;
  recommendation: string;
} {
  const { weightKg, repsCompleted, targetReps } = log;

  // Progressive Overload Logic
  if (repsCompleted >= targetReps + 2) {
    const recommended = weightKg + 2.5;
    return {
      nextWeightKg: recommended,
      recommendation: `🔥 Goal Exceeded! Increase target weight to ${recommended} kg next session.`,
    };
  } else if (repsCompleted < targetReps - 2) {
    const recommended = Math.max(0, weightKg - 2.5);
    return {
      nextWeightKg: recommended,
      recommendation: `💡 Target missed. Maintain or lower weight to ${recommended} kg for form.`,
    };
  }

  return {
    nextWeightKg: weightKg,
    recommendation: `✅ Target hit! Maintain ${weightKg} kg for clean progressive overload.`,
  };
}
