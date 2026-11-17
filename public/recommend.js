export const KNOWLEDGE_LABELS = {
  variables: "变量与类型", operators: "运算符", condition: "条件判断", loop: "循环",
  array: "数组", string: "字符串", method: "方法", oop: "类与对象",
  encapsulation: "封装", inheritance: "继承", polymorphism: "多态", exception: "异常",
  collections: "集合", generics: "泛型", io: "文件 IO", lambda: "Lambda"
};

export const STAGE_TOPIC_ORDER = {
  zero: ["variables", "operators", "condition", "loop", "array", "string"],
  basic: ["condition", "loop", "array", "string", "method", "oop"],
  practice: ["method", "oop", "encapsulation", "inheritance", "exception", "collections"],
  oop: ["oop", "encapsulation", "inheritance", "polymorphism", "exception", "collections", "generics"]
};

function stableNumber(value = "") {
  return [...String(value)].reduce((total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0, 7);
}

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function selectDailyExercises({ exercises = [], attempts = [], profile = {}, dateKey = localDateKey() } = {}) {
  const requested = Number(profile.dailyGoal);
  const limit = [2, 4, 6].includes(requested) ? requested : 2;
  const stage = Object.hasOwn(STAGE_TOPIC_ORDER, profile.stage) ? profile.stage : "zero";
  const historicAttempts = attempts.filter((item) => {
    const date = new Date(item.time);
    return !Number.isNaN(date.getTime()) && localDateKey(date) < dateKey;
  });
  const weakTopics = Object.keys(KNOWLEDGE_LABELS).map((knowledge) => {
    const records = historicAttempts.filter((item) => item.knowledge === knowledge);
    const score = records.length ? records.reduce((sum, item) => sum + Number(item.score || 0), 0) / records.length : null;
    return { knowledge, score };
  }).filter((item) => item.score !== null && item.score < 80)
    .sort((a, b) => a.score - b.score)
    .map((item) => item.knowledge);
  const topicOrder = [...new Set([...weakTopics, ...STAGE_TOPIC_ORDER[stage], ...Object.keys(KNOWLEDGE_LABELS)])];
  const grouped = new Map(topicOrder.map((topic) => [topic, []]));
  exercises.forEach((exercise) => {
    if (!grouped.has(exercise.knowledge)) grouped.set(exercise.knowledge, []);
    grouped.get(exercise.knowledge).push(exercise);
  });
  const seed = stableNumber(`${dateKey}:${profile.stage || "zero"}:${profile.nickname || "learner"}`);
  grouped.forEach((items, topic) => {
    const shift = items.length ? (seed + stableNumber(topic)) % items.length : 0;
    grouped.set(topic, [...items.slice(shift), ...items.slice(0, shift)]);
  });
  const selected = [];
  let round = 0;
  while (selected.length < Math.min(limit, exercises.length)) {
    let added = false;
    for (const topic of topicOrder) {
      const candidate = grouped.get(topic)?.[round];
      if (candidate && !selected.some((item) => item.id === candidate.id)) {
        selected.push(candidate);
        added = true;
        if (selected.length >= limit) break;
      }
    }
    if (!added) break;
    round += 1;
  }
  return selected;
}
