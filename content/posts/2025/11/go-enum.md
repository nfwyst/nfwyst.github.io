+++
title = "Go Learn - Go Enum"
date = "2025-11-06T19:51:03+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - 枚举"
+++

与其他静态类型语言相比, Go 缺少枚举 、 求和类型 、 带标签的联合类型等. Go 的类型系统功能不够强大。它更接近 C 的类型系统，而不是 Rust 的类型系统。它更注重简洁性，而不是表达力。在 Rust 中，和 Go 一样，错误也只是值。在 Go 中，我们这样写：

```go
user, err := getUser()
if err != nil {
    return fmt.Errorf("failed to get user: %w", err)
}
// do something with user
```

在 Rust 中，我们可以这样做：

```go
let user_result = get_user();
let user = match user_result {
    Ok(user) => user,
    Err(error) => return Err(format!("failed to get user: {}", error)),
};
```

在 Rust 中， get_user 函数返回一个 Result 类型：该类型要么是 `Ok ，要么是` Err 。编译器强制开发者在继续执行正常流程（使用用户数据）之前处理错误情况。在 Go 语言中，开发者可以选择忽略错误值并使用用户数据，即使该数据无效（可能是 nil 或空结构体）。Rust 对枚举的支持使得编写无 bug 代码变得更加容易。

## 类型定义

尽管 `TypeScript` 存在一些缺陷，但它确实拥有非常出色的类型系统。以下是它定义联合类型的方式：

```go
type sendingChannel = "email" | "sms" | "phone";

function sendNotification(ch: sendingChannel, message: string) {
  // send the message
}
```

我们创建的 `sendingChannel` 类型是一个联合类型 。它只能是我们定义的三个字符串之一 。这意味着当开发者调用 `sendNotification()` 方法时，他们不会意外地传递无效的 `sendingChannel` 值，例如“slack”或拼写错误的 `emil`。`TypeScript` 编译器会在编译时捕获到这种错误。

在 Go 语言中，我们没有这些好东西。我们秉持 `Grug` 的思维方式。我们最接近联合类型的东西是类型定义 ：

```go
type sendingChannel string

const (
    Email sendingChannel = "email"
    SMS   sendingChannel = "sms"
    Phone sendingChannel = "phone"
)

func sendNotification(ch sendingChannel, message string) {
    // send the message
}
```

这比在 Go 中使用普通 string 要安全一些 ，但并非完全安全。Go 会阻止我们这样做：

```go
sendingCh := "slack"
sendNotification(sendingCh, "hello") // string is not sendingChannel
```

但这并不会阻止我们这样做：

```go
// "slack" is automatically implied as a sendingChannel
sendNotification("slack", "hello")
```

而且也不会阻止我们这样做：

```go
sendingCh := "slack"
convertedSendingCh := sendingChannel(sendingCh)
sendNotification(convertedSendingCh, "hello")
```

`sendingChannel` 类型只是 string 的一个包装器，而且由于我们创建了一些该类型的常量，大多数开发者都会直接使用这些常量：我们让正确操作变得简单易行。即便如此，Go 仍然不像 `TypeScript` 那样强制我们这样做。

> 虽然 sendingChannel 类型底层是 string, 但 go 仍然视它们为不同的类型

## iota

Go 语言有一个特性，当与类型定义一起使用时（如果你眯起眼睛仔细看），它看起来有点像枚举（但它不是）。它叫做 iota 。

```go
type sendingChannel int

const (
  Email sendingChannel = iota
  SMS
  Phone
)
```

在 Go 语言中， iota 关键字是一个特殊的关键字，它用于生成一个数字序列。该序列从 0 开始，对于 `const` 代码块中的每个常量递增 1。因此，在上面的示例中， Email 为 0， SMS 为 1， Phone 为 2。 Go 开发者有时会使用 iota 来创建一系列常量，以表示一组相关的值，这很像其他语言中的枚举类型。 但请记住，它不是枚举类型，它只是一个数字序列。

> 在 Go 语言的 const 代码块中，如果多个常量共享相同的类型和表达式模式，可以省略后续常量的类型定义和显式赋值
