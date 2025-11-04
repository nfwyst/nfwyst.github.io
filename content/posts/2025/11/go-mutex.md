+++
title = "Go Learn - Go Mutex"
date = "2025-11-03T22:35:22+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - 互斥锁"
+++

互斥锁允许我们锁定对数据的访问。这确保我们可以控制哪些 `goroutine` 在何时可以访问哪些数据。Go 的标准库提供了一个内置的互斥锁实现，类型为 `sync.Mutex` ，它有两个方法：

- Lock 锁
- Unlock 开锁

我们可以通过调用 Lock 和 Unlock 来保护一段代码，如下面的 protected() 函数所示。将受保护的代码组织在一个函数中是一种良好的做法，这样就可以使用 defer 来确保我们永远不会忘记解锁互斥锁。

```go
func protected(){
  mu.Lock()
  defer mu.Unlock()
  // the rest of the function is protected
  // any other calls to `mu.Lock()` will block
}
```

互斥锁功能强大。但就像大多数强大的事物一样，如果使用不当，它们也会导致许多漏洞。

## 索引并非线程安全的

Map 不适合并发使用！如果有多个 `goroutine` 访问同一个 Map，并且至少有一个 `goroutine` 正在写入该 Map，则必须使用互斥锁锁定这些 Map。

```go
package main

import (
	"sync"
	"time"
)

type safeCounter struct {
	counts map[string]int
	mu     *sync.Mutex
}

func (sc safeCounter) inc(key string) {
	sc.mu.Lock()
	defer sc.mu.Unlock()
	sc.slowIncrement(key)
}

func (sc safeCounter) val(key string) int {
	sc.mu.Lock()
	defer sc.mu.Unlock()
	return sc.slowVal(key)
}

func (sc safeCounter) slowIncrement(key string) {
	tempCounter := sc.counts[key]
	time.Sleep(time.Microsecond)
	tempCounter++
	sc.counts[key] = tempCounter
}

func (sc safeCounter) slowVal(key string) int {
	time.Sleep(time.Microsecond)
	return sc.counts[key]
}
```

要确保 `safeCounter` 的 inc() 和 val() 方法在多 `goroutine` 环境下安全访问共享数据，需要使用互斥锁来保护对 counts 映射的访问

## 为什么叫“互斥锁”？

`Mutex` 是 mutual exclusion 的缩写，提供互斥的数据结构的常规名称是 `mutex`，通常缩写为 `mu`。它被称为互斥，因为互斥锁会阻止不同的线程（或 `goroutine`）同时访问相同的数据。

互斥锁帮助我们避免的主要问题是并发读/写问题 。当一个线程正在写入一个变量，而另一个线程同时正在读取同一个变量时，就会出现这个问题。当这种情况发生时，Go 程序会崩溃，因为读取器可能正在读取错误数据，而此时数据正在被原地修改。

### 互斥锁示例

```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	m := map[int]int{}

	mu := &sync.Mutex{}

	go writeLoop(m, mu)
	go readLoop(m, mu)

	// stop program from exiting, must be killed
	block := make(chan struct{})
	<-block
}

func writeLoop(m map[int]int, mu *sync.Mutex) {
	for {
		for i := 0; i < 100; i++ {
			mu.Lock()
			m[i] = i
			mu.Unlock()
		}
	}
}

func readLoop(m map[int]int, mu *sync.Mutex) {
	for {
		mu.Lock()
		for k, v := range m {
			fmt.Println(k, "-", v)
		}
		mu.Unlock()
	}
}
```

在这个例子中，我们添加了一个 `sync.Mutex{}` 并将其命名为 mu 。在写入循环中，写入之前会调用 Lock() 方法，写入完成后会调用 Unlock() 方法。这种锁定/解锁的顺序确保在我们锁定互斥锁期间，没有其他线程可以调用 Lock() 方法——任何尝试调用 Lock() 其他线程都会阻塞并等待我们 Unlock() 。在读取器中，我们在遍历映射表之前 Lock() ，并在遍历完成后调用 Unlock() 。现在线程可以安全地共享内存了！

## RW 互斥锁

标准库还公开了一个 `sync.RWMutex`。额外提供了以下用于并发读取的方法：

- RLock
- RUnlock

`sync.RWMutex` 可以提升读取密集型进程的性能。多个 `goroutine` 可以同时安全地从 map 中读取数据，因为可以同时进行多次 `RLock()` 调用从而在多个 `goroutine` 中共享读锁。但是，一次只能有一个 `goroutine` 持有写锁(`Lock()`调用) ，在写锁被持有期间，所有 `RLock()` 操作都会被阻塞。Map 可以安全地进行并发读取访问，但不能进行并发读/写或写/写访问。读/写互斥锁允许所有读取者同时访问 Map，但写入者仍然会阻止所有其他读取者和写入者访问。

```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	m := map[int]int{}

	mu := &sync.RWMutex{}

	go writeLoop(m, mu)
	go readLoop(m, mu)
	go readLoop(m, mu)
	go readLoop(m, mu)
	go readLoop(m, mu)

	// stop program from exiting, must be killed
	block := make(chan struct{})
	<-block
}

func writeLoop(m map[int]int, mu *sync.RWMutex) {
	for {
		for i := 0; i < 100; i++ {
			mu.Lock()
			m[i] = i
			mu.Unlock()
		}
	}
}

func readLoop(m map[int]int, mu *sync.RWMutex) {
	for {
		mu.RLock()
		for k, v := range m {
			fmt.Println(k, "-", v)
		}
		mu.RUnlock()
	}
}
```

通过使用 `sync.RWMutex` ，我们的程序效率更高 。我们可以拥有任意数量的 `readLoop()` 线程，同时确保写入线程拥有独占访问权限。
