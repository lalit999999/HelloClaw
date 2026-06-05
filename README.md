# OpenClaw

## Project Summary

OpenClaw is a TypeScript/Node.js based command‑line tool that provides an interactive, AI‑powered development environment. It glues together a collection of **agents** that can track actions, execute tools, diff code, and orchestrate workflows, all driven by LLMs. The core components include:

- **AI configuration** (`ai/ai.config.ts`) – defines the model, prompt templates and tool integrations.
- **Agent system** (`modes/agents/*`) – implements the different roles such as an orchestrator, tool executor, diff viewer and approval handler.
- **CLI entry point** (`modes/cli.ts`) – parses command‑line arguments and boots the interactive terminal UI.
- **Terminal UI** (`tui/*`) – provides a rich text‑based interface for conversation, code preview and user prompts.

The project is designed to be extensible; new agents or tools can be added by implementing the defined TypeScript interfaces. It aims to streamline coding tasks, automate repetitive edits, and give developers a conversational partner that can read, modify, and explain code directly from the command line.

## Getting Started

```bash
# Install dependencies
npm install

# Run the interactive CLI
npm run start
```

## License

MIT © 2024 OpenClaw contributors
