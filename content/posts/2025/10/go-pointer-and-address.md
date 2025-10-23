+++
title = "Go Learn - Pointer, Address"
date = "2025-10-19T13:53:56+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - 指针和地址"
+++

Go 是一种值传递语言。换句话说，我们传递的是函数参数的值 。从技术角度来看，当我们使用参数调用函数时，Go 编译器严格使用参数的值 ，而不是参数本身。由于这个特性（按值传递），函数中发生的更改只会保留在函数内部。想象一下，一位老师带着一群学生，需要学生们完成一张练习题。老师会保留练习题的原件，并复印一份给学生书写，但学生不会直接在老师的复印件上书写。

但是，我们确实有能力从不同的作用域更改值。为此，我们需要利用：

- 地址
- 指针
- 取消引用

现在我们知道了需要参考哪些主题，让我们快速解决这个问题并进入正题！

## 地址

想象一下在课堂上听课的情景。当我们听到一个重要的细节时，我们会把它记在笔记本上，以便日后参考。正是这种将重要信息存储在某个地方的想法，让我们声明了变量。但是，计算机不是把信息写在笔记本上，而是在内存中留出一些空间来存储值。计算机分配的空间称为地址 。每个地址都被标记为唯一的数值。每次使用变量时，我们所做的就是检索存储在变量地址中的值。要查找变量的地址，我们使用 & 运算符，后跟变量名，如下所示：

```go
x := "My very first address"
fmt.Println(&x) // Prints 0x414020
```

当我们看到 0x 前缀时，这意味着该数字是十六进制格式的，这是一种表示 16 位数字的方式。因此， 0x414020 实际上是 x 的十六进制地址。

## 指针

上面我们学习了地址，现在我们来学习如何存储它们。在 Go 中，指针为我们完成这项工作, 即存储地址的变量:

```go
var pointerForInt *int
```

在上面的例子中， pointerForInt 将存储一个 int 数据类型变量的地址。进一步细分， `*` 运算符表示该变量将存储一个地址，而 int 部分表示该地址包含一个整数值。初始化 pointerForInt 后，我们可以像这样为其赋值：

```go
var pointerForInt *int

minutes := 525600

pointerForInt = &minutes

fmt.Println(pointerForInt) // Prints 0xc000018038
```

注意，在我们的例子中， minutes 的值为 525600 ，它是一个整数类型。由于我们已将 pointerForInt 初始化为一个保存整数值地址的指针，因此我们可以将 minutes 的地址（ &minutes ）赋值给 pointerForInt 。打印出 pointerForInt ，我们得到另一个十六进制数： 0xc000018038 。

我们也可以像其他变量一样隐式声明指针：

```go
minutes := 55

pointerForInt := &minutes
```

## 取消引用

我们知道地址是存储值的地方，指针允许我们跟踪地址。但是，如果我们想让地址存储不同的值怎么办？其实，我们可以使用指针来访问地址并更改其值！此操作称为解引用或间接引用 。我们需要在指针上再次使用 `*` 运算符，然后分配一个新值，如下所示：

```go
lyrics := "Moments so dear"
pointerForStr := &lyrics

*pointerForStr = "Journeys to plan"

fmt.Println(lyrics) // Prints: Journeys to plan
```

在我们的例子中，我们有变量： lyrics ，其值为 "Moments so dear" ； pointerForStr ，它是一个指向 lyrics 的指针。然后，我们在 pointerForStr 上使用 `*` 运算符来取消引用它，并赋值一个新值 "Journeys to plan" 。当我们检查 lyrics 的值时，它现在是 "Journeys to plan" ！

## 在不同的作用域内改变值

利用我们对地址、指针以及解引用的了解，让我们回到最初的问题：如何在不同的作用域中更改变量的值？让我们再看一下代码：

```go
func addHundred(num int) {
  num += 100
}

func main() {
  x := 1
  addHundred(x)
  fmt.Println(x) // Prints 1
}
```

即使我们调用 addHundred(x) ， x 的值也不会改变！这是为什么呢？记住，Go 是一种值传递语言。当我们调用 addHundred(x) 时，我们给 addHundred() 传入了一个值 1 。我们实际上并没有提供 x 的地址让 addHundred() 去修改存储在那里的值。如果我们想使用函数改变 x 的值，我们首先需要改变我们的函数：

```go
func addHundred (numPtr *int) {
  *numPtr += 100
}
```

我们的新函数现在有一个指向整数的指针参数。通过将指针的值（即地址）传递给 addHundred() ，我们也可以取消引用该地址，并将它的值加 100 但是，既然 addHundred() 需要一个指针作为参数，我们还需要修改 main() 函数！完整代码如下：

```go
func addHundred (numPtr *int) {
  *numPtr += 100
}

func main() {
  x := 1
  addHundred(&x)
  fmt.Println(x) // Prints 101
}
```

最后一步是向 addHundred() 提供 x 的地址。这样， x 就变成了 101 ！

## 总结与回顾

现在我们可以更改变量值，即使变量超出作用域！本文涵盖了以下概念：

- Go 是一种按值传递的语言。
- 地址是存储值的地方。
- 要查找变量的地址，请在变量前使用 `&` 运算符。
- 指针是存储地址的变量。
- 指针特定于它可以存储什么类型的地址。
- `*` 运算符可用于为指针分配其地址所保存的值的类型。
- `*` 运算符还可用于取消引用指针并分配新值。
