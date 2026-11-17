import { escapeHtml, renderMarkdown } from "./markdown.js";
import { normalizeProfile, STAGE_LABELS, STAGE_STARTS } from "./profile.js";
import { KNOWLEDGE_LABELS, STAGE_TOPIC_ORDER, localDateKey, selectDailyExercises } from "./recommend.js";

const initialState = { attempts: [], mistakes: {}, diagnoses: 0, streak: 1, lastVisit: null };
const state = loadState();
let exercises = [];
let lessons = [];
let practiceMode = "daily";

function loadState() {
  try { return { ...initialState, ...JSON.parse(localStorage.getItem("codemate-state") || "{}") }; }
  catch { return { ...initialState }; }
}
function saveState() { localStorage.setItem("codemate-state", JSON.stringify(state)); renderProfile(); }
function toast(message) { const el = document.querySelector("#toast"); el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2200); }
async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw Object.assign(new Error(data.error || "请求失败"), { data });
  return data;
}

function go(view) {
  document.querySelectorAll(".view").forEach((el) => el.classList.toggle("active", el.id === `view-${view}`));
  document.querySelectorAll(".nav-item").forEach((el) => el.classList.toggle("active", el.dataset.view === view));
  document.querySelector(".sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (view === "mistakes") renderMistakes();
}

function knowledgeStats() {
  const all = Object.keys(KNOWLEDGE_LABELS);
  return Object.fromEntries(all.map((id) => {
    const attempts = state.attempts.filter((item) => item.knowledge === id);
    const score = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length) : 0;
    return [id, score];
  }));
}

function learnerContext() {
  const weakPoints = Object.entries(knowledgeStats())
    .filter(([, score]) => score > 0)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([id]) => KNOWLEDGE_LABELS[id] || id);
  return {
    stage: state.profile ? STAGE_LABELS[normalizeProfile(state.profile).stage] : "未设置（按 Java 入门学习者讲解）",
    goal: state.profile?.goal || "完成每日练习并理解错题",
    weakPoints
  };
}

function renderProfile() {
  const profile = state.profile ? normalizeProfile(state.profile) : null;
  const attempts = state.attempts;
  const passed = attempts.filter((item) => item.passed).length;
  const accuracy = attempts.length ? `${Math.round((passed / attempts.length) * 100)}%` : "—";
  const stats = knowledgeStats();
  document.querySelector("#completedCount").textContent = attempts.length;
  document.querySelector("#accuracy").textContent = accuracy;
  document.querySelector("#mastered").textContent = Object.values(stats).filter((score) => score >= 80).length;
  document.querySelector("#diagnosisCount").textContent = state.diagnoses;
  document.querySelector("#streak").textContent = state.streak;
  const nickname = profile?.nickname || "Java 学习者";
  const stageLabel = profile ? STAGE_LABELS[profile.stage] : "尚未设置学习阶段";
  document.querySelector("#profileAvatar").textContent = nickname.slice(0, 1).toUpperCase();
  document.querySelector("#profileName").textContent = nickname;
  document.querySelector("#profileStage").textContent = stageLabel;
  const hour = new Date().getHours();
  const timeGreeting = hour < 6 ? "夜深了" : hour < 12 ? "早上好" : hour < 18 ? "下午好" : "晚上好";
  document.querySelector("#heroGreeting").textContent = `${timeGreeting}，${nickname} 👋`;
  document.querySelector("#tutorIntro").textContent = profile ? `将按“${stageLabel}”阶段讲解，并围绕“${profile.goal}”提供提示。` : "不是替你写答案，而是陪你把思路想明白。";
  const todayDone = new Set(attempts.filter((item) => localDateKey(new Date(item.time)) === localDateKey()).map((item) => item.id)).size;
  const dailyGoal = profile?.dailyGoal || 2;
  document.querySelector("#goalText").textContent = `完成 ${dailyGoal} 道练习`;
  document.querySelector("#goalProgress").style.width = `${Math.min(100, todayDone / dailyGoal * 100)}%`;
  document.querySelector("#goalMeta").textContent = `${Math.min(todayDone, dailyGoal)} / ${dailyGoal} 已完成`;
  const attempted = Object.entries(stats).filter(([, score]) => score > 0).sort((a, b) => a[1] - b[1]);
  const visibleKnowledge = [...new Set([...attempted.map(([id]) => id), ...STAGE_TOPIC_ORDER[profile?.stage || "zero"]])].slice(0, 8);
  document.querySelector("#knowledgeBars").innerHTML = visibleKnowledge.map((id) => `<div class="bar-row"><span>${KNOWLEDGE_LABELS[id]}</span><div class="bar-track"><i style="width:${stats[id]}%"></i></div><b>${stats[id]}%</b></div>`).join("");
  const target = attempted[0]?.[0] || STAGE_STARTS[profile?.stage] || "variables";
  const matching = lessons.find((item) => item.id === target);
  document.querySelector("#recommendation").innerHTML = matching ? `<div class="rec-row"><span class="rec-icon">${attempted.length ? "↗" : "1"}</span><div><b>${attempted.length ? "巩固薄弱点：" : "建议从这里开始："}${escapeHtml(matching.title)}</b><p>${escapeHtml(matching.summary)}</p></div></div>` : "加载课程后生成推荐。";
}

function openProfile() {
  const profile = state.profile ? normalizeProfile(state.profile) : normalizeProfile();
  document.querySelector("#profileNickname").value = state.profile ? profile.nickname : "";
  document.querySelector("#profileGoal").value = profile.goal;
  document.querySelector(`[name="stage"][value="${profile.stage}"]`).checked = true;
  document.querySelector(`[name="dailyGoal"][value="${profile.dailyGoal}"]`).checked = true;
  document.querySelector("#profileTitle").textContent = state.profile ? "编辑学习档案" : "创建你的学习档案";
  document.querySelector("#profileModal").hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(() => document.querySelector("#profileNickname").focus(), 0);
}

function closeProfile() {
  document.querySelector("#profileModal").hidden = true;
  document.body.style.overflow = "";
}

function dailyExercises() {
  return selectDailyExercises({ exercises, attempts: state.attempts, profile: state.profile ? normalizeProfile(state.profile) : normalizeProfile() });
}

function updatePracticeMeta(daily = dailyExercises()) {
  document.querySelector("#dailyQuestionCount").textContent = daily.length;
  document.querySelector("#allQuestionCount").textContent = exercises.length;
  document.querySelectorAll("[data-practice-mode]").forEach((button) => button.classList.toggle("active", button.dataset.practiceMode === practiceMode));
  const summary = document.querySelector("#practiceSummary");
  if (practiceMode === "all") {
    summary.textContent = `共 ${exercises.length} 道结构化题目，覆盖 ${lessons.length} 个 Java 知识领域。`;
    return;
  }
  const todayIds = new Set(state.attempts.filter((item) => localDateKey(new Date(item.time)) === localDateKey()).map((item) => item.id));
  const completed = daily.filter((item) => todayIds.has(item.id)).length;
  const stage = state.profile ? STAGE_LABELS[normalizeProfile(state.profile).stage] : "零基础";
  summary.textContent = `今日已完成 ${completed}/${daily.length} · 根据“${stage}”阶段和历史薄弱点推荐，明天会轮换题目。`;
}

function setPracticeMode(mode) {
  practiceMode = mode === "all" ? "all" : "daily";
  renderExercises();
}

function renderExercises(items) {
  const root = document.querySelector("#exerciseList");
  const daily = dailyExercises();
  const shown = items || (practiceMode === "all" ? exercises : daily);
  updatePracticeMeta(daily);
  root.innerHTML = shown.map((item, index) => {
    const answer = item.type === "choice"
      ? `<div class="options">${item.options.map((option, i) => `<button class="option" data-answer="${i}"><b>${String.fromCharCode(65 + i)}.</b> ${escapeHtml(option)}</button>`).join("")}</div><input type="hidden" class="answer-value">`
      : `<textarea class="code-answer" spellcheck="false">${escapeHtml(item.starter)}</textarea>`;
    return `<article class="exercise-card" data-id="${item.id}" data-knowledge="${item.knowledge}"><div class="exercise-meta"><span class="tag">${item.type === "code" ? "代码题" : "选择题"}</span><span class="tag">${item.difficulty}</span><span class="tag">${escapeHtml(KNOWLEDGE_LABELS[item.knowledge] || item.knowledge)}</span><span class="tag">第 ${index + 1} 题</span></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.prompt)}</p>${answer}<div class="exercise-actions"><button class="primary submit-answer">提交答案</button><span class="feedback"></span></div><div class="checks"></div></article>`;
  }).join("");
}

async function submitExercise(card) {
  const button = card.querySelector(".submit-answer");
  const answer = card.querySelector(".answer-value")?.value ?? card.querySelector(".code-answer")?.value ?? "";
  if (!answer.trim()) return toast("请先填写或选择答案");
  button.disabled = true;
  try {
    const result = await request("/api/judge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: card.dataset.id, answer }) });
    const record = { id: card.dataset.id, knowledge: result.knowledge, passed: result.passed, score: result.score, time: new Date().toISOString() };
    state.attempts.push(record);
    if (!result.passed) state.mistakes[card.dataset.id] = { ...record, count: (state.mistakes[card.dataset.id]?.count || 0) + 1 };
    else delete state.mistakes[card.dataset.id];
    saveState();
    updatePracticeMeta();
    const feedback = card.querySelector(".feedback");
    feedback.className = `feedback ${result.passed ? "pass" : "fail"}`;
    feedback.textContent = `${result.feedback} 得分 ${result.score}。${result.explanation}`;
    card.querySelector(".checks").innerHTML = (result.checks || []).map((check) => `<span class="check ${check.passed ? "pass" : ""}">${check.passed ? "✓" : "○"} ${escapeHtml(check.message)}</span>`).join("");
    toast(result.passed ? "做得好，已更新学习画像" : "已加入错题本");
  } catch (error) { toast(error.message); }
  finally { button.disabled = false; }
}

function renderMistakes() {
  const root = document.querySelector("#mistakeList");
  const items = Object.values(state.mistakes).map((record) => ({ ...record, exercise: exercises.find((item) => item.id === record.id) })).filter((item) => item.exercise);
  if (!items.length) { root.innerHTML = `<div class="panel empty-state"><h3>错题本还是空的</h3><p>完成练习后，答错的题会自动出现在这里。</p><button class="primary" data-go="practice">去做练习</button></div>`; return; }
  root.innerHTML = items.map((item) => `<article class="mistake-card"><div><span class="tag">${escapeHtml(item.exercise.difficulty)}</span><h3>${escapeHtml(item.exercise.title)}</h3><p>${escapeHtml(item.exercise.prompt)}</p><small>已错 ${item.count} 次 · 最近得分 ${item.score}</small></div><button class="ghost retry" data-id="${item.id}">重新练习</button></article>`).join("");
}

function renderLessons(items = lessons) {
  document.querySelector("#lessonList").innerHTML = items.length ? items.map((item) => `<article class="lesson-card"><span class="tag">${item.level} · ${item.minutes} 分钟</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p><pre>${escapeHtml(item.example)}</pre></article>`).join("") : `<div class="panel empty-state">没有匹配的知识卡片，试试更短的关键词。</div>`;
}

async function init() {
  try {
    const [status, lessonData, exerciseData] = await Promise.all([request("/api/status"), request("/api/lessons"), request("/api/exercises")]);
    lessons = lessonData.lessons; exercises = exerciseData.exercises;
    const mode = document.querySelector(".mode-pill");
    mode.classList.toggle("api", status.aiMode === "api");
    document.querySelector("#modeText").textContent = status.aiMode === "api" ? `AI API · ${status.model}` : "AI 演示模式";
    renderExercises(); renderLessons(); renderProfile();
    if (!state.profile) openProfile();
  } catch { document.querySelector("#modeText").textContent = "服务连接失败"; toast("无法连接后端服务"); }
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-view]"); if (nav) go(nav.dataset.view);
  const goButton = event.target.closest("[data-go]"); if (goButton) go(goButton.dataset.go);
  const option = event.target.closest(".option");
  if (option) { const card = option.closest(".exercise-card"); card.querySelectorAll(".option").forEach((el) => el.classList.remove("selected")); option.classList.add("selected"); card.querySelector(".answer-value").value = option.dataset.answer; }
  const submit = event.target.closest(".submit-answer"); if (submit) submitExercise(submit.closest(".exercise-card"));
  const chip = event.target.closest(".prompt-chip"); if (chip) { document.querySelector("#chatInput").value = chip.textContent; document.querySelector("#chatInput").focus(); }
  const retry = event.target.closest(".retry"); if (retry) { setPracticeMode("all"); go("practice"); document.querySelector(`[data-id="${retry.dataset.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }); }
  const practiceTab = event.target.closest("[data-practice-mode]"); if (practiceTab) setPracticeMode(practiceTab.dataset.practiceMode);
});
document.querySelector("#menuButton").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("open"));
document.querySelector("#profileButton").addEventListener("click", openProfile);
document.querySelector("#profileClose").addEventListener("click", closeProfile);
document.querySelector("#profileModal").addEventListener("click", (event) => { if (event.target.id === "profileModal" && state.profile) closeProfile(); });
document.querySelector("#profileForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  state.profile = { ...normalizeProfile(Object.fromEntries(form)), updatedAt: new Date().toISOString() };
  saveState();
  setPracticeMode("daily");
  closeProfile();
  toast(`欢迎你，${state.profile.nickname}！学习路线已更新`);
});
document.querySelector("#diagnoseButton").addEventListener("click", async () => {
  const button = document.querySelector("#diagnoseButton"); button.disabled = true; button.textContent = "诊断中…";
  try {
    const result = await request("/api/diagnose", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: document.querySelector("#codeInput").value }) });
    state.diagnoses += 1; saveState();
    document.querySelector("#codeScore").textContent = result.score;
    document.querySelector("#scoreRing").style.background = `conic-gradient(var(--green) ${result.score}%, #e8ece7 0)`;
    document.querySelector("#diagnosisResults").innerHTML = result.issues.map((item) => `<div class="issue ${item.severity}"><b>${item.severity === "error" ? "错误" : item.severity === "warning" ? "提醒" : item.severity === "success" ? "通过" : "建议"} · 第 ${item.line} 行：${escapeHtml(item.title)}</b><p>${escapeHtml(item.detail)}</p></div>`).join("");
  } catch (error) { toast(error.message); }
  finally { button.disabled = false; button.textContent = "开始诊断"; }
});
document.querySelector("#chatForm").addEventListener("submit", async (event) => {
  event.preventDefault(); const input = document.querySelector("#chatInput"); const message = input.value.trim(); if (!message) return;
  const root = document.querySelector("#chatMessages");
  root.insertAdjacentHTML("beforeend", `<div class="message user"><span>你</span><div><p>${escapeHtml(message)}</p></div></div>`); input.value = ""; root.scrollTop = root.scrollHeight;
  const loading = document.createElement("div"); loading.className = "message assistant"; loading.innerHTML = `<span>✦</span><div class="message-content"><b>CodeMate</b><div class="markdown-body"><p>正在思考…</p></div></div>`; root.append(loading);
  try {
    const data = await request("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, learnerContext: learnerContext() })
    });
    loading.querySelector(".markdown-body").innerHTML = renderMarkdown(data.answer);
    if (data.sources?.length) loading.querySelector(".message-content").insertAdjacentHTML("beforeend", `<small>参考课程：${data.sources.map((item) => escapeHtml(item.title)).join("、")} · ${data.mode === "demo" ? "演示模式" : "AI 生成"}</small>`);
  } catch (error) {
    const fallback = error.data?.fallback || `暂时无法回答：${error.message}`;
    loading.querySelector(".markdown-body").innerHTML = renderMarkdown(fallback);
    if (error.data?.mode === "fallback") loading.querySelector(".message-content").insertAdjacentHTML("beforeend", `<small class="fallback-note">真实模型暂时不可用，已切换到演示回答。</small>`);
  }
  root.scrollTop = root.scrollHeight;
});
document.querySelector("#searchForm").addEventListener("submit", async (event) => {
  event.preventDefault(); const q = document.querySelector("#searchInput").value.trim();
  if (!q) return renderLessons();
  try { const data = await request(`/api/search?q=${encodeURIComponent(q)}`); renderLessons(data.results); }
  catch (error) { toast(error.message); }
});

init();
