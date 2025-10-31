+++
title = "Go Learn - Error Handle"
date = "2025-10-30T22:29:16+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - 错误处理"
+++

妥善的错误处理对于维护应用程序的可靠性和用户友好性至关重要。通过在错误发生时及时处理，开发人员可以防止意外崩溃，从而增强程序的健壮性。有效的错误处理还能提供清晰的错误信息，帮助开发人员快速识别和解决问题，从而辅助调试。

在 Go 语言中，错误是通过 error 类型进行管理的，这提供了以下几个优点：

- 促进程序流程的可预测性。
- 便于立即进行错误检查和处理。
- 降低忽略错误的风险。
- 通过错误信息增强调试功能。

Go 程序使用 error 值来表示错误。Error 是任何实现了简单内置错误接口的类型：

```go
type error interface {
  Error() string
}
```

当函数中可能出错时，该函数应在其最后一个返回值中返回 error 。任何调用可能返回 error 函数的代码都应该通过检查错误是否为 nil 来处理错误。

## 错误接口

我们来看看 Atoi 函数是如何使用这种模式的。Atoi 的签名如下：

```go
func Atoi(s string) (int, error)
```

这意味着 Atoi 接受一个字符串参数，并返回两个值：一个整数和一个 error 。如果字符串可以成功转换为整数，Atoi 返回该整数和一个 nil 错误。如果转换失败，则返回零和一个非 nil 错误。以下是安全使用 Atoi 方法：

```go
// Atoi 将包含数字的字符串转换为整数
i, err := strconv.Atoi("42b")
// 如果有错误
if err != nil {
  fmt.Println("couldn't convert:", err)
  // couldn't convert: strconv.Atoi: parsing "42b": invalid syntax
  // 'parsing "42b": invalid syntax' 是通过 .Error() 方法返回的
  return
}
// 如果执行到这里则成功转换
```

错误为 nil 表示成功；错误不是 nil 表示失败。由于错误只是接口，因此你可以构建自己的自定义类型来实现错误接口。下面是实现错误接口的 userError 结构的示例：

```go
type userError struct {
  name string
}

func (e userError) Error() string {
  return fmt.Sprintf("%v has a problem with their account", e.name)
}
```

然后它可以用作错误：

```go
func sendSMS(msg, userName string) error {
  if !canSendToUser(userName) {
      return userError{name: userName}
  }
  ...
}
```

Go 处理错误的方式相当独特。大多数语言将错误视为特殊和不同的东西。例如，Python 引发异常类型，JavaScript 引发并捕获错误。在 Go 中， 错误只是我们像处理任何其他值一样处理的另一个值 - 无论我们想要什么！没有任何特殊的关键字来处理它们。

## 错误包

Go 标准库提供了一个名为“errors”的包，使得处理错误变得容易。请阅读 [`errors.New()`](https://pkg.go.dev/errors#New) 函数的 godoc 文档，但这里有一个简单的例子：

```go
var err error = errors.New("something went wrong")
```

## 恐慌

正如我们所见，在 Go 中处理错误的正确方法是使用 error 接口。将错误逐级传递到调用栈，并像处理普通值一样处理它们：

```go
func enrichUser(userID string) (User, error) {
  user, err := getUser(userID)
  if err != nil {
      // fmt.Errorf is GOATed: it wraps an error with additional context
      return User{}, fmt.Errorf("failed to get user: %w", err)
  }
  return user, nil
}
```

然而，Go 语言还有另一种处理错误的方法： panic 函数。当一个函数调用 panic 时，程序会崩溃并打印堆栈跟踪信息。一般而言， 不要使用恐慌！panic 函数会将控制权从当前函数中抛出，并沿着调用栈向上传递，直到遇到一个延迟调用 recover 的函数。如果没有函数调用 recover ，则 goroutine（通常是整个程序）会崩溃。

```go
func enrichUser(userID string) User {
  user, err := getUser(userID)
  if err != nil {
      panic(err)
  }
  return user
}

func main() {
  defer func() {
      if r := recover(); r != nil {
          fmt.Println("recovered from panic:", r)
      }
  }()

  // this panics, but the defer/recover block catches it
  // a truly astonishingly bad way to handle errors
  enrichUser("123")
}
```

有时，一些 Go 新手开发者看到 panic/recover 时会想：“这就像 try/catch ！我喜欢这个！” 不要像他们那样。对于所有“正常”错误处理，我使用错误值；如果遇到真正无法恢复的错误，我会使用 `log.Fatal` 打印一条消息并退出程序。
