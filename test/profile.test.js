import test from "node:test";
import assert from "node:assert/strict";
import { normalizeProfile, STAGE_LABELS, STAGE_STARTS } from "../public/profile.js";

test("学习档案会规范昵称、阶段和每日目标", () => {
  const profile = normalizeProfile({ nickname: "  小码同学  ", stage: "basic", goal: "完成学校课程", dailyGoal: "4" });
  assert.deepEqual(profile, { nickname: "小码同学", stage: "basic", goal: "完成学校课程", dailyGoal: 4 });
  assert.equal(STAGE_LABELS[profile.stage], "学过一点");
  assert.equal(STAGE_STARTS[profile.stage], "loop");
});

test("无效学习档案安全回退到入门默认值", () => {
  const profile = normalizeProfile({ nickname: "", stage: "unknown", dailyGoal: 100 });
  assert.equal(profile.nickname, "Java 学习者");
  assert.equal(profile.stage, "zero");
  assert.equal(profile.dailyGoal, 2);
});
