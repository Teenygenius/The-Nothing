export const SESSION_COMPLETION_QUOTES = [
  "Nothing completed successfully.",
  "You accomplished absolutely nothing.",
  "Productivity decreased successfully.",
  "Congratulations! Nothing happened.",
  "Your contribution to society today: 0%.",
  "You have wasted time with supreme elegance.",
  "Excellent work. Zero progress detected.",
  "Your inbox remains full, your desk messy, your soul peaceful.",
  "A truly remarkable display of inaction.",
  "The void acknowledges your dedication.",
  "Successfully postponed tomorrow's problems to the day after.",
  "Zero bugs introduced. Zero features shipped. Pure stability.",
  "Another moment subtracted from the global GDP."
];

export const MILESTONE_MESSAGES: Record<number, string> = {
  1: "🎉 Welcome to the Void! You completed your first session of doing nothing.",
  5: "🛋️ 5 Sessions Reached! Casual neglect is now a verified routine.",
  10: "📈 Double Digits! 10 sessions of unadulterated inactivity recorded.",
  25: "🏆 25 Sessions! Your dedication to doing nothing is getting suspiciously serious.",
  50: "🎖️ Half-Century! 50 sessions of certified non-achievement.",
  100: "👑 Century Club! 100 sessions of supreme stillness. You are a legend of nothing."
};

export const ANALYTICS_INSIGHTS = [
  "Your performance is statistically insignificant.",
  "Your Nothing activity is increasing at an exponential rate.",
  "You are becoming increasingly unproductive, and we salute you.",
  "You have spent more time doing nothing than doing something.",
  "Efficiency forecast: Approaching absolute zero.",
  "Enterprise impact: Saved company 0 kilowatt-hours of constructive effort.",
  "KPI status: Key Performance Inactivity optimized."
];

export function getRandomQuote(): string {
  const index = Math.floor(Math.random() * SESSION_COMPLETION_QUOTES.length);
  return SESSION_COMPLETION_QUOTES[index];
}

export function getAnalyticsInsight(totalSessions: number, totalMinutes: number): string {
  if (totalSessions === 0) {
    return "You have not even managed to do nothing yet. Get started immediately.";
  }
  if (totalMinutes > 60) {
    return "Over an hour of pure stillness! You have officially wasted more time than an all-hands meeting.";
  }
  if (totalSessions > 30) {
    return "Your commitment to zero output is unmatched across the enterprise.";
  }
  const index = Math.floor(Math.random() * ANALYTICS_INSIGHTS.length);
  return ANALYTICS_INSIGHTS[index];
}
