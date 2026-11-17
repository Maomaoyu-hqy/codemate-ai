import test from "node:test";
import assert from "node:assert/strict";
import { generateLearningReport, sanitizeReportContext } from "../src/learning-report.js";

const sample = {
  stage: "basic",
  goal: "完成学校课程与考试",
  totalAttempts: 6,
  accuracy: 67,
  averageScore: 72,
  masteredTopics: 2,
  mistakeCount: 2,
  trendStatus: "compared",
  trendDelta: 8,
  strengths: [{ topic: "变量与类型", score: 100 }],
  weaknesses: [{ topic: "循环", score: 40 }],
  nextTopic: "循环"
};

test("学习报告汇总数据会被限制在安全范围", () => {
  const safe = sanitizeReportContext({ ...sample, accuracy: 999, totalAttempts: -3, strengths: Array(10).fill({ topic: "超长知识点".repeat(20), score: 500 }) });
  assert.equal(safe.accuracy, 100);
  assert.equal(safe.totalAttempts, 0);
  assert.equal(safe.strengths.length, 4);
  assert.ok(safe.strengths[0].topic.length <= 30);
});

test("趋势数据不足时不会伪造持平结论", () => {
  const safe = sanitizeReportContext({ ...sample, trendStatus: "insufficient", trendDelta: 0 });
  assert.equal(safe.trendStatus, "insufficient");
  assert.equal(safe.trendDelta, null);
});

test("没有密钥时生成明确的本地学习总结", async () => {
  const result = await generateLearningReport({ reportContext: sample, fetchImpl: async () => { throw new Error("不应请求网络"); } });
  assert.equal(result.mode, "demo");
  assert.match(result.answer, /学习总结/);
  assert.match(result.answer, /循环/);
});

test("真实 AI 报告只发送汇总数据并限制输出长度", async () => {
  let captured;
  const result = await generateLearningReport({
    reportContext: sample,
    apiKey: "test-key",
    apiBase: "https://api.deepseek.com/",
    model: "deepseek-flash",
    maxTokens: 9999,
    fetchImpl: async (_url, options) => {
      captured = JSON.parse(options.body);
      return new Response(JSON.stringify({ choices: [{ message: { content: "## 学习总结\n继续巩固循环。" } }] }), { status: 200 });
    }
  });
  assert.equal(captured.max_tokens, 900);
  assert.match(captured.messages[1].content, /循环/);
  assert.equal(result.mode, "api");
});
