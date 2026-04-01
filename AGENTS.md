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
pnpm test       # Run tests (placeholder)
```

#### @agent-admin/prompt (libs/prompt/)
```bash
cd libs/prompt
pnpm build      # Compile TypeScript
pnpm clean      # Remove dist directory
pnpm test       # Run tests (placeholder)
```

### Running Single Tests
Tests are not yet implemented. When added, follow project conventions for test naming and location.

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
