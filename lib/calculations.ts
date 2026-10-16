import { UserProfile, MacroTargets } from "../types";

export function calculateMacros(profile: UserProfile): MacroTargets {
  const { weightKg, heightCm, age, gender, goal } = profile;

  // Mifflin-St Jeor Equation
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr = gender === "male" ? bmr + 5 : bmr - 161;

  // Standard Moderate Activity Factor (1.55)
  let tdee = Math.round(bmr * 1.55);

  let targetCalories = tdee;
  if (goal === "muscle_gain") {
    targetCalories = Math.round(tdee * 1.1); // +10% surplus
  } else if (goal === "fat_loss") {
    targetCalories = Math.round(tdee * 0.8); // -20% deficit
  }

  // Macronutrient split calculation
  const proteinGrams = Math.round(weightKg * 2.2); // 2.2g per kg
  const fatsGrams = Math.round((targetCalories * 0.25) / 9); // 25% calories from fat
  const proteinCalories = proteinGrams * 4;
  const fatCalories = fatsGrams * 9;
  const remainingCalories = targetCalories - (proteinCalories + fatCalories);
  const carbsGrams = Math.max(0, Math.round(remainingCalories / 4));

  return {
    calories: targetCalories,
    proteinGrams,
    carbsGrams,
    fatsGrams,
  };
}
