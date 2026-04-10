# Agent Admin

An automated development task execution tool based on ACP (Agent Client Protocol).

[中文文档](./README-CN.md)

---

> 🎁 **Promotion**: Arking Coding Plan supports Doubao, GLM, DeepSeek, Kimi, MiniMax and other models, with unlimited tools. Subscribe now for 10% off, starting from just 36 RMB! The more you subscribe, the better the deal! Subscribe now: https://volcengine.com/L/X1hhwa3aKYk/  Invite code: GVXQVR6M

![Poster](./images/poster.png)

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
# Install with npm
npm install -g @agent-admin/agent-admin

# or with pnpm
pnpm add -g @agent-admin/agent-admin

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
- [Project Overview](#project-overview)
- [Package Structure](#package-structure)
- [Requirements](#requirements)
- [Development](#development)
- [Tech Stack](#tech-stack)
- [Repository](#repository)
- [License](#license)

---

## Project Overview

Agent Admin is a Rush-managed TypeScript monorepo that provides a CLI tool and related libraries for automated development task execution.

---

## Package Structure

| Package | Description |
|---------|-------------|
| [@agent-admin/agent-admin](./apps/agent-admin/) | Agent Admin CLI tool |
| [@agent-admin/prompt](./libs/prompt/) | ACP client library |

---

## Requirements

- Node.js: `>=22.20.0 <23.0.0`
- pnpm: `10.22.0`
- Rush: `5.162.0`

---

## Development

### Clone and install

```bash
git clone https://github.com/wanxger/agent-admin.git
cd agent-admin

rush update
```

### Build

```bash
# Build all projects
rush build

# Clean all projects
rush clean
```

### Link for local development

```bash
# Link CLI to global
cd apps/agent-admin
npm link

# Now you can use `aa` command anywhere
aa --help

# Unlink
npm unlink @agent-admin/agent-admin
```

### Development commands

#### apps/agent-admin

```bash
cd apps/agent-admin
pnpm build      # compile TypeScript
pnpm clean      # clean build output
pnpm dev        # dev mode (tsx)
pnpm start      # run compiled code
pnpm test       # run tests (Vitest)
```

#### libs/prompt

```bash
cd libs/prompt
pnpm build      # compile TypeScript
pnpm clean      # clean build output
pnpm test       # run tests (Vitest)
```

---

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Rush** - Monorepo management tool
- **pnpm** - Fast, disk space efficient package manager
- **ACP SDK** - Agent Client Protocol SDK
- **Commander.js** - CLI framework
- **Zod** - TypeScript-first schema validation
- **js-yaml** - YAML parser

---

## Repository

https://github.com/wanxger/agent-admin

---

## License

MIT
