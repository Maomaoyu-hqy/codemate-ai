import test from "node:test";
import assert from "node:assert/strict";
import { exercises } from "../src/catalog.js";
import { selectDailyExercises } from "../public/recommend.js";

test("每日推荐遵守学习者设置的题目数量", () => {
  const selected = selectDailyExercises({
    exercises,
    profile: { nickname: "小码", stage: "zero", dailyGoal: 4 },
    dateKey: "2026-11-17"
  });
  assert.equal(selected.length, 4);
  assert.equal(new Set(selected.map((item) => item.id)).size, 4);
  assert.deepEqual(selected.map((item) => item.knowledge), ["variables", "operators", "condition", "loop"]);
});

test("每日推荐会优先安排历史薄弱知识点", () => {
  const selected = selectDailyExercises({
    exercises,
    attempts: [{ id: "q23", knowledge: "exception", score: 0, time: "2026-11-16T08:00:00.000Z" }],
    profile: { nickname: "小码", stage: "zero", dailyGoal: 2 },
    dateKey: "2026-11-17"
  });
  assert.equal(selected[0].knowledge, "exception");
});

test("同一天推荐稳定，隔天会轮换同领域题目", () => {
  const input = { exercises, profile: { nickname: "小码", stage: "zero", dailyGoal: 2 } };
  const first = selectDailyExercises({ ...input, dateKey: "2026-11-17" }).map((item) => item.id);
  const again = selectDailyExercises({ ...input, dateKey: "2026-11-17" }).map((item) => item.id);
  const tomorrow = selectDailyExercises({ ...input, dateKey: "2026-11-18" }).map((item) => item.id);
  assert.deepEqual(first, again);
  assert.notDeepEqual(first, tomorrow);
});
