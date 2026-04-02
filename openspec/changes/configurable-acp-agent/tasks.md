## 1. libs/prompt 核心修改

- [ ] 1.1 修改 libs/prompt/src/utils/agent.ts` - 添加 parseAgentCommand 函数
- [ ] 1.2 修改 `getAgentProcess()` 支持接受 command 参数
- [ ] 1.3 更新 `getAgentProcess()` 使用 parseAgentCommand 解析命令
- [ ] 1.4 修改 `libs/prompt/src/utils/connection.ts` - getAcpConnection() 接受 agentCommand 参数
- [ ] 1.5 更新 getAcpConnection() 传递 agentCommand 给 getAgentProcess
- [ ] 1.6 更新 libs/prompt/src/index.ts 导出相关类型和函数（如需要）

## 2. Test Agent 实现

- [ ] 2.1 创建 libs/prompt/src/utils/test-agent.ts 文件
- [ ] 2.2 实现 TestAgent 类基础结构（ServerSideConnection 封装）
- [ ] 2.3 实现 initialize 处理
- [ ]) 2.4 实现 newSession 处理和 sessionId 生成
- [ ] 2.5 实现 loadSession 处理
- [ ] 2.6 实现 prompt 处理和响应
- [ ] 2.7 实现可观测性方法（getMessages、getLastMessage）
- [ ] 2.8 实现行为配置方法（setResponse）
- [ ] 2.9 添加独立运行模式支持（作为 CLI 使用）

## 3. apps/agent-admin CLI 支持

- [ ] 3.1 更新 apps/agent-admin/src/main.ts 的接口定义
- [ ]) 3.2 在 program 中添加 --agent 选项
- [ ] 3.3 解析 --agent 参数并传递给 prompt 函数
- [ ] 3.4 更新 Config 接口，添加 agent 字段（支持配置文件）
- [ ] 3.5 实现配置优先级逻辑（CLI > 配置文件 > 默认值）

## 4. Test Agent 单元测试

- [ ] 4.1 创建 libs/prompt/src/utils/test-agent.test.ts
- [ ] 4.2 测试 TestAgent 初始化
- [ ] 4.3 测试 initialize 响应
- [ ]) 4.4 测试 newSession 创建和 sessionId 返回
- [ ] 4.5 测试 loadSession 加载
- [ ] 4.6 测试 prompt 响应
- [ ] 4.7 测试 getMessages 可观测性
- [ ] 4.8 测试 setResponse 行为配置

## 5. 协议通信集成测试

- [ ] 5.1 创建 libs/prompt/test/integration/protocol.test.ts
- [ ] 5.2 测试参数传递 - cwd 参数
- [ ]) 5.3 测试参数传递 - mcpServers 参数
- [ ] 5.4 测试参数传递 - prompt 内容
- [ ] 5.5 测试参数传递 - sessionId
- [ ] 5.6 测试初始化握手
- [ ] 5.7 测试会话创建和提示流程
- [ ] 5.8 测试消息序号和 ID
- [ ] 5.9 测试无效会话处理
- [ ] 5.10 测试错误响应

## 6. 配置 agent 命令测试

- [ ] 6.1 创建 apps/agent-admin/test/integration/agent-config.test.ts
- [ ] 6.2 测试 --agent 参数指定自定义 agent
- [ ]) 6.3 测试配置文件 agent 字段
- [ ] 6.4 测试 CLI 参数优先级高于配置文件
- [ ] 6.5 测试 agentCommand 解析（多参数命令）

## 7. 更新依赖变更

- [ ] 7.1 导出 TestAgent 类型（libs/prompt/src/index.ts）
- [ ] 7.2 更新 libs/prompt/package.json（如需要）

## 8. 更新 setup-tdd-testing 变更

- [ ] 8.1 更新 openspec/changes/setup-tdd-testing/design.md
- [ ]) 8.2 更新集成测试策略（使用 test agent）
- [ ] 8.3 更新 openspec/changes/setup-tdd-testing/tasks.md
- [ ] 8.4 修改集成测试任务，使用 Test Agent 而非外部 opencode
- [ ] 8.5 移除集成测试的环境依赖说明

## 9. 文档和验证

- [ ] 9.1 更新 AGENTS.md 添加 --agent 参数说明
- [ ]) 9.2 添加 Test Agent 使用示例文档
- [ ] 9.3 运行所有测试确保通过
- [ ] 9.4 验证默认行为（不提供 --agent 时使用 opencode acp）
