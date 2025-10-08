+++
title = "Fix Ld System Not Found"
date = "2025-04-20T16:26:12+08:00"
tags = ["build", "bob"]
keywords = ["neovim", "ld"]
description = "mac 修复 ld: System 找不到的问题"
+++

最近使用 bob 编译安装最新的 neovim commit 的时候, 遇到
`ld: library 'System' not found 错误`

后排查是由于更新 mac 系统版本后 xcode 路径的问题, 系统升级后没有兼容, 解决方案如下:

1. **确保Xcode命令行工具完整安装**

   ```bash
   xcode-select --install
   sudo xcodebuild -license accept
   ```

2. **重置Xcode路径**

   ```bash
   sudo xcode-select --reset
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   ```

3. **验证SDK路径存在**

   ```bash
   ls /Library/Developer/CommandLineTools/SDKs/
   ```

   如果输出中没有MacOSX.sdk，需要重新安装命令行工具：

   ```bash
   sudo rm -rf /Library/Developer/CommandLineTools
   xcode-select --install
   ```

4. **重试CMake构建**
   ```bash
   bob install HEAD
   ```

- 如果使用Homebrew的CMake，建议更新到最新版本：
  ```bash
  brew update && brew upgrade cmake
  ```
