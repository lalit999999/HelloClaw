import { isCancel, text } from "@clack/prompts";
import chalk from "chalk";
import { defaultAgentConfig } from "./types.js";
import { ActionTracker } from "./action-tracker.js";
import { ToolExecutor } from "./tool-executer.js";
import { renderTerminalMarkdown } from  "../../tui/terminalmd.js";
import { createAgentTools } from "./agent-tool.js";
import { stepCountIs, ToolLoopAgent } from "ai";
import { getAgentModel } from "../../ai/ai.config.js";

async function runAgentmode(): Promise<void> {
  console.log(chalk.green("agent Mode"));
  const goal = await text({
    message: "what would you like the agent to do ?",
    placeholder: "concreate task for this codebase...",
  });

  if (isCancel(goal) || !goal.trim()) return;

  const config = defaultAgentConfig();
  const tracker = new ActionTracker();
  const executor = new ToolExecutor(tracker, config);
  const tools = createAgentTools(executor);

  const agent = new ToolLoopAgent({
    model: getAgentModel(),
    stopWhen: stepCountIs(40),
    instructions: [
      `Workspace root: ${config.codebasePath}`,
      "All mutations are staged until approval.",
    ].join("\n"),
    tools,
  });

  const result = await agent.generate({
    prompt: goal.trim(),
    onStepFinish: ({ toolCalls }) => {
      for (const tc of toolCalls) {
        const preview = JSON.stringify(tc.input).slice(0, 160);
        console.log(
          chalk.green("  ✓"),
          chalk.bold(String(tc.toolName)),
          chalk.dim(preview + (preview.length >= 160 ? "..." : "")),
        );
      }
    },
  });

  if (result.text?.trim()) console.log(renderTerminalMarkdown(result.text));

}

export { runAgentmode };
