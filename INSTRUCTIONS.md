# OpenClaw - Setup & Usage Instructions

## 📦 Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **Git**: For version control (optional)

## 🚀 Installation & Setup

### Step 1: Clone or Download the Project

```bash
# If cloning from Git
git clone https://github.com/lalit999999/HelloClaw
cd HelloClaw


```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`:
- TypeScript and build tools
- CLI frameworks and UI components
- AI/LLM integration libraries
- Telegram bot library
- Web scraping tools

### Step 3: Configure Environment Variables

Create a `.env` file in the project root directory:

```bash
cp .env.example .env  # If example exists, or create new
touch .env
```

Edit `.env` with your API keys:

```env
# ========================================
# REQUIRED - OpenRouter API Configuration
# ========================================
OPENROUTER_API_KEY=sk_or_xxxxxxxxxxxxxxxxxxxxxx
OPENROUTER_DEFAULT_MODEL=openai/gpt-4-turbo

# =========================================
# OPTIONAL - Telegram Bot Configuration
# =========================================
# Get token from BotFather on Telegram
TELEGRAM_BOT_TOKEN=123456:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh

# =========================================
# OPTIONAL - Firecrawl Web Scraping
# =========================================
# For advanced web scraping features
FIRECRAWL_API_KEY=fc_xxxxxxxxxxxxxxxxxxxxxxxx
```

**How to Get API Keys:**

1. **OpenRouter API Key**
   - Visit: https://openrouter.ai/
   - Sign up/Login
   - Go to API Keys section
   - Create new key
   - Copy and paste into `.env`

2. **Telegram Bot Token**
   - Open Telegram and search for `@BotFather`
   - Send command: `/newbot`
   - Follow prompts to create new bot
   - Copy token to `.env`

3. **Firecrawl API Key** (Optional)
   - Visit: https://firecrawl.dev/
   - Sign up and get API key
   - Used for web scraping features

### Step 4: Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

## 📝 Available Commands

### Development Mode
```bash
npm run dev
```
Runs the CLI tool with the wakeup sequence:
```
chaicodeclaw-build wakeup
```

### Build Only
```bash
npm run build
```
Compiles TypeScript without running.

### Run CLI Directly
```bash
./dist/index.js wakeup
```

## 🎮 Usage Guide

### Main Interface

When you run the tool, you'll see:

```
   ███╗   ███╗ █████╗ ██╗███╗   ██╗
   ████╗ ████║██╔══██╗██║████╗  ██║
   ██╔████╔██║███████║██║██╔██╗ ██║
   ██║╚██╔╝██║██╔══██║██║██║╚██╗██║
   ██║ ╚═╝ ██║██║  ██║██║██║ ╚████║
   ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝

◇  which mode do you want proceed with ?
│  ○ CLI Mode
│  ○ Telegram Mode
│  ○ Exit
```

---

## 🔧 Mode 1: CLI Mode

### Entry Point
Select "CLI Mode" from the main menu.

### Sub-Modes Available

#### 1.1 Agent Mode
**Purpose**: Automated task execution with AI planning

**Workflow:**
```
1. You describe a task (e.g., "Create a new TypeScript file with a hello world function")
2. AI breaks it into steps and proposes actions
3. You review and approve/modify the actions
4. System executes the approved actions
5. View diffs and results
```

**Example Tasks:**
- "Create a new utility function for string manipulation"
- "Refactor this code to use async/await"
- "Fix the bug in the login function"
- "Add error handling to the API endpoint"

**Approval Flow:**
- ✓ Accept: Executes the action as proposed
- ✗ Reject: Skip this action
- 🔄 Modify: Change the action before execution
- ? View: See diff before executing

#### 1.2 Plan Mode
**Purpose**: Strategic planning, brainstorming, and research

**Workflow:**
```
1. Enter a topic or problem statement
2. Optionally perform web search for research
3. AI generates a comprehensive plan with multiple approaches
4. Browse through different sections and strategies
5. Export or save the plan
```

**Example Topics:**
- "Plan for building a scalable microservices architecture"
- "Strategy for optimizing database performance"
- "Roadmap for mobile app development"
- "Design patterns for handling complex state management"

**Navigation:**
- Arrow keys: Move between sections
- Enter: Select/expand section
- `s`: Search the web for research
- `e`: Export plan to file
- `q`: Quit and return to menu

#### 1.3 Ask Mode
**Purpose**: Direct Q&A with AI assistant

**Workflow:**
```
1. Type your question
2. Get AI-powered answer with markdown formatting
3. Ask follow-up questions or start new query
```

**Example Questions:**
- "How do I implement JWT authentication in Node.js?"
- "What are the pros and cons of microservices?"
- "Explain the concept of closures in JavaScript"
- "Best practices for error handling in async code"

**Features:**
- Formatted output with syntax highlighting
- Code snippets with language detection
- Links and markdown rendering

---

## 📱 Mode 2: Telegram Bot Mode

### Setup

1. Make sure you have `TELEGRAM_BOT_TOKEN` in your `.env` file
2. Select "Telegram Mode" from main menu
3. Bot will start polling for messages

### Available Commands

```
/start              - Show welcome message and available commands
/help               - Display command help
/agent [task]       - Execute agent mode for a task
/plan [topic]       - Generate a plan for a topic
/ask [question]     - Ask a question
/approve            - View and manage pending approvals
/status             - Check current session status
/cancel             - Cancel current operation
```

### Usage Examples

```
User: /agent Create a function to validate emails
Bot: [Proposes steps] → [Requests approval] → [Executes] → [Shows results]

User: /plan Design a weather app
Bot: [Generates comprehensive plan with sections]

User: /ask What is machine learning?
Bot: [Provides detailed answer]

User: /approve
Bot: [Shows pending actions to approve/reject]
```

### Session Management

- Each user has independent session
- Approvals handled via inline buttons
- Conversation history maintained during session
- Sessions timeout after inactivity

### Approval Interface (Telegram)

```
Pending Action:
[Create file: utils.ts]
[Show Diff] [Approve] [Reject] [Modify]

Diff View:
+++ utils.ts
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

---

## 🎯 Common Workflows

### Workflow 1: Automated Task Execution
```
1. npm run dev
2. Select: CLI Mode → Agent Mode
3. Describe task: "Create authentication middleware"
4. Review proposed steps
5. Approve and execute
6. Review changes in diff view
7. Task complete!
```

### Workflow 2: Strategic Planning
```
1. npm run dev
2. Select: CLI Mode → Plan Mode
3. Enter topic: "Mobile app MVP launch strategy"
4. Choose web search for research (optional)
5. Review generated plan sections
6. Export plan to file
7. Use plan as reference
```

### Workflow 3: Remote Bot Assistance
```
1. npm run dev
2. Select: Telegram Mode
3. Open Telegram and find your bot
4. Send: /agent Write a React hook for API fetching
5. Review proposed code in Telegram
6. Approve via button
7. Receive confirmation with results
```

---

## 🔧 Troubleshooting

### Issue 1: "Invalid Model ID"
**Problem**: Error shows model is not valid
```
APICallError: nemotron-3-super-120b:free is not a valid model ID
```

**Solution**:
1. Check your `.env` file
2. Visit https://openrouter.ai/docs/models
3. Copy a valid model ID (e.g., `openai/gpt-4-turbo`)
4. Update `OPENROUTER_DEFAULT_MODEL` in `.env`
5. Restart the tool

### Issue 2: "API Key not set"
**Problem**: 
```
Error: OPENROUTER_API_KEY not set
```

**Solution**:
1. Create `.env` file in project root
2. Add your OpenRouter API key
3. Ensure `.env` is not in `.gitignore` issue (it should be!)
4. Restart the tool

### Issue 3: "Telegram Bot not responding"
**Problem**: Bot doesn't reply to messages

**Solution**:
1. Check `TELEGRAM_BOT_TOKEN` is correct in `.env`
2. Verify bot is created via BotFather
3. Ensure bot is active (not stopped)
4. Check internet connection
5. Restart the tool and try again

### Issue 4: Dependencies not installed
**Problem**:
```
Module not found error
```

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue 5: TypeScript compilation errors
**Problem**: Build fails with TS errors

**Solution**:
```bash
npm run build -- --noEmit  # Check errors
npm run build              # Build anyway
```

---

## 📁 Project Structure Reference

```
openclaw/
├── index.ts                 # CLI entry point
├── package.json            # Dependencies
├── .env                    # YOUR API KEYS (keep secret!)
│
├── ai/
│   └── ai.config.ts       # OpenRouter setup
│
├── tui/
│   ├── wakeup.ts          # Main banner & menu
│   └── terminalmd.ts      # Terminal rendering
│
├── modes/
│   ├── cli.ts             # CLI mode router
│   ├── agents/            # Agent mode (automation)
│   ├── ask/               # Ask mode (Q&A)
│   ├── plan/              # Plan mode (planning)
│   └── telegram/          # Telegram bot
│
└── dist/                  # Compiled output (generated)
```

---

## 🛡️ Security Best Practices

### API Keys & Secrets
```bash
# ✓ DO
echo ".env" >> .gitignore
export API_KEY="your_key"
```

```bash
# ✗ DON'T
git add .env
console.log(process.env.API_KEY)
commit API keys to repository
```

### File Operations
- Agent mode requests approval before file modifications
- Always review diffs before execution
- Keep backups of important files

### Telegram Bot
- Don't share bot token publicly
- Use environment variables for tokens
- Implement authentication for sensitive operations

---

## 🚀 Performance Tips

1. **Faster Execution**: Use faster models from OpenRouter
2. **Offline Browsing**: Cache web search results
3. **Batch Operations**: Execute multiple tasks in Agent mode sequentially
4. **Telegram Polling**: Adjust polling timeout for better responsiveness

---

## 🔄 Updating & Maintenance

### Update Dependencies
```bash
npm update                    # Update to compatible versions
npm install @latest           # Update to latest version
```

### Clean Build
```bash
rm -rf dist/
npm run build
```

### View Logs
```bash
# Enable debug mode (if implemented)
DEBUG=* npm run dev

# Check recent git commits
git log --oneline -10
```

---

## 📚 Learning Resources

### Understanding the Code
1. Start with `index.ts` - Entry point
2. Review `tui/wakeup.ts` - Mode selection
3. Explore one mode: `modes/agents/orchestrator.ts`
4. Check types in `modes/*/types.ts`

### External Resources
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Commander.js**: https://github.com/tj/commander.js
- **Telegraf**: https://telegraf.js.org/
- **OpenRouter API**: https://openrouter.ai/docs
- **Marked**: https://marked.js.org/

---

## 🆘 Getting Help

### Debugging Steps
1. Check error message carefully
2. Review `.env` file configuration
3. Check logs in terminal
4. Try clean rebuild:
   ```bash
   npm run build
   npm run dev
   ```

### Common Solutions
- Restart the tool
- Verify API keys are valid
- Check internet connection
- Update dependencies: `npm install`

---

## 📝 Development Tips

### Adding New Features
1. Create files in appropriate `modes/` subdirectory
2. Export from `modes/cli.ts` or relevant orchestrator
3. Add TypeScript types in `types.ts`
4. Test via CLI or Telegram mode
5. Build: `npm run build`

### Testing a Feature
```bash
npm run build
npm run dev
# Navigate to feature
# Test thoroughly
```

### Git Workflow
```bash
git status                    # Check changes
git add <files>
git commit -m "Description"
git log --oneline -5          # View recent commits
```

---

## ✅ Verification Checklist

Before considering setup complete:

- [ ] Dependencies installed: `npm install`
- [ ] `.env` file created with API keys
- [ ] Build successful: `npm run build`
- [ ] CLI mode works: `npm run dev` → Try "Ask Mode"
- [ ] Plan mode works: Try "Plan Mode" with a sample topic
- [ ] Agent mode works: Try simple task execution
- [ ] (Optional) Telegram mode: Bot responds to /start

---

## 🎓 Next Steps

1. **Basic Usage**: Try Ask Mode with simple questions
2. **Plan Mode**: Generate plan for a real project
3. **Agent Mode**: Automate a small file-based task
4. **Telegram Integration**: Connect bot to your Telegram
5. **Customization**: Modify prompts and behaviors

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review PROJECT.md for architecture details
3. Check git history for recent changes
4. Review console output for error messages

---

**Version**: 1.0.0  
**Last Updated**: July 8, 2026  
**Status**: Ready for Production Use

