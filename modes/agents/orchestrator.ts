import { isCancel, text } from "@clack/prompts";
import chalk from "chalk";
import { defaultAgentConfig } from "./types.js";
import { ActionTracker } from "./action-tracker.js";

async function runAgentmode(): Promise<void> {
  console.log(chalk.green("agent Mode"));
  const goal = await text({
    message: "what would you like the agent to do ?",
    placeholder: "concreate task for this codebase...",
  });

  if (isCancel(goal) || !goal.trim()) return;

  const config = defaultAgentConfig();
  const tracker = new ActionTracker();
  
  console.log(config);
}

export { runAgentmode };
