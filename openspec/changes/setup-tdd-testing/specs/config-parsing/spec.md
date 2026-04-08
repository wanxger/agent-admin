## ADDED Requirements

### Requirement: 配置文件解析成功
当有效的 YAML 配置文件存在时，系统 SHALL 正确解析文件内容并返回配置对象。

#### Scenario: 解析包含任务列表的有效配置
- **WHEN** 配置文件包含有效的 tasks 数组
- **THEN** 系统返回包含正确任务列表的 Config 对象

#### Scenario: 解析包含空任务数组的配置
- **WHEN** 配置文件包含空的 tasks 数组
- **THEN** 系统返回包含空数组的 Config 对象

### Requirement: 配置文件不存在时返回空
当指定的配置文件不存在时，系统 SHALL 返回 null 而不是抛出异常。

#### Scenario: 配置文件路径不存在
- **WHEN** 指定的配置文件路径不存在
- **THEN** 系统返回 null

### Requirement: 配置文件格式无效时返回空
当配置文件包含无效的 YAML 格式时，系统 SHALL 捕获错误并返回 null，同时记录错误日志。

#### Scenario: YAML 语法错误
- **WHEN** 配置文件包含无效的 YAML 语法
- **THEN** 系统捕获错误并返回 null
- **THEN** 系统输出错误日志

### Requirement: 配置文件结构无效时返回空
当配置文件包含有效的 YAML 但结构不符合预期时，系统 SHALL 返回 null。

#### Scenario: 缺少 tasks 字段
- **WHEN** 配置文件不包含 tasks 字段
- **THEN** 系统返回 null

#### Scenario: tasks 不是数组
- **WHEN** 配置文件的 tasks 字段不是数组类型
- **THEN** 系统返回 null
