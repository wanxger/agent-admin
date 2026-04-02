# Agent Admin

An automated development task execution tool based on ACP (Agent Client Protocol).

[中文文档](./README-CN.md)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Package Structure](#package-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Development Commands](#development-commands)
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

## Installation

### Install CLI globally

```bash
npm install -g @agent-admin/agent-admin
# or
pnpm add -g @agent-admin/agent-admin
```

### Develop from Source

```bash
# clone repository
git clone https://github.com/wanxger/agent-admin.git
cd agent-admin

# install dependencies
rush update

# build project
rush build
```

#### npm link

You can use npm link to link the local version globally during development:

```bash
# cd to CLI project directory
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

### Using the CLI

The CLI provides two command aliases:
- `aa` - Short alias
- `agent-admin` - Full command name

```bash
# run a single task (using short alias)
aa --task "Create a simple HTML webpage"

# or using full command name
agent-admin --task "Create a simple HTML webpage"

# use config file
aa --file aa.yaml
```

See [@agent-admin/agent-admin documentation](./apps/agent-admin/README.md) for more usage.

---

## Development Commands

### Root commands

```bash
# install dependencies
rush update

# build all projects
rush build

# clean all projects
rush clean
```

### Project-specific commands

#### apps/agent-admin

```bash
cd apps/agent-admin
pnpm build      # compile TypeScript
pnpm clean      # clean build output
pnpm dev        # dev mode (tsx)
pnpm start      # run compiled code
pnpm test       # run tests (TBD)
```

#### libs/prompt

```bash
cd libs/prompt
pnpm build      # compile TypeScript
pnpm clean      # clean build output
pnpm test       # run tests (TBD)
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
