# @agent-admin/agent-admin

Agent Admin CLI 工具 - 基于 ACP (Agent Client Protocol) 的自动化开发任务执行工具。

[English Documentation](./README.md)

---

## 快速开始

### 使用 npx（推荐 - 无需安装）

```bash
# 执行单个任务
npx @agent-admin/agent-admin --task "创建一个简单的 HTML 网页"

# 使用配置文件
npx @agent-admin/agent-admin --file aa.yaml
```

### 全局安装

```bash
# 使用 npm 安装
npm install -g @agent-admin/agent-admin

# 执行单个任务
aa --task "创建一个简单的 HTML 网页"

# 或使用完整命令名
agent-admin --task "创建一个简单的 HTML 网页"

# 使用配置文件
aa --file aa.yaml
```

---

## 目录

- [快速开始](#快速开始)
- [命令行参数](#命令行参数)
- [使用示例](#使用示例)
- [YAML 配置文件格式](#yaml-配置文件格式)
- [工作原理](#工作原理)
- [开发](#开发)
- [项目结构](#项目结构)
- [相关包](#相关包)
- [许可证](#许可证)
- [仓库](#仓库)

---

## 命令行参数

| 参数 | 简写 | 描述 | 默认值 |
|------|------|------|--------|
| `--cwd <path>` | `-c` | 工作目录 | 当前运行目录 |
| `--task <task>` | `-t` | 单个任务描述 | - |
| `--file <path>` | `-f` | YAML 配置文件路径 | cwd 目录下的 aa.yaml |
| `--parallel <number>` | `-p` | 并行任务数 | 1 |
| `--retries <number>` | `-r` | 每个任务的最大重试次数 | 0 |
| `--iterations <number>` | `-i` | 每个任务的最大迭代次数 | 5 |
| `--help` | `-h` | 显示帮助信息 | - |

---

## 使用示例

### 示例 1: 指定工作目录

```bash
aa --cwd ./my-project --task "开发一个 React 组件"
```

### 示例 2: 并行执行任务

```bash
aa --file tasks.yaml --parallel 3
```

### 示例 3: 配置任务重试和迭代

```bash
aa --file tasks.yaml --parallel 2 --retries 2 --iterations 3
```

---

## YAML 配置文件格式

```yaml
tasks:
  - 第一个任务描述
  - 第二个任务描述
  - 第三个任务描述
```

---

## 工作原理

1. **任务执行**: 根据任务描述调用 ACP agent 开始开发工作
2. **迭代判断**: 自动判断任务是否完成，最多迭代 `--iterations` 次
3. **自动完善**: 根据判断结果自动完善代码
4. **失败重试**: 任务执行失败时自动重试，最多重试 `--retries` 次
5. **并行执行**: 支持同时执行多个任务，提高效率

---

## 开发

### 克隆并安装

```bash
git clone https://github.com/wanxger/agent-admin.git
cd agent-admin
rush update
rush build
```

### 本地开发链接

```bash
cd apps/agent-admin
npm link

aa --help
npm unlink @agent-admin/agent-admin
```

### 开发命令

```bash
pnpm dev      # 开发模式（监听文件变化）
pnpm build    # 编译
pnpm clean    # 清理
pnpm test     # 运行测试
```

---

## 项目结构

```
apps/agent-admin/
├── src/
│   └── main.ts          # 主入口文件
├── dist/                # 编译输出目录
├── package.json
└── README.md
```

---

## 相关包

- [@agent-admin/prompt](https://www.npmjs.com/package/@agent-admin/prompt) - ACP 客户端库

---

## 许可证

MIT

---

## 仓库

https://github.com/wanxger/agent-admin
