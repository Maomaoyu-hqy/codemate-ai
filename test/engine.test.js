import test from "node:test";
import assert from "node:assert/strict";
import { diagnoseJava, judgeExercise, retrieveLessons } from "../src/engine.js";

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

test("课程检索返回相关知识", () => {
  const result = retrieveLessons("数组下标越界怎么办");
  assert.equal(result[0].id, "array");
});
