## Why

当前实现硬编码使用 `opencode acp` 作为 ACP agent，缺乏灵活性。集成测试依赖外部 opencode 命令，增加了环境依赖和测试不稳定性。需要支持配置任意 ACP agent，并基于 SDK 实现可控的测试 agent。

## What Changes

- **BREAKING**：`libs/prompt` 支持 agentCommand 配置参数（通过 CLI 参数或初始化参数）
- 修改 `libs/prompt/src/utils/agent.ts`：`getAgentProcess()` 支持自定义 agent 命令
- 修改 `libs/prompt/src/utils/connection.ts`：`getAcpConnection()` 接受 agentCommand 参数
- 新增测试 agent 实现：基于 ServerSideConnection 的 mock agent
- 修改集成测试：使用自实现的测试 agent 替代外部 opencode
- 更新 `setup-tdd-testing` 变更的集成测试任务，使用测试 agent

## Capabilities

### New Capabilities
- `configurable-agent-command`：支持配置任意 ACP agent 命令
- `test-agent-implementation`：基于 SDK 实现的测试 agent
- `test-protocol-communication`：测试 ACP 协议通信正确性

### Modified Capabilities
（无）

## Impact

- **API 变更**：
  - `libs/prompt` 导出的 `getAcpConnection()` 新增可选的 `agentCommand` 参数
  - `libs/prompt` 可能导出新的连接初始化函数
- **依赖变更**：无新增依赖
- **文件变更**：
  - libs/prompt/src/utils/agent.ts：支持自定义 agent 命令
  - libs/prompt/src/utils/connection.ts：传递 agentCommand
  - libs/prompt/src/utils/test-agent.ts：新增测试 agent 实现
  - apps/agent-admin/src/main.ts：添加 --agent 参数
  - openspec/changes/setup-tdd-testing/tasks.md：更新集成测试任务
- **测试策略**：集成测试不再依赖外部 opencode
