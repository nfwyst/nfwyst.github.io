+++
title = "Create Blog With Hugo"
date = "2025-02-28T17:07:27+08:00"
cover = "/img/hugo.png"
tags = ["hugo", "golang"]
keywords = ["golang", "hugo"]
description = "在本文中我们将使用 hugo 创建一个可以存储文章元数据的静态博客站点"
+++

## 使用 hugo 创建 blog

### Hugo 简介

Hugo 是一个基于 Go 语言的静态网站生成器，速度快、免费且安全, 且在性能基准测试中，Hugo 通常优于其他框架

### 创建 Hugo 博客的步骤

#### 安装 Hugo

在 mac 上可以使用 `brew install hugo` 安装 hugo 的扩展版本. 相比标准版, 扩展版本提供更丰富的功能. 其他平台可以访问 [installation](https://gohugo.io/installation/) 根据说明安装

#### 创建 Hugo 站点

通过命令行 `hugo new site` 后跟文件夹路径创建新站点

#### 为 Hugo 站点添加主题

可以通过命令行 `hugo new theme` 后跟主题名称创建新的主题, 也可以访问 [themes](https://themes.gohugo.io) 安装第三方提供的主题, 例如: [terminal](https://github.com/mirus-ua/hugo-theme-re-terminal)
第三方主题一般都可以作为 git 子模块安装, 例如 terminal 可以通过命令行 `git submodule add -f https://github.com/mirus-ua/hugo-theme-re-terminal.git themes/re-terminal` 安装, 安装之前运行命令行 `git init` 确保后续操作可以执行

安装好主题之后, 需要在 hugo.toml 文件中新增字段 `theme` 为themes目录下主题的目录名

#### 创建文章

使用 `hugo new posts/` 后跟文件名称, 创建新的 markdown 文件, 一个文件对应一篇 post. 创建的文件位于 `content` 目录下, 以 markdown 格式编写, 不同主题生成的文件头部有差异, 一般都有 `date`, `title`, `tags` 三个字段分别表示文章创建日期, 标题, 标签, 其余均为特定于主题的头部拓展字段.

#### 插入图片

图片文件需要放在目录 `/static/img/` 下, 使用时通过插入片段 `![alt text](/img/name.png)` 来使用, name 表示真实的图片名称

#### 预览和发布

通过 `hugo server` 命令在本地预览网站，完成后可以部署到互联网, 如果发布到 github pages, 可配置如下 actions 自动构建

```yaml
# Sample workflow for building and deploying a Hugo site to GitHub Pages
name: Deploy Hugo site to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches:
      - main

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

# Default to bash
defaults:
  run:
    shell: bash

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.141.0
    steps:
      - name: Install Hugo CLI
        run: |
          wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
          && sudo dpkg -i ${{ runner.temp }}/hugo.deb
      - name: Install Dart Sass
        run: sudo snap install dart-sass
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5
      - name: Install Node.js dependencies
        run: "[[ -f package-lock.json || -f npm-shrinkwrap.json ]] && npm ci || true"
      - name: Build with Hugo
        env:
          HUGO_CACHEDIR: ${{ runner.temp }}/hugo_cache
          HUGO_ENVIRONMENT: production
          TZ: America/Los_Angeles
        run: |
          hugo \
            --gc \
            --minify \
            --baseURL "${{ steps.pages.outputs.base_url }}/"
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

根据实际情况调整发布的分支和hugo的版本, 分别对应 branches 和 HUGO_VERSION. 如果发布的 domain 默认为 http, 则需要调整 steps.pages.outputs.base_url 和 steps.pages.outputs.page_url 为实际的 https 地址, 因为 github 官方的 actions/configure-pages@v5 在自定义 domain 检测为 http 的情况下输出的是 http 地址
