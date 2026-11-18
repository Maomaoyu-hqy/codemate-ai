import { exercises, lessons, publicExercise } from "../../src/catalog.js";
import { demoTutorReply, diagnoseJava, judgeExercise, retrieveLessons } from "../../src/engine.js";
import { generateTutorReply } from "../../src/tutor.js";
import { demoLearningReport, generateLearningReport } from "../../src/learning-report.js";

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  }
});

async function readBody(request) {
  const raw = await request.text();
  if (raw.length > 200_000) throw new Error("请求内容过大");
  return raw ? JSON.parse(raw) : {};
}

export async function onRequest({ request, env }) {
  try {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;

    if (method === "GET" && path === "/api/status") {
      return json({ ok: true, aiMode: env.AI_API_KEY ? "api" : "demo", model: env.AI_API_KEY ? (env.AI_MODEL || "gpt-4o-mini") : null });
    }
    if (method === "GET" && path === "/api/lessons") return json({ lessons });
    if (method === "GET" && path === "/api/exercises") return json({ exercises: exercises.map(publicExercise) });
    if (method === "GET" && path === "/api/search") {
      return json({ results: retrieveLessons(url.searchParams.get("q") || "", 6), mode: "keyword" });
    }
    if (method === "POST" && path === "/api/diagnose") {
      const { code = "" } = await readBody(request);
      return json(diagnoseJava(String(code).slice(0, 50_000)));
    }
    if (method === "POST" && path === "/api/judge") {
      const { id, answer } = await readBody(request);
      const result = judgeExercise(id, answer);
      return json(result.body, result.status);
    }
    if (method === "POST" && path === "/api/tutor") {
      const { message = "", learnerContext = {} } = await readBody(request);
      if (!String(message).trim()) return json({ error: "请输入问题" }, 400);
      try {
        return json(await generateTutorReply({
          message,
          learnerContext,
          apiKey: env.AI_API_KEY || "",
          apiBase: env.AI_BASE_URL || "https://api.openai.com/v1",
          model: env.AI_MODEL || "gpt-4o-mini",
          maxTokens: env.AI_MAX_TOKENS || 1600
        }));
      } catch (error) {
        return json({
          error: "模型服务暂时不可用",
          detail: error.message,
          fallback: demoTutorReply(message, retrieveLessons(message, 2)),
          mode: "fallback"
        }, 502);
      }
    }
    if (method === "POST" && path === "/api/report") {
      const { reportContext = {} } = await readBody(request);
      try {
        return json(await generateLearningReport({
          reportContext,
          apiKey: env.AI_API_KEY || "",
          apiBase: env.AI_BASE_URL || "https://api.openai.com/v1",
          model: env.AI_MODEL || "gpt-4o-mini",
          maxTokens: env.AI_MAX_TOKENS || 1600
        }));
      } catch (error) {
        return json({ error: "学习总结暂时无法生成", detail: error.message, fallback: demoLearningReport(reportContext), mode: "fallback" }, 502);
      }
    }
    return json({ error: "接口不存在" }, 404);
  } catch (error) {
    return json({ error: error instanceof SyntaxError ? "JSON 格式错误" : "服务器内部错误" }, error instanceof SyntaxError ? 400 : 500);
  }
}
