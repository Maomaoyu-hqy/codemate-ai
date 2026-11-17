import test from "node:test";
import assert from "node:assert/strict";
import { server } from "../server.js";

test("服务可启动并提供首页和核心 API", async (t) => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  const page = await fetch(`${base}/`);
  assert.equal(page.status, 200);
  const pageHtml = await page.text();
  assert.match(pageHtml, /CodeMate AI/);
  assert.match(pageHtml, /个性化学习报告/);
  assert.match(pageHtml, /仅重置学习档案/);
  assert.match(pageHtml, /清除全部数据/);

  const reportScript = await fetch(`${base}/report.js`);
  assert.equal(reportScript.status, 200);
  assert.match(await reportScript.text(), /analyzeLearningReport/);

  const knowledgeStyles = await fetch(`${base}/knowledge.css`);
  assert.equal(knowledgeStyles.status, 200);
  assert.match(await knowledgeStyles.text(), /lesson-resource/);

  const status = await fetch(`${base}/api/status`).then((response) => response.json());
  assert.equal(status.ok, true);
  assert.equal(status.aiMode, "demo");

  const diagnosis = await fetch(`${base}/api/diagnose`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: "public class Main {}" })
  }).then((response) => response.json());
  assert.equal(diagnosis.score, 100);

  const tutor = await fetch(`${base}/api/tutor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "for 循环怎么写？" })
  }).then((response) => response.json());
  assert.equal(tutor.mode, "demo");
  assert.ok(tutor.sources.length > 0);

  const report = await fetch(`${base}/api/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reportContext: { totalAttempts: 2, accuracy: 50, nextTopic: "循环" } })
  }).then((response) => response.json());
  assert.equal(report.mode, "demo");
  assert.match(report.answer, /循环/);
});
