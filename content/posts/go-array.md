+++
title = "Go Learn - Array"
date = "2025-10-20T20:56:11+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - 数组"
+++

假设我们正在创建一个在线游戏平台，需要跟踪玩家的得分。对于每个玩家，我们需要将他们的得分存储在该玩家的一致索引中。在这种情况下，可以使用数组, 数组是相同类型数据元素的集合，我们可以通过索引访问每个元素 。我们可以把数组想象成一排邮箱，每个索引代表一个门牌号。数组是最常见的变量形式之一, 在程序中使用。我们使用数组来完成以下任务：

- 存储多条输入
- 存储相关的值集合
- 对数字列表执行数学运算

在世界各地，数十亿正在运行的程序都在使用数组！在本文中, 我们将介绍:

- 创建数组
- 访问数组值
- 使用数组的长度

## 创建数组

在程序中使用数组，我们必须首先声明并命名它们。在 Go 中，有多种声明数组的方式。当我们在 Go 中声明一个变量时，编译器：

- 位该变量在内存中查找空间
- 将变量与名称关联

使用数组会使编译器的工作稍微复杂一些。当我们声明单个变量时，编译器需要为该数据类型之一找到足够的空间。当我们声明一个数组时，编译器需要为多个数据类型找到足够的空间。为了简化此过程，在 Go 中声明数组需要提供元素数量。声明后，除非声明新数组，否则无法更改此数量。编译器会根据数组类型乘以元素数量，找到足够的空间。

我们可以创建带有或不带有初始元素集的数组。当程序的其余部分将创建数组的内容时，我们使用不带初始元素集的数组。要创建不带初始元素集的数组，我们使用以下语法：

```go
var playerScores [4]int
fmt.Println(playerScores)
// [0 0 0 0]
```

此语法创建一个包含 4 个元素的整数空数组。我们可以创建一个类似的数组，然后根据用户输入的值填充它。虽然空数组非常适合存储我们无法预测的数据，但有时我们已经知道数组中需要什么！

## 使用元素创建数组

想象一下，我们正在做一些数学作业，并且一遍又一遍地使用相同的三角形。我们可以声明两个数组，分别保存该三角形的边长和角度值。

```go
triangleSides := [3]int{15, 26, 30}
triangleAngles := [...]int{30, 60, 90}
```

注意这两行之间的语法差异。当创建一个包含值的数组时，我们可以让编译器使用 `...` 省略号语法自动确定其长度。现在我们有了一些值，但是如何使用它们来完成数学作业呢?，我们需要访问存储在数组中的值。

## 使用索引访问数组值

我们已经了解了如何创建包含初始值的数组。但是我们如何访问存储在数组中的值呢？虽然程序中有一个数字列表看起来不错，但我们需要访问这些值来进行有用的计算。我们需要使用或修改单个值来执行以下操作：

- 求所有元素的总和（或其他值）
- 更新特定元素的值
- 在数组中搜索特定值

如果不能访问或更改值，数组就只是一个漂亮的列表！为了访问数组的元素，我们使用一种叫做索引的方法。如前所述，数组的每个元素都有一个索引。经常让新程序员感到困惑的一件事是数组开头的索引。Go 使用 0 作为数组的第一个索引，这意味着它将第一个元素存储在索引 0 处 。尝试使用索引 1 访问第一个元素可能很诱人，但这会访问第二个元素。让我们看一下如何访问学生姓名数组，定义如下：

```go
students = [3]string{"Jill", "Fred", "Sasha"}
// Access the first element of the array
fmt.Println(students[0])
// Output: Jill
// Access the third element of the array
fmt.Println(students[2])
// Output: Sasha
// Store the second element into a variable
secondStudent := students[1]
// Print it
fmt.Println(secondStudent)
// Output: Fred
```

访问数组元素很有用，但我们经常需要更改数组中存储的值。修改数组值将是我们下一个的主题。

## 修改数组值

能够检索存储在数组中的值非常有用，但如果我们需要更改它们怎么办？在专业程序中，更改数组值是经常发生的事情。考虑一下：

- 计数或计算一段时间内的值
- 接收有关某条数据的新信息
- 数组内的数据位置发生变化

所有这些场景都需要我们更改数组中初始存储的值。这样做的语法非常简单:

```go
array[index] = value
```

其中 index 是数组中任意有效的索引，value 是任意表达式。假设我们有一个数组：

```go
myArray := [4]int{10, 24, 5, 47}
```

假设我们决定将第三个元素设为 33 。我们可以使用以下代码更改该索引处的数组：

```go
myArray[2] = 33
```

数组的内容现在为 {10, 24, 33, 47}, 我们可以使用此语法来修改 0 到数组长度之间的任何有效索引。接下来我们将了解切片, 这使我们能够为数组`添加额外的长度`!

## 切片简介

到目前为止，我们一直在使用数组，它们的大小是固定的。如果我们想在数组中存储不同数量的元素，就必须创建一个全新的数组。不过，Go 为我们提供了一个实用的替代方案。

切片是一种类似于数组的数据集合类型，但它可以改变大小。首先需要知道如何创建切片。创建切片的方法有很多种。我们可以从数组创建切片，也可以直接创建切片本身。我们先从创建切片本身开始。

```go
// Each of the following creates an empty slice
var numberSlice []int
stringSlice := []string{}

// The following creates a slice with elements
names := []string{"Kathryn", "Martin", "Sasha", "Steven"}
```

虽然最后一个切片目前有四个元素，但我们可以继续使用函数添加元素。我们也可以获取一个数组，并基于该数组创建一个切片。修改切片仍然会更新原始数组。

```go
array := [5]int{2, 5, 7, 1, 3}
// This is a slice of the whole array
sliceVersion := array[:]
fmt.Println(sliceVersion)
// [2 5 7 1 3]
// This is a slice containing the elements at indices 2, 3, and 4
partialSlice := array[2:5]
fmt.Println(partialSlice)
// [7 1 3]
```

切片的元素访问和修改方式与数组相同！既然我们已经知道如何使用数组，我们当然也知道使用切片:

```go
var names = []string{"Kathryn", "Martin", "Sasha", "Steven"}
fmt.Println(names[1])
// Martin
names[3] = "Bishop"
fmt.Println(names[3])
// Bishop
```

## 长度和容量

为什么我们需要计算数组的长度？请描述一下这在哪些场景下会很有用。

### len

len 是一个函数，它返回传递给它的数组或切片的长度：

```go
favoriteThings := [2]string{"Raindrops on Roses", "Whiskers on Kittens"}
fmt.Println(len(favoriteThings))
// 2

fmt.Println(len(nastyThings))
// 3
```

len 用于循环，以及验证是否可以在数组或切片上使用索引。访问超出长度的元素会导致错误。数组只有长度，但当涉及到切片时,还有一个额外的因素需要考虑，那就是容量。

### cap

切片是可调整大小的，因此存在以下区别：

- 它的长度，它当前持有的元素数量
- 它的容量 ，即在需要调整自身大小之前它可以容纳的元素数量。

可以通过 cap 函数访问切片的容量：

```go
slice := []string{"Fido", "Fifi", "FruFru"}
// The slice begins at length 3 and capacity 3
fmt.Println(slice, len(slice), cap(slice))
// [Fido Fifi FruFru] 3 3
slice = append(slice, "FroFro")
// After appending an element when the slice is at capacity
// The slice will double in capacity, but increase its length by 1
fmt.Println(slice, len(slice), cap(slice))
// [Fido Fifi FruFru FroFro] 4 6
```

请注意在上面的例子中，当我们向已满容量的切片中添加一个元素时，发生了以下情况：

- 仍然可以添加新元素
- 长度增加以适应新元素
- 容量增加了一倍。

所有这些都是通过切片自动实现的，而使用数组则无法实现！

## 向切片添加内容

到目前为止，我们已经讨论了数组和切片是什么，以及如何在基本层面上使用它们。然而，使用切片的一个重要方面是我们可以添加元素，并且切片会自动调整大小。但是，如何向切片中添加元素呢？Go 为我们提供了一个函数 append ，它处理添加和调整切片大小的所有逻辑：

```go
books := []string{"Tom Sawyer", "Of Mice and Men"}
books = append(books, "Frankenstein")
books = append(books, "Dracula")
fmt.Println(books)
// [Tom Sawyer Of Mice and Men Frankenstein Dracula]
```

能够向切片中添加新元素非常重要。尤其是当数据随时间推移而来，且我们无法预测时。

## 函数中的数组和切片

所有这些数组和切片功能都很有用，但我们需要能够在 main 之外使用它们。接下来，我们将了解定义函数中使用它们. 我们可以将数组或切片作为参数传递给函数。要将数组参数传递给函数，我们需要提供本地名称、方括号和数据类型。切片参数和数组参数之间的区别在于是否声明元素数量：

```go
func printFirstLastArray(array [4]int) {
  fmt.Println("First", array[0])
  fmt.Println("Last", array[3])
}

func printFirstLastSlice(slice []int) {
  length := len(slice)
  if (length > 0) {
      fmt.Println("First", slice[0])
      fmt.Println("Last", slice[length-1])
  }
}
```

由于 Go 是一种值传递语言，修改普通数组参数不会产生永久性改变。这在执行本地计算时很有用。

```go
// Changes to the array will only be local to the function
func changeFirst(array [4]int, value int) {
  array[0] = value
}
```

为了保留更改，可以使用切片：

```go
// Changes to the slice parameter will be permanent
func changeFirst(slice []int, value int) {
  if (len(slice) > 0) {
      slice[0] = value
  }
}
```

## 总结和回顾

在本文中，我们介绍了与使用数组和切片相关的概念和语法. 数组是大小固定且有序的列表，元素类型相同。数组适用于收集和访问多个相关值。数组和切片都是由相同数据类型的多个元素组成的集合。但是，切片可以调整大小以容纳更多元素，而数组则不能。数组的容量就是它的长度，这个长度是不能改变的。切片既有长度，也有容量，其中：

- 切片的长度是它当前保存的元素数
- 切片的容量是它在需要调整自身大小之前可以容纳的元素数量。
