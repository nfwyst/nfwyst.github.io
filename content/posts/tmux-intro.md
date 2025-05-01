+++
title = "Tmux introduction"
date = "2025-03-13T01:00:00+08:00"
tags = ["terminal", "tmux"]
keywords = ["multiplexer", "tmux"]
description = "tmux 介绍与使用"
+++

## 1. **概述**

tmux 是一个终端复用器, 允许用户在一个终端窗口中管理多个窗口和会话, 适用于以下场景:

- 服务器故障时通过 TTY 操作
- 在 VMware 会话中没有完整桌面环境时
- 远程连接不稳定时, 防止会话中断

总的来说, tmux 能够帮助用户同时管理多个窗口和面板,提高工作效率

## 2. **安装与启动**

安装方式根据平台自行选择

- **RHEL or CentOS**: 通过命令行 `yum install tmux` 安装
- **macOS**: 使用命令行 `brew install tmux` 安装

通过命令行 `tmux` 启动并进入 tmux 会话, 进入会话后会看到底部有一栏 status bar, 显示了当前命令, 主机名, 时间和日期

默认的触发键是 `<c-b>`, 触发键结合其他键可以调用 tmux 不同的功能

## 3. **配置**

在 home 目录下创建 `.config/tmux/tmux.conf` 配置文件, 填入基础配置

```conf
# alt + p, r 重新加载配置
unbind r
bind r source-file ~/.config/tmux/tmux.conf

# 解绑 <c-b>
unbind C-b
# 将 alt + p 设置为 leader key, 覆盖默认的 <c-b>
set -g prefix M-p
# 允许 alt + p 发送 leader key, 在嵌套的 tmux 会话中很有用
bind M-p send-prefix
# 支持鼠标操作, 方便调整窗口大小和选择窗口
set -g mouse on
# alt + p 后跟 ` 回到标记的位置, alt + p 后跟 m 可标记 panel
bind \` switch-client -t'{marked}'
# window 以及 panel 显示的基础索引从1 开始, 默认从 0 开始
set -g base-index 1
set -g pane-base-index 1
set-window-option -g pane-base-index 1
# 当一个 window 被删除, 其余 window 自动移动并计算新索引
set -g renumber-windows on
# 复制模式下启用 Vi 风格的键绑定, h/j/k/l 移动光标
set-window-option -g mode-keys vi
# 默认 shell
set-option -g default-shell /opt/homebrew/bin/nu
# 启用焦点事件的传递
set-option -g focus-events on
# alpt + p 后跟 x, 关闭 penel
bind-key x kill-pane

# alt + p, h/l/j/k 在 panel 中移动, 替代默认的箭头键
bind-key -n M-h select-pane -L
bind-key -n M-l select-pane -R
bind-key -n M-j select-pane -D
bind-key -n M-k select-pane -U

# 在当前目录下打开新窗口或 panel
bind c new-window -c "#{pane_current_path}"
bind '"' split-window -v -c "#{pane_current_path}"
bind % split-window -h -c "#{pane_current_path}"

# 调整 panel 大小
bind-key h resize-pane -L
bind-key l resize-pane -R
bind-key j resize-pane -D
bind-key k resize-pane -U

# alt + p, alt + p 在当前和上一个 session 中切换
bind-key M-p switch-client -l

# 通过 alt + i 与左边窗口交换位置
bind -n M-i swap-window -t -1
# 通过 alt + o 与右边窗口交换位置
bind -n M-o swap-window -t +1

# 使用 vi 的可视选择模式
bind-key -T copy-mode-vi v send-keys -X begin-selection
bind-key -T copy-mode-vi C-v send-keys -X rectangle-toggle
bind-key -T copy-mode-vi y send-keys -X copy-selection-and-cancel

# 设置环境变量
setenv -g SNACKS_KITTY 1

# 启用 passthrough, 允许终端控制序列绕过 tmux 的处理，直接传递给终端应用
set -g allow-passthrough on
```

## 3.1 **配置插件管理器**

tpm 是一个 tmux 的插件管理器, 类似于 neovim 中的 lazy.nvim. 通过命令行安装:

```bash
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

在 tmux 配置文件中追加 tpm 相关配置:

```bash
# 插件列表
set -g @plugin 'tmux-plugins/tpm'
# 初始化 tpm
run '~/.config/tmux/plugins/tpm/tpm'
```

## 3.2 **自定义主题**

tmux 默认的 statusline 太过简单, 可以安装第三方主题插件自定义, 在配置文件中新增如下内容:

```conf
# 将状态栏显示在底部
set-option -g status-position bottom
# 主题插件
set -g @plugin 'wfxr/tmux-power'
# 插件主题色系
set -g @tmux_power_theme               'everforest'
# 自定义箭头图标
set -g @tmux_power_right_arrow_icon    ''
set -g @tmux_power_left_arrow_icon     ''
# 不显示用户名及主机名
set -g @tmux_power_show_user           false
set -g @tmux_power_show_host           false
# 自定义日期时间格式
set -g @tmux_power_time_format         '%H:%M:%S'
set -g @tmux_power_date_format         '%m-%d%A'

# 自定义 tmux panel 分割线的样式
set -g pane-border-style "fg=#333333"
set -g pane-active-border-style "fg=#333333"
```

## 3.3 **快捷键提示**

类似 which-key.nvim, [tmux-which-key](https://github.com/alexwforsythe/tmux-which-key) 是一个用于tmux的插件, 允许用户从可定制的弹出菜单中选择操作, 在配置文件中新增如下内容:

```conf
set -g @plugin 'alexwforsythe/tmux-which-key'
```

完成插件管理器, 主题, 快捷键提示配置后需通过命令行 `tmux source ~/.config/tmux/tmux.conf` 重新加载配置文件, 后通过快捷键 `alt + p` 后跟 `shift + i` 安装插件. `alt + p` 后跟 `space` 唤出快捷键提示菜单

## 4. **核心功能**

- **会话管理**:
  - 创建新会话:`tmux new -s <session_name>`
  - 分离会话:`alt + p, d`
  - 重新连接会话:`tmux attach -t <session_name>`
- **窗口管理**:
  - 创建新窗口:`alt + p, c`
  - 切换窗口:`alt + p, <number>` 或 `alt + p, p/n`（前后切换）
- **分屏功能(panel)**:
  - 水平分屏:`alt + p, %`
  - 垂直分屏:`alt + p, "`
  - 切换分屏:`alt + p, <方向键>`
- **复制粘贴**:
  - 进入复制模式:`alt + p, [`
  - 选择文本并复制:使用方向键选择后按 `Ctrl + W`
  - 粘贴:`alt + p, ]`

## 5. **高级功能**

- **鼠标支持**:
  - 启用鼠标模式:`set -g mouse on`
  - 支持调整窗口大小、选择文本等
- **搜索历史**:
  - 在复制模式下,使用 `Ctrl + R` 反向搜索历史命令
- **自定义快捷键**:
  - 可以修改默认快捷键（如将 `alt + p` 改为其他组合）

## 6. **与 zellij 的对比**

- **tmux** 和 **zellij** 都是终端复用器
- zellij 速度比 tmux 快, 基于 rust 开发
- tmux 支持 passthrough 而 zellij 不支持

## 7. **总结**

- tmux 是一个强大的工具,特别适合需要管理多个终端会话的用户
- 通过灵活的分屏、会话管理和快捷键,可以显著提高工作效率
