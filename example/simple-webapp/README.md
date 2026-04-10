# 简单 Web 应用示例

这是一个最简单的示例，展示如何使用 Agent Admin 创建基本的 HTML 网页。

## 配置文件说明

`aa.yaml` 配置文件：

```yaml
tasks:
  - 创建一个简单的 HTML 网页，包含标题、段落和链接
```

## 运行示例

### 方法 1: 使用配置文件

```bash
# 进入示例目录
cd examples/simple-webapp

# 执行任务
aa -f aa.yaml
```

### 方法 2: 使用命令行参数

```bash
# 进入示例目录
cd examples/simple-webapp

# 直接指定任务
aa -t "创建一个简单的 HTML 网页，包含标题、段落和链接"
```

### 方法从根目录执行

```bash
# 指定工作目录和配置文件
aa -c examples/simple-webapp -f aa.yaml
```

## 预期结果

执行成功后，将在当前目录下生成一个 HTML 文件，包含：
- 标题元素
- 段落文本
- 链接

## 学到的知识

- 基本的 YAML 配置格式
- 如何使用配置文件执行任务
- 如何使用命令行参数执行任务
- 如何指定工作目录

## 下一步

查看 [advanced-tasks](../advanced-tasks/) 学习更高级的配置选项。
