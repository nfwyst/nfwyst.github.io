+++
title = "Go Learn - the basic"
date = "2025-10-10T21:52:40+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - 基础篇"
+++

Go 或 Golang 是 Google 为内部软件开发开发的一种语言，旨在使他们的软件更易于编写、维护和构建.Go 在开发领域迅速流行起来，常用于编写 API 和 DevOps 工具.Go 介于低级语言和高级语言之间，兼具两者的优点.

特点:

- 使用与许多其他语言（包括“C”）类似的语法
- 速度快内存占用少
- 跨多个平台运行
- 为多线程程序提供简单的语法
- 提供一些面向对象的功能
- 有垃圾收集功能

## 编译文件

现在我们知道了 Go 的用途，让我们学习如何使用 Go 编译器将文件编译为可执行文件, 在终端中，输入 go
build 然后输入文件名，最后按 Enter .如果我们要运行一个名为 greet.go 的文件

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello World")
}
```

命令如下

```go
go build greet.go
```

## 运行文件

虽然运行命令后没有显示任何内容，但 Go 已经创建了程序的可执行文件.如果我们输入命令 ls ，我们将看到原始的 Go 程序及其可执行文件 greet, 要执行该文件，我们调用:
`./greet`, 结果是打印了 Hello World. 我们可以根据需要多次运行该可执行文件

值得庆幸的是，我们有 go run 命令，后面跟着 Go 文件名.我们可以像这样使用 go
run 命令

```go
go run greet.go
```

go run 命令会编译代码（类似 go build ）并执行.与 go build 不同， go
run 不会在当前文件夹中创建可执行文件

## 包

现在我们了解了如何编译和运行 Go 程序，让我们来看看 Go 包, 项目可以包含许多 .go 文件，这些文件被组织成包.每个包就像一个目录：与程序某个部分相关的 .go 文件可以放在一个包中，而与程序其他部分相关的 .go 文件可以放在另一个包中.如果我们正在编写一个计算器程序，我们可以将用于计算的文件放在 calc 包中，将用于输入和输出的文件放在 io 包中我们前面见到的第一个程序中 package
main 这一行称为包声明 ，它告诉 Go 编译器这个 .go 文件属于哪个包.**如果这个包声明是 package
main ，那么这个程序将被编译成可执行文件**, 接下来是空行.Go 通常会忽略这些空行，它们被视为空白 （换行符、空格和制表符）.虽然我们的程序不需要换行符，但它使我们的代码更易于阅读, 然后我们有一个 import 语句 ， import
"fmt"
.import 关键字允许我们使用来自其他包的代码，在本例中是来自 fmt 包的 Println 函数.注意包名是如何用双引号 " 括起来的.

### 函数

现在我们知道了如何声明和使用 Go 包，让我们讨论一下函数. 之前的函数叫 main 函数, 我们使用 func 关键字来声明 Go 函数 main

- func 关键字表示函数声明的开始
- func 后面跟着函数的名称： main
- 名称后面跟着一对括号 () 和一对花括号 {}
- 函数代码写在花括号内

函数内部的代码是缩进的.此处的代码调用 fmt 包（我们之前导入的）中的 Println 函数来打印消息 Hello
World, 通常，我们编写函数时，需要编写代码来调用它们，否则它们就没用了.但是，如果 main 函数位于 main 包中，情况就不同了. 当 main 包中有一个 main 函数时，这对于 Go 来说是特殊的.编译时会生成一个可执行文件，运行时，该可执行文件以 main 函数为起点

### 导入多个包

之前，我们只导入了一个包 fmt
.这个包很有用，但它只是 Go 众多包中的一个, 标准包非常有用，你经常会在每个 .go 文件中使用多个包, 要导入多个包，我们可以添加多个 import 语句

```go
import "package1"
import "package2"
```

或者使用带括号的单个 import:

```go
import (
  "package1"
  "package2"
)
```

### 包别名

我们还可以通过在包名前指定别名来为包提供别名

```go
import (
  p1 "package1"
  "package2"
)
```

在上面的例子中，我们将 package1 别名为 p1 ，现在我们可以通过别名 p1 调用 package1 中的 SampleFunc 函数
`p1.SampleFunc()` 而不是 `package1.SampleFunc()`

## 注释

现在我们已经完成了使用包的基础知识，让我们继续讨论注释, 注释可用于:

- 解释代码的作用以及为什么以某种方式执行某些操作
- 概述需要额外小心的重要或脆弱的代码块
- 记下我们在编写代码时需要做的事情
- 禁用代码但不删除它
- 添加 go doc 工具可获取的信息（稍后会详细介绍）

Go 中有两种类型的注释.分别是单行注释和多行注释, 单行注释以 // 开头，该行的其余部分将被编译器忽略.

```go
// This entire line is ignored by the compiler
// fmt.Println("Does NOT print")
fmt.Println("This gets printed!") // This part gets ignored
```

多行注释它们以 `/*` 开头，以 `*/` 结尾，包含其中的所有内容

```go
/*
This is ignored.
This is also ignored.
fmt.Println("This WON'T print!")
*/
```

## 文档工具

Go 包含一个程序 go
doc 用于从 .go 文件中提取和查看文档.要获取某个包的信息，请使用命令 go
doc 加上包名称或函数名称

```go
go doc fmt.Println
```
