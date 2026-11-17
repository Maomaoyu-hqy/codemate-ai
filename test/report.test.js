import test from "node:test";
import assert from "node:assert/strict";
import { analyzeLearningReport, toAiReportContext } from "../public/report.js";

test("没有答题时报告提供安全的学习起点", () => {
  const report = analyzeLearningReport({ profile: { stage: "zero" }, now: new Date("2026-11-17T12:00:00+08:00") });
  assert.equal(report.total, 0);
  assert.equal(report.topics.length, 16);
  assert.equal(report.nextTopic.id, "variables");
  assert.equal(report.days.length, 7);
  assert.equal(report.trendStatus, "insufficient");
  assert.equal(report.trendDelta, null);
});

test("报告能识别优势、薄弱点和下一步", () => {
  const report = analyzeLearningReport({
    attempts: [
      { id: "q1", knowledge: "variables", passed: true, score: 100, time: "2026-11-16T03:00:00.000Z" },
      { id: "q5", knowledge: "variables", passed: true, score: 100, time: "2026-11-16T04:00:00.000Z" },
      { id: "q3", knowledge: "loop", passed: false, score: 25, time: "2026-11-17T03:00:00.000Z" }
    ],
    mistakes: { q3: { id: "q3" } },
    profile: { stage: "basic" },
    now: new Date("2026-11-17T12:00:00+08:00")
  });
  assert.equal(report.total, 3);
  assert.equal(report.mastered, 1);
  assert.equal(report.strengths[0].id, "variables");
  assert.equal(report.weaknesses[0].id, "loop");
  assert.equal(report.nextTopic.id, "loop");
  assert.equal(report.mistakeCount, 1);
  assert.equal(report.trendStatus, "insufficient");
});

test("至少两组练习数据后才计算趋势", () => {
  const attempts = Array.from({ length: 10 }, (_, index) => ({
    id: `q${index + 1}`,
    knowledge: "variables",
    passed: true,
    score: index < 5 ? 60 : 80,
    time: new Date(2026, 10, index + 1).toISOString()
  }));
  const report = analyzeLearningReport({ attempts });
  assert.equal(report.trendStatus, "compared");
  assert.equal(report.trendDelta, 20);
});

test("发送给 AI 的报告不包含昵称和原始答案", () => {
  const report = analyzeLearningReport({
    attempts: [{ id: "q1", knowledge: "variables", passed: true, score: 100, time: "2026-11-17T03:00:00.000Z", answer: "不应上传" }],
    profile: { stage: "zero" }
  });
  const context = toAiReportContext(report, { nickname: "测试同学", stage: "zero", goal: "夯实 Java 基础" });
  const serialized = JSON.stringify(context);
  assert.doesNotMatch(serialized, /测试同学|不应上传/);
  assert.equal(context.totalAttempts, 1);
});
