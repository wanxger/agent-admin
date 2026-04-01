# @agent-admin/agent-admin

Agent Admin CLI 工具，用于自动化开发任务执行。

## 安装

```bash
rush update
rush build
```

## 使用

### 命令行参数

```bash
aa [options]
```

#### 参数说明

| 参数 | 简写 | 描述 | 默认值 |
|------|------|------|--------|
| `--cwd <path>` | `-c` | 工作目录 | 当前运行目录 |
| `--task <task>` | `-t` | 单个任务描述 | - |
| `--file <path>` | `-f` | YAML 配置文件路径 | cwd 目录下的 aa.yaml |
| `--parallel <number>` | `-p` | 并行任务数 | 1 |
| `--retries <number>` | `-r` | 每个任务的最大重试次数 | 0 |
| `--iterations <number>` | `-i` | 每个任务的最大迭代次数 | 5 |
| `--help` | `-h` | 显示帮助信息 | - |

### 使用示例

#### 1. 执行单个任务

```bash
aa --task "创建一个简单的 HTML 网页"
```

#### 2. 从 YAML 配置文件执行任务

```bash
aa --file tasks.yaml
```

#### 3. 指定工作目录

```bash
aa --cwd ./my-project --task "开发一个 React 组件"
```

#### 4. 并行执行多个任务

```bash
aa --file tasks.yaml --parallel 3
```

#### 5. 配置任务重试和迭代

```bash
aa --file tasks.yaml --parallel 2 --retries 2 --iterations 3
```

## YAML 配置文件格式

创建一个名为 `aa.yaml` 的文件，格式如下：

```yaml
tasks:
  - 第一个任务描述
  - 第二个任务描述
  - 第三个任务描述
```

## 工作原理

1. 任务执行：根据任务描述开始开发工作
2. 迭代判断：自动判断任务是否完成，最多迭代 `--iterations` 次
3. 自动完善：根据判断结果自动完善代码
4. 失败重试：任务执行失败时自动重试，最多重试 `--retries` 次
5. 并行执行：支持同时执行多个任务，提高效率

## 开发

```bash
# 开发模式（监听文件变化）
cd apps/agent-admin
pnpm dev

# 编译
pnpm build

# 清理
pnpm clean
```

## 项目结构

```
apps/agent-admin/
├── src/
│   └── main.ts          # 主入口文件
├── dist/                # 编译输出目录
├── package.json
└── README.md
```

## 未来计划

- [ ] 工作流程可配置化：目前的工作流程是固定的，一个 agent 执行，一个 agent 验证，这个流程应是可以在配置文件中配置的
- [ ] 支持 Markdown 引入：yaml 不支持图片，可以把任务的说明的 Markdown 引入
- [ ] 上下文补充功能：如果需要补充上下文，agent 可以把需要咨询的内容补充出来
- [ ] 进度反馈：agent 完成的进度可以反馈在一个进度文件中
- [ ] 通用任务支持：目前的要求是固定用于开发的，以后可以会用于写作等更通用的任务，默认的描述需要更通用
- [ ] 可以实现 webhook 通知功能
- [ ] 支持在可用的 agent 中切换，可以预设工作流中的 agent
- [ ] 支持切换模型
- [ ] 支持按照预设情况切换 agent 或模型，比如某 agent 、模型组合失败一次或多次，切换其他 agent 、模型组合
- [ ] 可以挂入系统定时执行
- [ ] 执行某些固定任务时，可以让 agent 在首次编辑脚本，以后直接运行脚本
