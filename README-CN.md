# Agent Admin

基于 ACP (Agent Client Protocol) 的自动化开发任务执行工具。

[English Documentation](./README.md)

---

> 🎁 **优惠信息**：方舟 Coding Plan 支持 Doubao、GLM、DeepSeek、Kimi、MiniMax 等模型，工具不限，现在订阅9折，低至36元，订阅越多越划算！立即订阅：https://volcengine.com/L/X1hhwa3aKYk/  邀请码：GVXQVR6M

![海报](./images/poster.png)

---

## 快速开始

### 前置要求

安装 opencode（必需，默认使用）：

```bash
curl -fsSL https://opencode.ai/install | bash
```

更多信息请访问 [https://opencode.ai/](https://opencode.ai/)

### 使用 npx（推荐 - 无需安装）

```bash
# 执行单个任务（默认使用 opencode acp）
npx @agent-admin/agent-admin --task "创建一个简单的 HTML 网页"

# 使用配置文件
npx @agent-admin/agent-admin --file aa.yaml

# 指定自定义 agent
npx @agent-admin/agent-admin --task "创建一个简单的 HTML 网页" --agent "custom-agent --config /path/to/config"
```

### 全局安装

```bash
# 使用 npm 安装
npm install -g @agent-admin/agent-admin

# 或使用 pnpm
pnpm add -g @agent-admin/agent-admin

# 执行单个任务（默认使用 opencode acp）
aa --task "创建一个简单的 HTML 网页"

# 或使用完整命令名
agent-admin --task "创建一个简单的 HTML 网页"

# 使用配置文件
aa --file aa.yaml

# 指定自定义 agent
aa --task "创建一个简单的 HTML 网页" --agent "custom-agent --config /path/to/config"
```

---

## 目录

- [快速开始](#快速开始)
- [项目概述](#项目概述)
- [包结构](#包结构)
- [环境要求](#环境要求)
- [开发](#开发)
- [技术栈](#技术栈)
- [仓库](#仓库)
- [许可证](#许可证)

---

## 项目概述

Agent Admin 是一个 Rush 管理的 TypeScript monorepo，提供了自动化开发任务执行的 CLI 工具和相关库。

---

## 包结构

| 包 | 描述 |
|----|------|
| [@agent-admin/agent-admin](./apps/agent-admin/) | Agent Admin CLI 工具 |
| [@agent-admin/prompt](./libs/prompt/) | ACP 客户端库 |

---

## 环境要求

- Node.js: `>=22.20.0 <23.0.0`
- pnpm: `10.22.0`
- Rush: `5.162.0`

---

## 开发

### 克隆并安装

```bash
git clone https://github.com/wanxger/agent-admin.git
cd agent-admin

rush update
```

### 构建

```bash
# 构建所有项目
rush build

# 清理所有项目
rush clean
```

### 本地开发链接

```bash
# 将 CLI 链接到全局
cd apps/agent-admin
npm link

# 现在可以在任何地方使用 `aa` 命令
aa --help

# 取消链接
npm unlink @agent-admin/agent-admin
```

### 开发命令

#### apps/agent-admin

```bash
cd apps/agent-admin
pnpm build      # 编译 TypeScript
pnpm clean      # 清理构建输出
pnpm dev        # 开发模式 (tsx)
pnpm start      # 运行编译后的代码
pnpm test       # 运行测试 (Vitest)
```

#### libs/prompt

```bash
cd libs/prompt
pnpm build      # 编译 TypeScript
pnpm clean      # 清理构建输出
pnpm test       # 运行测试 (Vitest)
```

---

## 技术栈

- **TypeScript** - 类型安全的 JavaScript
- **Rush** - monorepo 管理工具
- **pnpm** - 快速、节省磁盘空间的包管理器
- **ACP SDK** - Agent Client Protocol SDK
- **Commander.js** - 命令行界面框架
- **Zod** - TypeScript 优先的模式验证
- **js-yaml** - YAML 解析器

---

## 仓库

https://github.com/wanxger/agent-admin

---

## 许可证

MIT
