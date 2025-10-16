+++
title = "Sql Intro"
date = "2025-10-17T01:02:46+08:00"
tags = ["sql"]
description = "SQL 简介"
+++

结构化查询语言是一种用于管理关系数据库中存储的数据的编程语言 SQL 通过简单的声明式语句进行操作。这可以确保数据的准确性和安全性，并有助于维护数据库的完整性, 如今，SQL 语言广泛应用于 Web 框架和数据库应用程序。了解 SQL 可以让我们自由探索数据, 并做出更明智的决策。通过学习 SQL，我们还将学习几乎所有数据存储系统都适用的概念。本文的语句使用 SQLite 关系数据库管理系统 `RDBMS` 。

## 关系数据库

关系型数据库将信息组织到一个或多个表中, 表格是按行和列组织的数据集合。表格有时也称为关系, 比如下面的 SQL 语句:

```sql
SELECT * FROM celebs;
```

上面的语句执行结果是:

| id  | name   | age |
| --- | ------ | --- |
| 1   | justin | 29  |
| 2   | beyond | 42  |
| 3   | swift  | 35  |
| 4   | lin    | 33  |

此处的表格是 celebs, 列是一组特定类型的数据值。这里， id 、 name 和 age 就是列。行是表中的一条记录。celebs 的第一行包含：

- id 为 1
- justin 的姓名
- age 年龄为 29

关系数据库中存储的所有数据都属于特定的数据类型, 一些最常见的数据类型是：

- `INTEGER` ，正整数或负整数
- `TEXT` ，文本字符串
- `DATE` ，日期格式为 `YYYY-MM-DD`
- `REAL` ，十进制值

## 语句

下面的代码是一条 SQL 语句。 语句是数据库`识别为有效命令的文本`。语句始终以分号 `;` 结尾。

```sql
CREATE TABLE table_name (
   column_1 data_type,
   column_2 data_type,
   column_3 data_type
);
```

让我们分解一下语句的组成部分：

- `CREATE TABLE` 是一个子句 。子句在 SQL 中执行特定任务。按照惯例，子句用大写字母书写。子句也可以称为命令。
- `table_name` 指的是应用该命令的表的名称。
- `(column_1 data_type, column_2 data_type, column_3 data_type)` 是一个参数。参数是列、数据类型的列表, 或作为参数传递给子句的值。此处，参数是列名及其关联数据类型的列表。

SQL 语句的结构各不相同。行数无关紧要。一条语句可以全部写在一行，也可以拆分成多行，以便于阅读。在本文中我们将熟悉常见语句的结构。

## CREATE TABLE 子句(命令)

CREATE 语句允许我们在数据库中创建新表。您可以随时使用 CREATE 语句从头创建新表。下面的语句创建了一个名为 celebs 的新表。

```sql
CREATE TABLE celebs (
   id INTEGER,
   name TEXT,
   age INTEGER
);
```

- `CREATE TABLE` 是一个告诉 SQL 您想要创建新表的子句。
- celebs 是表的名称。
- `(id INTEGER, name TEXT, age INTEGER)` 是定义表中每一列或属性及其数据类型的参数列表
  - id 是表中的第一列。它存储 `INTEGER` 类型的值
  - name 是表中的第二列。它存储的是 `TEXT` 类型的值
  - age 是表中的第三列。它存储了 `INTEGER` 类型的值
