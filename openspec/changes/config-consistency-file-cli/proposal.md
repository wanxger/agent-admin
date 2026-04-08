## Why

当前配置文件中的设置与命令行参数之间存在不一致，可能导致用户混淆和意外的行为。需要确保配置文件和命令行参数的优先级规则清晰且一致，提升用户体验。

## What Changes

- 明确配置文件和命令行参数的优先级规则文档
- 在 CLI 启动时验证配置文件和命令行参数的一致性
- 当检测到冲突时提供清晰的错误提示或警告
- 更新帮助文档以说明配置层级关系

## Capabilities

### New Capabilities

- `config-validation`: 配置文件与命令行参数的验证机制
- `config-priority`: 配置优先级规则和冲突解决

### Modified Capabilities

- 无

## Impact

- 影响 CLI 配置加载逻辑
- 影响命令行参数解析
- 需要更新用户文档
