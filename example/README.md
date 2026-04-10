# Agent Admin 示例项目

本目录包含多个示例项目，展示如何使用 Agent Admin CLI 工具进行自动化开发任务。

## 示例列表

### 1. [simple-webapp](./simple-webapp/)
- 展示最基本的 YAML 配置
- 演示单个任务的执行
- 适合新用户快速上手

### 2. [advanced-tasks](./advanced-tasks/)
- 展示高级配置功能
- 演示并行执行、重试机制
- 包含多个相关任务

### 3. [multi-project](./multi-project/)
- 展示多项目开发场景
- 演示工作目录切换
- 包含多个子项目

## 如何运行示例

### 前提条件

确保已安装 Agent Admin CLI：

```bash
npm install -g @agent-admin/agent-admin
```

### 运行单个示例

```bash
# 进入示例目录
cd examples/simple-webapp

# 使用配置文件执行任务
aa -f aa.yaml

# 或使用命令行参数
aa -t "创建一个简单的 HTML 网页"
```

## 常用命令

```bash
# 查看帮助
aa --help

# 执行单个任务
aa -t "任务描述"

# 使用配置文件
aa -f aa.yaml

# 指定工作目录
aa -c /path/to/project -f aa.yaml

# 并行执行
aa -f aa.yaml -p 3

# 配置重试和迭代
aa -f aa.yaml -r 2 -i 5
```

## 学习路径

1. 从 [simple-webapp](./simple-webapp/) 开始，了解基本概念
2. 学习 [advanced-tasks](./advanced-tasks/) 掌握高级功能
3. 参考 [multi-project](./multi-project/) 处理复杂场景

## 更多信息

- [Agent Admin 文档](../README-CN.md)
- [CLI 工具文档](../apps/agent-admin/README-CN.md)
