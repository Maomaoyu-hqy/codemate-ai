export const STAGE_LABELS = {
  zero: "零基础",
  basic: "学过一点",
  practice: "能做简单练习",
  oop: "正在学习面向对象"
};

export const STAGE_STARTS = {
  zero: "variables",
  basic: "loop",
  practice: "method",
  oop: "oop"
};

export function normalizeProfile(value = {}) {
  const nickname = String(value.nickname || "").trim().slice(0, 16) || "Java 学习者";
  const stage = Object.hasOwn(STAGE_LABELS, value.stage) ? value.stage : "zero";
  const goal = String(value.goal || "夯实 Java 基础").trim().slice(0, 60) || "夯实 Java 基础";
  const requestedDailyGoal = Number(value.dailyGoal);
  const dailyGoal = [2, 4, 6].includes(requestedDailyGoal) ? requestedDailyGoal : 2;
  return { nickname, stage, goal, dailyGoal };
}
