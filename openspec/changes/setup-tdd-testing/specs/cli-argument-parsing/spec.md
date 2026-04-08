## ADDED Requirements

### Requirement: CLI 参数正确解析
系统 SHALL 正确解析命令行参数并将其转换为应用程序选项。

#### Scenario: 解析 --cwd 参数
- **WHEN** 用户提供 --cwd 参数
- **THEN** 系统将路径转换为绝对路径并设置为工作目录

#### Scenario: 解析 --task 参数
- **WHEN** 用户提供 --task 参数
- **THEN** 系统将任务描述作为单一任务执行

#### Scenario: 解析 --file 参数
- **WHEN** 用户提供 --file 参数
- **THEN** 系统从指定文件加载配置

#### Scenario: 解析 --parallel 参数
- **WHEN** 用户提供 --parallel 参数
- **THEN** 系统解析为数字并设置并行任务数

#### Scenario: 解析 --retries 参数
- **WHEN** 用户提供 --retries 参数
- **THEN** 系统解析为数字并设置最大重试次数

#### Scenario: 解析 --iterations 参数
- **WHEN** 用户提供 --iterations 参数
- **THEN** 系统解析为数字并设置最大迭代次数

### Requirement: CLI 参数使用默认值
当用户未提供某些参数时，系统 SHALL 使用合理的默认值。

#### Scenario: 未提供 --cwd 参数时使用当前目录
- **WHEN** 用户未提供 --cwd 参数
- **THEN** 系统使用 process.cwd() 作为工作目录

#### Scenario: 未提供 --parallel 参数时使用默认值
- **WHEN** 用户未提供 --parallel 参数
- **THEN** 系统使用默认值 1

#### Scenario: 未提供 --retries 参数时使用默认值
- **WHEN** 用户未提供 --retries 参数
- **THEN** 系统使用默认值 0

#### Scenario: 未提供 --iterations 参数时使用默认值
- **WHEN** 用户未提供 --iterations 参数
- **THEN** 系统使用默认值 5

### Requirement: 任务来源优先级
系统 SHALL 根据明确的优先级确定任务来源。

#### Scenario: --task 参数优先于配置文件
- **WHEN** 同时提供 --task 和 --file 参数
- **THEN** 系统优先使用 --task 的值作为任务

#### Scenario: 未提供任务时从配置文件加载
- **WHEN** 未提供 --task 参数但提供了 --file 参数
- **THEN** 系统从配置文件加载任务列表

#### Scenario: 未提供任务和文件时使用默认配置文件
- **WHEN** 未提供 --task 和 --file 参数
- **THEN** 系统尝试从工作目录下的 aa.yaml 加载配置

### Requirement: 无任务时优雅退出
当没有可执行的任务时，系统 SHALL 优雅退出而不抛出错误。

#### Scenario: 无任务描述且无配置文件
- **WHEN** 未提供 --task 且配置文件不存在或为空
- **THEN** 系系统打印提示信息
- **THEN** 系统以状态码 0 退出
