const COURSE_RESOURCES = {
  beginner: {
    platform: "中国大学MOOC",
    course: "浙江大学《零基础学Java语言》",
    provider: "浙江大学",
    url: "https://www.icourse163.org/course/ZJU-1001541001?from=searchPage"
  },
  advanced: {
    platform: "中国大学MOOC",
    course: "北京大学《Java程序设计》",
    provider: "北京大学",
    url: "https://www.icourse163.org/course/PKU-1001941004?outVendor=zw_mooc_pclszykctj_"
  }
};

const COURSE_TOPICS = {
  variables: "基础语法与变量", operators: "运算符与表达式", condition: "分支控制", loop: "循环控制",
  array: "数组", string: "字符串", method: "方法与参数", oop: "类与对象",
  encapsulation: "封装与访问控制", inheritance: "继承", polymorphism: "多态", exception: "异常处理",
  collections: "Java 工具类与集合", generics: "泛型与类型安全", io: "流与文件", lambda: "Java 高级语法与函数式思维"
};

const BEGINNER_TOPICS = new Set(["variables", "operators", "condition", "loop", "array", "string", "method"]);

const lessonCatalog = [
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

export const lessons = lessonCatalog.map((lesson) => ({
  ...lesson,
  resource: {
    ...(BEGINNER_TOPICS.has(lesson.id) ? COURSE_RESOURCES.beginner : COURSE_RESOURCES.advanced),
    topic: COURSE_TOPICS[lesson.id]
  }
}));

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
  choice("q32", "lambda", "Stream 过滤", "中等", "Stream 中保留满足条件的元素使用哪个操作？", ["filter", "println", "catch", "extends"], "0", "filter 接收判断条件并保留结果为 true 的元素。"),

  choice("q33", "variables", "小数类型", "简单", "需要保存 3.14 这样的带小数数值，通常选择哪个类型？", ["boolean", "double", "char", "int"], "1", "double 适合保存常见的双精度浮点数。"),
  choice("q34", "variables", "字符字面量", "简单", "下面哪个是合法的 char 字面量？", ["\"A\"", "'A'", "`A`", "char(A)"], "1", "char 字面量使用单引号，双引号表示 String。"),
  choice("q35", "variables", "常量声明", "简单", "为变量添加哪个关键字后，赋值完成后不能再次修改？", ["final", "static", "public", "new"], "0", "final 变量只能完成一次赋值，常用于表示常量。"),
  choice("q36", "variables", "局部变量初始化", "中等", "关于 Java 局部变量，哪项说法正确？", ["使用前必须明确初始化", "一定自动初始化为 0", "只能保存整数", "必须声明为 public"], "0", "局部变量没有默认值，读取前必须先完成赋值。"),
  choice("q37", "variables", "数值类型转换", "中等", "执行 double result = 5 / 2.0; 后，result 的值是多少？", ["2", "2.5", "3", "编译错误"], "1", "参与运算的 2.0 是 double，因此会进行浮点除法并得到 2.5。"),

  choice("q38", "operators", "取余运算", "简单", "表达式 17 % 5 的结果是什么？", ["2", "3", "5", "12"], "0", "% 返回整数除法的余数，17 除以 5 余 2。"),
  choice("q39", "operators", "数值相等比较", "简单", "判断两个 int 值是否相等应使用哪个运算符？", ["=", "==", "equals only", "=>"], "1", "== 用于比较两个基本类型的值是否相等；= 是赋值。"),
  choice("q40", "operators", "短路与", "中等", "在 a != null && a.length() > 0 中，如果 a 为 null，会发生什么？", ["仍调用 length", "右侧不再计算", "一定抛出异常", "自动创建字符串"], "1", "&& 具有短路特性，左侧为 false 时不会计算右侧。"),
  choice("q41", "operators", "运算优先级", "简单", "表达式 2 + 3 * 4 的结果是什么？", ["20", "14", "24", "9"], "1", "乘法优先于加法，所以先计算 3 * 4，再加 2。"),

  choice("q42", "condition", "多分支判断", "简单", "需要依次判断成绩为优秀、及格或不及格，适合使用什么结构？", ["if / else if / else", "单个 break", "try / finally", "import"], "0", "if、else if 和 else 可以按顺序组织互斥的多分支条件。"),
  choice("q43", "condition", "三元运算符", "中等", "表达式 age >= 18 ? \"成人\" : \"未成年\" 的作用是什么？", ["创建循环", "根据条件选择两个值之一", "捕获异常", "声明数组"], "1", "三元运算符根据布尔条件返回冒号两侧中的一个值。"),
  choice("q44", "condition", "switch 的 break", "中等", "传统 switch 分支末尾省略 break 可能导致什么？", ["程序无法启动", "继续执行后续 case", "自动退出方法", "变量自动清空"], "1", "传统 switch 可能发生分支贯穿，继续执行后续 case。"),
  choice("q45", "condition", "空值安全比较", "中等", "role 可能为 null 时，哪种写法更不容易产生空指针异常？", ["role.equals(\"admin\")", "\"admin\".equals(role)", "role == admin", "equals.role(admin)"], "1", "常量字符串不为 null，用它调用 equals 可以安全接收 null 参数。"),
  choice("q46", "condition", "范围条件", "简单", "判断 score 位于 60 到 100（含边界），正确条件是哪项？", ["score >= 60 && score <= 100", "score >= 60 || score <= 100", "60 <= score <= 100", "score = 60..100"], "0", "范围判断需要同时满足下界和上界，因此使用 && 连接。"),

  choice("q47", "loop", "跳过本次循环", "简单", "哪个关键字会跳过当前迭代并进入下一次循环？", ["break", "continue", "stop", "exit"], "1", "continue 跳过本次迭代剩余语句，循环本身不会结束。"),
  choice("q48", "loop", "while 使用场景", "简单", "不知道确切循环次数，只知道继续条件时，通常优先使用什么？", ["while", "class", "switch", "import"], "0", "while 适合由条件控制、次数事先不确定的重复过程。"),
  choice("q49", "loop", "do-while 特点", "中等", "do-while 与 while 的主要区别是什么？", ["do-while 至少执行一次循环体", "do-while 不能使用条件", "while 至少执行两次", "两者没有区别"], "0", "do-while 先执行循环体再判断条件，因此至少执行一次。"),
  choice("q50", "loop", "嵌套循环次数", "中等", "两个循环都各执行 3 次，内层语句总共执行多少次？", ["3", "6", "9", "12"], "2", "外层每次都会完整执行 3 次内层循环，共 3 × 3 = 9 次。"),
  choice("q51", "loop", "循环边界", "中等", "遍历长度为 n 的数组，常用的安全循环条件是哪项？", ["i <= n", "i < n", "i > n", "i == n + 1"], "1", "合法下标是 0 到 n - 1，因此使用 i < n。"),

  choice("q52", "array", "数组声明", "简单", "下面哪个是合法的 Java 整数数组声明与初始化？", ["int[] nums = {1, 2, 3};", "array nums = 1,2,3;", "int nums = [1,2,3];", "nums<int> = 1,2,3;"], "0", "Java 可用 int[] 变量名 = {元素...} 初始化数组。"),
  choice("q53", "array", "数组长度", "简单", "获取数组 nums 的元素数量应使用什么？", ["nums.length", "nums.length()", "size(nums)", "nums.count"], "0", "数组使用 length 字段，不带括号；字符串才使用 length() 方法。"),
  choice("q54", "array", "增强 for", "中等", "增强 for 循环最适合哪种需求？", ["只需依次读取每个元素", "必须删除数组元素", "必须修改数组长度", "需要倒序索引且修改下标"], "0", "增强 for 适合顺序读取元素，不直接暴露当前下标。"),
  choice("q55", "array", "二维数组", "中等", "int[][] grid = new int[2][3]; 一共可保存多少个 int？", ["2", "3", "5", "6"], "3", "二维数组有 2 行、每行 3 个元素，共 6 个。"),
  choice("q56", "array", "数组排序", "中等", "对 int[] nums 进行升序排序，常用哪个方法？", ["Arrays.sort(nums)", "nums.order()", "Collections.sortInt(nums)", "sort = nums"], "0", "java.util.Arrays.sort 可以原地按升序排序基本类型数组。"),

  choice("q57", "string", "字符串长度", "简单", "获取字符串 text 的字符数量应使用什么？", ["text.length", "text.length()", "text.size", "count(text)"], "1", "String 通过 length() 方法返回长度。"),
  choice("q58", "string", "substring 边界", "中等", "\"Java\".substring(1, 3) 的结果是什么？", ["Jav", "av", "ava", "Ja"], "1", "substring 的起始下标包含、结束下标不包含，因此取得下标 1 和 2。"),
  choice("q59", "string", "判断空字符串", "简单", "判断字符串内容长度是否为 0，常用哪个方法？", ["isEmpty()", "isZero()", "clear()", "emptyString()"], "0", "isEmpty() 在字符串长度为 0 时返回 true；调用前仍需留意 null。"),
  choice("q60", "string", "StringBuilder 追加", "简单", "向 StringBuilder sb 末尾添加内容使用哪个方法？", ["sb.append(...) ", "sb.pushString(...) ", "sb += only", "sb.insertEndless(...)"], "0", "append 会把内容追加到 StringBuilder 末尾并返回自身。"),

  choice("q61", "method", "无返回值方法", "简单", "方法只执行操作而不返回结果时，返回类型通常写什么？", ["null", "void", "empty", "static"], "1", "void 表示方法不向调用者返回值。"),
  choice("q62", "method", "方法重载", "中等", "同一个类中方法名相同但参数列表不同，称为什么？", ["重写", "重载", "继承", "封装"], "1", "重载依据参数个数或类型区分同名方法。"),
  choice("q63", "method", "参数传递", "中等", "Java 方法参数的传递方式是什么？", ["总是按引用传递", "按值传递", "按名称传递", "随机选择"], "1", "Java 始终按值传递；对象参数传递的是引用值的副本。"),
  choice("q64", "method", "递归终止", "中等", "递归方法最需要具备什么以避免无限调用？", ["基线条件", "更多 import", "多个类名", "final 字段"], "0", "基线条件决定何时停止递归并开始返回结果。"),

  choice("q65", "oop", "实例字段", "简单", "每个对象通常各自拥有一份的数据称为什么？", ["实例字段", "包名", "导入语句", "注释"], "0", "实例字段属于具体对象，不同实例可以保存不同值。"),
  choice("q66", "oop", "this 关键字", "简单", "在实例方法中，this 通常指向什么？", ["当前对象", "父类对象", "所有类", "JVM"], "0", "this 表示当前正在执行该实例方法的对象。"),
  choice("q67", "oop", "static 成员", "中等", "static 字段主要属于什么？", ["每个局部变量", "类本身", "某一个循环", "构造参数"], "1", "static 成员与类关联，通常由所有实例共享。"),
  choice("q68", "oop", "默认构造方法", "中等", "类中已经显式声明了带参数构造方法后，编译器还会自动提供无参构造方法吗？", ["一定会", "不会自动提供", "只在运行时提供", "取决于字段数量"], "1", "一旦显式声明构造方法，编译器就不会再自动生成默认无参构造方法。"),

  choice("q69", "encapsulation", "读取私有字段", "简单", "外部代码通常通过什么方法读取 private 字段？", ["getter", "catch", "main only", "import"], "0", "getter 提供受控的只读访问入口。"),
  choice("q70", "encapsulation", "默认访问级别", "中等", "成员未写任何访问修饰符时，默认可被哪些代码访问？", ["仅当前方法", "同一个包中的代码", "全世界任意代码", "任何网络请求"], "1", "不写修饰符时是包级可见，同一包内可以访问。"),
  choice("q71", "encapsulation", "protected 访问", "中等", "protected 成员通常对哪些范围可见？", ["仅当前行", "同包代码及符合规则的子类", "所有网页用户", "只能由 main 访问"], "1", "protected 支持同包访问，也允许子类在继承语境下访问。"),
  choice("q72", "encapsulation", "不可变对象", "中等", "设计不可变类时，哪种做法更合适？", ["字段设为 private final 且不提供修改器", "所有字段设为 public", "反复暴露内部可变集合", "删除构造方法"], "0", "private final 字段配合防御性复制可帮助对象保持不可变。"),

  choice("q73", "inheritance", "类的单继承", "简单", "一个 Java 类可以直接 extends 多少个类？", ["0 或 1 个", "任意多个", "必须 2 个", "只能 10 个"], "0", "Java 类采用单继承，一个类最多直接继承一个父类。"),
  choice("q74", "inheritance", "Override 注解", "中等", "在重写方法上添加 @Override 的主要好处是什么？", ["让编译器检查是否正确重写", "自动创建数据库", "提高网络速度", "取消访问控制"], "0", "@Override 能让编译器发现签名写错等问题。"),
  choice("q75", "inheritance", "禁止继承", "简单", "不希望某个类再被继承，可使用哪个关键字？", ["final", "volatile", "native", "default"], "0", "final 类不能被子类继承。"),
  choice("q76", "inheritance", "继承与构造方法", "中等", "关于构造方法的继承，哪项正确？", ["构造方法不会被子类继承", "构造方法会像普通方法一样重写", "子类不能调用 super", "所有构造方法都是 static"], "0", "构造方法不被继承，但子类构造过程会调用父类构造方法。"),

  choice("q77", "polymorphism", "接口实现", "简单", "类实现接口使用哪个关键字？", ["extends only", "implements", "inherits", "interfaceOf"], "1", "类通过 implements 声明实现一个或多个接口。"),
  choice("q78", "polymorphism", "向下转型风险", "中等", "把父类引用强制转换为不匹配的子类类型，运行时可能抛出什么？", ["ClassCastException", "IOException only", "ArithmeticException", "NoLoopException"], "0", "对象实际类型不兼容时，向下转型会抛出 ClassCastException。"),
  choice("q79", "polymorphism", "抽象方法", "中等", "包含抽象方法的类通常必须声明为什么？", ["abstract", "final only", "private", "synchronized"], "0", "类包含未实现的抽象方法时必须声明为 abstract。"),
  choice("q80", "polymorphism", "运行时多态", "中等", "运行时多态主要作用于哪类方法？", ["被重写的实例方法", "构造方法名称", "局部变量声明", "import 语句"], "0", "对象实际类型决定被重写实例方法的执行版本。"),

  choice("q81", "exception", "受检异常", "中等", "调用可能抛出受检异常的方法时，通常必须怎么做？", ["捕获或在方法签名声明抛出", "忽略编译器", "改成循环", "把异常写进注释"], "0", "受检异常需要 catch 处理或用 throws 继续声明。"),
  choice("q82", "exception", "主动抛出异常", "简单", "在代码中主动抛出一个异常对象使用哪个关键字？", ["throw", "throws", "catch", "finally"], "0", "throw 后跟异常对象，用于立即抛出该异常。"),
  choice("q83", "exception", "声明可能抛出", "简单", "在方法签名中声明可能抛出的异常使用哪个关键字？", ["throw", "throws", "try", "error"], "1", "throws 写在方法签名中，可以列出一个或多个异常类型。"),
  choice("q84", "exception", "catch 顺序", "中等", "多个 catch 同时存在时，通常应如何排列？", ["先具体异常，后一般异常", "先 Exception，后具体异常", "顺序永远无所谓", "只能写一个 catch"], "0", "先捕获父类会让后续子类 catch 不可达，因此应先具体后一般。"),

  choice("q85", "collections", "去重集合", "简单", "需要保存不重复元素，通常优先选择哪种接口？", ["Set", "List", "Map.Entry only", "StringBuilder"], "0", "Set 的核心语义是不保存重复元素。"),
  choice("q86", "collections", "读取 Map", "简单", "从 Map<String, Integer> scores 中按键 \"Tom\" 取值，常用什么？", ["scores.get(\"Tom\")", "scores[Tom]", "scores.readTom()", "get.scores(Tom)"], "0", "Map 的 get(key) 根据键返回对应的值。"),
  choice("q87", "collections", "安全删除元素", "中等", "遍历集合时需要安全删除当前元素，通常应使用什么？", ["Iterator 的 remove", "直接清空 JVM", "修改数组长度", "重新 import"], "0", "通过 Iterator 遍历并调用其 remove 可避免常见并发修改问题。"),
  choice("q88", "collections", "队列顺序", "简单", "普通 Queue 最常见的处理顺序是什么？", ["先进先出", "后进先出", "完全随机", "按字符串长度固定排序"], "0", "队列通常按 FIFO，也就是先进先出的顺序处理元素。"),

  choice("q89", "generics", "上界通配符", "中等", "List<? extends Number> 最适合做什么？", ["安全读取 Number 类型值", "添加任意 Object", "添加任意 Number 子类", "保存文件路径 only"], "0", "extends 通配符适合从集合读取为上界类型，但通常不能安全添加具体值。"),
  choice("q90", "generics", "下界通配符", "中等", "需要向集合中安全加入 Integer，可考虑哪种声明？", ["List<? super Integer>", "List<? extends Integer>", "List<?> 并随意添加", "List<void>"], "0", "super 通配符允许安全加入该类型及其子类型的值。"),
  choice("q91", "generics", "泛型方法", "中等", "泛型方法中的 <T> 通常写在什么位置？", ["返回类型之前", "方法体最后", "类文件名之后", "catch 之后"], "0", "泛型方法将类型参数列表写在返回类型之前，例如 static <T> T first(...）。"),
  choice("q92", "generics", "基本类型限制", "简单", "Java 泛型类型参数能直接写成 int 吗？", ["能", "不能，应使用 Integer", "只能在循环中能", "取决于变量名"], "1", "泛型参数必须是引用类型，基本类型 int 对应包装类 Integer。"),

  choice("q93", "io", "检查文件存在", "简单", "使用 NIO 判断 Path path 是否存在，常用什么？", ["Files.exists(path)", "path.isThere()", "File.existsAll()", "exists = path"], "0", "Files.exists 接收 Path 并返回布尔值。"),
  choice("q94", "io", "读取文本文件", "中等", "现代 Java 中一次读取较小文本文件内容，可使用什么？", ["Files.readString(path)", "Path.print()", "String.readFileOnly()", "System.in.write(path)"], "0", "Files.readString 可便捷地把小型文本文件读取为字符串。"),
  choice("q95", "io", "缓冲流作用", "中等", "使用 BufferedReader 的主要目的是什么？", ["减少底层读取次数并支持按行读取", "让文件自动变成数据库", "改变 Java 语法", "创建网络域名"], "0", "缓冲可减少频繁的底层 I/O 调用，BufferedReader 还提供 readLine。"),
  choice("q96", "io", "字符编码", "中等", "为了明确使用 UTF-8 编码，常用哪个常量？", ["StandardCharsets.UTF_8", "Charset.AUTO_ALWAYS", "String.UTF", "Files.DEFAULT_TEXT"], "0", "StandardCharsets.UTF_8 是 Java 提供的标准 UTF-8 Charset 常量。"),

  choice("q97", "lambda", "函数式接口", "中等", "Lambda 表达式可以赋值给什么类型？", ["只有一个抽象方法的函数式接口", "任意普通类", "基本类型 int", "包名"], "0", "Lambda 为函数式接口的单一抽象方法提供实现。"),
  choice("q98", "lambda", "Stream 映射", "简单", "Stream 中把每个元素转换成另一种形式使用哪个操作？", ["map", "catch", "extends", "break"], "0", "map 对每个元素应用转换函数并产生新的流。"),
  choice("q99", "lambda", "Stream 汇总", "中等", "把 Stream<Integer> 中的元素累加为一个结果，可使用哪个操作？", ["reduce", "filter only", "peek only", "import"], "0", "reduce 将多个元素按累加规则合并为一个结果。"),
  choice("q100", "lambda", "终止操作", "中等", "下面哪个通常是 Stream 的终止操作？", ["collect", "filter", "map", "sorted"], "0", "collect 会触发流的处理并把元素汇总到集合或其他结果中。")
];

export function publicExercise(exercise) {
  const { answer, checks, explanation, ...safe } = exercise;
  return safe;
}
