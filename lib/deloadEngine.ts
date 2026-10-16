export interface DeloadStatus {
  isDeloadWeek: boolean;
  currentWeekNumber: number;
  message: string;
}

export function checkDeloadStatus(startDateIso?: string): DeloadStatus {
  if (!startDateIso) {
    return {
      isDeloadWeek: false,
      currentWeekNumber: 1,
      message: "Week 1: Hypertrophy & Progression Phase",
    };
  }

  const startDate = new Date(startDateIso);
  const today = new Date();
  const diffInDays = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
  );
  const currentWeekNumber = Math.floor(diffInDays / 7) + 1;

  // Deload every 5th week to prevent fatigue & protect joints/sciatica
  const isDeloadWeek = currentWeekNumber % 5 === 0;

  return {
    isDeloadWeek,
    currentWeekNumber,
    message: isDeloadWeek
      ? "⚡ Deload Week Active: Working volume reduced by 30% for spinal & recovery protection."
      : `Week ${currentWeekNumber}: Regular Training Phase`,
  };
}
