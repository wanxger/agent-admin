## ADDED Requirements

### Requirement: 基于 ServerSideConnection 实现测试 agent
系统 SHALL 基于 @agentclientprotocol/sdk 的 ServerSideConnection 实现测试 agent。

#### Scenario: 测试 agent 使用 ServerSideConnection
- **WHEN** 初始化测试 agent
- **THEN** 使用 ServerSideConnection 实现
- **THEN** agent 符合 ACP 协议规范

### Requirement: 测试 agent 实现基本功能
测试 agent SHALL 实现接收和处理 ACP 消息的基本功能。

#### Scenario: 测试 agent 接收初始化请求
- **WHEN** 客户端发送初始化请求
- **THEN** 测试 agent 正确响应
- **THEN** 返回有效的协议版本和能力信息

#### Scenario: 测试 agent 接收会话创建请求
- **WHEN** 客户端发送 newSession 请求
- **THEN** 测试 agent 创建会话
- **THEN** 返回有效的 sessionId

#### Scenario: 测试 agent 接收 prompt 请求
- **WHEN** 客户端发送 prompt 请求
- **THEN** 测试 agent 处理 prompt
- **THEN** 返回模拟的响应消息

### Requirement: 测试 agent 支持配置行为
测试 agent SHALL 支持配置不同的响应行为。

#### Scenario: 配置测试 agent 返回固定响应
- **WHEN** 配置测试 agent 返回预定义的响应文本
- **THEN** 所有 prompt 请求返回配置的响应

#### Scenario: 配置测试 agent 模拟错误
- **WHEN** 配置测试 agent 模拟特定错误
- **THEN** 相关请求返回错误响应

### Requirement: 测试 agent 可独立运行
测试 agent SHALL 可作为独立进程运行或内联使用。

#### Scenario: 作为独立进程运行
- **WHEN** 启动测试 agent 进程
- **THEN** agent 通过标准输入输出进行通信
- **THEN** agent 正确处理 ndJSON 协议

#### Scenario: 内联使用（用于单元测试）
- **WHEN** 在测试中内联使用测试 agent
- **THEN** agent 可直接连接使用
- **THEN** 无需启动独立进程

### Requirement: 测试 agent 提供可观测性
测试 agent SHALL 提供日志和状态检查接口。

#### Scenario: 测试 agent 记录接收的消息
- **WHEN** 客户端发送消息
- **THEN** 测试 agent 记录消息内容
- **THEN** 测试代码可验证接收的消息

#### Scenario: 测试 agent 提供状态查询
- **WHEN** 测试代码查询 agent 状态
- **THEN** agent 返回当前会话和消息统计
