+++
title = "Go Learn - Protobuf & gRPC"
date = "2025-11-05T23:06:32+08:00"
tags = ["go"]
keywords = ["编程语言"]
description = "Go 语言之旅 - Protocol Buffer 与 gPRC"
+++

## 什么是Protocol Buffers和gRPC？

**Protocol Buffers**（简称protobuf）是Google开发的一种数据序列化协议，类似于JSON或XML，但更小、更快、更简单。它使用`.proto`文件定义数据结构，然后通过编译器生成对应语言的代码。

**gRPC**是一个高性能、开源的通用RPC(远程过程调用协议, 允许一台计算机上的程序调用另一台远程计算机上的函数或程序，而无需了解底层网络通信细节)框架，基于HTTP/2协议传输，使用protobuf作为接口定义语言（IDL）和消息交换格式。

## 特点

- **高性能**：二进制格式，序列化/反序列化速度快
- **跨语言**：支持多种编程语言
- **版本兼容**：向前向后兼容性好
- **代码生成**：自动生成客户端和服务端代码

## 环境准备

### 1. 安装Protocol Buffers编译器

```bash
# macOS
brew install protobuf

# Ubuntu
sudo apt-get install protobuf-compiler

# 验证安装
protoc --version
```

### 2. 安装Go的protobuf插件

```bash
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

## 第一个proto文件

创建 `user.proto` 文件：

```protobuf
syntax = "proto3";

package tutorial;

option go_package = "github.com/yourname/yourproject/user";

// 用户消息定义
message User {
  string id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
  UserType user_type = 5;
}

// 用户类型枚举
enum UserType {
  CUSTOMER = 0;
  ADMIN = 1;
  MODERATOR = 2;
}

// 用户服务定义, 包含远程方法定义
service UserService {
  // 创建用户
  rpc CreateUser (CreateUserRequest) returns (CreateUserResponse) {}
  // 获取用户
  rpc GetUser (GetUserRequest) returns (GetUserResponse) {}
  // 列出所有用户
  rpc ListUsers (ListUsersRequest) returns (ListUsersResponse) {}
}

// 请求和响应消息
message CreateUserRequest {
  User user = 1;
}

message CreateUserResponse {
  string user_id = 1;
  bool success = 2;
}

message GetUserRequest {
  string user_id = 1;
}

message GetUserResponse {
  User user = 1;
}

message ListUsersRequest {
  int32 page = 1;
  int32 page_size = 2;
}

message ListUsersResponse {
  repeated User users = 1;
  int32 total_count = 2;
}
```

## 生成Go代码

```bash
protoc --go_out=. --go-grpc_out=. user.proto
```

这将生成两个文件：

- `user.pb.go` - 包含消息结构体
- `user_grpc.pb.go` - 包含gRPC服务接口

## 实现gRPC服务端

创建 `server/main.go`：

```go
package main

import (
  "context"
  "log"
  "net"

  "google.golang.org/grpc"
  pb "github.com/yourname/yourproject/user"
)

type userService struct {
  pb.UnimplementedUserServiceServer
  users map[string]*pb.User
}

func newUserService() *userService {
  return &userService{
    users: make(map[string]*pb.User),
  }
}

func (s *userService) CreateUser(ctx context.Context, req *pb.CreateUserRequest) (*pb.CreateUserResponse, error) {
  user := req.GetUser()

  // 简单的ID生成（实际项目中应使用更可靠的方法）
  user.Id = generateID()

  s.users[user.Id] = user

  log.Printf("创建用户: %s", user.Name)

  return &pb.CreateUserResponse{
    UserId:  user.Id,
    Success: true,
  }, nil
}

func (s *userService) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.GetUserResponse, error) {
  userID := req.GetUserId()
  user, exists := s.users[userID]

  if !exists {
    return nil, fmt.Errorf("用户不存在")
  }

  return &pb.GetUserResponse{
    User: user,
  }, nil
}

func (s *userService) ListUsers(ctx context.Context, req *pb.ListUsersRequest) (*pb.ListUsersResponse, error) {
  var users []*pb.User
  for _, user := range s.users {
    users = append(users, user)
  }

  return &pb.ListUsersResponse{
    Users:      users,
    TotalCount: int32(len(users)),
  }, nil
}

func generateID() string {
  // 简单的ID生成实现
  return fmt.Sprintf("user_%d", time.Now().UnixNano())
}

func main() {
  lis, err := net.Listen("tcp", ":50051")
  if err != nil {
    log.Fatalf("监听失败: %v", err)
  }

  server := grpc.NewServer()
  pb.RegisterUserServiceServer(server, newUserService())

  log.Println("gRPC服务器启动在 :50051")
  if err := server.Serve(lis); err != nil {
    log.Fatalf("服务启动失败: %v", err)
  }
}
```

## 实现gRPC客户端

创建 `client/main.go`：

```go
package main

import (
  "context"
  "log"
  "time"

  "google.golang.org/grpc"
  "google.golang.org/grpc/credentials/insecure"
  pb "github.com/yourname/yourproject/user"
)

func main() {
  conn, err := grpc.Dial("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
  if err != nil {
    log.Fatalf("连接失败: %v", err)
  }
  defer conn.Close()

  client := pb.NewUserServiceClient(conn)
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()

  // 创建用户
  user := &pb.User{
    Name:     "张三",
    Email:    "zhangsan@example.com",
    Age:      25,
    UserType: pb.UserType_CUSTOMER,
  }

  createResp, err := client.CreateUser(ctx, &pb.CreateUserRequest{User: user})
  if err != nil {
    log.Fatalf("创建用户失败: %v", err)
  }
  log.Printf("创建用户成功，用户ID: %s", createResp.GetUserId())

  // 获取用户
  getResp, err := client.GetUser(ctx, &pb.GetUserRequest{UserId: createResp.GetUserId()})
  if err != nil {
    log.Fatalf("获取用户失败: %v", err)
  }
  log.Printf("获取用户: %s, 邮箱: %s", getResp.GetUser().GetName(), getResp.GetUser().GetEmail())

  // 列出用户
  listResp, err := client.ListUsers(ctx, &pb.ListUsersRequest{Page: 1, PageSize: 10})
  if err != nil {
    log.Fatalf("列出用户失败: %v", err)
  }
  log.Printf("总用户数: %d", listResp.GetTotalCount())
}
```

## proto3语法要点

### **1. 语法版本声明**

```protobuf
syntax = "proto3";
```

**必须**是文件的第一行非空非注释内容。`proto3` 是目前主流的版本，比 `proto2` 更简洁，语法规则更清晰。

### **2. 包名**

```protobuf
package tutorial;
```

用于防止消息类型之间的命名冲突，在不同的包中可以有同名的消息。

### **3. 导入**

```protobuf
import "google/protobuf/timestamp.proto";
```

允许你使用其他 `.proto` 文件中定义的消息类型，例如 Protobuf 内置的常用类型。

### **4. 选项**

```protobuf
option java_package = "com.example.tutorial";
```

以 `option` 开头，用于控制特定语言代码生成器的行为。例如 `java_package` 只对 Java 生成器有效。

### **5. 消息 - message**

消息是 Protobuf 的核心，用于定义数据结构。

- **字段规则**:
  - `singular`: 默认规则，一个格式正确的消息可以有 0 个或 1 个此字段（但不能超过1个）。在 `proto3` 中，对于标量类型，如果字段未被设置，会使用类型的默认值（如数字为0，字符串为空串）。
  - `repeated`: 该字段可以重复任意多次（包括零次）。顺序会被保留，相当于列表。
  - `optional` (在 `proto3` 中需要显式声明): 表示该字段是可选的。这允许你区分“字段未设置”和“字段被设置为默认值”。

- **字段类型**:
  - **标量类型**: `string`, `int32`, `int64`, `float`, `double`, `bool`, `bytes` 等。
  - **复合类型**: 其他消息类型或枚举类型。

- **字段标签号**

  ```protobuf
  int32 id = 2;
  ```

  **这是最重要的部分！** 标签号 `= 1`, `= 2` 等用于在消息的二进制格式中标识字段。一旦定义，**永远不要更改**。
  - 标签号 1-15 用一个字节编码，16-2047 用两个字节。所以应将最常用的字段用 1-15。
  - 标签号范围是 1 到 2^29-1 (536,870,911)，但 19000 到 19999 是 Protobuf 的保留范围，不可用。

- **枚举 - `enum`**
  定义一组命名的常量。**第一个枚举值必须为 0**。

### **6. 服务 - service**

当 Protocol Buffers 与 gRPC 一起使用时，用于定义 RPC 服务接口。

```protobuf
service PersonService {
  rpc CreatePerson (Person) returns (Person);
}
```

这定义了一个名为 `CreatePerson` 的远程方法，它接收一个 `Person` 消息作为参数，并返回另一个 `Person` 消息。

### protobuf 语法总结

`.proto` 文件的核心语法可以概括为：

1.  **声明版本**：`syntax = "proto3"`
2.  **定义消息**：使用 `message` 关键字，内部是 `规则 类型 字段名 = 标签号;` 的格式。
3.  **标签号唯一**：每个字段的标签号在同一个消息内必须是唯一的，且一旦使用不应更改。
4.  **支持嵌套和枚举**：可以在消息内定义子消息和枚举类型。
5.  **定义服务**：使用 `service` 和 `rpc` 关键字定义 RPC 接口（可选，用于 gRPC）。

### 服务定义最佳实践

```protobuf
// 使用一致的命名约定
rpc MethodName(RequestMessage) returns (ResponseMessage) {}

// 为每个RPC方法定义独立的请求响应消息
message CreateUserRequest { ... }
message CreateUserResponse { ... }
```

## 运行示例

1. 启动服务端：

```bash
cd server
go run main.go
```

2. 运行客户端：

```bash
cd client
go run main.go
```
