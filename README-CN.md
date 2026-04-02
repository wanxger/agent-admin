# Agent Admin

基于 ACP (Agent Client Protocol) 的自动化开发任务执行工具。

[English Documentation](./README.md)

---

## 目录

- [项目概述](#项目概述)
- [包结构](#包结构)
- [环境要求](#环境要求)
- [安装](#安装)
- [快速开始](#快速开始)
- [开发命令](#开发命令)
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

## 安装

### 全局安装 CLI

```bash
npm install -g @agent-admin/agent-admin
# 或
pnpm add -g @agent-admin/agent-admin
```

### 从源码开发

```bash
# 克隆仓库
git clone https://github.com/wanxger/agent-admin.git
cd agent-admin

# 安装依赖
rush update

# 构建项目
rush build
```

#### 本地链接 (npm link)

开发过程中可以使用 npm link 将本地版本链接到全局：

```bash
# 进入 CLI 项目目录
cd apps/agent-admin

# 链接到全局
npm link

# 现在可以在任何地方使用 `aa` 命令
aa --help

# 取消链接
npm unlink @agent-admin/agent-admin
```

---

## 快速开始

### 使用 CLI

CLI 提供两个命令别名：
- `aa` - 简短别名
- `agent-admin` - 完整命令名

```bash
# 执行单个任务 (使用简短别名)
aa --task "创建一个简单的 HTML 网页"

# 或使用完整命令名
agent-admin --task "创建一个简单的 HTML 网页"

# 使用配置文件
aa --file aa.yaml
```

更多用法请参考 [@agent-admin/agent-admin 文档](./apps/agent-admin/README-CN.md)。

---

## 开发命令

### 根目录命令

```bash
# 安装依赖
rush update

# 构建所有项目
rush build

# 清理所有项目
rush clean
```

### 项目特定命令

#### apps/agent-admin

```bash
cd apps/agent-admin
pnpm build      # 编译 TypeScript
pnpm clean      # 清理构建输出
pnpm dev        # 开发模式 (tsx)
pnpm start      # 运行编译后的代码
pnpm test       # 运行测试 (待实现)
```

#### libs/prompt

```bash
cd libs/prompt
pnpm build      # 编译 TypeScript
pnpm clean      # 清理构建输出
pnpm test       # 运行测试 (待实现)
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
