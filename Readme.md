# OpenClaw Project Documentation

## 📋 Project Overview

**OpenClaw** (Chaicodeclaw) is an advanced CLI tool that integrates artificial intelligence with multiple operational modes to provide intelligent task automation, planning, and interactive assistance. It leverages OpenRouter API for AI-powered capabilities and supports multiple interfaces including CLI and Telegram bot.

### Purpose
OpenClaw is designed to:
- Provide intelligent AI assistance through multiple interaction modes (CLI, Telegram)
- Enable automated agent-based task execution with approval workflows
- Support interactive planning and brainstorming sessions
- Perform web scraping and video processing tasks
- Manage complex workflows through a unified interface

---

## 🏗️ Architecture Overview

OpenClaw follows a modular architecture with the following components:

```
Entry Point (index.ts)
    ↓
Wakeup Banner & Mode Selection
    ├── CLI Mode
    │   ├── Agent Mode (Task Automation)
    │   ├── Plan Mode (Strategic Planning)
    │   └── Ask Mode (Q&A Interface)
    └── Telegram Mode (Bot Interface)
        ├── Web Scraping
        ├── Video Processing
        ├── Agent Execution
        ├── Plan Management
        └── Approval Workflows
```

---

## 📦 Tech Stack

### Core Technologies
- **Language**: TypeScript 6.0.3
- **Runtime**: Node.js (ES Modules)
- **Package Manager**: npm

### AI & LLM Integration
- **OpenRouter SDK**: `@openrouter/ai-sdk-provider` (v2.9.0) - LLM provider abstraction
- **Vercel AI SDK**: `ai` (v6.0.191) - Unified AI/LLM interface
- **Zod**: `zod` (v4.4.3) - Schema validation for type-safe data handling

### CLI & TUI (Terminal User Interface)
- **Commander.js**: `commander` (v14.0.3) - CLI argument parsing and command structure
- **Clack Prompts**: `@clack/prompts` (v1.4.0) - Interactive terminal prompts
- **Chalk**: `chalk` (v5.6.2) - Terminal color styling
- **Figlet**: `figlet` (v1.11.0) - ASCII art banner generation
- **Marked**: `marked` (v15.0.12) - Markdown parser
- **Marked Terminal**: `marked-terminal` (v7.3.0) - Markdown to terminal rendering

### Web & Data Tools
- **Firecrawl**: `@mendable/firecrawl-js` (v4.25.2) - Web scraping and crawling
- **Telegraph**: `telegraph` (v0.8.22) - Content publishing utility
- **Diff**: `diff` (v9.0.0) - Unified diff generation for code comparisons

### Telegram Integration
- **Telegraf**: `telegraf` (v4.16.3) - Telegram Bot API wrapper

### Environment & Configuration
- **Dotenv**: `dotenv` (v17.4.2) - Environment variable management

### Development Tools
- **TypeScript**: `typescript` (v6.0.3) - Type checking and compilation
- **TSX**: `tsx` (v4.22.3) - Direct TypeScript execution
- **@types/node**: `@types/node` (v25.9.2) - Node.js type definitions

---

## 📁 Folder Structure

```
openclaw/
├── index.ts                          # Entry point - CLI command definition
├── package.json                      # Project metadata and dependencies
├── tsconfig.json                     # TypeScript configuration
├── .env                              # Environment variables (not in git)
├── .gitignore                        # Git ignore rules
│
├── ai/                               # AI Configuration
│   ├── index.ts                      # AI module exports
│   └── ai.config.ts                  # OpenRouter API configuration
│
├── tui/                              # Terminal UI Components
│   ├── wakeup.ts                     # Main banner and mode selection
│   └── terminalmd.ts                 # Markdown terminal rendering
│
├── modes/                            # Operation Modes
│   ├── cli.ts                        # CLI mode router
│   │
│   ├── agents/                       # Agent Mode (Automated Tasks)
│   │   ├── orchestrator.ts           # Agent workflow orchestrator
│   │   ├── agent-tool.ts             # Tool definitions for agents
│   │   ├── tool-executer.ts          # Tool execution engine
│   │   ├── action-tracker.ts         # Track pending agent actions
│   │   ├── approvel.ts               # User approval workflow
│   │   ├── diff-view.ts              # Diff visualization
│   │   └── types.ts                  # TypeScript type definitions
│   │
│   ├── ask/                          # Ask Mode (Q&A)
│   │   └── orchestrator.ts           # Q&A flow orchestrator
│   │
│   ├── plan/                         # Plan Mode (Strategic Planning)
│   │   ├── orchestrator.ts           # Plan mode controller
│   │   ├── planner.ts                # Planning logic
│   │   ├── selection.ts              # Plan selection UI
│   │   ├── websearch-tool.ts         # Web search integration
│   │   └── types.ts                  # Plan-related types
│   │
│   └── telegram/                     # Telegram Bot Mode
│       ├── index.ts                  # Telegram bot entry and setup
│       ├── Handlers.ts               # Message handlers
│       ├── agent-run.ts              # Telegram agent execution
│       ├── plan-session.ts           # Telegram plan session management
│       ├── aprovel.ts                # Telegram approval flow
│       ├── auth.ts                   # Authentication logic
│       ├── text.ts                   # Telegram response texts
│       └── constant.ts               # Constants and configuration
│
├── dist/                             # Compiled JavaScript (generated)
│   └── [compiled files structure mirroring src]
│
└── node_modules/                     # Dependencies (not in git)
```

---

## 🔄 Key Modules & Functionality

### 1. **Wakeup Module** (`tui/wakeup.ts`)
- Displays ASCII art banner with "Chaicodeclaw" title
- Presents main menu for mode selection
- Routes to CLI or Telegram mode

### 2. **CLI Mode** (`modes/cli.ts`)
Routes users to three sub-modes with distinct capabilities

#### 2.1 **Agent Mode** (`modes/agents/`)
- **Purpose**: Automated task execution with AI-powered planning
- **Workflow**:
  1. User provides task description
  2. Agent breaks down task into steps
  3. User approves/modifies proposed actions
  4. System executes approved actions
  5. Displays diffs and results
- **Key Files**:
  - `orchestrator.ts`: Main workflow controller
  - `agent-tool.ts`: Defines available tools (file read/write, shell execution, etc.)
  - `approvel.ts`: User approval workflow for proposed actions
  - `action-tracker.ts`: Manages pending actions
  - `diff-view.ts`: Shows file changes before/after

#### 2.2 **Plan Mode** (`modes/plan/`)
- **Purpose**: Strategic planning and brainstorming
- **Workflow**:
  1. User inputs problem/topic
  2. AI generates comprehensive plan
  3. User can browse, modify, and export plan
  4. Web search integration for research
- **Key Files**:
  - `orchestrator.ts`: Plan workflow controller
  - `planner.ts`: Plan generation logic
  - `selection.ts`: Interactive plan browsing
  - `websearch-tool.ts`: Web search capability

#### 2.3 **Ask Mode** (`modes/ask/`)
- **Purpose**: Simple Q&A interface
- **Workflow**:
  1. User asks a question
  2. AI provides answer
  3. Markdown formatting for readability

### 3. **Telegram Mode** (`modes/telegram/`)
- **Purpose**: Telegram bot for remote AI-powered assistance
- **Features**:
  - Agent execution through Telegram
  - Plan generation and management
  - Web scraping capabilities
  - Approval workflows via Telegram UI
  - Multi-user session management
- **Key Files**:
  - `index.ts`: Bot initialization and polling setup
  - `Handlers.ts`: Command and message handlers
  - `agent-run.ts`: Execute agent tasks via Telegram
  - `plan-session.ts`: Manage planning sessions
  - `auth.ts`: User authentication
  - `aprovel.ts`: Approval workflow in Telegram UI

### 4. **AI Configuration** (`ai/`)
- Initializes OpenRouter API connection
- Manages model selection and API keys
- Provides unified model interface for all modes

---

## 🛠️ How Different Modes Work

### CLI Mode Flow
```
$ chaicodeclaw-build wakeup
  ↓
[Banner Display]
  ↓
Select Mode → CLI
  ↓
[Sub-mode Selection]
  ├─ Agent Mode → Task automation with approval
  ├─ Plan Mode → Strategic planning with research
  └─ Ask Mode → Direct Q&A with AI
```

### Telegram Mode Flow
```
$ chaicodeclaw-build wakeup
  ↓
Select Mode → Telegram
  ↓
[Bot starts polling for messages]
  ↓
User sends command
  ├─ /agent [task] → Agent execution
  ├─ /plan [topic] → Plan generation
  ├─ /ask [question] → Q&A
  └─ /approve → Approval interface
```

---

## 📊 Data Flow

### Task Execution Flow (Agent Mode)
```
User Input
    ↓
AI Task Breakdown
    ↓
Action Tracking
    ↓
User Approval
    ↓
Tool Execution
    ├─ Read Files
    ├─ Write Files
    ├─ Execute Shell Commands
    └─ Web Scraping
    ↓
Diff Generation
    ↓
Results Display
```

### Planning Flow (Plan Mode)
```
Topic/Problem
    ↓
Web Research (optional)
    ↓
AI Plan Generation
    ↓
Plan Breakdown into Steps
    ↓
Interactive Selection
    ↓
Export/Save Option
```

---

## 🔐 Environment Variables

Required `.env` file variables:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_DEFAULT_MODEL=your_preferred_model_id

# Telegram Configuration (for Telegram mode)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Firecrawl Configuration (for web scraping)
FIRECRAWL_API_KEY=your_firecrawl_api_key_optional
```

---

## 🚀 Build & Execution

### Build
```bash
npm run build
```
- Compiles TypeScript to JavaScript
- Output: `dist/` directory
- Generates type declarations and source maps

### Run
```bash
npm run dev
# or
chaicodeclaw-build wakeup
```

---

## 📝 Type System

The project uses TypeScript with strict mode enabled:
- Full type safety across all modules
- Zod for runtime schema validation
- Type definitions for agent tools, plans, and Telegram interactions

Key type files:
- `modes/agents/types.ts` - Agent-related types
- `modes/plan/types.ts` - Planning types

---

## 🔧 Tool Ecosystem

### Agent Tools Available
- File system operations (read, write, delete)
- Shell command execution
- Web scraping (via Firecrawl)
- Search operations

### External APIs
- **OpenRouter**: LLM access with multiple model options
- **Firecrawl**: Web scraping and content extraction
- **Telegram**: Bot API for messaging
- **Telegraph**: Content publishing

---

## 📈 Project Status

**Completed Features:**
- ✅ CLI mode with three sub-modes
- ✅ Agent mode with approval workflows
- ✅ Plan mode with strategic planning
- ✅ Ask mode for Q&A
- ✅ Telegram bot integration
- ✅ Web scraping capabilities
- ✅ Video project completion
- ✅ Environment configuration

**Recent Enhancements:**
- Environment variable management with dotenv
- Improved error handling for model validation
- Telegram bot with multi-mode support

---

## 🎯 Future Enhancement Opportunities

1. **Database Integration**: Store conversation history, user preferences
2. **Advanced Authentication**: JWT tokens, API key management
3. **Rate Limiting**: Handle API rate limits gracefully
4. **Persistence**: Save plans and agent results to file system
5. **Plugin System**: Allow custom tools and extensions
6. **Logging**: Comprehensive audit logs for all operations
7. **Error Recovery**: Retry logic for failed operations
8. **Performance**: Caching for repeated queries
9. **Multi-language**: Support for multiple languages
10. **Advanced Telegram Features**: Inline keyboards, photo uploads, file handling

---

## 📞 Support & Troubleshooting

### Common Issues

1. **Invalid Model ID Error**
   - Ensure `OPENROUTER_DEFAULT_MODEL` is set to a valid model
   - Check OpenRouter documentation for available models

2. **API Key Errors**
   - Verify `.env` file exists and is properly configured
   - Check API key validity in OpenRouter dashboard

3. **Telegram Bot Not Responding**
   - Confirm `TELEGRAM_BOT_TOKEN` is valid
   - Check bot is active in Telegram Bot Father

---

## 📄 License

ISC License (as specified in package.json)

---

**Last Updated**: July 8, 2026  
**Version**: 1.0.0
