+++
title = "Data Flow Editor Design"
date = "2025-10-27T21:08:27+08:00"
tags = ["editor"]
description = "数据流编辑器设计与实现"
+++

数据流编辑器是一类基于拖放操作的交互式图表界面, 非常适合创建连接图, 因为这些连接图可能过于复杂，无法在传统的web界面中显示, 此外，它们鼓励用户将数据流经边缘的过程可视化, 将其呈现为明确、具体的内容，而不是仅仅通过嵌套和定位来暗示关系。数据流接口在实际应用中并不常见，但它们在某些领域占据主导地位，例如视觉特效软件。其他一些突出的例子包括：

- [Max/MSP](https://cycling74.com/products/max/): 一个现场音乐和多媒体编程环境
- [Antimony](https://www.mattkeeter.com/projects/antimony/3/): 来自平行宇宙的 CAD
- [Enso](https://enso.org/) 一种通用的可视化编程语言
- [LabView](https://en.wikipedia.org/wiki/LabVIEW) 专有的系统设计平台和开发环境

数据流接口的纯粹复杂性可能会令人反感，但它们在许多无法通过更标准的 UI 很好地服务的应用程序中找到了自己的位置。目前一些基于浏览器的数据流编辑器多使用 Canvas 或 WebGL 来渲染节点和边. 但 Canvas 是一项高负载技术，它会给原本基于 DOM 的应用程序带来严重的不连续性。你会失去文本选择、辅助功能以及所有的 CSS, 而基于 svg 的实现则没有这个问题, 我们期望一个好用的数据流编辑器具备如下特征:

1. 足够通用
   大多数数据流编辑器都是为单个应用程序和领域定制的，不易被其他应用程序复用
2. 基于 svg 矢量图绘制
   在数据量不多的情况下, SVG 更轻量级, 更易于使用, 并且在 React 组件的环境中, SVG 还有另一个优势：它们可以在服务器端渲染
3. 高质量的代码
   为了有效地实现通用性，我们需要以一种实用的方式暴露编辑器状态, 在 React 中，这意味着将编辑器构建为受控组件，并使用回调来处理更新, 我们的状态值应该是 JSON 序列化的，以便用户轻松存储和读取它们，并且我们的状态应该尽可能地强类型化，以便于合理管理

## 编辑器状态

将数据流编辑器的状态描述为由“节点和边”组成的“图”似乎很自然，但这与通常的有向图定义并不完全相同, 数据流编辑器具有带标记输入和输出端口的块, 边只能将输出端口连接到输入端口, 这种图更恰当的叫法应该是接线图, 但我们仍然使用术语"图"来指代编辑其的内容, 以下是我们编辑器状态的一些基本规则:

1. 节点具有一组固定的命名输入端口和命名输出端口
2. 边将输出端口连接到输入端口
3. 一个输入端口最多可以是一个传入边的目标
4. 输出端口可以是任意多个传出边的源
5. 允许循环: 边可以将任何输出连接到任何输入

有了这些，让我们尝试写出节点和边的类型：

```typescript
type NodeID = string;
type EdgeID = string;

interface Node {
  title: string;
  backgroundColor: string;
  position: { x: number; y: number };
  inputs: Record<string, EdgeID | null>;
  outputs: Record<string, EdgeID[]>;
}

interface Edge {
  source: { id: NodeID; output: string };
  target: { id: NodeID; input: string };
}

interface EditorState {
  nodes: Record<NodeID, Node>;
  edges: Record<EdgeID, Edge>;
}
```

明确的“端口”出现在边源和目标的类型中：边将特定节点（Edge.source.id）的特定输出端口（Edge.source.output）连接到另一个节点（Edge.target.id）的特定输入端口（Edge.target.input）。每个节点还分别在 Node.inputs 和 Node.outputs 对象中存储对其入边和出边的引用。Node.inputs 中的每个条目都是一个输入端口，其值为 EdgeID | null, 表示一个输入端口引用一条边, 而 Node.outputs 中的每个条目都是输出端口，其值为 EdgeID[], 表示一个输出端口引用多条边, 这些类型是一个很好的起点.

## 状态的合法性

这些类型并没有强制要求每个 Node.inputs 和 Node.outputs 中的每个 EdgeID 都实际存在于 EditorState.edges 中, 或者每个 Edge.source.id 和 Edge.target.id 都实际存在于 EditorState.nodes 中, 如果我们打算只将这些类型用作内存中的 JavaScript 对象，我们可以用直接对象引用替换字符串 ID 系统。但我们希望状态是 JSON 可序列化的，这意味着我们不能允许对象中存在引用循环，并且需要使用显式 ID 来获得这种良好的扁平结构。

而且类型过于冗余, 每个 Node.inputs 和 Node.outputs 都可以从 EditorState.edges 派生, 反之亦然。我们的状态定义本质上同时使用了`邻接表`和`邻接矩阵`来表示连接——这导致了两者可能不同步。甚至邻接表本身也是多余的，因为每条边都会作为输入出现一次，然后作为输出再次出现。如果我们丢弃邻接表（Node.inputs 和 Node.outputs）并保留邻接矩阵（EditorState.edges），我们就会失去输入端口最多只能接受一个传入边的约束。

如果我们反过来，保留邻接表并丢弃邻接矩阵，我们会发现这仍然是多余的，因为每条边都会被重复计算：一次作为输入，另一次作为输出。如果我们坚持不懈，尝试丢弃传出的 Node.outputs 并只保留传入的 Node.inputs ，我们虽然保留了独占输入的约束，但空输出将无法表示（即，一个没有传出边且只有一个输出的节点与一个根本没有输出的节点之间没有区别）。

所有这些麻烦都源于图本身难以用对象和数组等常规数据结构建模。邻接矩阵和邻接表各有利弊，它们各自更适合不同类型的用途，并且比不同类型的图更高效。因此，我们可以得出一个结论：由于编辑器状态是我们将向用户（此处“用户”指的是开发者而非最终用户）公开的内容，并且我们不知道他们可能想要用它做什么，因此公开这两种表示形式是一件好事。

保持冗余的另一个（更简单的）理由是这样的：“数据流编辑器处理节点和边，因此状态应该有节点和边”。这是一个相当有力的论点——强到很难说它是什么。它诉诸一种对应感: 它提醒我们应该选择看起来像我们头脑中的概念模型的类型。当我们查看图表时，我们倾向于将节点和边在视觉上解析为独立的东西，既不从属于另一个，也不“受另一个状态的暗示”。相邻的边感觉像是节点状态的一部分，边也感觉它们有自己的身份，所以我们的类型应该以类似的方式组织。

## 什么样的类型设计才是"好"的？

理想情况是你的类型系统应该让"错误的代码"根本编译不过, 比如：Node.inputs 中的端口名应该与节点类型定义中的端口名一致, 坏的设计是类型系统允许你写 node.inputs.不存在的端口名而不会报错, 但是，仅仅"不报错"就够了吗？让我们用现实生活中的例子来理解, 想象你在用乐高积木：

- 基本要求（双射）：圆形积木不能插进方形孔里 → 这就是"非法状态不可表示"
- 更高要求（结构对应）：积木的说明书（类型）应该告诉你：
  - 这个轮子积木（节点类型）应该用在车底（特定位置）
  - 这个窗户积木应该用在车身侧面（特定关系）

这样你拼出来的车才像车，而不只是一堆正确连接的积木

### 在数据流编辑器中的具体体现：

1. 基础级别：防止明显错误

```typescript
// 坏的设计：类型上允许，但逻辑上错误
node.inputs.不存在的端口 = "some_value"; // 编译通过，但运行时出错

// 好的设计：编译时就报错
node.inputs.不存在的端口 = "some_value"; // TypeScript 直接报错
```

2. 高级级别：让正确的用法更自然

```typescript
// 不只是让错误用法报错，还要让正确用法很顺畅
if (node.kind === "加法器") {
  // TypeScript 自动知道这里只能访问 a 和 b 输入
  const a = node.inputs.a; // ✅ 自动补全，类型安全
  const b = node.inputs.b; // ✅ 自动补全，类型安全
  // node.inputs.c  // ❌ TypeScript 直接报错
}
```

核心是：类型系统不应该只是"警察"（抓错误），还应该是"向导"（引导你写出好代码）。

## 设计中的坏味道

让我们先看看最初的设计有什么问题：

```typescript
// 最初的设计 - 每个节点都重复存储相同的信息
interface Node {
  title: string; // ❌ 每个"加法器"节点都重复存储"加法器"
  backgroundColor: string; // ❌ 每个"加法器"节点都重复存储"淡紫色"
  position: { x: number; y: number };
  inputs: Record<string, EdgeID | null>;
  outputs: Record<string, EdgeID[]>;
}
```

### 这有什么问题？

- 浪费内存：100个"加法器"节点就存储了100次"加法器"这个标题
- 容易出错：用户可以不小心把某个"加法器"节点的标题改成"减法器"
- 难以维护：如果想修改所有"加法器"的背景颜色，需要修改100个节点

### 更好的设计：分离"什么"和"在哪里"

我们的节点实际上有两个不同的状态级别：

- 类型 Kind: 描述是什么, 包含标题, 背景色
- 具体 Node: 在哪里放置这个节点

因此, 改进后的设计为:

```typescript
// 类型说明书 - 定义"什么"
interface Kind {
  title: string; // "加法器"
  backgroundColor: string; // "淡紫色"
  inputs: Record<string, null>; // 定义有哪些输入端口
  outputs: Record<string, null>; // 定义有哪些输出端口
}

// 具体的节点 - 定义"在哪里"
interface Node {
  kind: KindID; // 引用"加法器"这个类型
  position: { x: number; y: number }; // 在画布上的位置
  // inputs和outputs现在存储实际的连接关系
  inputs: Record<string, EdgeID | null>;
  outputs: Record<string, EdgeID[]>;
}

type KindID = string;
type NodeID = string;
type EdgeID = string;

interface Edge {
  source: { id: NodeID; output: string };
  target: { id: NodeID; input: string };
}

interface EditorState {
  kinds: Record<KindID, Kind>;
  nodes: Record<NodeID, Node>;
  edges: Record<EdgeID, Edge>;
}
```

这样设计的好处：

- 节省内存和避免重复
- 一致性保证: 修改所有"加法器"的背景色，只需要改一个地方
- 类型安全
  ```typescript
  // TypeScript可以帮我们检查节点类型的正确性
  if (node.kind === "adder") {
    // TypeScript知道这里只能有a和b输入
    console.log(node.inputs.a); // ✅ 正确
    console.log(node.inputs.c); // ❌ TypeScript报错：c不存在
  }
  ```

### 范型参数的约束

现在, 我们的类型更加混乱了，因为现在我们有一个隐式的非强制约束，即每个 Node.inputs 的键也是相应 `EditorState.kinds[Node.kind].inputs` 的键。我们希望所有静态值都放在一个地方，但我们也希望 TypeScript 知道 Node.inputs 和 Node.outputs 的类型取决于 Node.kind 的值 。最好的方法是将状态的静态部分提升到类型级别, 对我们来说，这意味着使 EditorState 、 Node 和 Edge 都通过某个共享参数实现泛型，我们将其称为 Schema:

```typescript
type Schema = Record<string, { inputs: string; outputs: string }>;
```

在我们的代码库中，我们永远不会处理Schema--相反，它更像是一个类型的类型。它的唯一目的是作为泛型参数`S extends Schema` 的约束，我们将在重写 Node 、 Edge 等时使用它。这就是为什么 `.inputs` 和 `.outputs` 在 Schema 中都是 string ，而不是 `string[]` 或 `Record<string, null>`。节点类型应该声明命名端口集--所以如果我们考虑可分配给 Schema 类型的值 ，我们会担心，因为只有具体的单个字符串才能分配给 string 类型。但我们关心的是扩展 Schema 类型的类型 。字符串字面量的并集（ "foo" | "bar" ）是在类型级别表示字符串集的自然方式，而表达“此类型可以是任何字符串字面量的并集”的最佳类型约束就是 string 。这是 TypeScript 中类型级编程变得非常危险的地方之一：很容易忘记某些泛型参数 `Foo extends string` 应该只用一个字符串字面量还是它们的并集来实例化，这可能会导致难以诊断的错误。总而言之，我们有一个类型 Schema ，我们只会将它用作具体类型`S extends Schema`的通用参数约束，如下所示:

```typescript
// 节点类型 a，具有两个输入端口'foo'和'bar'，但没有输出端口
type S1 = { a: { inputs: "foo" | "bar"; outputs: never } }

// 三种节点类型: “x”、“y”和“z”
type S2 = {
	// 节点类型 x, 没有输入端口, 输出端口只有 hello 一种
	x: { inputs: never; outputs: "hello" }
	// 节点类型 y, 没有输入端口, 具有两个输出端口 "hello" 和 "world"
	y: { inputs: never; outputs: "hello" | "world" }
	// 节点类型 z, 输入端口只有 "FJDKLSFJKSDJFS" 一种, 具有两个输出端口 "hello" 和 "world"
	z: { inputs: "FJDKLSFJKSDJFS"; outputs: "hello" | "world" }
```

## 实用程序类型

当你的代码库中有大量代码片段需要泛型化某些配置参数时, 最好编写一些实用类型集合，用作 getter，而不是直接在配置类型中索引。你很可能会多次重构你的大型配置类型，而且进行大量的类型级编程实际上非常不安全（因为类型不是强类型）, 实用类型有助于将重要的逻辑集中在一个更容易维护的地方。

```typescript
type GetInputs<S extends Schema, K extends keyof S> = S[K]["inputs"];
type GetOutputs<S extends Schema, K extends keyof S> = S[K]["outputs"];
```

我们可以使用实用程序类型 GetInputs 和 GetOutputs 作为访问器，就像下面的代码一样：

```typescript
type S = { a: { inputs: "foo" | "bar"; outputs: never } };
type _A = GetInputs<S, "a">; // "foo" | "bar"
type _B = GetOutputs<S, "b">; // never
```

## 值级别 vs 类型级别

到目前为止，我们希望将状态的静态部分(节点类型)分解为其自身的值，并且我们希望通过使所有内容通用来将状态的这一部分“提升”到类型级别。很容易看出这种情况并得出结论，我们应该使用静态状态值的类型作为通用参数约束，如下所示：

```typescript
type Config = Record<KindID, Kind>;

interface EditorState<C extends Config> {
  config: C;
  nodes: Record<NodeID, Node<C>>;
  edges: Record<EdgeID, Edge<C>>;
}
```

毕竟，我们的目标是让类型系统识别这个静态值, 所以我们应该让这个静态值的类型具有泛型, 至关重要的是，我们需要编写两种不同的类型来实现这一点：一种类型用于值级别，另一种类型用于类型级别。读起来可能有点让人抓狂，所以让我们来分析一下。

- 一种类型用于值级别
  意味着，当用户将我们的编辑器用作 React 组件时，他们会为其提供一些 props（称为 kinds ），其中包含有关不同节点类型的所有运行时数据，并且这些 props 会是某种类型的。此运行时数据包含每种节点类型的显示标题、背景颜色以及输入和输出端口的名称。这些都是我们将节点实际渲染为 SVG 所需的所有值 。
- 一种类型用于类型级别
  为了让 TypeScript 意识到 Node.inputs 的类型取决于 Node.kind 的值，我们将为所有状态类型添加一个泛型参数`S extends Schema`充当类型变量, 我们可以在类型定义中使用 S，就好像它被实例化为 Schema 的某个具体子类型一样。我们的目标是使用 S 在我们的状态类型之间共享数据，但这意味着我们必须将该数据存储为 Schema 的具体子类型。

## 开发者体验

我们说"我们需要两个独立的类型"用于值和类型级别:

```typescript
// 类型级别
type MySchema = { add: { inputs: "a" | "b"; outputs: "sum" } }
// 值级别
const kinds = {
  add: {
    inputs: { a: null, b: null },
    outputs: { sum: null },
    backgroundColor: "lavender",
    title: "Addition"
  }
}

function Index(props: {}) {
  return <Editor<MySchema> kinds={kinds} ... />
}
```

让我们想想这里的约束：

- 我们必须将相同的数据（关于每种类型的端口配置）获取到值级别和类型级别
- 我们绝对不能从类型开始然后从中派生值，因为所有这些最终都作为 JavaScript 代码运行，它不知道我们在类型方面做了什么

所以如果我们想避免定义相同的东西两次，我们必须尝试从用户提供给我们的值派生出类型, 让我们回去再看一些例子。我们想派生一个看起来像这样的类型:

```typescript
type S = { add: { inputs: "a" | "b"; outputs: "sum" } };
```

以上类型通过下面的值派生:

```typescript
const kinds = {
  add: {
    inputs: { a: null, b: null },
    outputs: { sum: null },
    backgroundColor: "lavender",
    title: "Addition",
  },
};
```

事实证明，我们可以像应用程序的其余部分一样编写 kinds: Kinds<S extends Schema>，TypeScript 将反向运行虚线箭头。换句话说，我们可以编写属性 kinds 的类型，就好像它依赖于类型 S，即使在现实中我们需要事情以相反顺序"发生"。让我们重写 Kinds 以依赖于 S：

```typescript
interface Kind<I extends string, O extends string> {
  title: string;
  backgroundColor: string;
  inputs: Record<I, null>;
  outputs: Record<O, null>;
}

type Kinds<S extends Schema> = {
  [K in keyof Schema]: Kind<GetInputs<S, K>, GetOutputs<S, K>>;
};
```

当用户导入我们的组件并尝试使用它时：

```typescript
const kinds = {
  add: {
    inputs: { a: null, b: null },
    outputs: { sum: null },
    backgroundColor: "lavender",
    title: "Addition"
  }
}

function Index(props: {}) {
  return <Editor kinds={kinds} ... />
}
```

编译器会发现我们使用泛型函数 Editor 作为组件，却没有明确指定泛型参数 `S extends Schema` 的具体类型。它将尝试通过提供的 kinds 参数来推断具体的类型。然后使用常规的类型推断规则赋予它以下类型:

```typescript
declare const kinds: {
  a: {
    inputs: { a: null; b: null };
    outputs: { sum: null };
    backgroundColor: string;
    title: string;
  };
};
```

通过逆向推导，得出 S 的具体类型 `{ add: { inputs: "a" | "b"; outputs: "sum" } }` 。保持类型可管理的最简单方法是将所有内容集中化:

- 将需要的所有类型级数据合并到单个全局通用参数中
- 为需要使用的参数的每个方面编写一个访问器实用程序类型
- 使用单个专用的配置属性或参数（在同一个参数中也是通用的）来驱动参数具体类型的推断

## 提升类型级别

另一件可能比较突出的事情是，我们要求用户通过提供一个对象来配置每种类型的输入和输出端口，该对象以端口名称为键，每个值都为 null ，例如 `{ a: null; b: null }` 。这是一个奇怪的选择。使用 `["a", "b"]` 不是更简单吗？这个问题与 TypeScript 默认的启发式方法有关，它用于将类型赋给原始值（未注解的值）。例如，如果我们这样写:

```typescript
const foo = { a: null, b: null };
```

foo 的类型会被推断为: `{ a: null, b: null }`, 但如果我们改写成:

```typescript
const bar = ["a", "b"];
```

TypeScript 会赋予 bar 类型 `string[]`, 实际值 a 和 b-我们最初试图与类型级别共享的内容会被忽略。利用值来驱动范型是一种强大的设计模式, 我们天真地认为类型存在于值之上，好的代码应该是100% 类型覆盖率的代码, 其中每个值都有明确的类型注释，而 TypeScript 编译器的作用是检查你所有的工作。对类型系统更细致的看法是，它与其说是一个专制的统治者，不如说是一个共犯—一个你可以向其推送数据和从其提取数据的地方。我们通常需要反向设计，让类型从（故意不注释的）值中冒泡出来；这是协调这两个层级的最佳方式。

## 重新分发联合类型

鉴于我们"使一切在 S 上泛型"的总体计划，你期望我们会这样写 Node：

```typescript
interface Node<S extends Schema, K extends keyof S = keyof S> {
  kind: K;
  inputs: Record<GetInputs<S, K>, null | string>;
  outputs: Record<GetOutputs<S, K>, string[]>;
  position: { x: number; y: number };
}
```

直观来看，这完全正确。Node 由两个类型变量参数化—一个模式和该模式中的 K 类型—并且它有一个显式的 `.kind: K` ，以及 `.inputs` 和 `.outputs` 对象，它们分别具有属性域 `GetInputs<S, K>` 和 `GetOutputs<S, K>` 。但我们应该检查一下，确保这个类型确实按照我们想要的方式运行。首先，让我们手动实例化一个具体的模式来操作。

```typescript
type MySchema = {
  add: { inputs: "a" | "b"; outputs: "sum" };
  div: { inputs: "dividend" | "divisor"; outputs: "quotient" | "remainder" };
};

type MySchemaNodeAdd = Node<MySchema, "add">;
```

如果我们检查具体类型 MySchemaNodeAdd ，我们会看到：

```typescript
type MySchemaNodeAdd = {
  position: { x: number; y: number };
  kind: "add";
  inputs: Record<"a" | "b", string | null>;
  outputs: Record<"sum", string[]>;
};
```

如果我们不指定类型会怎么样?

```typescript
type MySchemaNode2 = Node<MySchema>;
```

检查一下我们发现:

```typescript
type MySchemaNode2 = {
  position: { x: number; y: number };
  kind: keyof MySchema;
  inputs: Record<"a" | "b" | "dividend" | "divisor", string | null>;
  outputs: Record<"sum" | "quotient" | "remainder", string[]>;
};
```

这不是我们想要的。TypeScript 使我们的节点类型崩溃了，这在某种程度上违背了我们让 `.inputs` 的类型依赖于 `.kind` 的值的整个目标, 我们尝试支持的具体用例是区分节点类型。当用户导入我们的组件并在 onChange 回调中收到 `nodes: Record<NodeID, Node<S>>` 时，我们希望他们能够遍历节点，并针对每个节点执行如下操作：

```typescript
for (const [id, node] of Object.entries(nodes)) {
  if (node.kind === "add") {
    // 此时，TS 应该知道 node.inputs
    // 是类型 { a: null | EdgeID; b: null | EdgeID }
    // 并且 node.outputs 是类型 { sum: EdgeID[] }
  } else if (node.kind === "div") {
    // 而*此时*，TS 应该知道 node.inputs
    // 是类型 { dividend: null | EdgeID; divisor: null | EdgeID }
    // 并且 node.outputs 是类型
    // { quotient: EdgeID[]; remainder: EdgeID[] }
  } else {
    // 而这里，TS 应该认为 node 是 never 类型！
    throw new Error("Invalid node kind");
  }
}
```

并且 TypeScript 仅当 Node<S, keyof S> 的类型保持属性分组时才会执行此操作：

```typescript
// 这是我们需要的
type MySchemaNode2 =
  | {
      kind: "add";
      position: { x: number; y: number };
      inputs: Record<"a" | "b", string | null>;
      outputs: Record<"sum", string[]>;
    }
  | {
      kind: "div";
      position: { x: number; y: number };
      inputs: Record<"dividend" | "divisor", string | null>;
      outputs: Record<"quotient" | "remainder", string[]>;
    };
```

换句话说，我们想要的是对象的联合，而不是联合的对象。控制联合的分配方式可能是 TypeScript 类型级编程中最令人沮丧的部分之一。幸运的是，一个相对简单的策略对我们有用——我们只需创建一个中间“索引对象”，然后立即对其进行索引：

```typescript
type Node<S extends Schema, K extends keyof S = keyof S> = {
  [k in K]: {
    kind: k;
    inputs: Record<GetInputs<S, k>, null | string>;
    outputs: Record<GetOutputs<S, k>, string[]>;
    position: { x: number; y: number };
  };
}[K];
```

当 K 是字符串字面量类型的并集时，这实际上会强制分配。现在，当我们计算 `Node<S>` 时，我们得到了我们想要的 `MySchemaNode2`, 让我们将所有的碎片拼凑起来:

```typescript
// 我们的全局泛型参数约束
type Schema = Record<string, { inputs: string; outputs: string }>;

// 我们的访问器实用类型
type GetInputs<S extends Schema, K extends keyof S> = S[K]["inputs"];
type GetOutputs<S extends Schema, K extends keyof S> = S[K]["outputs"];

// 我们每种节点类型需要的值。
// 让我们使其全部只读，只是为了好衡量。
type Kind<I extends string, O extends string> = Readonly<{
  title: string;
  backgroundColor: string;
  inputs: Readonly<Record<I, null>>;
  outputs: Readonly<Record<O, null>>;
}>;

// 我们的"配置属性"，将驱动 S 的推断。
// 也让其只读。
type Kinds<S extends Schema> = {
  readonly [K in keyof Schema]: Kind<GetInputs<S, K>, GetOutputs<S, K>>;
};

// GetSchema 将具体 Kinds<S> 转回 S
// 这对想要存储编辑器状态的用户很有用
// 在某个地方，并需要从他们的配置对象获取具体模式
type GetSchema<T extends Kinds<Schema>> = {
  [k in keyof T]: T[k] extends Kind<infer I, infer O>
    ? { inputs: I; outputs: O }
    : never;
};

type NodeID = string;
type EdgeID = string;

// 每个节点现在确切知道其
// .inputs 和 .outputs 对象有哪些属性！
type Node<S extends Schema, K extends keyof S = keyof S> = {
  [k in K]: {
    kind: k;
    inputs: Record<GetInputs<S, k>, null | string>;
    outputs: Record<GetOutputs<S, k>, string[]>;
    position: { x: number; y: number };
  };
}[K];

type Source<S extends Schema, K extends keyof S = keyof S> = {
  id: NodeID;
  output: GetOutputs<S, K>;
};

type Target<S extends Schema, K extends keyof S = keyof S> = {
  id: NodeID;
  input: GetInputs<S, K>;
};

// 由于边不存储其源和目标的类型，
// 我们不需要以与节点相同的方式重新索引它们。
// 不要太担心 SK 和 TK。
type Edge<
  S extends Schema,
  SK extends keyof S = keyof S,
  TK extends keyof S = keyof S,
> = {
  source: Source<S, SK>;
  target: Target<S, TK>;
};

interface EditorState<S extends Schema> {
  nodes: Record<NodeID, Node<S>>;
  edges: Record<EdgeID, Edge<S>>;
}

interface EditorProps<S extends Schema> {
  kinds: Kinds<S>; // 静态，不可变
  state: EditorState<S>; // 动态，可变
}
```

## 编辑器操作

动作是离散状态转换的语法, 从某种意义上来说，这些操作仍然是抽象的。它们代表了状态改变的不同方式，但没有说明用户如何发起这些改变。我们需要类似 redux 的三个基本功能:

- 每个抽象动作的具体类型
- 每个具体动作类型的构造函数
- 将动作应用于状态值的 Reducer 函数

这也意味着，我们的顶级 Editor 组件将采用 `dispatch: (action: EditorAction<S>) => void` 回调，而不是像在受控 React 组件中那样采用 `onChange: (value) => void` 回调。这使得我们的用户操作起来稍微复杂一些：除了必须自己存储状态（就像任何受控组件一样）之外，他们还必须组装自己的 reducer 函数和 dispatch 方法。我们可以通过使用以下签名导出 reduce 函数，尽可能简化这一过程：

```typescript
declare function reduce<S extends Schema>(
  kinds: Kinds<S>,
  state: EditorState<S>,
  action: EditorAction<S>,
): EditorState<S>;
```

因此典型用法可能看起来像这样：

```typescript
const kinds = { /* ... */ }

type S = GetSchema<typeof kinds>

function MyComponent({}) {
	const [state, setState] = useState<EditorState<S>>({nodes: {}, edges: {}})

	const dispatch = useCallback((action: EditorAction<S>) => {
		setState(reduce(kinds, state, action))
	}, [state])

	return <Editor kinds={kinds} state={state} dispatch={dispatch} />
}
```

这虽然有点额外的开销，但它为用户提供了一个明确的地方来插入他们自己的编辑逻辑——也许他们想在删除节点之前打开一个确认对话框，或者防止创建某种类型的多个节点，或者对边缘连接强制执行某种类型检查。我们的顶级编辑器组件现在需要三个 props

```typescript
interface EditorProps<S extends Schema> {
  kinds: Kinds<S>; // static, immutable
  state: EditorState<S>; // dynamic, mutable
  dispatch: (action: EditorAction<S>) => void;
}
```

然后我们会将这个 dispatch prop 传递到整个组件树，这样我们就可以在任何地方访问它了。可惜的是，我们不能使用 React context 来实现这一点，因为 context 不兼容（而且在概念上也无法兼容）泛型值，所以我们只能用老办法了。

## 行为

我们的数据流编辑器操作涉及到的只有两类事物——节点和边——我们可以创建、移动和删除它们。有些操作必须在参数 S extends Schema 中实现泛型, 而有些操作则不需要访问 S 为了保持一致性，我们可以在 S 中将它们全部设置为泛型, 但引入一个未使用的泛型参数是非常糟糕的做法。这意味着我们的组合 EditorAction 类型如下所示：

```typescript
type EditorAction<S extends Schema> =
  | CreateNodeAction<S>
  | MoveNodeAction
  | DeleteNodeAction
  | CreateEdgeAction<S>
  | MoveEdgeAction<S>
  | DeleteEdgeAction;
```

### 创建节点

创建节点是一个需要两个参数的操作：要创建的节点类型和画布上的位置。

```typescript
import { nanoid } from "nanoid";

type CreateNodeAction<S extends Schema> = {
  type: "node/create";
  id: NodeID;
  kind: keyof S;
  position: { x: number; y: number };
};

function createNode<S extends Schema>(
  kind: keyof S,
  position: { x: number; y: number },
): CreateNodeAction<S> {
  const id = nanoid(10);
  return { type: "node/create", id, kind, position };
}
```

### 删除节点

删除节点是一个需要使用一个参数的操作：节点 ID。

```typescript
type DeleteNodeAction = {
  type: "node/delete";
  id: NodeID;
};

function deleteNode(id: NodeID): DeleteNodeAction {
  return { type: "node/delete", id };
}
```

### 移动节点

移动节点是一个需要两个参数的操作：节点 ID 和画布上的位置。

```typescript
type MoveNodeAction = {
  type: "node/move";
  id: NodeID;
  position: { x: number; y: number };
};

function moveNode(
  id: NodeID,
  position: { x: number; y: number },
): MoveNodeAction {
  return { type: "node/move", id, position };
}
```

### 创建边

创建边是一个需要两个参数的操作：源输出端口和目标输入端口。

```typescript
import { nanoid } from "nanoid";

type CreateEdgeAction<S extends Schema> = {
  type: "edge/create";
  id: EdgeID;
  source: Source<S>;
  target: Target<S>;
};

function createEdge<S extends Schema>(
  source: Source<S>,
  target: Target<S>,
): CreateEdgeAction<S> {
  const id = nanoid(10);
  return { type: "edge/create", id, source, target };
}
```

### 删除边

删除边的操作需要一个参数：边 ID。

```typescript
type DeleteEdgeAction = {
  type: "edge/delete";
  id: EdgeID;
};

function deleteEdge(id: EdgeID): DeleteEdgeAction {
  return { type: "edge/delete", id };
}
```

### 移动边

移动边是一个需要两个参数的动作：边 ID 和新目标的输入端口。

```typescript
type MoveEdgeAction<S extends Schema> = {
  type: "edge/move";
  id: EdgeID;
  target: Target<S>;
};

function moveEdge<S extends Schema>(
  id: EdgeID,
  target: Target<S>,
): MoveEdgeAction<S> {
  return { type: "edge/move", id, target };
}
```

## 总结

即使是那些疯狂的功能， 也可以通过精心设计、创造出令人惊叹的开发者体验。安全的类型编程会不断发展.

> [原文来自](https://research.protocol.ai/blog/2021/designing-a-dataflow-editor-with-typescript-and-react/#background)
