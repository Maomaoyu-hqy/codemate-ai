import test from "node:test";
import assert from "node:assert/strict";
import { onRequest } from "../functions/api/[[path]].js";
import worker from "../worker.js";

const call = (path, init = {}) => onRequest({
  request: new Request(`https://codemate.pages.dev${path}`, init),
  env: {}
});

test("Cloudflare Pages API 兼容入口可用", async () => {
  const status = await call("/api/status").then((response) => response.json());
  assert.equal(status.ok, true);
  assert.equal(status.aiMode, "demo");

  const judge = await call("/api/judge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: "q1", answer: "0" })
  }).then((response) => response.json());
  assert.equal(judge.passed, true);
});

test("Cloudflare Worker 同时路由 API 和静态资源", async () => {
  const env = {
    ASSETS: { fetch: async () => new Response("STATIC_OK") }
  };
  const apiResponse = await worker.fetch(new Request("https://codemate.workers.dev/api/status"), env);
  assert.equal((await apiResponse.json()).ok, true);

  const staticResponse = await worker.fetch(new Request("https://codemate.workers.dev/"), env);
  assert.equal(await staticResponse.text(), "STATIC_OK");
});

test("学习报告接口在 Cloudflare Pages 环境可用", async () => {
  const report = await call("/api/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reportContext: { totalAttempts: 3, accuracy: 67, nextTopic: "数组" } })
  }).then((response) => response.json());
  assert.equal(report.mode, "demo");
  assert.match(report.answer, /数组/);
});
