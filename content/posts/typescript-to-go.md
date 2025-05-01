+++
title = "Typescript to Go"
date = "2025-03-14T01:20:47+08:00"
tags = ["ts", "js"]
keywords = ["typescript", "javascript"]
description = "微软宣布将 Typescript 编译器迁移到 Golang"
+++

## 1. **背景**：

TypeScript 是现代 Web 开发中最重要的项目之一，但其自身是用 TypeScript 编写的，导致编译器缺乏对低级别优化的支持.

## 2. **重构原因**：

- TypeScript 编译器缺乏直接内存访问、原生多线程等低级别优化支持.
- 为了解决这些问题，Microsoft 决定将 TypeScript 编译器从 TypeScript 迁移到 Go 语言.

## 3. **选择 Go 的原因**：

- **性能提升**：使用 Go 后，编译器速度提升了 10 倍（例如，VS Code 编译时间从 70 秒减少到 7 秒）.
- **编译语言**：Go 是编译语言，可以编译为优化的机器代码，而 JavaScript 是解释型语言.
- **内存管理**：Go 使用垃圾回收机制，相比 C++ 或 Rust 更易于使用.
- **可移植性**：Microsoft 选择 Go 的主要原因是其可移植性，能够将 TypeScript 代码逐行转换为等效的 Go 代码，保留原有行为.

## 4. **影响**：

- 开发者将在大型项目中体验到显著的性能提升，尤其是在 VS Code 中.
- 新的编译器将在 TypeScript 7 中发布，预计需要数月甚至数年的时间才能完全实现.

## 5. **未来展望**：

尽管重构过程漫长，但 Microsoft 的这一决定被认为是选择了最适合的工具，而非盲目追随 Rust 或 Zig 等语言的潮流.

## 6. **总结**:

Microsoft 决定将 TypeScript 编译器从 TypeScript 迁移到 Go 语言，以解决性能瓶颈和低级别优化问题.这一决定不仅提升了编译速度，还为开发者带来了更好的开发体验.尽管重构过程漫长，但这一举措是技术上的重大进步.
