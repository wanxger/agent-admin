# @agent-admin/agent-admin

Agent Admin CLI tool - An automated development task execution tool based on ACP (Agent Client Protocol).

[中文文档](./README-CN.md)

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Options](#cli-options)
- [Usage Examples](#usage-examples)
- [YAML Config Format](#yaml-config-format)
- [How It Works](#how-it-works)
- [Development Guide](#development-guide)
- [Project Structure](#project-structure)
- [Related Packages](#related-packages)
- [License](#license)
- [Repository](#repository)

---

## Installation

### Install from npm

```bash
npm install -g @agent-admin/agent-admin
# or
yarn global add @agent-admin/agent-admin
# or
pnpm add -g @agent-admin/agent-admin
```

### Develop from Source

```bash
git clone https://github.com/wanxger/agent-admin.git
cd agent-admin
rush update
rush build
```

#### npm link

You can use npm link to link the local version globally during development:

```bash
# cd to project directory
cd apps/agent-admin

# link to global
npm link

# now you can use `aa` command anywhere
aa --help

# unlink
npm unlink @agent-admin/agent-admin
```

---

## Quick Start

The CLI provides two command aliases:
- `aa` - Short alias
- `agent-admin` - Full command name

### 1. Run a single task

```bash
# using short alias
aa --task "Create a simple HTML webpage"

# or using full command name
agent-admin --task "Create a simple HTML webpage"
```

### 2. Use YAML config file

Create `aa.yaml`:

```yaml
tasks:
  - Create a simple HTML webpage
  - Create a React component
  - Write unit tests
```

Then run:

```bash
aa --file aa.yaml
```

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

## Development Guide

```bash
# cd to project directory
cd apps/agent-admin

# dev mode (watch)
pnpm dev

# build
pnpm build

# clean
pnpm clean

# test (TBD)
pnpm test
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
