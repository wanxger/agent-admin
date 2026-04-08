# Agent Admin - Developer Guidelines

This document provides guidelines for agentic coding agents working in the Agent Admin repository.

## Project Overview

This is a **Rush-managed monorepo** using **TypeScript** with:
- Package manager: `pnpm@10.22.0`
- Rush version: `5.162.0`
- Node.js requirement: `>=22.20.0 <23.0.0`
- TypeScript: `^5.9.3`
- Uses ES modules (`"type": "module"`)

### Repository Structure

```
/
├── apps/
│   └── agent-admin/   # Main application
├── libs/
│   └── prompt/         # Reusable ACP client library
├── common/             # Rush common files
└── result/             # Output directory for generated projects
```

## Build, Lint, and Test Commands

### Root Commands
- `rush build`: Build all projects
- `rush clean`: Clean all projects

### Project-Specific Commands

#### @agent-admin/agent-admin (apps/agent-admin/)
```bash
cd apps/agent-admin
pnpm build      # Compile TypeScript
pnpm clean      # Remove dist directory
pnpm dev        # Run with tsx (watch mode)
pnpm start      # Run compiled code
pnpm test       # Run unit tests (Vitest)
pnpm test --run # Run unit tests once (without watch mode)
```

#### @agent-admin/prompt (libs/prompt/)
```bash
cd libs/prompt
pnpm build      # Compile TypeScript
pnpm clean      # Remove dist directory
pnpm test       # Run all tests (unit + integration) with Vitest
pnpm test --run # Run all tests once (without watch mode)
```

### Running Tests

#### All Tests
Run all tests (unit + integration) for all packages:
```bash
rush test
```

Run all tests for a specific package:
```bash
cd apps/agent-admin && pnpm test
cd libs/prompt && pnpm test
```

#### Test Coverage
Generate coverage reports:
```bash
pnpm test --coverage
```

## Code Style Guidelines

### Formatting
- **Formatter**: Prettier (configured in `.prettierrc.js`)
- Print width: 110 characters
- Single quotes instead of double quotes
- No trailing commas
- End of line: auto
- **Always format on save** - VSCode settings enforce this

### Imports
- Use ES module syntax with `.js` extensions for relative imports
- Group imports: external dependencies first, then internal packages
- Example:
  ```typescript
  import readline from 'node:readline/promises';
  import { EventEmitter } from 'node:events';
  import * as acp from '@agentclientprotocol/sdk';
  import { AcpClient } from './utils/client.js';
  ```

### TypeScript
- Use strict TypeScript configuration
- Define interfaces for object shapes
- Use `async/await` for asynchronous code
- Prefer type inference where appropriate

### Naming Conventions
- **Files**: kebab-case (e.g., `client.ts`, `session.ts`)
- **Classes**: PascalCase (e.g., `AcpClient`)
- **Functions/Variables**: camelCase (e.g., `getAcpClient`, `maxIterations`)
- **Constants**: UPPER_SNAKE_CASE (where appropriate)
- **Interfaces**: PascalCase (e.g., `DebugOptions`)

### Error Handling
- Always handle promises with `.catch()` or try/catch
- Use `console.error()` for error logging
- Example:
  ```typescript
  main().catch((err) => {
    console.error(err);
  });
  ```

### Code Organization
- One class/export per file where appropriate
- Place utility functions in `utils/` directories
- Export from `index.ts` for clean imports
- Keep functions focused and single-purpose

### Comments
- No mandatory comments unless explaining complex logic
- Write self-documenting code first
- Use JSDoc for public APIs when needed

## Key Dependencies
- `@agentclientprotocol/sdk`: Agent Client Protocol SDK
- `zod`: Schema validation
- `tsx`: TypeScript execution environment

## Git & Commit Guidelines
- No specific commit message format enforced
- Commit meaningful changes
- Do not commit secrets or `.env` files

## Cursor & Copilot Rules
No Cursor rules or Copilot instructions configured yet. Follow the conventions outlined in this document.

## Best Practices
1. Always run `rush build` before submitting changes
2. Format code with Prettier before committing
3. Follow the existing code patterns in the repository
4. Keep dependencies updated through Rush
5. Use workspace references for internal packages (`workspace:*`)

## Configuration File Format

The agent-admin CLI supports YAML configuration files (default: `aa.yaml`) for defining tasks.

### Configuration Schema

```yaml
# Optional: Project-level working directory
cwd: "/path/to/project"

# Optional: Agent command
agent: "custom-agent --config /path/to/config"

# Required: List of tasks (can be strings or task objects)
tasks:
  # Simple task (uses project-level cwd or default)
  - "Task description 1"
  
  # Task with custom cwd
  - task: "Task description 2"
    cwd: "/path/to/task2"
  
  - task: "Task description 3"
    cwd: "./relative/path"
```

### Configuration Priority Rules

The agent-admin CLI supports multiple configuration sources with the following priority:

1. **Command-line parameters** (highest priority)
2. **Configuration file** (`aa.yaml`)
3. **Default values**

#### Working Directory (cwd) Priority

The working directory for each task is determined by the following priority:

1. **Command-line `--cwd`** (highest priority) - overrides all other sources
2. **Task-level `cwd`** in configuration file
3. **Project-level `cwd`** in configuration file
4. **Process current directory** (default)

When command-line `--cwd` conflicts with configuration file `cwd`, the command-line value is used and a warning is displayed.

#### Agent Command Priority

The agent command is determined by the following priority:

1. **Command-line `--agent`** (highest priority) - overrides all other sources
2. **Configuration file `agent`**
3. **Default value** (`opencode acp`)

When command-line `--agent` conflicts with configuration file `agent`, the command-line value is used and a warning is displayed.

### Example Configuration

```yaml
cwd: "/home/user/my-project"
agent: "custom-agent --config /path/to/config"

tasks:
  - task: "Build the project"
    cwd: "./build"
  
  - task: "Run tests"
    cwd: "./test"
  
  - "Deploy to production"
```

In this example:
- "Build the project" runs in `/home/user/my-project/build`
- "Run tests" runs in `/home/user/my-project/test`
- "Deploy to production" runs in `/home/user/my-project`
- All tasks use the agent command `custom-agent --config /path/to/config`

### Command-Line Override

You can override configuration file settings using command-line flags:

```bash
# Override working directory
aa -c /custom/path

# Override agent command
aa --agent "another-agent --config /other/config"

# Combine overrides
aa -c /custom/path --agent "another-agent"
```

When overriding values that exist in the configuration file, warnings will be displayed:

```
⚠️  配置冲突: 配置文件和命令行参数都指定了 cwd
   配置文件: /home/user/my-project
   命令行参数: /custom/path
   优先使用: 命令行参数 (/custom/path)
```

### Configuration Validation

The CLI validates configuration at startup and will:

- **Warn** when command-line parameters override configuration file values
- **Error** when:
  - Configuration file format is invalid (YAML syntax errors)
  - Working directory does not exist
  - No tasks are specified (no config file and no `--task` parameter)
  - Task list is empty in configuration file

### Examples

#### Using Configuration File

```yaml
cwd: "/home/user/my-project"
agent: "custom-agent --config /path/to/config"

tasks:
  - "Build the project"
  - "Run tests"
```

```bash
aa
```

#### Using Command-Line Parameters

```bash
aa -t "Build the project"
```

#### Overriding Configuration File

```yaml
cwd: "/home/user/my-project"

tasks:
  - "Task 1"
```

```bash
# This will override both cwd and agent from config file
aa -c /custom/path --agent "another-agent"
# Output: ⚠️  配置冲突: 配置文件和命令行参数都指定了 cwd
```

### Test Agent

For testing purposes, you can use the built-in Test Agent. The Test Agent is available from `@agent-admin/prompt` package:

```typescript
import { TestAgent } from '@agent-admin/prompt';

const testAgent = new TestAgent({ autoRespond: true, defaultResponse: 'Test response' });

// Use TestAgent for integration testing
// See libs/prompt/src/utils/test-agent.ts for more details
```
