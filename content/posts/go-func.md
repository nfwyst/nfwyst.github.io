+++
title = "Go Learn - Function"
date = "2025-10-17T22:50:34+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - 函数"
+++

## 什么是函数？

在编程中，函数是一段可复用的代码块。作为程序员，我们既想找到问题的解决方案，又不想在不必要的情况下做额外的工作。让我们先举个例子，假设我们需要将一个数字翻倍：

```go
x := 5
doubleX := 5 * 2
```

很好，但如果我们需要将另一个数字加倍怎么办？

```go
y := 3
doubleY := 3 * 2
```

还有另一个？？

```go
z := 25
doubleZ := 25 * 2
```

这些简短的代码可能会花费大量的时间和精力（只是为了使数字翻倍！）这就是函数确实能帮上忙的时候。我们可以使用一个函数来定义执行此任务的逻辑，并在需要时调用它 （执行其代码）：

```go
func doubleNum(num int) int {
  return num * 2
}
```

现在不必太担心语法，但它看起来应该很熟悉，因为我们之前已经多次使用过 main() 函数（提醒：主要区别之一是不必调用 main() ，因为编译器已经知道运行它）。我们的 doubleNum() 函数将允许我们传入数字，它返回一个整数，该整数是给定数字的两倍！此外，如果我们的输出开始看起来很奇怪，例如我们的数字没有翻倍，而是翻了三倍，我们知道原因很可能是我们的函数。我们可以直接跳到修复函数的代码，而不必像 doubleX 、 doubleY 和 doubleZ 那样查看每个语句。我们的代码变得更加精简：

```go
fmt.Println(doubleNum(x)) // Prints: 10
fmt.Println(doubleNum(y)) // Prints: 6
fmt.Println(doubleNum(z)) // Prints: 50
```

在后面，我们将介绍更多示例，介绍如何创建和使用函数、何时可以访问函数以及如何在函数内使用`延迟执行`。简而言之，我们将了解函数是如何运作的。

## 使用函数

正如我们之前所见，我们可以将代码打包成一个函数，并在需要运行时调用该函数。我们将从一个简单的函数定义开始讲解函数语法：

```go
func summonNicole() {
  fmt.Println("Hey Nicole, get over here!")
}
```

上面，我们定义了一个名为 summonNicole() 的函数，并在函数体 （花括号之间的部分）打印了一条消息。需要注意的是，函数体中的代码只有在调用该函数时才会运行。我们通过在函数定义之外的某个地方使用函数名和括号来调用函数。我们的整个 main.go 文件可能如下所示：

```go
package main

import "fmt"

func summonNicole() {
  fmt.Println("Hey Nicole, get over here!")
}

func main() {
  // We call our function for the first time
  summonNicole()

  // We call our function for the second time
  summonNicole()
}
```

在我们的示例中，我们定义了函数 summonNicole() ，并在 main() 函数中调用了两次。请注意，我们的函数定义位于 main() 函数之外，但 summonNicole() 调用发生在 main() 函数内部。这将在终端中产生以下输出：

```go
Hey Nicole, get over here!
Hey Nicole, get over here!
```

## 作用域

函数定义会创建一个叫做作用域的东西。我们之前在条件语句中提到过作用域短声明，但重要的是要认识到作用域在函数中扮演着多么重要的角色

作用域是一个概念，指的是值和函数的定义位置以及它们可以被访问的位置。例如，当一个变量在一个函数内定义时，该变量只能在该函数内访问。当我们尝试从不同的函数访问同一个变量时，会报错，因为我们无法访问它。每个函数都有自己特定的作用域，请看下面的代码:

```go
package main

import "fmt"

func performAddition() {
  x := 5
  y := 7
  fmt.Println("The sum of", x, "and", y, "is", x + y)
}

func main() {
  performAddition()
  fmt.Println("What if", x, "was different?")
}
```

上述代码退出时出现以下错误：

```go
./main.go:12:26: undefined: x
```

引发此错误的原因是， main() 打印语句 `fmt.Println("What if", x, "was different?")` 中的 x 与 `performAddition()` 中定义的 x 位于不同的作用域中。在 main() 的作用域中无法直接引用 performAddition() 的 x 变量。

此示例中存在三个不同的作用域：

1. 全局作用域，包含 main() 和 performAddition() 的函数定义。
2. performAddition() 具有局部作用域，它定义 x 和 y
3. main() 也有一个局部作用域。它可以访问 performAddition() 因为它与 main() 定义在同一作用域级别，但无法访问 performAddition 作用域的内部（即 x 或 y ）。

这种作用域的区分保留了`命名空间`、`可用变量`和`关键字`，结果更简洁。你只能引用在特定命名空间内定义的变量或函数。

## 从函数返回值

虽然变量处于函数内部, 但我们有方法将信息从其函数传递到另一个命名空间。让我们描述一下如何将信息从函数内部发送到调用点（即函数被调用的地方）。这是通过返回一个值来实现的——当我们返回一个值时，我们将该值传递到代码中的另一个位置。可以为函数赋予一个返回类型 ，即函数将返回的值的类型。在调用点，返回值可以存储在与函数返回值类型相同的变量中。

```go
func getLengthOfCentralPark() int32 {
  var lengthInBlocks int32
  lengthInBlocks = 51
  return lengthInBlocks
}
```

上面我们编写了 getLengthOfCentralPark() 函数，我们也可以通过在括号后添加类型来决定返回类型。在本例中，我们的函数的返回类型为 int32 。然后，在函数内部，我们声明一个变量 lengthInBlocks ，其值为 51 。在最后一行，我们有 return 语句。return 语句告诉函数返回一个值（或多个值），并停止函数执行任何其他代码，也就是说，如果我们在 return 语句后添加更多代码，它将无法运行！我们的函数已经全部设置完毕，现在我们需要在 main() 中调用它：

```go
func main() {
  var centralParkLength int32
  centralParkLength = getLengthOfCentralPark()
  fmt.Println(centralParkLength) // Prints: 51
}
```

在 main() 内部，我们创建了一个 int32 类型的变量 centralParkLength ，并将 getLengthOfCentralPark() 的结果 （返回值）存储到 centralParkLength 中。然后，我们可以通过打印 centralParkLength 的值来检查它，这验证了我们之前关于 return 的结论，打印数字 51 也证实了这一点。虽然我们无法直接从 getLengthOfCentralPark() 函数访问 lengthInBlocks ，但我们可以通过 return 关键字访问所需的信息！

## 使用函数参数

我们知道函数可以返回信息, 但我们也可以使用参数为函数提供信息, 函数参数是变量, 在函数内部用于某种计算或运算. 调用函数时，我们会提供参数 ，也就是我们希望这些参数变量采用的值。在定义函数时，我们会为函数参数指定类型：

```go
func multiplier(x int32, y int32) int32 {
  return x * y
}
```

在上面的函数中，我们在括号内添加了信息，这就是参数所属的位置。我们的第一个参数是 x ，它的类型是 int32 。我们的第二个参数 y 也是 int32 类型。括号后面是我们之前见过的东西：返回值的类型。由于两个参数的类型相同，我们可以将其写成：

```go
func multiplier(x, y int32) int32 {
  return x * y
}
```

现在让我们使用字面量作为参数来调用我们的函数：

```go
func main() {
  var product int32
  product = multiplier(25, 4)
  fmt.Println(product) // Prints: 100
}
```

我们还可以使用变量作为参数来调用我们的函数：

```go
func main() {
  var mainX, mainY, newProduct int32
  mainX = 6
  mainY = 7
  newProduct = multiplier(mainX, mainY)
  fmt.Println(newProduct) // Prints: 42
}
```

注意，在这两种情况下，我们的函数都能按预期使用提供的参数运行！但是，提供足够的参数非常重要。我们的 multiplier() 函数有两个形参，所以它需要两个参数。如果没有，Go 编译器会抛出一个错误，错误代码为 not enough arguments in call to (functionName) ，在我们的例子中是： not enough arguments in call to multiplier 。
