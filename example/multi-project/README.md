# 多项目管理示例

这个示例展示了如何在 Agent Admin 中管理多个相关的项目，例如前端、后端和共享代码库。

## 项目结构

```
multi-project/
├── frontend/          # React 前端项目
│   └── src/
│       └── components/
├── backend/           # Node.js 后端项目
│   └── src/
│       └── api/
└── shared/            # 共享类型定义
```

## 配置文件说明

`aa.yaml` 配置文件：

```yaml
cwd: "./multi-project-root"

tasks:
  - task: "初始化 React 前端项目"
    cwd: "./frontend"
    
  - task: "初始化 Node.js 后端项目"
    cwd: "./backend"
    
  - task: "创建前端登录页面组件"
    cwd: "./frontend/src/components"
    
  - task: "创建后端用户认证 API"
    cwd: "./backend/src/api"
    
  - task: "创建前后端共享的类型定义"
    cwd: "./shared"
```

### 配置说明

- `cwd`: 项目根目录（所有任务相对于此目录）
- 每个任务都有自己的 `cwd`，指向不同的子项目

## 运行示例

### 方法 1: 使用配置文件

```bash
# 进入示例目录
cd examples/multi-project

# 执行所有任务（顺序执行）
aa -f aa.yaml
```

### 方法 2: 并行执行（谨慎使用）

```bash
# 并行执行 3 个任务
aa -f aa.yaml -p 3
```

注意：并行执行时，确保任务之间没有依赖关系。例如，"创建前端登录页面组件" 应该在 "初始化 React 前端项目" 之后执行。

### 方法 3: 分阶段执行

```bash
# 阶段 1: 初始化项目
aa -t "初始化 React 前端项目" -c ./frontend
aa -t "初始化 Node.js 后端项目" -c ./backend
aa -t "创建前后端共享的类型定义" -c ./shared

# 阶段 2: 开发功能
aa -t "创建前端登录页面组件" -c ./frontend/src/components
aa -t "创建后端用户认证 API" -c ./backend/src/api
```

## 最佳实践

### 1. 顺序执行有依赖的任务

对于有依赖关系的任务（如初始化项目后才能创建组件），建议使用默认的顺序执行：

```bash
aa -f aa.yaml
```

### 2. 并行执行独立任务

对于独立的任务（如同时开发前端和后端的不同功能），可以使用并行执行：

```bash
aa -f aa.yaml -p 2
```

### 3. 使用项目级 cwd

为整个项目设置 cwd，所有任务路径都相对于此目录：

```yaml
cwd: "./multi-project-root"
tasks:
  - task: "创建前端组件"
    cwd: "./frontend/src"
```

## 分离配置文件

你也可以为每个子项目创建单独的配置文件：

`frontend/aa.yaml`:
```yaml
tasks:
  - "创建登录页面组件"
  - "创建注册页面组件"
```

`backend/aa.yaml`:
```yaml
tasks:
  - "创建用户认证 API"
  - "创建数据获取 API"
```

然后分别执行：

```bash
# 开发前端
aa -c examples/multi-project/frontend -f aa.yaml

# 开发后端
aa -c examples/multi-project/backend -f aa.yaml
```

## 学到的知识

- 如何管理多个相关项目
- 任务依赖关系的处理
- 顺序执行 vs 并行执行的选择
- 项目级工作目录的使用
- 如何分离配置文件

## 下一步

回到实际项目中，根据你的需求选择合适的执行策略。
