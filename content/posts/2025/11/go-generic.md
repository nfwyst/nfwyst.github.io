+++
title = "Go Learn - Generic"
date = "2025-11-05T20:10:10+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - 泛型"
+++

Go 语言不支持类。长期以来，这意味着 Go 代码在很多情况下难以复用。例如，假设有一段代码将一个切片分割成两个相等的部分。分割切片的代码并不关心切片中存储的值的类型 。在泛型出现之前，我们需要为每种类型编写相同的代码，这非常不符合 `DRY` 原则。

```go
func splitIntSlice(s []int) ([]int, []int) {
    mid := len(s)/2
    return s[:mid], s[mid:]
}
```

```go
func splitStringSlice(s []string) ([]string, []string) {
    mid := len(s)/2
    return s[:mid], s[mid:]
}
```

然而，在 Go 1.18 中，对泛型的支持被发布，有效地解决了这个问题！

## 类型参数

假设我们将一次营销活动的所有电子邮件以数据切片的形式存储在内存中。我们也以同样的方式存储单个用户的付款信息。`getLast` 是一个通用函数，返回切片中的最后一个元素，无论切片中存储的是什么类型。如果切片为空，则返回该类型的零值。

```go
func getLast[T any](s []T) T {
  if len(s) == 0 {
      var zero T
      return zero
  }
  return s[len(s)-1]
}
```

组成部分:

- `T` 类型参数名（可以任意命名，常用 T、K、V 等）
- `any` 类型约束（表示 T 可以是任何类型）
- `[T any]` 整体声明这是一个泛型函数

### 类型零值

创建一个值为零的变量很容易：

```go
var myZeroInt int
```

泛型也是如此，我们只需要一个变量来表示类型：

```go
var myZero T
```

## 为什么选择泛型?

你应该重视泛型，因为它们意味着你可以减少代码量！仅仅因为底层数据类型略有不同，就得一遍又一遍地编写相同的逻辑，这确实令人沮丧。泛型为 Go 开发者提供了一种优雅的方式来编写强大的工具包。虽然你会在应用程序代码中看到并使用泛型，但泛型在库和包中的应用会更加普遍。库和包包含可导入的代码，旨在供多个应用程序使用，因此以更抽象的方式编写它们更有意义。而泛型通常正是实现这一目标的理想选择！Go 语言强调简洁性。换句话说，Go 有意省略了许多功能，以突出其最大的优势：简单易用。根据 Go 语言调查的历史数据 ，缺乏泛型一直是该语言三大问题之一。在某种程度上，缺少泛型这类特性所带来的缺点，足以成为增加语言复杂性的理由。

## 约束条件

有时，你需要让通用函数了解它所操作的类型。我们在第一个练习中使用的示例不需要了解切片中的类型，因此我们使用了内置的 any 约束：

```go
func splitAnySlice[T any](s []T) ([]T, []T) {
    mid := len(s)/2
    return s[:mid], s[mid:]
}
```

约束本质上就是接口，它允许我们编写泛型，使其仅在给定接口类型的约束范围内运行。在上面的例子中， any 约束与空接口相同，因为它意味着所讨论的类型可以是任何类型 。

### 创建自定义约束

例如我们会向客户的信用卡收取不同类型的费用。这些费用包括订阅或电子邮件使用费等。

```go
type lineItem interface {
  GetCost() float64
  GetName() string
}

func chargeForLineItem[T lineItem](newItem T, oldItems []T, balance float64) ([]T, float64, error) {
  cost := newItem.GetCost()
  if balance < cost {
      return nil, 0, errors.New("insufficient funds")
  }
  newItems := append(oldItems, newItem)
  newBalance := balance - cost
  return newItems, newBalance, nil
}
```

在上面的例子中, 我们通过 `newItem.GetCost` 获取项目费用, 比较当前余额 `balance` 与新增项目的费用, 余额不足时返回空切片、零余额和错误信息. 余额充足时, 使用 append 扩展历史记录`oldItems`, 计算并返回新余额

#### 基于类型列表的接口约束

泛型发布的同时，一种新的接口编写方式也随之发布！它规定了：只有被列在这个名单里的类型，才能用作泛型函数的类型参数。

```go
type Ordered interface {
  ~int | ~int8 | ~int16 | ~int32 | ~int64 |
      ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 | ~uintptr |
      ~float32 | ~float64 |
      ~string
}
```

- | 符号表示“或”。所以这整个列表的意思是：这个接口可以被 `int` 或 `int8` 或 `int16` `...` 或 `string` 等类型满足
- ~ 符号是一个波浪号，意思是“底层类型为”。例如，~int 不仅匹配 int 本身，还匹配任何底层类型是 int 的类型别名（如 `type MyInt int`）。

因此 Ordered 接口类型表示的是: 所有整数类型（有符号和无符号）、所有浮点数类型、字符串类型. 假设你想写一个泛型函数 Max，来找出两个值中较大的那个。如果没有 Ordered 约束，你没法写，因为你不知道传进来的类型 T 能不能用 > 比较。 有了 Ordered 约束，你就可以这样写：

```go
// 导入包含 Ordered 定义的包
import "golang.org/x/exp/constraints"

// T 必须是 Ordered “名单”里的类型
func Max[T constraints.Ordered](a, b T) T {
  if a > b { // 因为 T 被 Ordered 约束了，所以这里可以用 > 比较
      return a
  }
  return b
}
```

现在，你可以这样调用这个函数：

```go
Max(3, 5)        // 正确，T 是 int
Max(2.1, 1.8)    // 正确，T 是 float64
Max("a", "b")    // 正确，T 是 string
```

#### 接口的类型参数约束

接口定义的时候也可以接受类型参数 。

```go
// The store interface represents a store that sells products.
// It takes a type parameter P that represents the type of products the store sells.
type store[P product] interface {
  Sell(P)
}

type product interface {
  Price() float64
  Name() string
}

type book struct {
  title  string
  author string
  price  float64
}

func (b book) Price() float64 {
  return b.price
}

func (b book) Name() string {
  return fmt.Sprintf("%s by %s", b.title, b.author)
}

type toy struct {
  name  string
  price float64
}

func (t toy) Price() float64 {
  return t.price
}

func (t toy) Name() string {
  return t.name
}

// The bookStore struct represents a store that sells books.
type bookStore struct {
  booksSold []book
}

// Sell adds a book to the bookStore's inventory.
func (bs *bookStore) Sell(b book) {
  bs.booksSold = append(bs.booksSold, b)
}

// The toyStore struct represents a store that sells toys.
type toyStore struct {
  toysSold []toy
}

// Sell adds a toy to the toyStore's inventory.
func (ts *toyStore) Sell(t toy) {
  ts.toysSold = append(ts.toysSold, t)
}

// sellProducts takes a store and a slice of products and sells
// each product one by one.
func sellProducts[P product](s store[P], products []P) {
  for _, p := range products {
    s.Sell(p)
  }
}

func main() {
  bs := bookStore{
    booksSold: []book{},
  }

    // By passing in "book" as a type parameter, we can use the sellProducts function to sell books in a bookStore
  sellProducts[book](&bs, []book{
    {
      title:  "The Hobbit",
      author: "J.R.R. Tolkien",
      price:  10.0,
    },
    {
      title:  "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      price:  20.0,
    },
  })
  fmt.Println(bs.booksSold)

    // We can then do the same for toys
  ts := toyStore{
    toysSold: []toy{},
  }
  sellProducts[toy](&ts, []toy{
    {
      name:  "Lego",
      price: 10.0,
    },
    {
      name:  "Barbie",
      price: 20.0,
    },
  })
  fmt.Println(ts.toysSold)
}
```

在上面的例子中:

- book 和 toy 都实现了 `product` 接口
- `bookStore` 实现了 `store[book product]` 接口（通过 Sell(book) 方法）
- `toyStore` 实现了 `store[toy product]` 接口（通过 Sell(toy) 方法）

`sellProducts` 函数可以处理不同类型的商店和产品且添加新的产品类型（如 electronics）时，只需实现 product 接口和对应的商店类型

> 使用泛型函数时需要明确传入类型参数, 以便编译时检查确保类型正确性

## 命名泛型类型

T 只是一个变量名，我们可以给类型参数取任何名字 。T 恰好是类型变量一个相当常见的命名约定，类似于 T 是循环中索引变量的命名 `i` :

```go
func splitAnySlice[MyAnyType any](s []MyAnyType) ([]MyAnyType, []MyAnyType) {
    mid := len(s)/2
    return s[:mid], s[mid:]
}
```
