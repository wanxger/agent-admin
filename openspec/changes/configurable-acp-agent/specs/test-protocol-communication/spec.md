## ADDED Requirements

### Requirement: 测试参数传递的完整性
系统 SHALL 验证所有参数通过 ACP 协议正确传递。

#### Scenario: 验证 cwd 参数传递
- **WHEN** 客户端发送 newSession 请求包含 cwd 参数
- **THEN** 测试 agent 接收到正确的 cwd 值

#### Scenario: 验证 mcpServers 参数传递
- **WHEN** 客户端发送 newSession 请求包含 mcpServers
- **THEN** 测试 agent 接收到正确的 mcpServers 配置

#### Scenario: 验证 prompt 内容传递
- **WHEN** 客户端发送 prompt 请求包含 prompt 内容
- **THEN** 测试 agent 接收到正确的 prompt 数据

#### Scenario: 验证 sessionId 参数传递
- **WHEN** 客户端发送 loadSession 或 prompt 请求
- **THEN** 测试 agent 接收到正确的 sessionId

### Requirement: 测试消息收发的正确性
系统 SHALL 验证 ACP 协议消息的收发符合规范。

#### Scenario: 测试初始化握手
- **WHEN** 客户端发起连接初始化
- **THEN** 测试 agent 接收 initialize 请求
- **THEN** 测试 agent 返回 initialized 响应
- **THEN** 握手成功完成

#### Scenario: 测试会话创建和提示流程
- **WHEN** 客户端创建会话并发送 prompt
- **THEN** 测试 agent 接收 newSession 请求
- **THEN** 测试 agent 接收 prompt 请求
- **THEN** 测试 agent 发送 session_update 通知
- **THEN** 测试 agent 返回 prompt 响应

#### Scenario: 测试消息序号和 ID
- **WHEN** 客户端发送多个请求
- **THEN** 测试 agent 接收所有请求
- **THEN** 每个响应对应正确的请求 ID

### Requirement: 测试会话管理
系统 SHALL 验证会话创建、加载和管理的正确性。

#### Scenario: 测试新会话创建
- **WHEN** 客户端调用 newSession
- **THEN** 测试 agent 创建新会话
- **THEN** 返回唯一且有效的 sessionId
- **THEN** 会话状态正确初始化

#### Scenario: 测试现有会话加载
- **WHEN** 客户端调用 loadSession 提供有效 sessionId
- **THEN** 测试 agent 恢复会话
- **THEN** 返回会话成功状态

#### Scenario: 测试无效会话处理
- **WHEN** 客户端使用无效 sessionId
- **THEN** 测试 agent 返回错误
- **THEN** 错误信息明确说明原因

### Requirement: 测试错误处理
系统 SHALL 验证错误场景的协议处理。

#### Scenario: 测试无效参数响应
- **WHEN** 客户端发送格式错误的请求
- **THEN** 测试 agent 返回错误响应
- **THEN** 错误响应包含有效的错误信息

#### Scenario: 测试未实现的请求
- **WHEN** 客户端发送测试 agent 不支持的请求
- **THEN** 测试 agent 返回方法未实现错误

### Requirement: 测试性能和稳定性
系统 SHALL 验证测试 agent 的性能和稳定性。

#### Scenario: 测试并发消息处理
- **WHEN** 客户端快速发送多个请求
- **THEN** 测试 agent 正确处理所有请求
- **THEN** 所有响应在合理时间内返回

#### Scenario: 测试长时间连接稳定性
- **WHEN** 客户端保持连接并定期通信
- **THEN** 测试 agent 保持稳定
- **THEN** 无内存泄漏或连接断开
