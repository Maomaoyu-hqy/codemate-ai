import { KNOWLEDGE_LABELS, STAGE_TOPIC_ORDER, localDateKey } from "./recommend.js";

const average = (items, pick = (item) => item) => items.length
  ? Math.round(items.reduce((sum, item) => sum + Number(pick(item) || 0), 0) / items.length)
  : 0;

export function analyzeLearningReport({ attempts = [], mistakes = {}, diagnoses = 0, profile = {}, now = new Date() } = {}) {
  const validAttempts = attempts.filter((item) => item && Object.hasOwn(KNOWLEDGE_LABELS, item.knowledge));
  const total = validAttempts.length;
  const passed = validAttempts.filter((item) => item.passed).length;
  const topics = Object.entries(KNOWLEDGE_LABELS).map(([id, label]) => {
    const records = validAttempts.filter((item) => item.knowledge === id);
    const score = average(records, (item) => item.score);
    const accuracy = records.length ? Math.round(records.filter((item) => item.passed).length / records.length * 100) : 0;
    const status = !records.length ? "unstarted" : score >= 80 ? "strong" : score < 70 ? "weak" : "growing";
    return { id, label, attempts: records.length, score, accuracy, status };
  });
  const attemptedTopics = topics.filter((item) => item.attempts > 0);
  const strengths = attemptedTopics.filter((item) => item.score >= 80).sort((a, b) => b.score - a.score || b.attempts - a.attempts).slice(0, 4);
  const weaknesses = attemptedTopics.filter((item) => item.score < 70).sort((a, b) => a.score - b.score || b.attempts - a.attempts).slice(0, 4);
  const stage = Object.hasOwn(STAGE_TOPIC_ORDER, profile.stage) ? profile.stage : "zero";
  const preferred = STAGE_TOPIC_ORDER[stage] || STAGE_TOPIC_ORDER.zero;
  const nextTopic = weaknesses[0] || preferred.map((id) => topics.find((item) => item.id === id)).find((item) => item?.attempts === 0) || topics.find((item) => item.attempts === 0) || topics[0];
  const recent = validAttempts.slice(-5);
  const previous = validAttempts.slice(-10, -5);
  const recentScore = average(recent, (item) => item.score);
  const previousScore = average(previous, (item) => item.score);
  const trendDelta = previous.length ? recentScore - previousScore : 0;
  const days = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(now);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (6 - offset));
    const key = localDateKey(date);
    const records = validAttempts.filter((item) => {
      const itemDate = new Date(item.time);
      return !Number.isNaN(itemDate.getTime()) && localDateKey(itemDate) === key;
    });
    return { key, label: `${date.getMonth() + 1}/${date.getDate()}`, count: records.length, score: average(records, (item) => item.score) };
  });
  return {
    total,
    passed,
    accuracy: total ? Math.round(passed / total * 100) : 0,
    averageScore: average(validAttempts, (item) => item.score),
    mastered: topics.filter((item) => item.attempts >= 2 && item.score >= 80).length,
    diagnoses: Number(diagnoses) || 0,
    mistakeCount: Object.keys(mistakes || {}).length,
    topics,
    strengths,
    weaknesses,
    unstarted: topics.filter((item) => item.attempts === 0),
    nextTopic,
    recentScore,
    trendDelta,
    days
  };
}

export function toAiReportContext(report, profile = {}) {
  return {
    stage: String(profile.stage || "zero").slice(0, 20),
    goal: String(profile.goal || "夯实 Java 基础").slice(0, 60),
    totalAttempts: report.total,
    accuracy: report.accuracy,
    averageScore: report.averageScore,
    masteredTopics: report.mastered,
    mistakeCount: report.mistakeCount,
    trendDelta: report.trendDelta,
    strengths: report.strengths.map((item) => ({ topic: item.label, score: item.score })).slice(0, 4),
    weaknesses: report.weaknesses.map((item) => ({ topic: item.label, score: item.score })).slice(0, 4),
    nextTopic: report.nextTopic?.label || "变量与类型"
  };
}
