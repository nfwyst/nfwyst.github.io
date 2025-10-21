+++
title = "Go Learn - Map"
date = "2025-10-21T19:48:06+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - 映射"
+++

想象一下手机上的联系人列表。我们可以通过姓名搜索找到相关的电话号码。在编程中，我们经常需要将一个数据片段与另一个数据片段连接起来。这种关联正是 Map 最擅长的！我们可以通过键来访问映射中的值。与数组不同，映射中的值不能通过索引访问。映射通过组织检索值来实现非常快速的查找。

我们使用映射来执行以下任务：

- 计算列表中唯一名称出现的次数。
- 将简单标识符（例如员工 ID）映射到相关值。
- 任何时候我们都需要将任何数据与另一数据关联起来！

在本文中，我们将介绍：

- 创建映射
- 访问映射值
- 添加和修改映射中的值
- 删除键值对

## 创建映射

在 Go 中，有两种方法可以创建 map。

1. 使用 make 创建 map, 我们可以使用 make 函数创建一个空的 map。格式如下：

```go
variableName := make(map[keyType]valueType)
```

例如，我们可以创建一个产品名称到价格的空映射：

```go
prices := make(map[string]float32)
```

当我们不知道映射内容是什么时，创建空映射很有用。但有时映射的内容是预先知道的。

2. 创建带有值的映射

如果我们知道一些映射值，我们可以按如下方式指定它们：

```go
variableName := map[keyType]valueType{
    name1: value1,
    name2: value2,
    name3: value3,
}
```

例如，我们可以创建一个联系人列表：

```go
contacts := map[string]int{
    "Joe":    2126778723,
    "Angela": 4089978763,
    "Shawn":  3143776876,
    "Terell": 5026754531,
}
```

## 访问 Map 中的值

通过 Map 可以轻松查找值并将值存储在变量中以供进一步使用：

```go
variable := yourMap[keyValue]
```

但是如果我们从未将请求的键值对添加到映射中会发生什么？如果某个键不在映射中，则返回该值类型的默认值。我们还可以获取第二个返回值来判断该键是否在映射中。

```go
customer, status := contacts["billy"]

if status {
    fmt.Println("we found the customer")
} else {
    fmt.Println("no such customer!")
}
```

这里我们有一个名为 status 的 boolean 可以检查。当 status 为 true 时，表示在 Map 中找到了该键！

## 添加和修改

Map 也很容易添加键值对，或者修改现有键值对的值。在这两种情况下，我们都会指定 Map 名称、键和值：

```go
yourMap[newKey] = newValue
```

因此，要添加新的客户余额，我们可以这样做：

```go
customers["Samantha"] =  1.25
```

我们可以使用相同的格式来更改现有值。格式是一样的！所以当 Samantha 买了另一个甜甜圈时：

```go
customers["Samantha"] =  2.75
```

## 移除键值对

有时我们的映射中有一个不再需要的键。Go 允许我们使用 delete 函数删除元素：

```go
delete(yourMap, keyValueToDelete)
```

假设我们想从手机中删除一个联系人：

```go
delete(contacts, "Gary")
```

如果我们使用 map 中不存在的键调用 delete 函数，则不会发生任何异常。其他语言可能会崩溃或引发异常！
