import test from "node:test";
import assert from "node:assert/strict";
import { generateTutorReply } from "../src/tutor.js";

test("真实导师接口携带学习画像、课程检索结果并限制输出长度", async () => {
  let capturedUrl = "";
  let capturedBody = null;
  const fakeFetch = async (url, options) => {
    capturedUrl = url;
    capturedBody = JSON.parse(options.body);
    return new Response(JSON.stringify({
      choices: [{ finish_reason: "stop", message: { content: "先复习循环边界，再尝试写一个 0 到 4 的循环。" } }],
      usage: { prompt_tokens: 120, completion_tokens: 30, total_tokens: 150 }
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  const result = await generateTutorReply({
    message: "for 循环为什么会越界？",
    learnerContext: { stage: "学过一点", goal: "掌握循环", weakPoints: ["循环", "数组"] },
    apiKey: "test-key",
    apiBase: "https://api.deepseek.com/",
    model: "deepseek-flash",
    maxTokens: 9999,
    fetchImpl: fakeFetch
  });

  assert.equal(capturedUrl, "https://api.deepseek.com/chat/completions");
  assert.equal(capturedBody.model, "deepseek-flash");
  assert.equal(capturedBody.max_tokens, 2400);
  assert.match(capturedBody.messages[1].content, /学过一点/);
  assert.match(capturedBody.messages[1].content, /循环、数组/);
  assert.match(capturedBody.messages[2].content, /循环结构/);
  assert.equal(result.mode, "api");
  assert.equal(result.finishReason, "stop");
  assert.equal(result.truncated, false);
  assert.equal(result.usage.completionTokens, 30);
  assert.ok(result.sources.some((item) => item.id === "loop"));
});

test("模型因长度停止时返回明确截断标记", async () => {
  const result = await generateTutorReply({
    message: "用表格详细解释类和对象",
    apiKey: "test-key",
    fetchImpl: async () => new Response(JSON.stringify({
      choices: [{ finish_reason: "length", message: { content: "## 类与对象\n回答尚未完成" } }]
    }), { status: 200, headers: { "Content-Type": "application/json" } })
  });

  assert.equal(result.finishReason, "length");
  assert.equal(result.truncated, true);
});

test("没有密钥时明确返回演示模式且不请求外部服务", async () => {
  const result = await generateTutorReply({
    message: "数组下标是什么？",
    fetchImpl: async () => { throw new Error("不应调用网络"); }
  });
  assert.equal(result.mode, "demo");
  assert.ok(result.answer.length > 0);
  assert.ok(result.sources.some((item) => item.id === "array"));
});
