## Context

当前架构中，`libs/prompt` 的 `getAgentProcess()` 硬编码启动 `opencode acp` 进程。这种方式在集成测试中存在以下问题：
- 依赖外部 opencode 命令，增加了环境依赖
- 测试不稳定，受外部进程影响
- 难以控制 agent 行为，测试覆盖有限

`@agentclientprotocol/sdk` 提供了完整的 ACP 协议实现，包括 ClientSideConnection 和 ServerSideConnection，完全基于这些类实现测试 agent 是可行的。

## Goals / Non-Goals

**Goals:**
- 支持配置任意 ACP agent 命令（CLI 参数、配置文件）
- 基于 SDK 实现 test agent，用于集成测试
- 测试 agent 可完全可控，不依赖外部进程
- 集成测试关注 ACP 协议正确性，而非 agent 逻辑

**Non-Goals:**
- 不实现完整的 agent 功能（如 MCP 工具调用）
- 不测试 agent 的智能或能力（只测试协议通信）
- 不替换 agent-admin 使用的 opencode acp（保持默认）
- 不实现 agent 的持久化或状态恢复

## Decisions

### agentCommand 配置层次

配置优先级：
```
1. CLI 参数 --agent (最高优先级)
2. 配置文件 agent 字段
3. 默认值 "opencode acp"
```

**API 设计：**
```typescript
// libs/prompt/src/utils/connection.ts
export const getAcpConnection = async (options?: {
  agentCommand?: string;
  // ... 其他现有参数
}) => {
  const agentCommand = options?.agentCommand || 'opencode acp';
  // ...
};
```

**理由：**
- 保持向后兼容（参数可选）
- 清晰的配置层次
- 易于测试

### Test Agent 实现方式

**实现文件：** `libs/prompt/src/utils/test-agent.ts`

**结构：**
```typescript
export class TestAgent {
  private server: ServerSideConnection;
  private sessions: Map<string, Session>;
  private messages: Array<{ type: string; data: any }>;

  constructor(options?: TestAgentOptions) {
    // 初始化 ServerSideConnection
  }

  async connect(stream: { input: ReadableStream; output: WritableStream }) {
    // 连接到客户端
  }

  // 内联使用：直接传递 ServerSideConnection 实例
  getServerSideConnection(): ServerSideConnection {
    return this.server;
  }

  // 测试辅助方法
  getMessages(): Array<{ type: string; data: any }> {
    return this.messages;
  }

  getLastMessage(): any {
    return this.messages[this.messages.length - 1];
  }

  // 配置行为
  setResponse(text: string) {
    // 设置后续 prompt 的响应
  }
}
```

**理由：**
- 基于 ServerSideConnection，完全符合 ACP 协议
- 提供可观测性（记录所有消息）
- 支持配置响应行为
- 既可独立运行，也可内联使用

### agentCommand 解析策略

**解析函数：**
```typescript
function parseAgentCommand(command: string): [string, string[]] {
  const parts = command.trim().split(/\s+/);
  return [parts[0], parts.slice(1)];
}
```

**示例：**
```typescript
parseAgentCommand("opencode acp")           // ["opencode", ["acp"]]
parseAgentCommand("custom-agent --config X") // ["custom-agent", ["--config", "X"]]
```

**理由：**
- 简单的空格分割即可满足需求
- 支持任意复杂的 agent 命令
- 易于测试和维护

### 集成测试架构

**测试策略：**
```
┌─────────────────────────────────────────────┐
│  集成测试                                   │
│  ┌───────────────────────────────────────┐  │
│  │  创建 TestAgent 实例                  │  │
│  │  使用 ServerSideConnection            │  │
│  │  直接连接，无需启动独立进程             │  │
│  └───────────────────────────────────────┘  │
│              ↓                              │
│  ┌───────────────────────────────────────┐  │
│  │  配置客户端使用 test agent             │  │
│  │  通过 agentCommand 或直接传入         │  │
│  └───────────────────────────────────────┘  │
│              ↓                              │
│  ┌───────────────────────────────────────┐  │
│  │  执行测试：                            │  │
│  │  - 参数传递正确性                     │  │
│  │  - 协议消息收发                       │  │
│  │  - 会话管理                           │  │
│  │  - 错误处理                           │  │
│  └───────────────────────────────────────┘  │
│              ↓                              │
│  ┌───────────────────────────────────────┐  │
│  │  验证：使用 TestAgent 的可观测方法    │  │
│  │  - getMessages()                      │  │
│  │  - getLastMessage()                   │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**测试用例示例：**
```typescript
test('should pass cwd parameter correctly', async () => {
  const testAgent = new TestAgent();

  // 创建客户端连接，使用 test agent
  const connection = await createTestConnection(testAgent);

  await connection.newSession({ cwd: '/test/path' });

  // 验证参数传递
  const lastMessage = testAgent.getLastMessage();
  expect(lastMessage.method).toBe('newSession');
  expect(lastMessage.params.cwd).toBe('/test/path');
});
```

**理由：**
- 完全可控，无外部依赖
- 测试速度快
- 可观测性强
- 易于验证协议正确性

### Test Agent 独立运行模式

**用途：** 用于 CLI 测试或其他需要独立进程的场景

**实现方式：**
```typescript
// test-agent.ts (可作为 CLI 运行)
if (import.meta.url === `file://${process.argv[1]}`) {
  // 作为独立进程运行
  const testAgent = new TestAgent();
  const input = Readable.toWeb(process.stdin);
  const output = Writable.toWeb(process.stdout);
  await testAgent.connect({ input, output });
}
```

**使用方式：**
```bash
# 测试时可以指定使用测试 agent
aa --task "test task" --agent "node test-agent.js"
```

**理由：**
- 同一实现支持两种模式
- 灵活性高
- 便于调试

## Risks / Trade-offs

**Breaking API 变更**
- **风险：** getAcpConnection() 新增参数，可能影响现有调用
- **缓解：** 参数设为可选，保持向后兼容
- **缓解：** 更新项目内所有调用点

**Test Agent 功能不完整**
- **风险：** Test Agent 只实现基本协议，不支持 MCP 等
- **缓解：** 明确设计目标，只测试协议通信
- **缓解：** 如需扩展功能，可后续增强

**性能开销**
- **风险：** 每个测试创建新的 TestAgent 实例
- **缓解：** Test Agent 轻量级，开销可接受
- **缓解：** 可在 Vitest 配置中优化复用

**与现有测试框架的兼容性**
- **风险：** setup-tdd-testing 变更中的集成测试任务需要更新
- **缓解：** 更新 tasks.md，使用新的测试方式
- **缓解：** 确保变更顺序正确（先实现 configurable-acp-agent）

## Open Questions

1. **Test Agent 是否需要支持多个并发会话？**
   - 当前设计使用 Map<string, Session> 已支持
   - 集成测试可能需要测试并发场景

2. **是否需要支持 agentCommand 的环境变量替换？**
   - 例如：agent: "$HOME/.local/bin/opencode acp"
   - 当前设计暂不支持，如需要可后续添加

3. **Test Agent 是否需要支持延迟响应？**
   - 用于测试超时和重试逻辑
   - 可通过配置延迟时间实现

4. **与 setup-tdd-testing 的实施顺序？**
   - 建议先实施 configurable-acp-agent
   - 然后更新 setup-tdd-testing 的集成测试任务
