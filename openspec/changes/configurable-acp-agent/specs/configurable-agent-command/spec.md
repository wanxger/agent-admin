## ADDED Requirements

### Requirement: 支持通过 CLI 参数配置 agent 命令
系统 SHALL 支持通过命令行参数指定使用的 ACP agent。

#### Scenario: 使用 --agent 参数指定 agent 命令
- **WHEN** 用户提供 --agent "custom-agent --config X"
- **THEN** 系统启动指定的 agent 进程
- **THEN** 系统使用该 agent 进行 ACP 通信

#### Scenario: 未提供 --agent 参数时使用默认值
- **WHEN** 用户未提供 --agent 参数
- **THEN** 系统使用默认值 "opencode acp"

### Requirement: 支持通过配置文件配置 agent 命令
系统 SHALL 支持通过 YAML 配置文件指定 ACP agent 命令。

#### Scenario: 配置文件包含 agent 字段
- **WHEN** 配置文件包含 agent: "custom-agent --config X"
- **THEN** 系统使用配置的 agent 命令

#### Scenario: 配置文件不包含 agent 字段时使用默认值
- **WHEN** 配置文件不包含 agent 字段
- **THEN** 系统使用默认值 "opencode acp"

### Requirement: CLI 参数优先级高于配置文件
系统 SHALL 在同时提供时优先使用 CLI 参数。

#### Scenario: 同时提供 --agent 和配置文件
- **WHEN** 用户通过 --agent 指定命令且配置文件也包含 agent 字段
- **THEN** 系统使用 CLI 参数指定的命令

### Requirement: libs/prompt 支持 agentCommand 参数
getAcpConnection() 函数 SHALL 支持接受 agentCommand 参数。

#### Scenario: 调用 getAcpConnection 时传递 agentCommand
- **WHEN** 调用 getAcpConnection({ agentCommand: "custom-agent" })
- **THEN** 系统使用指定的 agent 命令启动进程

#### Scenario: 调用 getAcpConnection 时不传递 agentCommand
- ****WHEN** 调用 getAcpConnection() 不传递 agentCommand
- **THEN** 系统使用默认值 "opencode acp"

### Requirement: agentCommand 解析支持复杂命令
系统 SHALL 正确解析和执行包含多个参数的 agent 命令。

#### Scenario: agent 命令包含多个参数
- **WHEN** agentCommand 为 "custom-agent --config /path/to/config --debug"
- **THEN** 系统正确解析命令和参数
- **THEN** 系统使用完整的命令行启动 agent 进程
