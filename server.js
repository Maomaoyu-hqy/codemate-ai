import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { exercises, lessons, publicExercise } from "./src/catalog.js";
import { demoTutorReply, diagnoseJava, judgeExercise, retrieveLessons } from "./src/engine.js";
import { generateTutorReply } from "./src/tutor.js";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicRoot = join(root, "public");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";
const apiKey = process.env.AI_API_KEY || "";
const apiBase = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
const model = process.env.AI_MODEL || "gpt-4o-mini";
const maxTokens = process.env.AI_MAX_TOKENS || 700;

const json = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
};

const readBody = async (req) => {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 200_000) throw new Error("请求内容过大");
  }
  return raw ? JSON.parse(raw) : {};
};

async function api(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/status") return json(res, 200, { ok: true, aiMode: apiKey ? "api" : "demo", model: apiKey ? model : null });
  if (req.method === "GET" && url.pathname === "/api/lessons") return json(res, 200, { lessons });
  if (req.method === "GET" && url.pathname === "/api/exercises") return json(res, 200, { exercises: exercises.map(publicExercise) });
  if (req.method === "GET" && url.pathname === "/api/search") return json(res, 200, { results: retrieveLessons(url.searchParams.get("q") || "", 6), mode: "keyword" });
  if (req.method === "POST" && url.pathname === "/api/diagnose") {
    const { code = "" } = await readBody(req);
    return json(res, 200, diagnoseJava(String(code).slice(0, 50_000)));
  }
  if (req.method === "POST" && url.pathname === "/api/judge") {
    const { id, answer } = await readBody(req);
    const result = judgeExercise(id, answer);
    return json(res, result.status, result.body);
  }
  if (req.method === "POST" && url.pathname === "/api/tutor") {
    const { message = "", learnerContext = {} } = await readBody(req);
    if (!String(message).trim()) return json(res, 400, { error: "请输入问题" });
    try { return json(res, 200, await generateTutorReply({ message, learnerContext, apiKey, apiBase, model, maxTokens })); }
    catch (error) { return json(res, 502, { error: "模型服务暂时不可用", detail: error.message, fallback: demoTutorReply(message, retrieveLessons(message, 2)), mode: "fallback" }); }
  }
  return json(res, 404, { error: "接口不存在" });
}

const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json; charset=utf-8" };
async function staticFile(req, res, url) {
  const requested = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
  const safe = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const file = join(publicRoot, safe);
  if (!file.startsWith(publicRoot)) return json(res, 403, { error: "禁止访问" });
  try {
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": mime[extname(file)] || "application/octet-stream", "X-Content-Type-Options": "nosniff" });
    res.end(data);
  } catch { json(res, 404, { error: "页面不存在" }); }
}

export const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) await api(req, res, url); else await staticFile(req, res, url);
  } catch (error) {
    json(res, error instanceof SyntaxError ? 400 : 500, { error: error instanceof SyntaxError ? "JSON 格式错误" : "服务器内部错误" });
  }
});

if (process.argv[1] && fileURLToPath(import.meta.url) === normalize(process.argv[1])) {
  server.listen(port, host, () => console.log(`CodeMate AI 已启动：http://${host}:${port}（AI：${apiKey ? "API" : "演示模式"}）`));
}
