## Context

当前项目是一个 Rush 管理的 monorepo，包含两个主要包：
- `apps/agent-admin`：CLI 应用程序，负责任务执行和配置管理
- `libs/prompt`：可复用的 ACP 客户端库

项目当前没有任何测试基础设施，两个包的 package.json 中的 test 脚本都是占位符。需要建立完整的测试体系来保证代码质量和重构安全性。

## Goals / Non-Goals

**Goals:**
- 配置 Vitest 测试框架，支持单元测试、集成测试和 E2E 测试
- 为现有代码补全测试覆盖，重点关注配置解析、CLI 参数解析和 ACP 客户端功能
- 建立测试数据 fixtures 结构
- 集成测试使用真实的 opencode acp 进行端到端验证
- 在 Rush 层面添加测试命令支持

**Non-Goals:**
- 不实现 100% 代码覆盖率（重点测试关键业务逻辑）
- 不测试 ACP SDK 本身的功能（假设 SDK 是正确的）
- 不需要复杂的测试报告生成或覆盖率门槛
- 不实现性能测试或负载测试

## Decisions

### 测试框架选择：Vitest

**理由：**
- 与 ESM 模块系统原生兼容（项目使用 "type": "module"）
- 与 Jest API 兼容，学习成本低
- 内置支持 TypeScript，无需额外配置
- 更快的执行速度，适合 monorepo 环境
- 内置 watch 模式和 UI 界面

**替代方案：**
- Jest：配置 ESM 支持复杂，已逐渐被 Vitest 取代
- node:test：零依赖但功能较少，缺少生态支持
- Mocha：需要额外配置断言库和工具

### 测试文件组织

**结构：**
```
apps/agent-admin/
├── src/
│   ├── main.ts
│   └── main.test.ts          # 单元测试
├── test/
│   ├── fixtures/
│   │   └── configs/          # 测试配置文件
│   │       ├── valid.yaml
│   │       ├── empty.yaml
│   │       └── invalid.yaml
│   └── integration/
│       └── cli.test.ts       # CLI 集成测试

libs/prompt/
├── src/
│   ├── utils/
│   │   ├── client.ts
│   │   ├── client.test.ts    # 单元测试
│   │   ├── session.ts
│   │   ├── session.test.ts   # 集成测试
│   │   └── prompt.ts
│   │       └── prompt.test.ts # 集成测试
```

**理由：**
- 单元测试与源文件同级，便于维护
- 集成测试和 fixtures 放在 test/ 目录，保持清晰
- 使用 `.test.ts` 后缀，与 tsconfig 配置一致

### Mocking 策略

**单元测试：**
- 使用 `vi.fn()`、`vi.mock()` 等 Vitest mock 工具
- Mock 外部依赖（如 `node:fs`、`node:path`）
- 不 mock ACP SDK，因为单元测试主要测试逻辑不涉及 ACP 调用

**集成测试：**
- 使用 `@agent-admin/prompt` 包中的 `TestAgent`
- `TestAgent` 是基于 `@agentclientprotocol/sdk` 的测试实现
- 完全可控，无需外部 opencode 命令
- 测试速度更快，不依赖外部进程
- 使用 `vi.spyOn()` 监控函数调用

**理由：**
- 单元测试聚焦纯逻辑，避免外部依赖
- 集成测试使用 `TestAgent` 验证 ACP 协议正确性
- `TestAgent` 提供可观测性（`getMessages`、`getLastMessage`）
- 测试更稳定，不受外部环境影响

### Vitest 配置

**根目录配置：** `vitest.config.ts`
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts'
      ]
    }
  }
});
```

**理由：**
- globals: true 允许使用 describe/it/expect without import
- environment: node 适配 Node.js 运行时
- coverage 使用 v8 provider，零配置

### 测试数据 Fixtures

**结构：**
```
fixtures/
├── configs/
│   ├── valid.yaml          # 包含有效任务列表
│   ├── empty.yaml          # 空文件或空任务
│   ├── no-tasks.yaml       # 缺少 tasks 字段
│   └── invalid.yaml        # 无效 YAML 语法
└── tasks/
    └── simple-task.yaml    # 简单任务配置
```

**理由：**
- 集中管理测试数据，避免重复
- 易于维护和扩展
- 每个测试场景对应一个 fixture 文件

### 集成测试环境要求

**前置条件：**
- 无需外部安装 opencode 命令
- 使用 `@agent-admin/prompt` 包中的 `TestAgent`
- 无网络要求

**测试标记：**
集成测试始终运行，无需环境变量：
```typescript
test('ACP 集成测试', async () => {
  const testAgent = new TestAgent({ autoRespond: true });
  // 集成测试代码
});
```

**理由：**
- `TestAgent` 完全自包含，无外部依赖
- 集成测试可以与单元测试一起运行
- 测试速度快，适合 CI/CD 集成

## Risks / Trade-offs

**集成测试依赖 TestAgent 实现**
- **风险：** 如果 TestAgent 有 bug，集成测试可能通过但掩盖真实问题
- **缓解：** TestAgent 实现简单，代码易于审查
- **缓解：** 可以选择性使用真实 opencode acp 进行端到端验证

**测试覆盖率不足**
- **风险：** 重点测试关键路径，可能遗漏边缘情况
- **缓解：** 先建立测试基础设施，后续逐步提高覆盖率
- **缓解：** 在重构或修复 bug 时补充测试

**TestAgent 功能有限**
- **风险：** TestAgent 不实现完整的 agent 功能（如 MCP 工具调用）
- **缓解：** 集成测试专注于 ACP 协议正确性，不测试 agent 智能或能力
- **缓解：** 真实 agent 行为通过实际使用验证

## Open Questions

1. **是否需要 CI/CD 集成？**
   - 当前不确定项目是否有 CI/CD 流程
   - 如果需要，可以考虑在 rush.json 或 .github/workflows 中添加测试步骤

2. **覆盖率门槛是否需要设置？**
   - 建议先建立测试习惯，不强制覆盖率
   - 后续可以根据团队规范设置最低覆盖率（如 60%）

3. **是否需要测试报告上传？**
   - 如果有代码质量平台，可以配置覆盖率报告上传
   - 当前阶段暂不需要
