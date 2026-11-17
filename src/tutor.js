import { demoTutorReply, retrieveLessons } from "./engine.js";

const clamp = (value, min, max, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, Math.round(parsed))) : fallback;
};

function learnerSummary(learnerContext = {}) {
  const stage = String(learnerContext.stage || "未设置").slice(0, 40);
  const goal = String(learnerContext.goal || "未设置").slice(0, 80);
  const weakPoints = Array.isArray(learnerContext.weakPoints)
    ? learnerContext.weakPoints.slice(0, 5).map((item) => String(item).slice(0, 30)).join("、")
    : "暂无";
  return `学习阶段：${stage}\n学习目标：${goal}\n当前薄弱点：${weakPoints || "暂无"}`;
}

export async function generateTutorReply({
  message,
  learnerContext = {},
  apiKey = "",
  apiBase = "https://api.openai.com/v1",
  model = "gpt-4o-mini",
  maxTokens = 700,
  fetchImpl = fetch
}) {
  const safeMessage = String(message || "").trim().slice(0, 3000);
  const context = retrieveLessons(safeMessage, 3);
  const sources = context.map(({ id, title }) => ({ id, title }));
  if (!apiKey) return { mode: "demo", answer: demoTutorReply(safeMessage, context), sources };

  const courseContext = context
    .map((item) => `【${item.title}】${item.summary}\n示例：${item.example}`)
    .join("\n\n") || "未检索到直接相关的课程片段。";
  const base = String(apiBase || "https://api.openai.com/v1").replace(/\/$/, "");
  const response = await fetchImpl(`${base}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: clamp(maxTokens, 200, 1200, 700),
      messages: [
        {
          role: "system",
          content: "你是 CodeMate AI，一位耐心、严谨的 Java 入门导师。使用简洁中文；先诊断学习者卡点，再提供分层提示；除非用户明确要求，不直接给完整答案；引用课程上下文时不得编造；不要声称执行过代码。"
        },
        { role: "system", content: `学习者画像：\n${learnerSummary(learnerContext)}` },
        { role: "system", content: `课程知识检索结果：\n${courseContext}` },
        { role: "user", content: safeMessage }
      ]
    })
  });
  if (!response.ok) throw new Error(`模型服务返回 ${response.status}`);
  const data = await response.json();
  return {
    mode: "api",
    answer: data.choices?.[0]?.message?.content || "模型未返回有效内容。",
    sources
  };
}
