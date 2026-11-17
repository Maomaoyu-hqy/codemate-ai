import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("欢迎页提供产品介绍、动态演示和学习入口", async () => {
  const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  assert.match(html, /id="welcomeScreen"/);
  assert.match(html, /id="fireflyField"/);
  assert.match(html, /<h1><span>让每一次卡住，<\/span><em>都变成下一步。<\/em><\/h1>/);
  assert.match(html, /id="enterAppButton"/);
  assert.match(html, /data-demo="tutor"/);
  assert.match(html, /data-demo="diagnose"/);
  assert.match(html, /data-demo="path"/);
  assert.match(html, /id="introButton"/);
});

test("欢迎页脚本支持进入学习空间和返回介绍页", async () => {
  const script = await readFile(new URL("../public/welcome.js", import.meta.url), "utf8");
  assert.match(script, /function enterApp/);
  assert.match(script, /function showWelcome/);
  assert.match(script, /\/api\/status/);
  assert.match(script, /fireflyCount/);
});

test("AI 导师提供思考动画和逐字打印反馈", async () => {
  const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
  const motion = await readFile(new URL("../public/motion.css", import.meta.url), "utf8");
  assert.match(app, /typewriterMarkdown/);
  assert.match(app, /thinking-state/);
  assert.match(app, /is-printing/);
  assert.match(motion, /thinkingSpin/);
  assert.match(motion, /typing-plain/);
});
