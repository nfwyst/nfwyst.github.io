+++
title = "Go Learn - Loop"
date = "2025-10-19T21:46:12+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - 循环"
+++

循环是一种重复代码块直到满足特定条件的方式。循环建立在条件 if 语句的逻辑之上。当 if 语句的条件为真时，其代码块会执行一次。在 for 循环中，代码块会重复执行， 直到条件不再为真。还没在杂货店找到你需要的所有东西吗？那么，当这种情况发生时，你需要一遍又一遍地完成以下步骤：

- 读出购物清单上的一项。
- 在商店中找到该物品。
- 将该商品放入购物车。

机器人可以按照这个循环帮我们在商店购物！就像这些重复性任务在现实生活中很常见一样，它们在编程中也很常见。

## 经典的 For 循环

if 语句允许我们检查一次特定条件。但是，如果该条件需要检查一定次数，该怎么办？可以使用确定循环来重复代码固定的次数。虽然 if 语句只有一个条件表达式（如 number < 5 ），但确定循环还有两个附加组件：

- 初始语句 ，定义循环变量的起始值。例如：number := 0
- 后置语句 ，定义每次循环迭代结束时发生的情况。例如：number++

因此，打印一个小于 5 数字的 if 语句可能如下所示：

```go
number := 3
if number < 5 {
  fmt.Println(number)
}
// Output: 3
```

打印数字 0 、 1 、 2 、 3 和 4 的 for 循环如下所示：

```go
for number := 0; number < 5; number++ {
  fmt.Print(number, " ")
}
// Output: 0 1 2 3 4
```

虽然 if 语句打印一次数字，但 for 循环使用类似的语法打印五次数字。让我们更深入地了解这个明确循环的每个组成部分：

- 初始语句 number := 0 创建一个新变量，用于 for 循环代码块中。
- 条件表达式 number < 5 将在 number 达到目标值 5 时停止循环。
- 每次代码块完成时，后置语句 number++ 都会将 number 变量的值增加 1 。

## For 作为 While 循环

有时不可能提前知道循环需要进行多少次迭代。举个例子，假设一个俱乐部正在举办一场活动来吸引新会员注册。只要有越来越多的人加入，俱乐部就必须处理每一个新注册！在这种情况下，不定循环就可以使用。 不定循环是指只要条件成立就会重复执行的循环。因此，以俱乐部为例，只要有新的注册需要处理，不定循环就可以一直运行。

其他一些例子包括：

- 踩下油门即可加速的汽车。
- 打开旋钮即可加热的炉子。
- 未按下暂停按钮时播放歌曲的音乐播放器。

所有这些示例都展示了在满足某个条件时发生的某种过程。大多数编程语言使用 while 关键字来声明不定循环。然而，确定循环和不确定循环的行为非常相似。因此，Go 简化了语言，对两种类型的循环都只使用 for 关键字。两种循环的语法非常相似，但也存在一些关键的区别。首先，任何循环内部使用的变量都需要提前初始化。其次，对这些变量的任何更新都必须手动包含在代码块中。因此，前面使用确定循环打印数字的示例：

```go
for number := 0; number < 5; number++ {
  fmt.Println(number)
}
```

可以像这样重写为不定循环：

```go
number := 0 // Initialize a variable to be used inside the loop
for number < 5 {
  fmt.Println(number)
  number++ // Update the variable being used
}
```

这两个代码片段都产生相同的输出，它们只是实现相同逻辑的不同方式。如果上述代码不包含 number++ 会发生什么？有时不定循环不会结束，从而形成无限循环。无限循环是条件永远无法达到的循环，导致循环永远运行。有时这可能很危险，因为它会让程序在用户看来卡住了。但对于像 Web 服务器这样需要持续运行的程序来说，这些无限循环, 至关重要。虽然无限循环可以是任何不会结束的循环，但故意创建的无限循环写成如下：

```go
for {
  // Loop body logic
  // This repeats forever
}
// This is never reached
```

## 循环关键字：Break 和 Continue

程序员如何更直接地控制循环？使用 break 和 continue 关键字！break 关键字允许程序员在当前迭代处停止循环。例如，如果使用循环来搜索特定的宠物，则可以在找到该动物时 break 并停止循环：

```go
animals := []string{"Cat", "Dog", "Fish", "Turtle"}
for index := 0; index < len(animals); index++ {
  if animals[index] == "Dog" {
    fmt.Println("Found the perfect animal!")
    break // Stop searching the array
  }
}
```

continue 关键字的作用类似，允许循环跳到下一次迭代。例如，数组中可能填充了糖豆。为了不吃掉那些令人恶心的绿色糖豆，可以使用 continue 语句来跳过它们：

```go
jellybeans := []string{"green", "blue", "yellow", "red", "green", "yellow", "red"}
for index := 0; index < len(jellybeans); index++ {
  if jellybeans[index] == "green" {
    continue
  }
  fmt.Println("You ate the", jellybeans[index], "jellybean!")
}
```

然而，使用 continue 和 break 语句容易让人对循环的行为方式产生困惑。break 会改变循环的结束时间。而 continue 语句则会改变每个循环中发生的情况。虽然这些关键词并不总是最好的选择，但它们对于遍历数组非常有效

## 循环和数组

映射和数组是最基础的数据结构之一。在任何代码库中，读取和修改它们的内容都是很常见的。幸运的是，它们的属性赋予了它们一种易于使用的语法来循环遍历元素。程序员只需少量代码即可管理大量数据！数组包含固定数量的元素。在 Go 中，可以使用 range 关键字在循环中逐个遍历这些元素。例如：

```go
letters := []string{"A", "B", "C", "D"}
for index, value := range letters {
  fmt.Println("Index:", index, "Value:", value)
}
```

将输出以下内容：

```go
Index: 0 Value: A
Index: 1 Value: B
Index: 2 Value: C
Index: 3 Value: D
```

此处的 range 关键字用法类似于确定循环的初始语句。它允许程序员分配两个新变量用于数组中每个项目的索引和值。映射的行为相同。但由于映射没有索引，因此 range 会为每个项目提供键值对。

```go
addressBook := map[string]string{
  "John": "12 Main St",
  "Janet": "56 Pleasant St",
  "Jordan": "88 Liberty Ln",
}
for key, value := range addressBook {
  fmt.Println("Name:", key, "Address:", value)
}
```

这将输出以下内容：

```go
Name: John Address: 12 Main St
Name: Janet Address: 56 Pleasant St
Name: Jordan Address: 88 Liberty Ln
```

现在你可以将循环用于 Go 中的映射和数组

## 总结与回顾

循环是任何程序员工具箱中用于自动执行重复任务的主要工具。与 if 语句类似， 循环在满足特定条件时重复执行一段代码。当这些循环重复固定次数的循环称为确定循环 。确定循环的编程方式如下：

```go
for number := 0; number < 5; number++ {
 fmt.Println(number)
}
```

有时无法提前知道迭代次数。在这种情况下，可以使用不定循环 ，只要条件成立，循环就会一直重复。不定循环通常如下所示：

```go
number := 0
for number < 5 {
  fmt.Println(number)
  number++
}
```

但有时，如果不定循环永不结束，就会变成无限循环 。如果用户认为程序已冻结，无限循环可能会带来问题。另一方面，当 Web 服务器需要持续运行时，无限循环就很有用。要按需停止循环，可以使用 break 语句。如果需要跳过循环的当前迭代，也可以使用 continue 语句：

```go
for count := 0; count < 20; count++ {
  if count == 8 {
    continue
  }
  if count == 15 {
    break
  }
  fmt.Println(count)
}
```

range 语句给出了迭代映射和数组的简单语法：

```go
letters := []string{"A", "B", "C", "D"}
for index, value := range letters {
  fmt.Println("Index:", index, "Value:", value)
}
```
