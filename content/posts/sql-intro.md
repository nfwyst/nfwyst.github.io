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

CREATE 语句允许我们在数据库中创建新表。你可以随时使用 CREATE 语句从头创建新表。下面的语句创建了一个名为 celebs 的新表。

```sql
CREATE TABLE celebs (
   id INTEGER,
   name TEXT,
   age INTEGER
);
```

- `CREATE TABLE` 是一个告诉 SQL 你想要创建新表的子句。
- celebs 是表的名称。
- `(id INTEGER, name TEXT, age INTEGER)` 是定义表中每一列或属性及其数据类型的参数列表
  - id 是表中的第一列。它存储 `INTEGER` 类型的值
  - name 是表中的第二列。它存储的是 `TEXT` 类型的值
  - age 是表中的第三列。它存储了 `INTEGER` 类型的值

## INSERT INTO 子句(命令)

INSERT 语句将新行插入表中。当你想要添加新记录时，我们可以使用 INSERT 语句。下面的语句将 Justin Bieber 的记录输入到 celebs 表中:

```sql
INSERT INTO celebs (id, name, age)
VALUES (1, 'Justin Bieber', 29);
```

- `INSERT INTO` 是添加指定行或多行的子句。
- celebs 是添加该行的表。
- `(id, name, age)` 是标识将插入数据的列的参数。
- `VALUES` 是一个指示正在插入的数据的子句。
- `(1, 'Justin Bieber', 29)` 是一个标识插入值的参数。
  - 1 ：将添加到 id 列的整数
  - 'Justin Bieber' ：将添加到 name 列的文本
  - 29 ：将添加到 age 列的整数

## SELECT 子句(命令)

SELECT 子句用于从数据库中获取数据。在下面的语句中，SELECT 返回 celebs 表中 name 列中的所有数据。

```sql
SELECT name FROM celebs;
```

- `SELECT` 是一个子句，表示该语句是一个查询。每次从数据库查询数据时，都会使用 SELECT 。
- name 指定要从中查询数据的列。
- `FROM` celebs 指定要查询数据的表名。此语句从 celebs 表中查询数据。

我们还可以使用 SELECT 查询表中所有列的数据:

```sql
SELECT * FROM celebs;
```

`*` 是我们一直在使用的特殊通配符。它允许你选择表中的每一列，而无需逐一命名每一列。这里，结果集包含 celebs 表中的每一列。SELECT 语句总是返回一个称为结果集的新表。

## ALTER 子句(命令)

ALTER TABLE 语句用于向表中添加新列。当你想向表中添加列时，可以使用此命令。下面的语句向 celebs 表中添加了一个新列 twitter_handle :

```sql
ALTER TABLE celebs
ADD COLUMN twitter_handle TEXT;
```

- `ALTER TABLE` 是一个允许我们进行指定更改的子句
- celebs 是正在更改的表的名称
- `ADD COLUMN` 是一个子句，它允许我们向表中添加新列
  - twitter_handle 是正在添加的新列的名称
  - TEXT 是新列的数据类型

`NULL` 是 SQL 中的特殊值，表示缺失或未知的数据。此处, 在添加该列之前存在的行的 twitter_handle 值为 `NULL`.

## UPDATE 子句(命令)

UPDATE 语句用于编辑表中的一行。当你想要更改现有记录时，可以使用 UPDATE 语句。下面的语句将 id 值为 4 的记录的 twitter_handle 更新为 `@taylorswift13`:

```sql
UPDATE celebs
SET twitter_handle = '@taylorswift13'
WHERE id = 4;
```

- `UPDATE` 是编辑表中某一行的子句。
- celebs 是表的名称。
- SET 是一个指示要编辑的列的子句。
  - twitter_handle 是要更新的列的名称
  - `@taylorswift13` 是将要插入到 twitter_handle 列的新值。
- `WHERE` 子句指示要使用新列值更新哪些行。此处，id 列值为 4 的行将把 twitter_handle 更新为 `@taylorswift13`

## DELETE FROM 子句(命令)

DELETE FROM 语句用于从表中删除一行或多行。当我们要删除现有记录时，可以使用该语句。以下语句将删除 celebs 表中 twitter_handle 为 NULL 的记录：

```sql
DELETE FROM celebs
WHERE twitter_handle IS NULL;
```

- `DELETE FROM` 是一个允许你从表中删除行的子句。
- celebs 是我们要从中删除行的表的名称。
- `WHERE` 是一个子句，用于选择要删除的行。这里我们要删除所有 twitter_handle 列为 IS NULL 行。
- `IS NULL` 是 SQL 中的一个条件，当值为 `NULL` 时返回 true，否则返回 false。

## 列的约束

约束可以定义在指定列的数据类型后，这些函数来会被调用以添加有关如何使用该列的信息。它们可用于指示数据库拒绝不符合特定限制的插入数据。以下语句在 celebs表上设置了约束:

```sql
CREATE TABLE celebs (
   id INTEGER PRIMARY KEY,
   name TEXT UNIQUE,
   date_of_birth TEXT NOT NULL,
   date_of_death TEXT DEFAULT 'Not Applicable'
);
```

- `PRIMARY KEY` 列可用于唯一标识行。尝试插入与表中现有行具有相同值的行将导致`约束冲突`, 从而不允许插入新行
- `UNIQUE` 列的每一行都有不同的值。这与 `PRIMARY KEY` 类似，只不过一个表可以有多个不同的 UNIQUE 列
- `NOT NULL` 列必须有值。尝试插入没有 `NOT NULL` 列值的行将导致违反约束，新行将无法插入。
- `DEFAULT` 列采用一个附加参数，如果新行没有为该列指定值，则该参数将成为插入行的假定值。

## 总结与回顾

我们已经学习了六个常用的管理关系数据库中数据的命令，以及如何对这些数据设置约束。到目前为止，我们可以总结出哪些内容呢？

SQL 是一种用于操作和管理存储在关系数据库中的数据的编程语言。

- 关系数据库是将信息组织到一个或多个表中的数据库。
- 表格是按行和列组织的数据集合。

子句是数据库识别为有效命令的字符串。

- `CREATE TABLE` 创建一个新表
- `INSERT INTO` 向表中添加新行
- `SELE` 从表中查询数据
- `ALTER TABLE` 更改现有表
- `UPDATE` 编辑表中的一行
- `DELETE FROM` 从表中删除行
- 约束添加有关如何使用列的信息

## 附录: 什么是 SQLite

SQLite 是一个数据库引擎。它是一款允许用户与关系数据库交互的软件。在SQLite 中，数据库存储在单个文件中——这是它区别于其他数据库引擎的一个特点。这一特性赋予了它极大的可访问性：复制数据库并不比复制存储数据的文件复杂，共享数据库甚至可能意味着发送电子邮件附件。

### SQLite 的缺点

遗憾的是，SQLite 的签名可移植性使其在多个用户同时更新表时（为了维护数据完整性，`每次只能有一个用户写入文件`）成为一个糟糕的选择。由于 SQLite 拥有一些与可访问性相同的特性，因此可能需要进行一些`额外的工作来确保私有数据的安全性`。此外，SQLite 提供的功能与许多其他数据库系统并不完全相同，这限制了其他关系数据库系统提供的一些高级功能。最后，SQLite `不验证数据类型`。许多其他数据库软件会拒绝不符合表架构的数据，而 SQLite 允许用户将任何类型的数据存储到任何列中。

SQLite 会创建模式，用于限制每列的数据类型，但并不强制要求。以下示例显示，id 列应存储整数，name 列应存储文本，age 列应存储整数：

```sql
CREATE TABLE celebs (
   id INTEGER,
   name TEXT,
   age INTEGER
);
```

但是，SQLite 不会拒绝错误类型的值。我们可能会意外地在列中插入错误的数据类型。在同一列中存储不同类型的数据类型是一个坏习惯，可能会导致难以修复的错误，因此即使 SQLite 不会强制执行，严格遵守模式也很重要。

### SQLite 的常见用例

即使考虑到这些缺点，能够在不涉及服务器应用程序的情况下访问和操作数据库的优势也是巨大的。SQLite 在全球范围内被用于测试、开发以及任何其他将数据库与应用程序代码放在同一磁盘上合理的场景。SQLite 的维护者认为它是世界上复制率最高的软件之一。

### 如何安装 SQLite

你可以在 SQLite 下载页面安装 SQLite 的二进制文件。此页面提供适用于 Windows、Mac OS X 和 Linux 的 SQLite 版本。每个文件名中的最后一个数字代表当前的 SQLite 版本。

#### 在 Mac 上安装 SQLite

通过 home brew 命令安装

```sh
brew install sqlite
```

尝试输入 sqlite3 newdb.sqlite 。如果出现 sqlite> 提示符，则表示你已安装 SQLite！输入 control + d 退出。你也可以在提示符中输入 .exit 并按 return 退出。
