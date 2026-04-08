## ADDED Requirements

### Requirement: ACP 客户端正确初始化
系统 SHALL 使用正确的参数初始化 ACP 客户端连接。

#### Scenario: 使用默认工作目录初始化连接
- **WHEN** 未提供 cwd 参数
- **THEN** 系统使用 process.cwd() 作为工作目录
- **THEN** 系统传递正确的协议版本和客户端能力

#### Scenario: 使用自定义工作目录初始化连接
- **WHEN** 提供自定义 cwd 参数
- **THEN** 系统使用指定的工作目录
- **THEN** 系统传递正确的协议版本和客户端能力

### Requirement: 权限请求优先级正确
AcpClient SHALL 根据优先级选择正确的权限选项。

#### Scenario: 优先选择 allow_always
- **WHEN** 权限请求包含 allow_always 选项
- **THEN** 系统选择 allow_always 选项

#### Scenario: 无 allow_always 时选择 allow_once
- **WHEN** 权限请求不包含 allow_always 但包含 allow_once
- **THEN** 系统选择 allow_once 选项

#### Scenario: 无前两者时选择第一个选项
- **WHEN** 权限请求不包含 allow_always 和 allow_once
- **THEN** 系统选择选项列表中的第一个选项

### Requirement: Session 创建和加载正确
系统 SHALL 根据参数选择创建新会话或加载现有会话。

#### Scenario: 未提供 sessionId 时创建新会话
- **WHEN** 未提供 sessionId 参数
- **THEN** 系统调用 connection.newSession()
- **THEN** 系统使用正确的 cwd 和 mcpServers 参数

#### Scenario: 提供 sessionId 时加载现有会话
- **WHEN** 提供 sessionId 参数
- **THEN** 系统调用 connection.loadSession()
- **THEN** 系统使用正确的 sessionId、cwd 和 mcpServers 参数

### Requirement: Prompt 参数正确传递
系统 SHALL 将所有参数正确传递给 ACP 连接。

#### Scenario: Prompt 请求包含完整参数
- **WHEN** 调用 prompt 函数
- **THEN** 系统传递正确的 sessionId 和 prompt 参数
- **THEN** 系统正确捕获 agent_message_chunk 事件
- **THEN** 系统在完成后取消订阅

### Requirement: MCP 服务器参数正确传递
系统 SHALL 正确传递 MCP 服务器配置。

#### Scenario: 创建会话时传递 mcpServers
- **WHEN** 提供了 mcpServers 参数
- **THEN** 系统将 mcpServers 传递给 newSession 或 loadSession

#### Scenario: 未提供 mcpServers 时使用空数组
- **WHEN** 未提供 mcpServers 参数
- **THEN** 系统传递空数组给 newSession 或 loadSession
