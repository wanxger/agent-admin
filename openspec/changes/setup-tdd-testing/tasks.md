## 1. 测试基础设施设置

- [x] 1.1 在根目录创建 vitest.config.ts 配置文件
- [x] 1.2 在 apps/agent-admin/package.json 中添加 vitest 相关依赖
- [x] 1.3 在 libs/prompt/package.json 中添加 vitest 相关
- [x] 1.4 更新 apps/agent-admin/package.json 的 test 脚本
- [x] 1.5 更新 libs/prompt/package.json 的 test 脚本

## 2. 创建测试数据 Fixtures

- [x] 2.1 创建 apps/agent-admin/test/fixtures/configs 目录
- [x] 2.2 创建 valid.yaml fixture（包含有效任务列表）
- [x] 2.3 创建 empty.yaml fixture（空文件）
- [x] 2.4 创建 no-tasks.yaml fixture（缺少 tasks 字段）
- [x] 2.5 创建 invalid.yaml fixture（无效 YAML 语法）
- [x] 2.6 创建 non-array-tasks.yaml fixture（tasks 不是数组）

## 3. apps/agent-admin 单元测试

- [x] 3.1 创建 main.test.ts 文件
- [x] 3.2 编写 loadConfig 函数测试 - 有效配置
- [x] 3.3 编写 loadConfig 函数测试 - 文件不存在
- [x] 3.4 编写 loadConfig 函数测试 - 无效 YAML
- [x] 3.5 编写 loadConfig 函数测试 - 缺少 tasks 字段
- [x] 3.6 编写 loadConfig 函数测试 - tasks 不是数组
- [x] 3.7 编写工作目录解析测试 - 使用 --cwd 参数
- [x] 3.8 编写工作目录解析测试 - 使用默认目录

## 4. libs/prompt 单元测试

- [x] 4.1 创建 client.test.ts 文件
- [x] 4.2 编写 AcpClient.requestPermission 测试 - 优先 allow_always
- [x] 4.3 编写 AcpClient.requestPermission 测试 - 优先 allow_once
- [x] 4.4 编写 AcpClient.requestPermission 测试 - 选择第一个选项
- [x] 4.5 编写 AcpClient.sessionUpdate 测试 - 处理各种事件类型
- [x] 4.6 编写 AcpClient.onSessionNotification 测试 - 订阅和取消订阅

## 5. libs/prompt 集成测试

- [x] 5.1 创建 session.test.ts 文件
- [x] 5.2 编写 getSession 测试 - 创建新会话（标记为 skipIf 无环境）
- [x] 5.3 编写 getSession 测试 - 加载现有会话（标记为 skipIf 无环境）
- [x] 5.4 创建 prompt.test.ts 文件
- [x] 5.5 编写 prompt 测试 - 参数传递正确性（标记为 skipIf 无环境）

## 6. Rush 测试命令配置

- [x] 6.1 检查 rush.json 中是否需要添加测试命令
- [x] 6.2 更新 rush.json 或创建自定义脚本（如需要）

## 7. 验证和文档

- [x] 7.1 运行单元测试：pnpm test（在两个包中）
- [x] 7.2 运行集成测试：TEST_INTEGRATION=true pnpm test（在 libs/prompt 中）
- [x] 7.3 检查测试覆盖率报告
- [x] 7.4 更新 AGENTS.md 添加测试运行说明
