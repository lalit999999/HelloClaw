import chalk from "chalk";
import { runChatUI } from "../tui/chat.js";

async function runCliMode() {
  console.log(chalk.green("You chose CLI Mode!"));
  await runChatUI();
}

export { runCliMode };
