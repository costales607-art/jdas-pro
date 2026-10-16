import { UserProfile } from "../types";

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
}

export interface DayRoutine {
  dayName: string;
  dayOfWeek?: string;
  isRestDay?: boolean;
  focus: string;
  exercises: Exercise[];
}

export function generateWorkoutProgram(profile: UserProfile): DayRoutine[] {
  const hasBackIssue =
    profile.medicalNotes &&
    /sciatica|lower back|spine|disc/i.test(profile.medicalNotes);
  const days = profile.trainingDaysPerWeek || 3;

  const legExercises: Exercise[] = hasBackIssue
    ? [
        { name: "Supported Leg Press (Neutral Spine)", sets: 3, reps: "10-12" },
        { name: "Single-Leg Dumbbell RDLs (Light)", sets: 3, reps: "10-12" },
        { name: "Glute Bridges (Glute & Core Drive)", sets: 4, reps: "12-15" },
        { name: "McGill Bird-Dogs & Deadbugs", sets: 4, reps: "15-20" },
      ]
    : [
        { name: "Barbell Back Squat", sets: 4, reps: "6-8" },
        { name: "Romanian Deadlift", sets: 3, reps: "8-10" },
        { name: "Leg Press", sets: 3, reps: "10-12" },
        { name: "Hanging Leg Raises", sets: 4, reps: "15-20" },
      ];

  const pushExercises: Exercise[] = [
    { name: "Incline Dumbbell Press", sets: 4, reps: "8-10" },
    { name: "Standing Overhead Press", sets: 3, reps: "8-10" },
    { name: "Low-to-High Cable Flyes", sets: 3, reps: "12-15" },
    { name: "Triceps Rope Pushdowns", sets: 4, reps: "10-12" },
  ];

  const pullExercises: Exercise[] = [
    { name: "Chest-Supported Lat Pulldown", sets: 4, reps: "10-12" },
    { name: "Chest-Supported T-Bar Row", sets: 3, reps: "8-10" },
    { name: "Face Pulls", sets: 4, reps: "15-20" },
    { name: "Incline Bicep Curls", sets: 3, reps: "10-12" },
  ];

  const upperExercises: Exercise[] = [
    { name: "Incline Bench Press", sets: 4, reps: "8-10" },
    { name: "Lat Pulldowns", sets: 4, reps: "10-12" },
    { name: "Dumbbell Lateral Raises", sets: 4, reps: "12-15" },
    { name: "Hammer Curls", sets: 3, reps: "10-12" },
  ];

  const lowerExercises: Exercise[] = hasBackIssue
    ? [
        { name: "Leg Extensions", sets: 4, reps: "12-15" },
        { name: "Seated Hamstring Curls", sets: 4, reps: "12-15" },
        { name: "Glute Kickbacks / Bridges", sets: 4, reps: "12-15" },
        { name: "Plank Bracing Hold", sets: 3, reps: "45s" },
      ]
    : [
        { name: "Front Squat / Goblet Squat", sets: 4, reps: "8-10" },
        { name: "Lying Leg Curls", sets: 4, reps: "10-12" },
        { name: "Calf Raises", sets: 4, reps: "15-20" },
        { name: "Ab Wheel Rollouts", sets: 3, reps: "10-12" },
      ];

  const activeRecoveryExercises: Exercise[] = [
    { name: "Cat-Cow Spinal Mobility", sets: 3, reps: "10 reps" },
    { name: "McGill Bird-Dogs", sets: 3, reps: "10 reps/side" },
    { name: "Glute Bridges (Hold)", sets: 3, reps: "30s hold" },
    { name: "Light 20-min Walk", sets: 1, reps: "20 mins" },
  ];

  // 5-Day Weekly Protocol with Strategic Mid-Week Rest / Decompression Day
  if (days === 5) {
    return [
      {
        dayName: "Day 1",
        dayOfWeek: "Monday",
        focus: "Push (Chest & Shoulders)",
        exercises: pushExercises,
      },
      {
        dayName: "Day 2",
        dayOfWeek: "Tuesday",
        focus: "Pull (Lat Width & Upper Back)",
        exercises: pullExercises,
      },
      {
        dayName: "Day 3",
        dayOfWeek: "Wednesday",
        focus: hasBackIssue
          ? "Legs & Core (Sciatica Safe)"
          : "Legs & Core Density",
        exercises: legExercises,
      },
      {
        dayName: "Day 4",
        dayOfWeek: "Thursday",
        isRestDay: true,
        focus: hasBackIssue
          ? "☕ Active Recovery & Spine Decompression"
          : "☕ Complete Rest & Mobility",
        exercises: activeRecoveryExercises,
      },
      {
        dayName: "Day 5",
        dayOfWeek: "Friday",
        focus: "Upper Body Hypertrophy",
        exercises: upperExercises,
      },
      {
        dayName: "Day 6",
        dayOfWeek: "Saturday",
        focus: hasBackIssue
          ? "Lower Body & Core Stability"
          : "Lower Body Hypertrophy",
        exercises: lowerExercises,
      },
      {
        dayName: "Day 7",
        dayOfWeek: "Sunday",
        isRestDay: true,
        focus: "☕ Full System Recovery",
        exercises: activeRecoveryExercises,
      },
    ];
  }

  // 3-Day Protocol with Alternating Rest Days
  if (days === 3) {
    return [
      {
        dayName: "Day 1",
        dayOfWeek: "Monday",
        focus: "Push (Chest & Shoulders)",
        exercises: pushExercises,
      },
      {
        dayName: "Day 2",
        dayOfWeek: "Tuesday",
        isRestDay: true,
        focus: "☕ Active Recovery Day",
        exercises: activeRecoveryExercises,
      },
      {
        dayName: "Day 3",
        dayOfWeek: "Wednesday",
        focus: "Pull (Lat Width & Upper Back)",
        exercises: pullExercises,
      },
      {
        dayName: "Day 4",
        dayOfWeek: "Thursday",
        isRestDay: true,
        focus: "☕ Active Recovery Day",
        exercises: activeRecoveryExercises,
      },
      {
        dayName: "Day 5",
        dayOfWeek: "Friday",
        focus: hasBackIssue
          ? "Legs & Core (Sciatica Safe)"
          : "Legs & Core Density",
        exercises: legExercises,
      },
      {
        dayName: "Day 6",
        dayOfWeek: "Saturday",
        isRestDay: true,
        focus: "☕ Rest Day",
        exercises: activeRecoveryExercises,
      },
      {
        dayName: "Day 7",
        dayOfWeek: "Sunday",
        isRestDay: true,
        focus: "☕ Rest Day",
        exercises: activeRecoveryExercises,
      },
    ];
  }

  // Standard Fallback Split
  return [
    {
      dayName: "Day 1",
      dayOfWeek: "Monday",
      focus: "Push (Chest & Shoulders)",
      exercises: pushExercises,
    },
    {
      dayName: "Day 2",
      dayOfWeek: "Tuesday",
      focus: "Pull (Lat Width & Upper Back)",
      exercises: pullExercises,
    },
    {
      dayName: "Day 3",
      dayOfWeek: "Wednesday",
      focus: hasBackIssue
        ? "Legs & Core (Sciatica Safe)"
        : "Legs & Core Density",
      exercises: legExercises,
    },
  ];
}
