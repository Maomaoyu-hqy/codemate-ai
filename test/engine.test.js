import test from "node:test";
import assert from "node:assert/strict";
import { diagnoseJava, judgeExercise, retrieveLessons } from "../src/engine.js";
import { exercises, lessons, publicExercise } from "../src/catalog.js";

test("诊断缺失分号和字符串比较提示", () => {
  const result = diagnoseJava('String role = "student";\nif (role == "student") {\nSystem.out.println("ok")\n}');
  assert.ok(result.issues.some((item) => item.title.includes("分号")));
  assert.ok(result.issues.some((item) => item.title.includes("字符串")));
  assert.ok(result.score < 100);
});

test("诊断不会把注释中的无限循环当成代码", () => {
  const result = diagnoseJava("// while (true) {}\npublic class Main {}");
  assert.equal(result.issues.some((item) => item.title.includes("无限循环")), false);
});

test("选择题判题正确", () => {
  assert.equal(judgeExercise("q1", "0").body.passed, true);
  assert.equal(judgeExercise("q1", "2").body.passed, false);
});

test("代码题只进行静态结构检查", () => {
  const code = "for (int i = 1; i <= 5; i++) { System.out.println(i); }";
  const result = judgeExercise("q3", code).body;
  assert.equal(result.passed, true);
  assert.match(result.disclaimer, /不执行用户代码/);
});

test("数组求和同时接受下标循环和增强 for 循环", () => {
  const indexed = "for (int i = 0; i < nums.length; i++) { sum += nums[i]; }";
  const enhanced = "for (int num : nums) { sum += num; }";
  assert.equal(judgeExercise("q4", indexed).body.passed, true);
  assert.equal(judgeExercise("q4", enhanced).body.passed, true);
});

test("课程和题库覆盖 16 个 Java 知识领域", () => {
  assert.equal(lessons.length, 16);
  assert.equal(exercises.length, 32);
  const lessonIds = new Set(lessons.map((item) => item.id));
  assert.equal(lessonIds.size, 16);
  for (const lesson of lessons) {
    assert.equal(exercises.filter((item) => item.knowledge === lesson.id).length, 2);
  }
  assert.ok(exercises.every((item) => lessonIds.has(item.knowledge)));
});

test("公开题目不会泄露答案和判题规则", () => {
  const choice = publicExercise(exercises.find((item) => item.id === "q1"));
  const code = publicExercise(exercises.find((item) => item.id === "q3"));
  assert.equal("answer" in choice, false);
  assert.equal("explanation" in choice, false);
  assert.equal("checks" in code, false);
});

test("加法方法代码题可以正确判题", () => {
  const code = "static int add(int a, int b) { return a + b; }";
  assert.equal(judgeExercise("q14", code).body.passed, true);
});

test("课程检索返回相关知识", () => {
  const result = retrieveLessons("数组下标越界怎么办");
  assert.equal(result[0].id, "array");
});
