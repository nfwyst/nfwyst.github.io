+++
title = "What's JSON?"
date = "2025-10-25T18:52:21+08:00"
tags = ["json"]
description = "什么是 JSON?"
+++

在这个数据泛滥的世界里，了解如何处理各种数据变得越来越重要。作为程序员，我们需要能够将填充的数据结构从我们选择的任何语言转换为其他语言和平台可识别和读取的格式。幸运的是，存在这样一种数据交换格式。

## 什么是 JSON?

JSON ，即 JavaScript 对象表示法，是一种流行的、独立于语言的、用于存储和交换数据的标准格式。JSON 已被 ECMA International （一个成立于 1961 年、旨在标准化信息和通信系统的行业协会）采用，已成为促进所有编程语言之间存储和发送数据的事实标准。

## JSON 的常见用途

JSON 被广泛用于在 Web 应用程序中促进客户端（例如 Web 浏览器）和服务器之间的数据传输。此类数据传输的典型示例是填写 Web 表单。表单数据会从 HTML 转换为 JavaScript 对象，再转换为 JSON 对象，然后发送到远程 Web 服务器进行处理。

当公司向其他应用程序公开其数据时，例如 Spotify 共享其音乐库或 Google 共享其地图数据，这些信息都会以 JSON 格式存储。这样，任何应用程序（无论使用何种语言）都可以收集和解析这些数据。

## JSON 语法

由于 JSON 源自 JavaScript 编程语言，因此其外观与 JavaScript 对象相似。示例 JSON 对象表示如下：

```json
{
  "student": {
    "name": "Bob",
    "age": 30,
    "fullTime": true,
    "languages": ["JavaScript", "HTML", "CSS"],
    "GPA": 3.9,
    "favoriteSubject": null
  }
}
```

请注意以下 JSON 语法规则：

- 花括号 {} 包含对象。
- 方括号 [] 包含数组。
- 数据以键：值对的形式存储，以冒号 : 分隔。
- 每个键值对之间用逗号 , 分隔。类似地，数组中的每个项目也用逗号分隔。禁止使用尾随逗号 。
- JSON 中的属性名称必须用双引号 "" 括起来，尽管 JavaScript 名称不受此严格限制。
- JSON 不支持注释。

以下对象是有效的 JavaScript，但不是有效的 JSON：

```javascript
{
  "student": {
    name: "Rumaisa Mahoney",
    "age": 30,
    "fullTime": true,
    "languages": [ "JavaScript", "HTML", "CSS", ],
    "GPA": 3.9,
    'favoriteSubject': null
  }
}
```

1. name 属性没有用双引号引起来。
2. "languages" 数组的最后一项 "CSS" 后面有一个逗号。
3. 'favoriteSubject' 使用单引号而不是双引号。

## JSON 数据类型

JSON 数据类型必须是以下之一：

- 字符串（必须用双引号引起来，就像属性名称一样）
- 数字（整数或浮点数）
- 对象（键：值对）
- 数组（逗号分隔的值）
- 布尔值（ true 或 false ，不带引号）
- null

尝试查找此 JSON 示例中的所有数据类型：

```json
{
  "student": {
    "name": "Bob",
    "age": 30,
    "fullTime": true,
    "languages": ["JavaScript", "HTML", "CSS"],
    "GPA": 3.9,
    "favoriteSubject": null
  }
}
```

值得注意的是，JSON 并非涵盖所有数据类型。JSON 中未表示的类型（例如日期）可以存储为字符串，并转换为特定于语言的数据结构。以下是 ISO 8601 中可接受的国际认可的日期格式：

```sh
"2014-01-01T23:28:56.782Z"
```

这种格式包含类似于日期和时间的部分。然而，作为字符串，编程语言很难直接使用它。好在每种编程语言都内置了 JSON 功能，可以将这种字符串转换为更易读、更易用的格式，例如：

```sh
Wed Jan 01 2014 13:28:56 GMT-1000 (Hawaiian Standard Time)
```

## 总结

- 有限的数据类型: 仅支持字面量表示
  - 字符串
    - 仅支持双引号
  - 数字
    - 仅支持整数或浮点数
  - 对象
  - 数组
  - 布尔值
  - null
- 对象的键必须用双引号引起来
- 不能使用尾随逗号(最后一个元素后面跟一个逗号)
- 不能使用注释
