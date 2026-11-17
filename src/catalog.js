export const lessons = [
  { id: "variables", title: "变量与数据类型", level: "入门", minutes: 12, keywords: ["变量", "类型", "int", "double", "boolean", "char"], summary: "变量是带有类型和名称的数据容器。Java 是静态类型语言，基本类型与引用类型的使用方式不同。", example: "int age = 18;\ndouble price = 9.9;\nboolean active = true;" },
  { id: "operators", title: "运算符与表达式", level: "入门", minutes: 15, keywords: ["运算符", "表达式", "算术", "逻辑", "自增", "优先级"], summary: "运算符用于计算、比较和组合条件。复杂表达式建议用括号明确顺序，避免依赖记忆优先级。", example: "int total = price * count;\nboolean ok = age >= 18 && active;" },
  { id: "condition", title: "条件判断", level: "入门", minutes: 15, keywords: ["条件", "判断", "if", "else", "switch", "分支"], summary: "if/else 和 switch 根据条件选择执行路径。比较 String 内容应使用 equals，而不是 ==。", example: "if (score >= 60) {\n    System.out.println(\"及格\");\n} else {\n    System.out.println(\"继续加油\");\n}" },
  { id: "loop", title: "循环结构", level: "入门", minutes: 18, keywords: ["循环", "for", "while", "break", "continue", "遍历"], summary: "for 适合已知次数的循环，while 适合条件控制的循环。留意边界、退出条件和循环变量更新。", example: "for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}" },
  { id: "array", title: "数组与下标", level: "基础", minutes: 20, keywords: ["数组", "下标", "索引", "length", "越界", "增强for"], summary: "数组保存固定长度的同类型数据，下标从 0 开始，最后一个下标是 length - 1。", example: "int[] scores = {88, 92, 75};\nSystem.out.println(scores[0]);" },
  { id: "string", title: "字符串处理", level: "基础", minutes: 22, keywords: ["字符串", "String", "equals", "substring", "StringBuilder", "不可变"], summary: "String 对象不可变；频繁拼接可使用 StringBuilder。比较内容用 equals，处理空值时注意空指针。", example: "String name = \"CodeMate\";\nboolean same = name.equals(\"CodeMate\");" },
  { id: "method", title: "方法、参数与返回值", level: "基础", minutes: 22, keywords: ["方法", "函数", "参数", "返回值", "return", "重载", "static"], summary: "方法封装可复用逻辑，由返回类型、名称、参数列表和方法体组成；同名不同参数称为重载。", example: "static int add(int a, int b) {\n    return a + b;\n}" },
  { id: "oop", title: "类、对象与构造方法", level: "基础", minutes: 25, keywords: ["类", "对象", "class", "new", "构造方法", "实例"], summary: "类描述属性和行为，对象是类的实例。构造方法与类同名且没有返回类型，用于初始化对象。", example: "class Student {\n    String name;\n    Student(String name) { this.name = name; }\n}" },
  { id: "encapsulation", title: "封装与访问控制", level: "进阶", minutes: 22, keywords: ["封装", "private", "public", "getter", "setter", "访问控制"], summary: "封装通过 private 隐藏内部状态，并用公开方法提供受控访问，有助于维持对象数据的有效性。", example: "private int age;\npublic void setAge(int age) {\n    if (age >= 0) this.age = age;\n}" },
  { id: "inheritance", title: "继承与 super", level: "进阶", minutes: 24, keywords: ["继承", "extends", "super", "父类", "子类", "复用"], summary: "子类通过 extends 继承父类可访问的成员；super 可调用父类构造方法或被覆盖的方法。", example: "class Dog extends Animal {\n    Dog(String name) { super(name); }\n}" },
  { id: "polymorphism", title: "多态与方法重写", level: "进阶", minutes: 26, keywords: ["多态", "重写", "override", "父类引用", "动态绑定", "接口"], summary: "父类引用可以指向子类对象，调用重写方法时执行对象实际类型的实现，这就是运行时多态。", example: "Animal pet = new Dog();\npet.speak(); // 调用 Dog 的实现" },
  { id: "exception", title: "异常处理", level: "进阶", minutes: 25, keywords: ["异常", "try", "catch", "finally", "throw", "throws"], summary: "异常用于表示非正常执行情况。捕获具体异常并合理恢复，不要用空 catch 隐藏问题。", example: "try {\n    int n = Integer.parseInt(text);\n} catch (NumberFormatException e) {\n    System.out.println(\"请输入整数\");\n}" },
  { id: "collections", title: "集合框架", level: "进阶", minutes: 30, keywords: ["集合", "List", "ArrayList", "Set", "Map", "HashMap"], summary: "List 保存有序元素，Set 强调不重复，Map 保存键值对。集合长度可动态变化。", example: "List<String> names = new ArrayList<>();\nnames.add(\"小码\");" },
  { id: "generics", title: "泛型", level: "进阶", minutes: 24, keywords: ["泛型", "类型参数", "尖括号", "List<String>", "类型安全"], summary: "泛型把类型作为参数，在编译期提供类型检查，减少强制类型转换和运行时类型错误。", example: "List<Integer> scores = new ArrayList<>();\nscores.add(95);" },
  { id: "io", title: "文件与输入输出", level: "拓展", minutes: 30, keywords: ["文件", "IO", "输入输出", "Files", "Path", "BufferedReader", "流"], summary: "现代 Java 可用 Path 和 Files 处理常见文件任务；资源应及时关闭，推荐 try-with-resources。", example: "Path path = Path.of(\"notes.txt\");\nList<String> lines = Files.readAllLines(path);" },
  { id: "lambda", title: "Lambda 与 Stream 入门", level: "拓展", minutes: 32, keywords: ["Lambda", "Stream", "函数式", "filter", "map", "collect"], summary: "Lambda 简化函数式接口实现；Stream 可声明式地过滤、转换和汇总数据，但不会自动修改原集合。", example: "List<Integer> even = nums.stream()\n    .filter(n -> n % 2 == 0)\n    .toList();" }
];

const choice = (id, knowledge, title, difficulty, prompt, options, answer, explanation) => ({
  id, type: "choice", knowledge, title, difficulty, prompt, options, answer, explanation
});

export const exercises = [
  choice("q1", "variables", "变量声明", "简单", "下面哪一项是合法的 Java 整数变量声明？", ["int score = 90;", "score int = 90;", "number score = 90;", "let score = 90;"], "0", "Java 使用“类型 变量名 = 值”的形式声明变量。"),
  choice("q2", "condition", "字符串比较", "简单", "比较两个 String 的内容是否相同，推荐使用什么？", ["a == b", "a.equals(b)", "a = b", "compare a b"], "1", "== 比较引用是否相同；equals 比较 String 的内容。"),
  {
    id: "q3", type: "code", knowledge: "loop", title: "输出 1 到 5", difficulty: "简单", prompt: "补全 main 方法，用 for 循环依次输出 1 到 5（每行一个数字）。", starter: "public class Main {\n    public static void main(String[] args) {\n        // 在这里编写代码\n    }\n}",
    checks: [
      { pattern: "for\\s*\\(", message: "使用了 for 循环" },
      { pattern: "int\\s+\\w+\\s*=\\s*1", message: "循环从 1 开始" },
      { pattern: "<=\\s*5|<\\s*6", message: "循环边界覆盖到 5" },
      { pattern: "System\\.out\\.println", message: "使用 println 输出" }
    ], explanation: "参考写法：for (int i = 1; i <= 5; i++) { System.out.println(i); }"
  },
  {
    id: "q4", type: "code", knowledge: "array", title: "数组求和", difficulty: "中等", prompt: "给定 int[] nums，请使用循环计算所有元素之和，并将结果保存到变量 sum。", starter: "int[] nums = {2, 4, 6, 8};\nint sum = 0;\n// 在这里编写代码",
    checks: [
      { pattern: "for\\s*\\(|while\\s*\\(", message: "使用循环遍历" },
      { pattern: "nums\\.length|for\\s*\\(\\s*int\\s+\\w+\\s*:\\s*nums\\s*\\)", message: "使用数组长度控制边界或增强 for 遍历" },
      { pattern: "sum\\s*\\+=|sum\\s*=\\s*sum\\s*\\+", message: "将元素累加到 sum" }
    ], explanation: "可以用下标循环配合 nums.length 和 nums[i]，也可以用增强 for 循环直接取得每个元素并累加到 sum。"
  },
  choice("q5", "variables", "基本类型", "简单", "下面哪个类型适合保存 true 或 false？", ["int", "String", "boolean", "double"], "2", "boolean 类型只有 true 和 false 两个值。"),
  choice("q6", "operators", "逻辑与运算", "简单", "表达式 age >= 18 && hasTicket 表示什么？", ["两个条件至少一个成立", "两个条件都成立", "条件取反", "给变量赋值"], "1", "&& 是逻辑与，左右两个布尔条件都为 true 时结果才为 true。"),
  choice("q7", "operators", "自增运算", "简单", "执行 int i = 3; i++; 后，i 的值是多少？", ["2", "3", "4", "编译错误"], "2", "i++ 会让变量 i 的值增加 1。"),
  choice("q8", "condition", "switch 分支", "中等", "switch 表达式最适合处理哪种情况？", ["按若干离散值选择分支", "无限循环", "创建对象", "捕获异常"], "0", "switch 适合根据一个值匹配多个明确分支。"),
  choice("q9", "loop", "跳出循环", "简单", "在循环中，哪个关键字会立即结束当前循环？", ["continue", "break", "returnType", "next"], "1", "break 会结束当前循环；continue 只跳过本次迭代。"),
  choice("q10", "array", "最后一个下标", "简单", "长度为 5 的数组，最后一个合法下标是多少？", ["5", "4", "1", "取决于元素值"], "1", "数组下标从 0 开始，因此最后一个下标是 length - 1，也就是 4。"),
  choice("q11", "string", "String 不可变", "中等", "关于 Java String，哪项说法正确？", ["修改字符会原地改变原对象", "String 对象不可变", "String 只能保存一个字符", "String 是基本类型"], "1", "String 是引用类型且对象不可变，许多操作会返回新字符串。"),
  choice("q12", "string", "高效拼接", "简单", "循环中需要大量拼接字符串，优先使用什么？", ["StringBuilder", "Math", "Integer", "Scanner"], "0", "StringBuilder 可减少反复创建临时 String 对象。"),
  choice("q13", "method", "返回值", "简单", "声明为 static int add(...) 的方法，正常结束时应返回什么类型？", ["String", "boolean", "int", "void"], "2", "方法声明的返回类型是 int，因此应返回 int 值。"),
  {
    id: "q14", type: "code", knowledge: "method", title: "编写加法方法", difficulty: "中等", prompt: "编写 static int add(int a, int b)，返回两个整数的和。", starter: "public class Main {\n    // 在这里编写 add 方法\n}",
    checks: [
      { pattern: "static\\s+int\\s+add\\s*\\(", message: "声明 static int add 方法" },
      { pattern: "int\\s+a\\s*,\\s*int\\s+b", message: "接收两个 int 参数" },
      { pattern: "return\\s+a\\s*\\+\\s*b", message: "返回 a 与 b 的和" }
    ], explanation: "参考写法：static int add(int a, int b) { return a + b; }"
  },
  choice("q15", "oop", "构造方法", "简单", "Java 构造方法的名称应当是什么？", ["固定叫 constructor", "与类名相同", "与变量名相同", "任意名称"], "1", "构造方法与类同名且没有返回类型。"),
  choice("q16", "oop", "创建对象", "简单", "创建 Student 对象的常见写法是哪项？", ["Student s = new Student();", "new = Student s;", "class Student();", "Student.create only;"], "0", "new Student() 调用构造方法并返回对象引用。"),
  choice("q17", "encapsulation", "隐藏内部状态", "简单", "为了隐藏类的内部字段，通常使用哪个访问修饰符？", ["public", "private", "static", "final"], "1", "private 限制字段只能在当前类内部直接访问。"),
  choice("q18", "encapsulation", "受控修改", "中等", "setter 方法中进行参数校验的主要好处是什么？", ["让代码无法编译", "保证对象状态有效", "自动创建数据库", "替代所有构造方法"], "1", "通过公开方法校验输入，可以防止对象进入无效状态。"),
  choice("q19", "inheritance", "声明继承", "简单", "Dog 继承 Animal 的正确声明是哪项？", ["class Dog extends Animal", "class Dog implements class Animal", "class Dog inherits Animal", "extends Dog Animal"], "0", "类继承使用 extends 关键字。"),
  choice("q20", "inheritance", "调用父类构造", "中等", "在子类构造方法中调用父类构造方法使用什么？", ["this.field", "parent()", "super(...) ", "base.new()"], "2", "super(...) 用于调用父类构造方法，并且通常必须是构造方法第一条语句。"),
  choice("q21", "polymorphism", "方法重写", "中等", "子类提供与父类同签名的实例方法称为什么？", ["重载", "重写", "封装", "泛型"], "1", "方法重写让子类提供自己的行为实现。"),
  choice("q22", "polymorphism", "父类引用", "中等", "Animal pet = new Dog(); 调用被 Dog 重写的 speak() 时执行哪一个实现？", ["Animal 的实现", "Dog 的实现", "随机选择", "一定编译错误"], "1", "实例方法根据对象实际类型动态绑定，因此执行 Dog 的重写实现。"),
  choice("q23", "exception", "捕获具体异常", "中等", "把文本转成整数失败时，常见异常类型是什么？", ["NumberFormatException", "FileNotFoundError", "LoopException", "StringSuccess"], "0", "Integer.parseInt 遇到非法数字文本会抛出 NumberFormatException。"),
  choice("q24", "exception", "finally 作用", "中等", "finally 代码块通常用于什么？", ["声明类", "执行清理逻辑", "创建泛型", "跳过所有异常"], "1", "finally 通常无论是否发生异常都会执行，适合必要的清理逻辑。"),
  choice("q25", "collections", "动态有序集合", "简单", "需要保存可动态增长、允许重复且保持顺序的元素，优先选择什么？", ["ArrayList", "HashSet", "HashMap", "int"], "0", "ArrayList 是常用的有序可变长度 List 实现。"),
  choice("q26", "collections", "键值映射", "简单", "需要根据学号查找学生姓名，哪种结构更合适？", ["List<Boolean>", "HashMap<String, String>", "double[]", "StringBuilder"], "1", "Map 用键映射值，适合按唯一键快速查找。"),
  choice("q27", "generics", "泛型目的", "中等", "使用 List<String> 的主要好处是什么？", ["只能运行一次", "提供编译期类型检查", "自动连接网络", "取消所有异常"], "1", "泛型让编译器检查元素类型，减少强制转换和类型错误。"),
  choice("q28", "generics", "菱形语法", "简单", "List<Integer> nums = new ArrayList<>(); 中 <> 表示什么？", ["数组下标", "根据左侧推断泛型类型", "逻辑比较", "注释"], "1", "菱形操作符允许编译器从上下文推断类型参数。"),
  choice("q29", "io", "资源自动关闭", "中等", "哪种结构可以在代码块结束时自动关闭可关闭资源？", ["try-with-resources", "switch", "do-while", "synchronized list"], "0", "try-with-resources 会自动关闭实现 AutoCloseable 的资源。"),
  choice("q30", "io", "现代文件路径", "简单", "现代 Java 中表示文件路径常用哪个类型？", ["Path", "Thread", "Math", "Character"], "0", "java.nio.file.Path 配合 Files 提供现代文件操作 API。"),
  choice("q31", "lambda", "Lambda 语法", "中等", "下面哪个是合法的单参数 Lambda 表达式？", ["n -> n * 2", "lambda n = n * 2", "n =>> 2", "function(n) Java"], "0", "Lambda 使用参数、箭头 -> 和表达式或代码块组成。"),
  choice("q32", "lambda", "Stream 过滤", "中等", "Stream 中保留满足条件的元素使用哪个操作？", ["filter", "println", "catch", "extends"], "0", "filter 接收判断条件并保留结果为 true 的元素。")
];

export function publicExercise(exercise) {
  const { answer, checks, explanation, ...safe } = exercise;
  return safe;
}
