+++
title = "Go Learn - the fmt package"
date = "2025-10-15T21:15:18+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - fmt 包"
+++

fmt 是 Go 的核心包之一。我们使用它通过方法 `fmt.Println()` 将信息打印到终端，它帮助我们格式化数据，这就是为什么它有时被称为格式化包.除了 Println()之外，还有 `Print()` 和 `Printf()` 它们各自都有不同的数据打印方式。此外，还有 `Sprint()` 、 `Sprintln()` 和 `Sprintf()` 它们会格式化数据但不会在终端上打印任何内容。我们甚至可以使用 Scan() 获取用户输入。Go 的fmt 包中还有许多其他方法，但在本文中，我们将重点介绍刚才提到的那些。

## 打印方法

`fmt.Println()` 允许我们将数据打印到终端并查看正在处理的数据。它内置了一些默认样式，方便我们查看数据。`fmt.Println` 会打印其参数(括号内的数据)，每个参数之间会包含一个空格，并在末尾添加一个换行符。例如：

```go
fmt.Println("Println", "formats", "really well")
fmt.Println("Right?")
```

请注意，我们的第一个打印语句有 3 个参数，每个参数之间都有一个空格，尽管我们从未在代码中直接包含空格。对于我们的第二个打印语句，由于 Println() 为我们添加了换行符，因此参数被打印在下一行。但是，有时我们可能不需要默认格式。在这种情况下，使用 `fmt.Print()` 可能更合适：

```go
fmt.Print("The answer is", ": ")
fmt.Print("12")
```

上面的代码片段将打印：

```go
The answer is: 12
```

请注意，当 `fmt.Print()` 有多个参数时，不会添加默认空格。此外，由于 `fmt.Print()` 在打印后不会添加换行符，因此第二个 print 语句的参数会与第一个 print 语句的参数打印在同一行。例如:

```go
fmt.Print("Print", "is", "different")
```

将打印出:

```go
Printisdifferent
```

## Printf 方法

使用 `fmt.Println()` 和 `fmt.Print()` , 我们可以连接字符串 ，即将不同的字符串组合成一个字符串. 使用 `fmt.Printf()` ，我们可以插入字符串，或者在字符串中保留占位符，并使用值来填充占位符。让我们使用 `fmt.Printf()` 重新回顾一下这个例子：

```go
guess := "C"
fmt.Printf("Is %v your final answer?", guess)
// Prints: Is C your final answer?
```

我们为 `fmt.Printf()` 提供的第一个参数是字符串： "Is %v your final answer?" 。 %v 部分是占位符，在 Go 中称为动词 。动词由 % 字符后跟字母的组合标识。具体字母表示填充占位符的内容，在本例中， %v 从我们的第二个参数 guess 中获取了 "C" 的值。只要我们提供足够的参数，我们甚至可以添加多个占位符：

```go
selection1 := "soup"
selection2 := "salad"
fmt.Printf("Do I want %v or %v?", selection1, selection2)
// Prints: Do I want soup or salad?
```

注意，参数的位置很重要！如果我们交换 selection1 和 selection2 的位置，它会打印： `Do I want salad or soup?` 。

## 不同的动词

除了 %v 之外，Go 还有许多实用的动词（查看其[文档](https://golang.org/pkg/fmt/#hdr-Printing) 以获取完整列表）。在本练习中，我们将介绍其中几个，从 %T 开始:

```go
specialNum := 42
fmt.Printf("This value's type is %T.", specialNum)
// Prints: This value's type is int.

quote := "To do or not to do"
fmt.Printf("This value's type is %T.", quote)
// Prints: This value's type is string.
```

现在看看 %d ：

```go
votingAge := 18
fmt.Printf("You must be %d years old to vote.", votingAge)
// Prints: You must be 18 years old to vote.
```

使用 %d 我们可以将数字插入到字符串中！如果我们需要包含浮点数：

```go
gpa := 3.8
fmt.Printf("You're averaging: %f.", gpa)
// Prints: You're averaging 3.800000.
```

使用 %f ，我们可以通过 % 和 f 之间添加一个值来限制精度，例如： %.2f 。如果我们在代码中包含这个：

```go
gpa := 3.8
fmt.Printf("You're averaging: %.2f.", gpa)
// Prints: You're averaging 3.80.
```

## Sprint 和 Sprintln

虽然我们一直在使用 fmt 方法来打印内容，但请记住，它是格式化程序包。我们还有其他不打印字符串的方法

```go
grade := "100"
compliment := "Great job!"
teacherSays := fmt.Sprint("You scored a ", grade, " on the test! ", compliment)

fmt.Print(teacherSays)
// Prints: You scored a 100 on the test! Great job!
```

`fmt.Sprint()` 不会打印任何内容。相反，它返回了一个值，我们将其存储在 teacherSays 中。当返回值时，这意味着函数执行了一些计算并返回了计算值。之后，我们可以将返回值用于后续用途。我们将在 Go 函数中更详细地介绍返回值. 现在，我们应该承认返回值和打印值是两回事。在上面的代码中，我们通过连接四个独立的字符串来格式化一个字符串。要查看 teacherSays 的值，我们必须使用 print 语句。

`fmt.Sprintln()` 工作方式与 `fmt.Sprint()` 类似，但它会自动在参数之间包含空格（就像 `fmt.Println()` 与 `fmt.Print()` 的区别一样）:

```go
quote = fmt.Sprintln("Look ma,", "no spaces!")
fmt.Print(quote) // Look ma, no spaces!
```

尽管我们没有在 "Look ma," 中添加尾随空格，也没有在 "no spaces!" 中添加前导空格，但 quote 之间还是连接了一个空格： "Look ma, no spaces!" 。

## Sprintf 方法

如果我们需要插入一个字符串而不打印它，那么我们可以使用 `fmt.Sprintf() `。就像 `fmt.Printf()` 一样， `fmt.Sprintf()` 也可以使用动词：

```go
correctAns := "A"
answer := fmt.Sprintf("And the correct answer is… %v!", correctAns)

fmt.Print(answer) // Prints: And the correct answer is… A!
```

`fmt.Sprintf()` 工作方式与 `fmt.Printf()` 非常相似，主要区别在于 `fmt.Sprintf()` 返回其值而不是将其打印出来

## 获取用户输入

fmt 包中另一个有用的方法是 `fmt.Scan()` ，它允许我们获取用户输入！让我们看一个实际的例子：

```go
fmt.Println("How are you doing?")

var response string
fmt.Scan(&response)

fmt.Printf("I'm %v.", response)
```

我们逐行分析一下：首先，我们在终端上打印 How are you doing? 。然后我们声明一个变量， response ，类型为 string 。 `fmt.Scan(&response)` 会获取空格前的第一个值，并将其存储在 response 中。在终端中，我们会看到：

```go
How are you doing?
good
I'm good.
```

但是，如果我们尝试输入 not bad ：

```go
How are you doing?
not bad
I'm not.
```

仅保存 not 部分，因为它与 bad 之间有一个空格隔开。如果我们需要两个值，则需要声明两个变量：

```go
fmt.Println("How are you doing?")

var response1 string
var response2 string
fmt.Scan(&response1)
fmt.Scan(&response2)

fmt.Printf("I'm %v %v", response1, response2)
```

`fmt.Scan()` 需要地址作为参数，因此在 response1 和 response2 之前使用 `&` 。我们将在后面详细介绍地址。
