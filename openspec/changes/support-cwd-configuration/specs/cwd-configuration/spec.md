## ADDED Requirements

### Requirement: 项目级 cwd 配置
配置文件 SHALL 支持在顶层声明 `cwd` 字段，用于指定项目级别的工作目录。

#### Scenario: 配置文件包含项目级 cwd
- **WHEN** 配置文件顶层包含 `cwd` 字段且值为 `/path/to/project`
- **THEN** 系统应将该值作为所有任务（未声明独立 cwd 的任务）的工作目录

#### Scenario: 配置文件不包含项目级 cwd
- **WHEN** 配置文件顶层不包含 `cwd` 字段
- **THEN** 系统应使用进程当前目录作为默认工作目录

### Requirement: 任务级 cwd 配置
配置文件 SHALL 支持在每个任务对象中声明独立的 `cwd` 字段，用于覆盖项目级别的 cwd。

#### Scenario: 任务声明独立 cwd
- **WHEN** 任务对象包含 `cwd` 字段且值为 `/path/to/task`
- **THEN** 系统应使用该任务指定的 cwd 作为工作目录，忽略项目级 cwd

#### Scenario: 任务未声明 cwd
- **WHEN** 任务对象不包含 `cwd` 字段
- **THEN** 系统应使用项目级 cwd（如果存在）或进程当前目录

### Requirement: cwd 优先级规则
系统 SHALL 按照 任务级 cwd > 项目级 cwd > 进程当前目录 的优先级规则确定最终工作目录。

#### Scenario: 同时存在项目级和任务级 cwd
- **WHEN** 配置文件项目级 cwd 为 `/project`，任务级 cwd 为 `/task`
- **THEN** 系统应使用 `/task` 作为该任务的工作目录

#### Scenario: 仅存在项目级 cwd
- **WHEN** 配置文件项目级 cwd 为 `/project`，任务未声明 cwd
- **THEN** 系统应使用 `/project` 作为该任务的工作目录

#### Scenario: 仅存在任务级 cwd
- **WHEN** 配置文件未声明项目级 cwd，任务级 cwd 为 `/task`
- **THEN** 系统应使用 `/task` 作为该任务的工作目录

#### Scenario: 不存在任何 cwd 配置
- **WHEN** 配置文件未声明项目级 cwd，任务也未声明 cwd
- **THEN** 系统应使用进程当前目录作为工作目录

### Requirement: cwd 字段类型验证
配置文件解析器 SHALL 验证 `cwd` 字段为字符串类型。

#### Scenario: cwd 为有效字符串
- **WHEN** `cwd` 字段值为字符串类型的路径
- **THEN** 验证应通过

#### Scenario: cwd 为非字符串类型
- **WHEN** `cwd` 字段值为非字符串类型（如数字、对象等）
- **THEN** 验证应失败并提示错误
