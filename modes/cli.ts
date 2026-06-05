import chalk from "chalk";
import { select, isCancel } from "@clack/prompts";
import { runAgentmode } from "./agents/orchestrator.js";

// you choose cli mode :
// agent mode
// plan
// ask
// back
 async function runCliMode() {
  console.log(chalk.green("You chose CLI Mode!"));
  while (true) {
    const mode = await select({
      message: "choose CLI sub Mode.",
      options: [
        { value: "agent", label: "Agent Mode" },
        { value: "plan", label: "Plan Mode" },
        { value: "ask", label: "Ask Mode" },
        { value: "back", label: "Back to Main Menu" },
      ],
    });
    if (isCancel(mode) || mode === "back") {
      console.log(chalk.red("Going back to main menu."));
      break;
    }
    if (mode === "agent") {
     await runAgentmode();
    }
    if (mode === "plan") {
      console.log(chalk.green("You chose Plan Mode!"));
    }
    if (mode === "ask") {
      console.log(chalk.green("You chose Ask Mode!"));
    }
  }
}

export { runCliMode };
