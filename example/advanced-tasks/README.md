# 高级任务配置示例

这个示例展示了 Agent Admin 的高级配置功能，包括：
- 项目级配置
- 任务级工作目录
- 并行执行
- 重试机制
- 迭代次数控制

## 配置文件说明

`aa.yaml` 配置文件：

```yaml
cwd: "./components"
parallel: 2
retries: 1
iterations: 5

tasks:
  - task: "创建一个 React 按钮组件，支持点击事件"
    cwd: "./src/components"
    
  - task: "创建一个 React 表单组件，包含输入验证"
    cwd: "./src/components"
    
  - task: "创建一个 React 模态框组件"
    cwd: "./src/components"
```

### 配置项说明

- `cwd`: 项目级工作目录（可被任务级 cwd 覆盖）
- `parallel`: 并行执行的任务数量
- `retries`: 每个任务失败后的重试次数
- `iterations`: 每个任务的最大迭代次数（agent 会判断任务是否完成）
- `tasks`: 任务列表，每个任务可以有自己的 cwd

## 运行示例

### 方法 1: 使用配置文件（推荐）

```bash
# 进入示例目录
cd examples/advanced-tasks

# 执行任务（使用配置文件中的所有设置）
aa -f aa.yaml
```

### 方法 2: 覆盖配置文件中的设置

```bash
# 覆盖并行数为 3
aa -f aa.yaml -p 3

# 覆盖工作目录
aa -f aa.yaml -c /custom/path

# 组合覆盖
aa -f aa.yaml -p 3 -r 2 -i 10
```

## 配置优先级

当配置文件和命令行参数冲突时，命令行参数优先级更高：

1. 命令行参数（最高优先级）
2. 配置文件中的任务级设置
3. 配置文件中的项目级设置
4. 默认值（最低优先级）

## 预期行为

1. **并行执行**: 最多同时执行 2 个任务
2. **任务重试**: 任务失败后自动重试 1 次
3. **迭代完善**: agent 最多迭代 5 次来完善代码
4. **工作目录**: 所有任务在 `./src/components` 目录下执行（覆盖了项目级 cwd）

## 学到的知识

- 项目级 vs 任务级配置
- 并行执行控制
- 重试机制
- 迭代次数控制
- 配置优先级规则

## 下一步

查看 [multi-project](../multi-project/) 学习如何管理多个项目。
