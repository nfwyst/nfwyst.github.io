+++
title = "Go Learn - Channels"
date = "2025-11-02T16:55:54+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - 通道"
+++

什么是并发？并发是指同时执行多个任务的能力。通常情况下，我们的代码是逐行执行的，这被称为顺序执行或同步执行 。如果运行代码的计算机拥有多个核心，我们甚至可以同时执行多个任务。如果只有单个核心，则单个核心可以通过快速切换任务来几乎同时执行代码。无论哪种情况，我们用 Go 编写的代码看起来都一样，并且都能充分利用所有可用资源。

## Go 语言中并发是如何工作的？

Go 语言的设计初衷就是为了实现并发，这是 Go 语言独有的特性。它擅长使用简洁的语法安全地同时执行多个任务。在我看来，目前还没有任何一种流行的编程语言能够像它一样优雅地实现并发执行。并发实现非常简单，只需在调用函数时使用 go 关键字即可：

```go
go doSomething()
```

在上面的例子中， `doSomething()` 将与函数中的其余代码并发执行。go 关键字用于用于创建一个新的 `goroutine` 。

```go
package main

import (
	"fmt"
	"time"
)

func sendEmail(message string) {
  // 使用 go 关键字创建新的 goroutine 来并发执行匿名函数
	go func() {
		time.Sleep(time.Millisecond * 250)
		fmt.Printf("Email received: '%s'\n", message)
	}()
  // 这行代码会立即执行，不会等待上面的 goroutine
	fmt.Printf("Email sent: '%s'\n", message)
}

// 以下为测试代码，无需修改
func test(message string) {
	sendEmail(message)
	time.Sleep(time.Millisecond * 500)
	fmt.Println("========================")
}

func main() {
	test("Hello there Kaladin!")
	test("Hi there Shallan!")
	test("Hey there Dalinar!")
}
```

`sendEmail` 函数在未加 go 关键字之前是同步执行的, 这意味着 `Email received` 会先于 `Email send` 打印. 加了 go 关键字后该匿名函数将并发执行, Email sent 会立即执行, 并发执行的匿名函数异步执行, `Email received` 的消息会在 250 毫秒后由并发的 `goroutine` 打印出来, test 函数中的 500 毫秒延时确保了所有 `goroutine` 都能完成执行

## 通道

通道是一种类型化的、 线程安全的队列。通道允许不同的 `goroutine` 相互通信。

### 创建通道

与 Map 和 slice 一样, 通道也必须先创建才能使用, 它们也使用相同的 make 关键字:

```go
ch := make(chan int)
```

### 将数据发送到通道

```go
ch <- 69
```

<- 运算符被称为通道运算符, 数据沿箭头方向流动, 此操作会阻塞, 直到另一个 `goroutine` 准备好接收该值

### 从通道接收数据

```go
v := <- ch
```

此操作会从通道中读取并移除一个值, 并将其保存到变量 v 中, 此操作会阻塞, 直到通道中有值需要读取为止

### 引用类型

与映射和切片一样, 通道是引用类型, 这意味着默认情况下它们是按引用传递的:

```go
func send(ch chain int) {
  ch <- 99
}

func main() {
  ch := make(chan int, 1)
  send(ch)
  fmt.Println(<-ch) // 99
}
```

`make(chan int, 1)` 表示创建一个带缓冲区的整数类型通道，缓冲区大小为 1。

### 阻塞和死锁

死锁是指一组 `goroutine` 全部阻塞，导致它们都无法继续执行。这是并发编程中一个常见的 bug，需要格外注意。

```go
package main

import (
	"time"
)

type email struct {
	body string
	date time.Time
}

func checkEmailAge(emails [3]email) [3]bool {
	isOldChan := make(chan bool)

	sendIsOld(isOldChan, emails)

	isOld := [3]bool{}
	isOld[0] = <-isOldChan
	isOld[1] = <-isOldChan
	isOld[2] = <-isOldChan
	return isOld
}

func sendIsOld(isOldChan chan<- bool, emails [3]email) {
	for _, e := range emails {
		if e.date.Before(time.Date(2020, 0, 0, 0, 0, 0, 0, time.UTC)) {
			isOldChan <- true
			continue
		}
		isOldChan <- false
	}
}
```

`chan<- bool` 中的 `<-` 表示这个通道只能写入, 也就是在 `sendIsOld` 函数内, `isOldChan` 只能用于写入不能读取, 这被称为通道方向, 是 go 语言的类型安全特性, 运行程序。你会发现它陷入了死锁，永远不会退出。`sendIsOld` 函数试图通过通道发送数据，但没有其他用来接收来自该通道的值的 `goroutine` 正在运行。我们可以通过生成一个 `goroutine` 来发送数据, 从而修复死锁:

```go
package main

import (
	"time"
)

type email struct {
	body string
	date time.Time
}

func checkEmailAge(emails email) bool {
	isOldChan := make(chan bool)

	// 修复：使用 goroutine 来发送数据
	go sendIsOld(isOldChan, emails)

	isOld := bool{}
	isOld = <-isOldChan
	isOld = <-isOldChan
	isOld = <-isOldChan
	return isOld
}

func sendIsOld(isOldChan chan<- bool, emails email) {
	for _, e := range emails {
		if e.date.Before(time.Date(2020, 0, 0, 0, 0, 0, 0, time.UTC)) {
			isOldChan <- true
			continue
		}
		isOldChan <- false
	}
}
```

执行流程：

1. 主 goroutine 启动发送 goroutine
2. 主 goroutine 开始从通道接收数据（会阻塞等待）
3. 发送 goroutine 向通道发送数据
4. 主 goroutine 接收到数据后继续执行

### 用作信号

有时我们并不关心通道中传输的内容 ，我们只关心何时以及是否有数据通过通道传输。在这种情况下，我们可以使用以下语法阻塞并等待通道被写入数据。

```go
<-ch
```

这将阻塞，直到从通道中弹出一个值，丢弃该值后继续。在这种情况下， 空结构体通常用作一元值，以便发送方传达这只是一个“信号”，而不是接收方要捕获和使用的数据。以下是一个例子：

```go
func downloadData() chan struct{} {
	downloadDoneCh := make(chan struct{})

	go func() {
		fmt.Println("Downloading data file...")
		time.Sleep(2 * time.Second) // 模拟下载时间

		// 下载完成后发送一个空结构体作为完成信号
		downloadDoneCh <- struct{}{}
	}()

	return downloadDoneCh
}

func processData(downloadDoneCh chan struct{}) {
	fmt.Println("Preparing to process data...")

	// 阻塞直到 downloadData 发送完成信号
	<-downloadDoneCh

	fmt.Println("Data download complete, starting data processing...")
}

processData(downloadData())
// Downloading data file...
// Preparing to process data...
// Data download complete, starting data processing...
```

### 缓冲通道

你可以将缓冲区长度作为第二个参数传递给 make() 函数，以创建缓冲通道：

```go
ch := make(chan int, 100)
```

缓冲区允许通道在发送数据块之前先保存固定数量的值。这意味着，在带缓冲区的通道上发送数据时，只有当缓冲区满时才会阻塞；而接收数据时，只有当缓冲区为空时才会阻塞。

### 关闭通道

通道可以由发送方显式关闭：

```go
ch := make(chan int)
close(ch)
```

与在 map 中访问数据时检查 ok 值类似，接收器在从通道接收数据时可以检查 ok 值，以测试通道是否已关闭。

```go
v, ok := <-ch
```

如果通道为空且已关闭，则 ok 为 false 。在已关闭的通道上发送数据会导致程序崩溃。主 goroutine 中的 panic 会导致整个程序崩溃，而任何其他 goroutine 中的 panic 都会导致该 goroutine 崩溃。关闭通道并非必要。保持通道开放并无不妥，即使未使用，它们仍然会被垃圾回收。你应该关闭通道，以明确告知接收器不会再有其他数据写入。

### 迭代通道

与切片和映射类似, 通道也可以通过 range 迭代循环:

```go
for item := range ch {
  // item 是来自通道中的下一个值
}
```

此示例将通过通道接收值（如果每次迭代都没有新值，则会阻塞），并且只有在通道关闭时才会退出。

### 同时监听多个通道

有时我们有一个 goroutine 监听多个通道，并且希望按照数据通过每个通道的顺序处理数据。select 语句用于同时监听多个通道。它类似于 switch 语句，但用于监听多个通道。

```go
func logMessages(chEmails, chSms chan string) {
  for {
      select {
      case email, ok := <-chEmails:
          if !ok {
              return
          }
          logEmail(email)
      case sms, ok := <-chSms:
          if !ok {
              return
          }
          logSms(sms)
      }
  }
}
```

第一个有待接收值的通道将被触发，其响应体将被执行。如果多个通道同时准备就绪，则会随机选择一个。上述示例中的 ok 变量指的是通道是否已被发送方关闭。如果通道关闭（!ok），立即从函数返回, 如果通道没有被关闭，调用对应的日志函数记录消息, 且任一通道先关闭时，函数都会立即返回.

如果其他通道没有可用的值， select 语句中的 default 分支会立即执行。 default 分支可以防止 select 语句阻塞:

```go
select {
case v := <-ch:
  // use v
default:
  // receiving from ch would block
  // so do something else
}
```

有时你可能需要忽略某个通道的值。你可以通过不将其绑定到变量来实现这一点：

```go
select {
case <-ch:
  // event received; value ignored
default:
  // so do something else
}
```

或者，你可以使用空白标识符 `_` 来忽略该值：

```go
select {
case _ = <-ch:
  // event received; value ignored
default:
  // so do something else
}
```

### 与时间相关的内置通道

time 包提供了一些内置工具函数, 帮助我们创建与时间相关的通道:

- `time.Tick` 返回一个按给定时间间隔写入值的通道
- `time.After` 在指定时间之后写入一次值的通道
- `time.Sleep` 阻塞当前 `goroutine` 指定持续时间

这些函数接受一个 `time.Duration` 类型的参数, 例如:

```go
time.Tick(500 * time.Millisecond)
```

如果不指定 `time.Millisecond` 单位（例如毫秒），则默认单位为纳秒。

### 只读通道

可以通过将通道从 chan 强制转换为 `<-chan` 类型，将通道标记为只读。例如：

```go
func main() {
  ch := make(chan int)
  readCh(ch)
}

func readCh(ch <-chan int) {
  // ch can only be read from
  // in this function
}
```

### 只写通道

对于只写通道也是如此，但箭头的位置会移动。

```go
func writeCh(ch chan<- int) {
  // ch can only be written to
  // in this function
}
```
