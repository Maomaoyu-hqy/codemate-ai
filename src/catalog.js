export const lessons = [
  {
    id: "variables",
    title: "变量与数据类型",
    level: "入门",
    minutes: 12,
    keywords: ["变量", "类型", "int", "double", "String", "boolean"],
    summary: "变量是带有类型和名称的数据容器。Java 是静态类型语言，声明后类型固定。",
    example: "int age = 18;\nString name = \"CodeMate\";"
  },
  {
    id: "condition",
    title: "条件判断",
    level: "入门",
    minutes: 15,
    keywords: ["条件", "判断", "if", "else", "switch", "分支"],
    summary: "if/else 根据布尔条件选择执行路径。比较字符串内容应使用 equals，而不是 ==。",
    example: "if (score >= 60) {\n    System.out.println(\"及格\");\n} else {\n    System.out.println(\"继续加油\");\n}"
  },
  {
    id: "loop",
    title: "循环结构",
    level: "基础",
    minutes: 18,
    keywords: ["循环", "for", "while", "遍历", "次数"],
    summary: "for 适合已知次数的循环，while 适合由条件控制的循环。留意边界和循环变量更新。",
    example: "for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}"
  },
  {
    id: "array",
    title: "数组与下标",
    level: "基础",
    minutes: 20,
    keywords: ["数组", "下标", "索引", "length", "越界"],
    summary: "数组保存同类型的固定长度数据，下标从 0 开始，最后一个下标是 length - 1。",
    example: "int[] scores = {88, 92, 75};\nSystem.out.println(scores[0]);"
  },
  {
    id: "method",
    title: "方法与参数",
    level: "基础",
    minutes: 22,
    keywords: ["方法", "函数", "参数", "返回值", "return", "static"],
    summary: "方法把可复用逻辑封装起来，由返回类型、名称、参数列表和方法体组成。",
    example: "static int add(int a, int b) {\n    return a + b;\n}"
  },
  {
    id: "oop",
    title: "类与对象",
    level: "进阶",
    minutes: 25,
    keywords: ["类", "对象", "class", "new", "构造", "封装"],
    summary: "类描述属性和行为，对象是类的实例。构造方法用于初始化新对象。",
    example: "class Student {\n    String name;\n    Student(String name) { this.name = name; }\n}"
  }
];

export const exercises = [
  {
    id: "q1",
    type: "choice",
    knowledge: "variables",
    title: "变量声明",
    difficulty: "简单",
    prompt: "下面哪一项是合法的 Java 整数变量声明？",
    options: ["int score = 90;", "score int = 90;", "number score = 90;", "let score = 90;"],
    answer: "0",
    explanation: "Java 使用“类型 变量名 = 值”的形式声明变量。"
  },
  {
    id: "q2",
    type: "choice",
    knowledge: "condition",
    title: "字符串比较",
    difficulty: "简单",
    prompt: "比较两个 String 的内容是否相同，推荐使用什么？",
    options: ["a == b", "a.equals(b)", "a = b", "compare a b"],
    answer: "1",
    explanation: "== 比较引用是否相同；equals 比较 String 的内容。"
  },
  {
    id: "q3",
    type: "code",
    knowledge: "loop",
    title: "输出 1 到 5",
    difficulty: "简单",
    prompt: "补全 main 方法，用 for 循环依次输出 1 到 5（每行一个数字）。",
    starter: "public class Main {\n    public static void main(String[] args) {\n        // 在这里编写代码\n    }\n}",
    checks: [
      { pattern: "for\\s*\\(", message: "使用了 for 循环" },
      { pattern: "int\\s+\\w+\\s*=\\s*1", message: "循环从 1 开始" },
      { pattern: "<=\\s*5|<\\s*6", message: "循环边界覆盖到 5" },
      { pattern: "System\\.out\\.println", message: "使用 println 输出" }
    ],
    explanation: "参考写法：for (int i = 1; i <= 5; i++) { System.out.println(i); }"
  },
  {
    id: "q4",
    type: "code",
    knowledge: "array",
    title: "数组求和",
    difficulty: "中等",
    prompt: "给定 int[] nums，请使用循环计算所有元素之和，并将结果保存到变量 sum。",
    starter: "int[] nums = {2, 4, 6, 8};\nint sum = 0;\n// 在这里编写代码",
    checks: [
      { pattern: "for\\s*\\(|while\\s*\\(", message: "使用循环遍历" },
      { pattern: "nums\\.length", message: "使用数组长度控制边界" },
      { pattern: "sum\\s*\\+=|sum\\s*=\\s*sum\\s*\\+", message: "将元素累加到 sum" }
    ],
    explanation: "遍历下标 0 到 nums.length - 1，并用 sum += nums[i] 累加。"
  }
];

export function publicExercise(exercise) {
  const { answer, checks, explanation, ...safe } = exercise;
  return safe;
}
