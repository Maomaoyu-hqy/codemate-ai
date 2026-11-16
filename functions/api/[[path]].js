import { exercises, lessons, publicExercise } from "../../src/catalog.js";
import { demoTutorReply, diagnoseJava, judgeExercise, retrieveLessons } from "../../src/engine.js";

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

async function tutor(message, env) {
  const context = retrieveLessons(message, 3);
  const apiKey = env.AI_API_KEY || "";
  if (!apiKey) {
    return {
      mode: "demo",
      answer: demoTutorReply(message, context),
      sources: context.map(({ id, title }) => ({ id, title }))
    };
  }

  const apiBase = (env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = env.AI_MODEL || "gpt-4o-mini";
  const courseContext = context
    .map((item) => `【${item.title}】${item.summary}\n示例：${item.example}`)
    .join("\n\n") || "未检索到直接相关的课程片段。";

  const response = await fetch(`${apiBase}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages: [
        { role: "system", content: "你是 CodeMate AI，一位耐心的 Java 入门导师。用简洁中文回答；优先启发式提示，不直接替学生完成整题；不要声称执行过代码。" },
        { role: "system", content: `课程知识检索结果：\n${courseContext}` },
        { role: "user", content: String(message).slice(0, 5000) }
      ]
    })
  });
  if (!response.ok) throw new Error(`模型服务返回 ${response.status}`);
  const data = await response.json();
  return {
    mode: "api",
    answer: data.choices?.[0]?.message?.content || "模型未返回有效内容。",
    sources: context.map(({ id, title }) => ({ id, title }))
  };
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
      const { message = "" } = await readBody(request);
      if (!String(message).trim()) return json({ error: "请输入问题" }, 400);
      try {
        return json(await tutor(message, env));
      } catch (error) {
        return json({
          error: "模型服务暂时不可用",
          detail: error.message,
          fallback: demoTutorReply(message, retrieveLessons(message, 2)),
          mode: "fallback"
        }, 502);
      }
    }
    return json({ error: "接口不存在" }, 404);
  } catch (error) {
    return json({ error: error instanceof SyntaxError ? "JSON 格式错误" : "服务器内部错误" }, error instanceof SyntaxError ? 400 : 500);
  }
}
