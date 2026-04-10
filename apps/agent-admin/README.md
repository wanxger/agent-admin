# @agent-admin/agent-admin

Agent Admin CLI tool - An automated development task execution tool based on ACP (Agent Client Protocol).

[中文文档](./README-CN.md)

---

## Quick Start

### Using npx (Recommended - No installation required)

```bash
# Run a single task
npx @agent-admin/agent-admin --task "Create a simple HTML webpage"

# Use config file
npx @agent-admin/agent-admin --file aa.yaml
```

### Install globally

```bash
# Install with npm
npm install -g @agent-admin/agent-admin

# Run a single task
aa --task "Create a simple HTML webpage"

# Or use the full command name
agent-admin --task "Create a simple HTML webpage"

# Use config file
aa --file aa.yaml
```

---

## Table of Contents

- [Quick Start](#quick-start)
- [CLI Options](#cli-options)
- [Usage Examples](#usage-examples)
- [YAML Config Format](#yaml-config-format)
- [How It Works](#how-it-works)
- [Development](#development)
- [Project Structure](#project-structure)
- [Related Packages](#related-packages)
- [License](#license)
- [Repository](#repository)

---

## CLI Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--cwd <path>` | `-c` | Working directory | Current directory |
| `--task <task>` | `-t` | Single task description | - |
| `--file <path>` | `-f` | YAML config file path | aa.yaml in cwd |
| `--parallel <number>` | `-p` | Number of parallel tasks | 1 |
| `--retries <number>` | `-r` | Max retries per task | 0 |
| `--iterations <number>` | `-i` | Max iterations per task | 5 |
| `--help` | `-h` | Show help | - |

---

## Usage Examples

### Example 1: Specify working directory

```bash
aa --cwd ./my-project --task "Develop a React component"
```

### Example 2: Run tasks in parallel

```bash
aa --file tasks.yaml --parallel 3
```

### Example 3: Configure retries and iterations

```bash
aa --file tasks.yaml --parallel 2 --retries 2 --iterations 3
```

---

## YAML Config Format

```yaml
tasks:
  - First task description
  - Second task description
  - Third task description
```

---

## How It Works

1. **Task Execution**: Call ACP agent to start development work based on task description
2. **Iteration Check**: Automatically check if task is complete, up to `--iterations` times
3. **Auto-improve**: Automatically improve code based on judgment results
4. **Retry on Failure**: Automatically retry when task fails, up to `--retries` times
5. **Parallel Execution**: Support running multiple tasks simultaneously to improve efficiency

---

## Development

### Clone and install

```bash
git clone https://github.com/wanxger/agent-admin.git
cd agent-admin
rush update
rush build
```

### Link for local development

```bash
cd apps/agent-admin
npm link

aa --help
npm unlink @agent-admin/agent-admin
```

### Development commands

```bash
pnpm dev      # dev mode (watch)
pnpm build    # build
pnpm clean    # clean
pnpm test     # run tests
```

---

## Project Structure

```
apps/agent-admin/
├── src/
│   └── main.ts          # main entry
├── dist/                # build output
├── package.json
└── README.md
```

---

## Related Packages

- [@agent-admin/prompt](https://www.npmjs.com/package/@agent-admin/prompt) - ACP client library

---

## License

MIT

---

## Repository

https://github.com/wanxger/agent-admin
