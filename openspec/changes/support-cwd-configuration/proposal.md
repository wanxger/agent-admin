## Why

当前配置文件无法灵活指定工作目录，需要在项目级别和任务级别分别支持 cwd 声明，以提高配置的灵活性和任务执行的定位能力。

## What Changes

- 支持在配置文件中声明项目级别的 cwd（当前工作目录）
- 支持在配置文件中为单个任务声明独立的 cwd
- 解析逻辑支持继承和覆盖机制（任务 cwd 优先于项目 cwd）

## Capabilities

### New Capabilities
- `cwd-configuration`: 支持项目级和任务级的 cwd 配置声明

### Modified Capabilities
- 无

## Impact

- 配置文件解析器需要更新以支持 cwd 字段
- 任务执行逻辑需要使用指定的 cwd
- 配置文件 schema 需要更新
