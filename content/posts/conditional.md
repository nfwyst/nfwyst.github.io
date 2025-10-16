+++
title = "Go Learn - conditional"
date = "2025-10-16T19:47:12+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - 条件"
+++

我们每天都会根据特定的条件做出决定。闹钟响了吗？如果响了，就关掉它。下雨了吗？如果下雨了，带把伞。冰淇淋车停在外面了吗？如果停在外面，那就该犒劳一下自己了。我们还可以在程序中使用条件语句来实现这种决策能力, 下面我们将介绍:

- if 、 else if 和 else 语句。
- 比较运算符
- 逻辑运算符。
- switch 开关语句
- 条件中的简短声明。
- 如何在随机条件下使用条件。

## if 语句

如果……怎么办？如果我们饿了怎么办？如果下雨了怎么办？如果闹钟响了怎么办？我们会针对这些情况采取一些措施。if 语句的工作原理与我们自己的决策过程非常相似。让我们看一下 Go 的 if 语句：

```go
alarmRinging := true
if alarmRinging {
  fmt.Println("Turn off the alarm!!")
}
```

在我们的示例中，我们有一个变量 alarmRinging ，其值为 true 。然后，我们有一个 if 语句，用于检查 if 关键字旁边的条件是否为 true 。接着，我们有一个左花括号 { 其中包含代码，后接一个右花括号 } 。如果条件为 true ，则执行花括号 { } 之间的代码。在本例中， "Turn off the alarm!!" 会打印到控制台。

在我们的 if 语句中，我们可以提供括号，如下所示：

```go
if (alarmRinging) {
  fmt.Println("Turn off the alarm!!")
}
```

括号是可选的，可以使其更易于阅读，但通常我们会看到 if 语句不带括号。

## else 语句

如果我们饿了，我们就会去吃点东西。但如果我们不饿，我们就不会去。这样做的目的是，我们有一个备用计划，或者说，如果我们的条件不满足，我们可以默认采取某种措施. 我们可以通过添加 else 语句为我们的条件（ if 语句）提供默认选项：

```go
isHungry := false
if isHungry {
  fmt.Println("Eat the cookie")
} else {
  fmt.Println("Step away from the cookie...")
}
```

在上面的例子中， isHungry 是一个值为 false 的变量。我们像上一个练习中看到的那样设置了一个 if 语句。紧接着 if 语句右括号的是 else 关键字，它和左括号位于同一行。 else 语句也包含一个用花括号括起来的代码块。如果 if 条件为 false ，则默认执行代码块内的代码。注意， else 语句不接受条件。

## 比较运算符

到目前为止，我们一直在检查布尔值（赋值为 true 或 false 变量）。但是，我们可以使用比较运算符来检查多个值。以下是两个常用的比较运算符：

- `==` 等于
- `!=` 不等于

要使用比较运算符，我们需要两个值（或操作数 ），并在这两个值之间放置一个比较运算符。Go 的编译器会评估这两个值和运算符的组合，它会查看左边的值，将其与右边的值进行比较，然后判断结果为 true 或 false 。我们先来看一下 == ：

```go
"password1" == "password1" // Evaluates to true
"password1" == "badpass"   // Evaluates to false
```

我们用左边的值与右边的值进行比较。将比较语句想象成问题会很有帮助。当答案为“是”时，语句的计算结果为真；当答案为“否”时，语句的计算结果为假。上面代码的第一个例子是在问： "password1" 和 "password1" 相同吗？是的，所以 "password1" == "password1" 计算结果为 true 。我们可以将第二个例子理解为： "badpass" 和 "password1" 相同吗？否， "badpass" 和 "password1" 不同，所以计算结果为 false 。

让我们看一下 != 运算符的实际作用：

```go
123 != 12 // Evaluates to true
123 != 123 // Evaluates to false
```

上面，第一行检查 123 和 12 是否不相等，由于这两个整数是不同的值，所以结果为 true 。这次我们可以把问题理解为： 123 和 12 不等吗？是的，它们不等，所以结果为 true 。第二个例子也遵循同样的思路： 123 和 123 不等吗？它们相等，所以结果为 false 。

还有更多我们尚未涉及的比较运算符，它们可能在数学课上看起来很熟悉:

- `<` 小于
- `>` 大于
- `<=` 小于或等于
- `>=` 大于或等于

与上面类似，我们仍然使用比较运算符来比较左侧值和右侧值。例如

```go
100 < 200 // Evaluates to true
```

我们可以将这个例子理解为：“ 100 小于 200 吗？是的，答案是肯定的。”

让我们再看一个 <= 的例子：

```go
100.5 <= 100.5 // Evaluates to true
```

就像小于运算符（ < ）一样，我们要检查左边的值是否小于或等于右边的值。由于 100.5 小于或等于 100.5 ，因此结果为 true 。

## 逻辑运算符（与、或）

在前面的练习中，我们一次检查一个条件。但是如果我们想一次检查多个条件怎么办？为此，我们可以使用逻辑运算符 。共有三种逻辑运算符：

- `&&` 和
- `||` 或者
- `!` 不是

在本练习中，我们将重点关注前两个运算符， && 和 || 。当我们使用 And ( && ) 运算符时，我们检查两个表达式是否都为真：

```go
if storeLights == "on" && doorsOpen {
  fmt.Println("You can enter the store!")
}
```

使用 && 运算符时，两个条件都必须为 true ，整个条件才会被 true 。否则，只要其中一个条件为 false ， && 条件就会被 false ，并且 if 块内的代码将不会执行。如果我们只关心其中一个条件为真，我们可以使用或（ || ）运算符：

```go
if day == "Saturday" || day == "Sunday" {
  fmt.Println("Enjoy the weekend!")
} else {
  fmt.Println("Do some work.")
}
```

使用 || 运算符时，只需满足其中一个条件即可使整个语句的结果为真。在上面的代码示例中，如果 `day == "Saturday" || day == "Sunday"` 为 true ，则语句的代码块将执行。如果 || 表达式中的第一个操作数的结果为 true ，则第二个操作数甚至不会被检查。只有 `||` 前面的表达式为 false 时才会对 `||` 后面的表达式进行求值。只有当两个比较结果都为 false ，上面 else 语句中的代码才会执行。

最后一个逻辑运算符是“非”（ ! ）。它对布尔值取反 （反转）。例如：

```go
bored := true
fmt.Println(!bored) // Prints false

tired := false;
fmt.Println(!tired) // Prints true
```

请注意， ! 运算符要么接受 true 值并传回 false ，要么接受 false 值并传回 true 。

## else if 语句

我们可以使用 else if 语句为 `if...else` 语句添加不同的条件。添加 else if 语句允许我们在 if 语句检查完其条件后检查另一个条件。事实上，我们可以根据需要添加任意数量的 else if 语句来创建更复杂的条件！

`else if` 语句总是位于 if 语句之后。如果存在 else 语句，则 else if 位于其之前。else if 语句也带有条件。我们来看看它的语法：

```go
position := 2

if position == 1 {
  fmt.Println("You won the gold!")
} else if position == 2 {
  fmt.Println("You got the silver medal.")
} else if position == 3 {
  fmt.Println("Great job on bronze.")
} else {
  fmt.Println("Sorry, better luck next time?")
}
```

请注意，我们可以使用 else if 语句来评估单独的条件并允许不同的可能结果。`if / else if / else` 语句是从上到下读取 if ，因此第一个评估为 true 条件是唯一执行的代码块。

在上面的例子中，由于 position 等于 1 计算结果为 false ，所以第一个代码块不会被执行。然后，我们进入 else if 语句，如果 position 等于 2 计算结果为 true ，则第一个 else if 语句中的代码会被执行。其余条件不会被执行。如果所有条件的计算结果都不为 true ，那么 else 语句中的代码就会被执行。

## switch 语句

`else if` 语句非常适合检查多个条件。然而，我们有时会发现需要检查的条件太多，以至于编写所有必要的 else if 语句会让人感到乏味。例如：

```go
clothingChoice := "sweater"

if clothingChoice == "shirt" {
  fmt.Println("We have shirts in S and M only.")
} else if clothingChoice == "polos" {
  fmt.Println("We have polos in M, L, and XL.")
} else if clothingChoice == "sweater" {
  fmt.Println("We have sweaters in S, M, L, and XL.")
} else {
  fmt.Println("Sorry, we don't carry that.")
}
```

在上面的代码中，我们设置了一系列条件来检查值是否与 clothingChoice 变量匹配。我们的代码运行正常，但想象一下，如果我们需要检查更多值！不得不编写额外的 else if 语句，听起来很麻烦！相反，我们可以使用开关 `Switch` 使用更易于阅读和编写的替代语法的语句。以下是 switch 语句的示例：

```go
clothingChoice := "sweater"

switch clothingChoice {
case "shirt":
  fmt.Println("We have shirts in S and M only.")
case "polos":
  fmt.Println("We have polos in M, L, and XL.")
case "sweater":
  fmt.Println("We have sweaters in S, M, L, and XL.")
case "jackets":
  fmt.Println("We have jackets in all sizes.")
default:
  fmt.Println("Sorry, we don't carry that")
}
// Prints: We have sweaters in S, M, L, and XL.
```

让我们分解一下 switch 语句中发生的事情：

- switch 关键字位于语句的开头，后跟一个值。在示例中， switch 后的值与每个 case 后的值进行比较，直到匹配为止。
- 在 switch 语句块 `{ ... }` 中，有多个 case 。 case 关键字检查表达式是否与其后的指定值匹配。第一个 case 后面的值是 "shirt" 。由于 clothingChoice 的值与 "shirt" 不同，因此该 case 的代码不会运行。
- clothingChoice 的值为 "sweater" ，因此第三个 case 的代码运行并打印出 `"We have sweaters in S, M, L, and XL."` 。不再检查其他 case 语句。

在 switch 语句的末尾有一个 default 语句。如果所有 case 都不为真，则将运行 default 语句中的代码。

## 范围简短声明语句

我们还可以在 if 或 switch 中提供条件之前包含一个简短的变量声明语句。语法如下：

```go
x := 8
y := 9
if product := x * y; product > 60 {
  fmt.Println(product, "  is greater than 60")
}
```

在 if 语句中，我们首先声明 product 。注意， product 与 condition 之间用分号 ; 分隔。我们也可以在 switch 语句中添加一个简短的变量声明：

```go
switch season := "summer" ; season {
case "summer":
  fmt.Println("Go out and enjoy the sun!")
}
```

在 if 或 switch 语句中使用短变量声明时，需要注意的是，声明的变量的作用域仅限于语句块。在编程中，作用域指的是变量可以访问。将变量的作用域限定在 if… else if… else 语句或 switch 语句中，意味着该变量只能在这些语句块内访问，而不能在其他任何地方访问。

```go
x := 8
y := 9
if product := x * y; product > 60 {
  fmt.Println(product, "  is greater than 60")
}
fmt.Println(product)
```

上面的代码会抛出错误：

```go
./main.go:11:13: undefined: product
```

即使我们在代码片段中定义了 product ，我们也只能在 if 语句块内访问 product 。因此，当我们尝试在 if 语句块外访问它时，编译器会抛出错误。我们说 product 在 if 语句之外超出了作用域 。

## 随机化

以前，我们使用硬编码值（不会改变的值），然后创建条件 检查这些值。例如

```go
alarmRinging := true
if alarmRinging {
    fmt.Println("Turn off the alarm!!")
}
```

我们知道条件成立，打印语句就会执行。这种确定性通常不是我们使用条件语句的原因。相反，我们创建条件语句是为了解释不同的条件和不同的可能结果。因此，让我们通过生成随机数来为代码引入一些不确定性。Go 有一个 math/rand 库可以帮助我们生成随机整数：

```go
import (
  "math/rand"
  "fmt"
)

func main() {
  fmt.Println(rand.Intn(100))
}
```

在 main 函数中，我们使用 rand 和 Intn() 方法打印出一个随机数。参数为 100 ，该方法返回的最大值是 99。查看整行 `fmt.Println(rand.Intn(100))` ，它应该打印一个从 0 到 99 随机整数。但是，如果我们多次运行程序，就会发现它总是打印 81 。我们将在后面解释为什么会发生这种情况，现在让我们看看 `rand.Intn()` 实际作用。

## 随机种子

之前，我们看到了随机数并非完全随机。这种行为的原因在于 Go 语言如何设定种子 ，或者说选择一个数字作为生成随机数的起点。默认情况下，种子值为 1 。我们可以使用 `rand.Seed()` 方法并传入一个整数来设置新的种子值。但是，如果我们传入一个常量，例如传入 5 ，我们也会遇到同样的问题。每次运行程序时，我们总是会打印同一组数字。因此，每次运行程序时，我们还需要一个唯一的数字作为种子。每次运行程序时获取这个唯一数字的一种方法是使用时间。我们之所以可以使用时间作为唯一数字，是因为程序运行时的时间总是不同的！例如：

```go
package main

import (
  "fmt"
  "math/rand"
  "time"
)

func main() {
  rand.Seed(time.Now().UnixNano())
  fmt.Println(rand.Intn(100))
}
```

在上面的例子中，我们导入了 time 库。然后，我们使用该 time 库并调用 .Now() 函数，并将 .UnixNano() 方法链接到该函数。这将返回自 1970 年 1 月 1 日 `UTC` 时间以来的时间差（以纳秒为单位）。（更多详情，请参阅 [UnixNano 文档](https://golang.org/pkg/time/#Time.UnixNano) ）我们从 `time.Now().UnixNano()` 获取的数字作为参数传递给 `rand.Seed()` 函数，从而导致每次运行程序时都会产生不同的种子值。由于每次运行都有唯一的种子值，因此每次运行都会打印出一个从 0 到 99 随机数。

## 回顾与总结

我们涵盖了以下主题:

- 如何创建 if 语句来检查条件，并在条件 true 时执行代码
- 如何添加 else if 语句来检查附加条件。
- 使用 else 语句，如果前面的条件语句均不为 true ，则默认运行该语句。
- 检查两个操作数并计算布尔值。
- 逻辑运算符检查两个布尔值并返回一个布尔值。
- 语句可用于检查多个条件，类似于 `if… else if… else` 语句。
- 在为 if 或 switch 语句提供条件之前，可以使用简短的变量声明。声明的变量作用域为语句块。
- math/rand 库的 .Intn() 方法用于生成随机数。
- Go 使用种子值作为生成随机数的起点。
- 可以使用时间创建唯一的种子值，即 `rand.seed(time.Now().UnixNano())`

引入条件语句可以让你为代码添加一层逻辑，以应对各种不同的场景。作为开发人员，这是一项重要的基础技能。
