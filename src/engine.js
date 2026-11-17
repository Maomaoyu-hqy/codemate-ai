import { exercises, lessons } from "./catalog.js";

const stripCommentsAndStrings = (code = "") => code
  .replace(/\/\*[\s\S]*?\*\//g, " ")
  .replace(/\/\/.*$/gm, " ")
  .replace(/"(?:\\.|[^"\\])*"/g, "\"\"");

export function diagnoseJava(code = "") {
  const clean = stripCommentsAndStrings(code);
  const issues = [];
  const add = (severity, line, title, detail, knowledge) =>
    issues.push({ severity, line, title, detail, knowledge });

  const lines = code.split(/\r?\n/);
  lines.forEach((line, index) => {
    const n = index + 1;
    if (/System\.out\.print(ln)?\s*\([^;]*\)\s*$/.test(line.trim())) {
      add("error", n, "可能缺少分号", "Java 语句通常需要以分号结束。", "variables");
    }
    if (/\bString\b.*==|==.*\bString\b|==\s*"/.test(line) || /\.equals\s*\([^)]*\)\s*==/.test(line)) {
      add("warning", n, "留意字符串比较", "比较字符串内容请优先使用 equals()。", "condition");
    }
    if (/catch\s*\(\s*Exception\b/.test(line)) {
      add("info", n, "异常捕获范围较宽", "学习阶段可用；实际项目建议捕获更具体的异常类型。", "oop");
    }
    if (/System\.out\.println\s*\(\s*["'].*(password|token|secret|密码)/i.test(line)) {
      add("warning", n, "疑似输出敏感信息", "不要在日志或控制台输出密码、令牌等敏感数据。", "variables");
    }
  });

  if (/for\s*\(\s*;\s*;\s*\)|while\s*\(\s*true\s*\)/.test(clean) && !/\bbreak\s*;/.test(clean)) {
    add("warning", 1, "可能存在无限循环", "循环条件恒真且未发现 break，请确认退出条件。", "loop");
  }
  if (/\.length\s*\(\s*\)/.test(clean) && /\[|int\[\]|String\[\]/.test(clean)) {
    add("error", 1, "数组长度写法可能错误", "Java 数组使用 length 属性，不是 length() 方法。", "array");
  }

  let balance = 0;
  for (const char of clean) {
    if (char === "{") balance++;
    if (char === "}") balance--;
  }
  if (balance !== 0) add("error", lines.length, "花括号不匹配", "请检查 { 和 } 是否成对出现。", "variables");
  if (!issues.length) add("success", 1, "未发现常见问题", "静态规则检查通过。仍建议在本地 JDK 中编译并运行测试。", "variables");

  return {
    issues,
    score: Math.max(0, 100 - issues.reduce((sum, item) => sum + ({ error: 22, warning: 10, info: 3 }[item.severity] || 0), 0)),
    disclaimer: "本诊断仅做静态文本规则检查，不会编译或执行代码，也不能替代完整编译器与安全审计。"
  };
}

export function judgeExercise(id, answer = "") {
  const exercise = exercises.find((item) => item.id === id);
  if (!exercise) return { status: 404, body: { error: "题目不存在" } };
  if (exercise.type === "choice") {
    const passed = String(answer) === exercise.answer;
    return { status: 200, body: { passed, score: passed ? 100 : 0, feedback: passed ? "回答正确！" : "还差一点，再结合解析想一想。", explanation: exercise.explanation, knowledge: exercise.knowledge } };
  }
  const results = exercise.checks.map((check) => ({
    passed: new RegExp(check.pattern, "m").test(stripCommentsAndStrings(String(answer))),
    message: check.message
  }));
  const passedCount = results.filter((item) => item.passed).length;
  const passed = passedCount === results.length;
  return {
    status: 200,
    body: {
      passed,
      score: Math.round((passedCount / results.length) * 100),
      feedback: passed ? "关键结构检查通过！" : "部分关键结构尚未满足，请根据检查项修改。",
      checks: results,
      explanation: exercise.explanation,
      knowledge: exercise.knowledge,
      disclaimer: "为保障服务器安全，MVP 不执行用户代码；结果来自静态结构规则，不等同于真实编译运行。"
    }
  };
}

export function retrieveLessons(query = "", limit = 3) {
  const normalizedQuery = String(query).toLowerCase();
  const words = normalizedQuery.match(/[\u4e00-\u9fa5]{1,4}|[a-zA-Z][\w.]*/g) || [];
  return lessons
    .map((lesson) => {
      const haystack = `${lesson.title} ${lesson.summary} ${lesson.keywords.join(" ")} ${lesson.example}`.toLowerCase();
      const wordScore = words.reduce((sum, word) => sum + (haystack.includes(word) ? (word.length > 1 ? 2 : 1) : 0), 0);
      const keywordScore = lesson.keywords.reduce((sum, keyword) => sum + (normalizedQuery.includes(keyword.toLowerCase()) ? 4 : 0), 0);
      const score = wordScore + keywordScore;
      return { lesson, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.lesson);
}

export function demoTutorReply(message, context = []) {
  const found = context.length ? context : retrieveLessons(message, 2);
  if (!found.length) {
    return "我目前处于演示模式。可以问我 Java 变量、循环、数组、面向对象、异常、集合、泛型、文件 IO 或 Lambda，例如：‘为什么数组下标从 0 开始？’";
  }
  const primary = found[0];
  return `先给你一个提示：${primary.summary}\n\n可以从这个例子观察：\n${primary.example}\n\n试着用自己的话解释一次，再写一个稍有变化的小例子。如果仍不明白，可以继续告诉我具体卡在哪一行。`;
}
