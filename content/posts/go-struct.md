+++
title = "Go Learn - Struct"
date = "2025-10-23T22:31:55+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - 结构体"
+++

我们经常会遇到很多变量虽然它们彼此相关，但同时使用它们却非常麻烦。幸运的是，Go 提供了一种将多个变量组合成一个自定义数据类型的方法。这些类型使代码更简洁、更直观，并且更不容易出错。在 Go 中，使用 struct 将相关变量分组在一起。在本文中，我们将了解：

- 什么是结构体
- 如何定义结构体
- 如何访问和修改结构体的字段
- 如何编写与结构体一起使用的函数
- 如何在结构体之间彼此嵌套

使用结构体，我们可以定义自定义类型，从而处理任何类型的相关数据。要使用这些结构体，我们需要定义其内部内容。在后面，我们将讨论如何定义可在程序中使用的结构体。

## 定义结构体

我们刚刚了解了结构体的重要性, 对复杂数据类型进行分组, 但是，我们如何定义程序中要用到的结构体呢？结构体的定义包括其名称和字段。字段是内部变量之一, 在结构体内部。我们使用以下模板：

```go
// Struct names begin with a capital letter in Go
type NameOfStruct struct {
  // Struct fields go here
}
```

假设我们要定义一个具有 x 和 y 坐标的二维点。我们可以定义两个变量 x 和 y ，并在整个程序中使用它们。然而，以这种方式使用多个相关变量很容易出错。我们可能会将 x 理解为 y ，而处理多个点可能会造成混淆。

表示二维点的更好方法是创建一个名为 Point 的结构体，其中包含两个坐标。以这种方式定义 Point 可以在逻辑上将相关数据类型组合在一起。我们可以像这样定义 Point 的结构体：

```go
type Point struct {
  x int
  y int
}
```

现在我们已经定义了结构体，接下来我们需要能够使用它们。接下来，我们将了解如何创建我们定义的结构体的实例

## 创建结构体实例

我们已经定义了我们的结构体，但是我们如何基于结构体创建该类型的变量？要使用我们刚刚定义的结构体，我们必须创建它的实例:

```go
p1 := Point{x: 10, y: 12}
```

或者

```go
var p1 = Point{x: 10, y: 12}
```

使用这种标签语法，我们可以为结构体的每个字段定义值。但是，Go 也允许我们使用默认值。我们可以省略某个字段：

```go
p1 := Point{x: 10}
// y will be set to 0
```

事实上，我们可以省略所有字段，仅依赖默认值：

```go
p1 := Point{}
// x and y will be set to 0
```

结构体定义的顺序让我们可以避免标记字段。字段的值是根据结构体中从上到下定义的顺序从左到右分配的。

```go
p1 := Point{10, 12}
// Same as var p1 = Point{10, 12}
```

`当不使用标签时，我们必须为每个字段提供值`, 否则，我们的代码将无法编译。我们已经了解了如何创建结构体实例，但是如何使用它们呢？

## 访问和修改结构体变量

我们已经定义了结构体并创建了实例，现在是时候使用它们了。假设我们有一个 Student 结构体的实例：

```go
john := Student{"John", "Smith", 14, 9}
```

我们可以使用变量名 `.` 和字段名来访问结构体中的各个字段。我们可以像这样访问 John 的名字：

```go
fmt.Println(john.firstName)
```

我们可以使用赋值语句来改变字段的值：

```go
john.age = 15
```

## 访问结构体的方法

我们可以使用方法定义涉及我们结构体的逻辑并简化它。结构体通常具有一些重要的操作。例如，如果一个结构体表示一个几何形状，那么自然需要有方法来计算它的面积和周长。假设我们有一个描述矩形的结构体。该 rectangle 结构体包含两个字段：长度和宽度。我们定义这个结构体：

```go
type Rectangle struct {
  length float32
  width  float32
}
```

我们可以定义一个方法来计算矩形的面积；长度和宽度的乘积。

```go
func (rectangle Rectangle) area() float32 {
  return rectangle.length * rectangle.width
}
```

我们之前介绍 interface 时讲过, go 方法绑定到接收者类型, 我们可以通过接收者类型的变量调用方法, 需要注意的关键是 (rectangle Rectangle) 这一行。这行代码告诉 Go， area() 方法属于 Rectangle 结构体。请注意，与结构体关联的方法是写在结构体外部的！如果我们有一个名为 rect 的 Rectangle 实例，我们可以像这样调用 area() 方法：

```go
rect.area()
```

以这种方式定义方法只会传递矩形的副本：也就是说，我们将无法使用该方法来改变字段的值！如果我们想编写一个允许修改结构体字段值的方法，就必须传入一个指向结构体的指针, 因为指针接收者可以修改原始数据实例，因为它们引用了内存地址。

## 指向结构体的指针

当指针变量被传递给方法时，方法内部只会使用它的副本。我们可以在方法内使用指针来修改结构体中的值。但是我们如何获取指向我们结构体的指针呢？让我们以以下结构体为例:

```go
type Employee struct {
  firstName string
  lastName string
  age int
  title string
}
```

我们必须首先创建一个 Employee 的实例，然后创建一个指向该实例的指针：

```go
func main() {
  steve := Employee{“Steve”, “Stevens”, 34, “Junior Manager”}
  pointerToSteve := &steve
}
```

现在我们可以用这个指针来改变 steve 字段的值。在 Go 中有两种方法可以做到这一点：

```go
(*pointerToSteve).firstName
```

或者更简单，推荐的方法：

```go
pointerToSteve.firstName
```

我们可以使用这些指针来修改方法中的结构体, 考虑以下示例：

```go
type Rectangle struct {
	length float32
	width  float32
}

func (rectangle *Rectangle) modify(newLength float32) {
	rectangle.length = newLength
}

func main() {
	r := Rectangle{1, 2}
	r.modify(3)
	fmt.Println(r) // Print {3, 2}
}
```

在函数 modify() 内部， rectangle 是一个指针。它无需使用解引用运算符即可解引用，就像 pointerToSteve 一样！

## 结构体数组

当处理许多结构体时我们能做什么？我们可以把它们放在一个数组里一起使用！假设我们要创建一个包含以下点的数组：{1, 1} {7, 27} {12, 7} {9, 25}, 我们创建一个 Point 数组，如下所示：

```go
points := []Point{{1, 1}, {7, 27}, {12, 7}, {9, 25}}
```

如果点有名称，我们也可以像这样创建数组：

```go
a := Point{1, 1}
b := Point{7, 27}
c := Point{12, 7}
d := Point{9, 25}

points := []Point{a, b, c, d}
```

我们可以像访问普通数组一样访问该数组的内容。

```go
points := []Point{{1, 1}, {7, 27}, {12, 7}, {9, 25}}

fmt.Println(points[0]) // Output will be {1, 1}
```

我们还可以访问和修改每个数组元素的字段。

```go
points := []Point{{1, 1}, {7, 27}, {12, 7}, {9, 25}}

points[1].x = 8
points[1].y = 16

fmt.Println(points[1]) // Output will be {8, 16}
```

结构体数组允许我们在程序中同时访问多个结构体实例！

## 嵌套结构体

当我们的结构体中有复杂的字段时，这些复杂的字段也可以定义为各自的结构体！例如，在 Employee 结构体中，我们有两个单独的字段，分别用于存储员工的名字和姓氏。我们可以将这两个字段组合起来形成它们自己的名为 Name 的结构体：

```go
type Name struct{
  firstName string
  lastName string
}

type Employee struct{
  name Name
  age int
  title string
}
```

我们像这样创建 Employee 的实例：

```go
carl := Employee{Name{“Carl”, “Carlson”}, 32, “Engineer”}
```

为了访问嵌套结构体的字段（在本例中为 Name ），我们将字段访问链接在一起，如下所示：

```go
fmt.Println(carl.name.lastName) // Output will be “Carlson”
```

我们还可以使用 Name 结构体匿名定义员工结构体，如下所示：

```go
type Employee struct{
  Name
  age int
  title string
}
```

请注意 Name 没有与之关联的变量名。以这种方式组成的结构体允许我们直接从 Employee 结构体访问 firstName 和 lastName 字段。

```go
carl := Employee{Name{“Carl”, “Carlson”}, 32, “Engineer”}

fmt.Println(carl.firstName) // Output will be “Carl”
fmt.Println(carl.lastName) // Output will be “Carlson”
```

当然，我们不能有两个相同类型的匿名字段（即两个 Name 字段），因为这样就无法分辨正在访问哪个字段（如果是两个匿名 Name 字段，则是哪个的 firstName ）。使用匿名字段可以使字段访问更加容易，并使代码更加简洁。
