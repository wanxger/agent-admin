## ADDED Requirements

### Requirement: 配置优先级规则明确
系统必须遵循明确的配置优先级规则，确保用户行为可预测。

#### Scenario: 命令行参数优先级最高
- **WHEN** 同一个配置项在配置文件、命令行参数中同时存在
- **THEN** 命令行参数的值覆盖配置文件的值
- **THEN** 系统输出警告信息说明冲突

#### Scenario: 任务级别 cwd 优先级最高
- **WHEN** 配置文件中有项目级 `cwd` 和任务级 `cwd`
- **THEN** 任务级 `cwd` 覆盖项目级 `cwd` 用于该任务

#### Scenario: 项目级 cwd 优先级次之
- **WHEN** 配置文件中有项目级 `cwd` 且任务无 `cwd`
- **THEN** 项目级 `cwd` 应用于该任务

#### Scenario: 当前目录优先级最低
- **WHEN** 配置文件和任务均未指定 `cwd`
- **THEN** 使用进程当前目录

### Requirement: 配置合并行为
系统必须正确合并不同配置源中的配置项。

#### Scenario: 任务列表合并
- **WHEN** 配置文件中定义任务列表
-通过** 命令行参数不提供任务列表
- **THEN** 使用配置文件中的任务列表

#### Scenario: agent 配置默认值
- **WHEN** 配置文件和命令行参数均未指定 `agent`
- **THEN** 使用默认值 `opencode acp`
