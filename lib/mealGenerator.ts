import { MacroTargets, PrimaryGoal } from "../types";

export interface MealItem {
  name: string;
  portion: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

export interface Meal {
  mealName: string;
  items: MealItem[];
}

export interface Supplement {
  name: string;
  dosage: string;
  timing: string;
  purpose: string;
}

export interface NutritionPlan {
  meals: Meal[];
  supplements: Supplement[];
}

export function generateNutritionPlan(
  macros: MacroTargets,
  goal: PrimaryGoal,
): NutritionPlan {
  const { calories, proteinGrams, carbsGrams, fatsGrams } = macros;

  const eggWhitesGrams = Math.round((proteinGrams * 0.25) / 0.11);
  const oatsGrams = Math.round((carbsGrams * 0.3) / 0.6);
  const chickenGrams = Math.round((proteinGrams * 0.35) / 0.31);
  const riceGrams = Math.round((carbsGrams * 0.4) / 0.28);
  const fishGrams = Math.round((proteinGrams * 0.3) / 0.25);
  const potatoGrams = Math.round((carbsGrams * 0.3) / 0.17);
  const yogurtGrams = 200;
  const almondsGrams = Math.max(10, Math.round(fatsGrams * 0.4));

  const meals: Meal[] = [
    {
      mealName: "Meal 1: Anabolic Breakfast",
      items: [
        {
          name: "Oatmeal",
          portion: `${oatsGrams}g (dry weight)`,
          protein: Math.round(oatsGrams * 0.13),
          carbs: Math.round(oatsGrams * 0.6),
          fats: Math.round(oatsGrams * 0.07),
          calories: Math.round(oatsGrams * 3.89),
        },
        {
          name: "Egg Whites + Whole Egg",
          portion: `${eggWhitesGrams}g whites + 1 egg`,
          protein: Math.round(proteinGrams * 0.25),
          carbs: 2,
          fats: 5,
          calories: Math.round(proteinGrams * 0.25 * 4 + 50),
        },
      ],
    },
    {
      mealName: "Meal 2: Pre-Workout Fuel",
      items: [
        {
          name: "Grilled Chicken Breast",
          portion: `${chickenGrams}g (cooked weight)`,
          protein: Math.round(chickenGrams * 0.31),
          carbs: 0,
          fats: 4,
          calories: Math.round(chickenGrams * 1.65),
        },
        {
          name: "Jasmine Rice",
          portion: `${riceGrams}g (cooked weight)`,
          protein: Math.round(riceGrams * 0.025),
          carbs: Math.round(riceGrams * 0.28),
          fats: 0,
          calories: Math.round(riceGrams * 1.3),
        },
      ],
    },
    {
      mealName: "Meal 3: Post-Workout Recovery",
      items: [
        {
          name: "Lean Beef / Tilapia / Salmon",
          portion: `${fishGrams}g (cooked weight)`,
          protein: Math.round(fishGrams * 0.25),
          carbs: 0,
          fats: 6,
          calories: Math.round(fishGrams * 1.5),
        },
        {
          name: "Sweet Potato",
          portion: `${potatoGrams}g`,
          protein: 2,
          carbs: Math.round(potatoGrams * 0.17),
          fats: 0,
          calories: Math.round(potatoGrams * 0.86),
        },
      ],
    },
    {
      mealName: "Meal 4: Evening Recovery Snack",
      items: [
        {
          name: "Non-fat Greek Yogurt or Whey",
          portion: `${yogurtGrams}g yogurt or 1 scoop Whey`,
          protein: 24,
          carbs: 8,
          fats: 0,
          calories: 130,
        },
        {
          name: "Almonds / Peanut Butter",
          portion: `${almondsGrams}g`,
          protein: Math.round(almondsGrams * 0.2),
          carbs: Math.round(almondsGrams * 0.2),
          fats: Math.round(almondsGrams * 0.5),
          calories: Math.round(almondsGrams * 5.8),
        },
      ],
    },
  ];

  const supplements: Supplement[] = [
    {
      name: "Creatine Monohydrate",
      dosage: "5g daily",
      timing: "Post-workout",
      purpose: "Power output, muscle cell hydration, and ATP recovery.",
    },
    {
      name: "Whey Isolate Protein",
      dosage: "1-2 scoops",
      timing: "Post-workout / Between meals",
      purpose: "Fast-absorbing protein to reach daily macro target.",
    },
    {
      name: "Electrolytes",
      dosage: "1 scoop in water",
      timing: "Intra-workout",
      purpose: "Maintains muscular hydration and pump strength.",
    },
  ];

  if (goal === "fat_loss") {
    supplements.push({
      name: "L-Carnitine / Caffeine",
      dosage: "200mg Caffeine",
      timing: "30 mins pre-workout",
      purpose: "Supports energy output during caloric deficit.",
    });
  } else {
    supplements.push({
      name: "Citrulline Malate",
      dosage: "6-8g",
      timing: "20 mins pre-workout",
      purpose: "Maximizes nitric oxide production and vasodilation.",
    });
  }

  return { meals, supplements };
}
