import test from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown } from "../public/markdown.js";

test("AI Markdown 可渲染标题、代码块和表格", () => {
  const html = renderMarkdown("## 标题\n\n```java\nint n = 1;\n```\n\n| 名称 | 作用 |\n|---|---|\n| i | 计数 |");
  assert.match(html, /<h4>标题<\/h4>/);
  assert.match(html, /<pre><code>int n = 1;<\/code><\/pre>/);
  assert.match(html, /<table>/);
  assert.match(html, /<td>计数<\/td>/);
});

test("AI Markdown 会转义潜在脚本和 HTML", () => {
  const html = renderMarkdown("<img src=x onerror=alert(1)>\n\n```html\n<script>alert(1)</script>\n```");
  assert.doesNotMatch(html, /<img/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;img/);
  assert.match(html, /&lt;script&gt;/);
});

test("AI Markdown 会忽略没有标题内容的孤立井号", () => {
  const html = renderMarkdown("## 学习总结\n\n继续保持。\n\n##\n");
  assert.match(html, /学习总结/);
  assert.doesNotMatch(html, />##</);
});
