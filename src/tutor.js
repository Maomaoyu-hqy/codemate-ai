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
  maxTokens = 1600,
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
      max_tokens: clamp(maxTokens, 400, 2400, 1600),
      messages: [
        {
          role: "system",
          content: "你是 CodeMate AI，一位耐心、严谨的 Java 入门导师。使用简洁中文；先诊断学习者卡点，再提供分层提示；除非用户明确要求，不直接给完整答案；引用课程上下文时不得编造；不要声称执行过代码。回答必须完整收尾，不得留下只有标题而没有正文的章节；优先精炼，通常控制在 1200 个中文字以内；表格最多 6 行，示例代码只保留理解概念所需的最小片段。"
        },
        { role: "system", content: `学习者画像：\n${learnerSummary(learnerContext)}` },
        { role: "system", content: `课程知识检索结果：\n${courseContext}` },
        { role: "user", content: safeMessage }
      ]
    })
  });
  if (!response.ok) throw new Error(`模型服务返回 ${response.status}`);
  const data = await response.json();
  const choice = data.choices?.[0];
  const finishReason = choice?.finish_reason || "unknown";
  return {
    mode: "api",
    answer: choice?.message?.content || "模型未返回有效内容。",
    finishReason,
    truncated: finishReason === "length",
    usage: data.usage ? {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens
    } : undefined,
    sources
  };
}
