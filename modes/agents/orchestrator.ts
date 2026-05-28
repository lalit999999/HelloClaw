import { isCancel } from "@clack/core";
import chalk from "chalk";
import { text } from "node:stream/consumers";

async function runAgentmode(): any {
  console.log(chalk.green("agent Mode"));
  const goal = await text({
    message: "what would you like the agent to do ?",
    placeholder: "concreate task for this codebase...",
  });

  if (isCancel(goal) || !goal.trim()) return;

  const config = defaultAgentConfig();
}

export { runAgentmode };
