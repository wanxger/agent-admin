## 1. 测试基础设施设置

- [ ] 1.1 在根目录创建 vitest.config.ts 配置文件
- [ ] 1.2 在 apps/agent-admin/package.json 中添加 vitest 相关依赖
- [ ] 1.3 在 libs/prompt/package.json 中添加 vitest 相关
- [ ] 1.4 更新 apps/agent-admin/package.json 的 test 脚本
- [ ] 1.5 更新 libs/prompt/package.json 的 test 脚本

## 2. 创建测试数据 Fixtures

- [ ] 2.1 创建 apps/agent-admin/test/fixtures/configs 目录
- [ ] 2.2 创建 valid.yaml fixture（包含有效任务列表）
- [ ] 2.3 创建 empty.yaml fixture（空文件）
- [ ] 2.4 创建 no-tasks.yaml fixture（缺少 tasks 字段）
- [ ] 2.5 创建 invalid.yaml fixture（无效 YAML 语法）
- [ ] 2.6 创建 non-array-tasks.yaml fixture（tasks 不是数组）

## 3. apps/agent-admin 单元测试

- [ ] 3.1 创建 main.test.ts 文件
- [ ] 3.2 编写 loadConfig 函数测试 - 有效配置
- [ ]) 3.3 编写 loadConfig 函数测试 - 文件不存在
- [ ] 3.4 编写 loadConfig 函数测试 - 无效 YAML
- [ ] 3.5 编写 loadConfig 函数测试 - 缺少 tasks 字段
- [ ] 3.6 编写 loadConfig 函数测试 - tasks 不是数组
- [ ] 3.7 编写工作目录解析测试 - 使用 --cwd 参数
- [ ] 3.8 编写工作目录解析测试 - 使用默认目录

## 4. libs/prompt 单元测试

- [ ] 4.1 创建 client.test.ts 文件
- [ ] 4.2 编写 AcpClient.requestPermission 测试 - 优先 allow_always
- [ ] 4.3 编写 AcpClient.requestPermission 测试 - 优先 allow_once
- [ ] 4.4) 编写 AcpClient.requestPermission 测试 - 选择第一个选项
- [ ] 4.5 编写 AcpClient.sessionUpdate 测试 - 处理各种事件类型
- [ ] 4.6 编写 AcpClient.onSessionNotification 测试 - 订阅和取消订阅

## 5. libs/prompt 集成测试

- [ ] 5.1 创建 session.test.ts 文件
- [ ] 5.2 编写 getSession 测试 - 创建新会话（标记为 skipIf 无环境）
- [ ] 5.3 编写 getSession 测试 - 加载现有会话（标记为 skipIf 无环境）
- [ ] 5.4 创建 prompt.test.ts 文件
- [ ] 5.5 编写 prompt 测试 - 参数传递正确性（标记为 skipIf 无环境）

## 6. Rush 测试命令配置

- [ ] 6.1 检查 rush.json 中是否需要添加测试命令
- [ ] 6.2 更新 rush.json 或创建自定义脚本（如需要）

## 7. 验证和文档

- [ ] 7.1 运行单元测试：pnpm test（在两个包中）
- [ ] 7.2 运行集成测试：TEST_INTEGRATION=true pnpm test（在 libs/prompt 中）
- [ ] 7.3 检查测试覆盖率报告
- [ ] 7.4 更新 AGENTS.md 添加测试运行说明
