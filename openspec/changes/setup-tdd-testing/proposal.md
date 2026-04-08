## Why

当前项目缺乏测试基础设施，无法保证代码质量和重构安全性。需要建立 TDD 工程化规范，为现有代码补全测试，确保配置文件解析、CLI 入口点和 ACP 客户端参数传递的正确性。

## What Changes

- 配置 Vitest 测试框架，支持单元测试、集成测试和 E2E 测试
- 为 apps/agent-admin 添加测试：
  - loadConfig 函数：YAML 配置文件解析和验证
  - CLI 参数解析：--cwd、--task、--file 等参数的解析逻辑
  - 工作目录解析：默认值与自定义值的处理
- 为 libs/prompt 添加测试：
  - AcpClient.requestPermission：权限请求的优先级逻辑
  - 参数传递链路：prompt() → getSession() → connection 的参数正确性
  - 使用真实的 @agentclientprotocol/sdk 实现的 ACP agent 进行集成测试
- 添加测试数据 fixtures 目录结构

## Capabilities

### New Capabilities
- `config-parsing`: YAML 配置文件解析和验证能力
- `cli-argument-parsing`: CLI 参数解析和组合能力
- `acp-client-integration`: ACP 客户端初始化和参数传递能力

### Modified Capabilities
（无）

## Impact

- **依赖变更**：添加 vitest、@vitest/ui 等开发依赖
- **文件变更**：
  - apps/agent-admin/package.json：添加测试脚本和依赖
  - libs/prompt/package.json：添加测试脚本和依赖
  - vitest.config.ts：测试配置文件
  - apps/agent-admin/src/**/*.test.ts：单元测试文件
  - libs/prompt/src/**/*.test.ts：单元测试和集成测试文件
  - fixtures/：测试数据目录
- **构建流程**：添加 rush test 命令支持
