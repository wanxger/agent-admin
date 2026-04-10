# @agent-admin/agent-admin

Agent Admin CLI tool - An automated development task execution tool based on ACP (Agent Client Protocol).

[中文文档](./README-CN.md)

---

> 🎁 **Promotion**: Arking Coding Plan supports Doubao, GLM, DeepSeek, Kimi, MiniMax and other models, with unlimited tools. Subscribe now for 10% off, starting from just 36 RMB! The more you subscribe, the better the deal! Subscribe now: https://volcengine.com/L/X1hhwa3aKYk/  Invite code: GVXQVR6M

![Poster](https://raw.githubusercontent.com/wanxger/agent-admin/main/images/poster.png)

---

## Quick Start

### Prerequisites

Install opencode (required, used by default):

```bash
curl -fsSL https://opencode.ai/install | bash
```

For more information, visit [https://opencode.ai/](https://opencode.ai/)

### Using npx (Recommended - No installation required)

```bash
# Run a single task (uses opencode acp by default)
npx @agent-admin/agent-admin --task "Create a simple HTML webpage"

# Use config file
npx @agent-admin/agent-admin --file aa.yaml

# Specify a custom agent
npx @agent-admin/agent-admin --task "Create a simple HTML webpage" --agent "custom-agent --config /path/to/config"
```

### Install globally

```bash
# Install by npm
npm install -g @agent-admin/agent-admin

# Run a single task (uses opencode acp by default)
aa --task "Create a simple HTML webpage"

# Or use the full command name
agent-admin --task "Create a simple HTML webpage"

# Use config file
aa --file aa.yaml

# Specify a custom agent
aa --task "Create a simple HTML webpage" --agent "custom-agent --config /path/to/config"
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
| `--agent <command>` | `-a` | ACP agent command | opencode acp |
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
