import { runCliMode } from "../modes/cli.js";

import { select, isCancel } from "@clack/prompts";

import chalk from "chalk";
import figlet from "figlet";
import { run } from "node:test";
import { runTelegramMode } from "../modes/telegram/index.js";
const BANNER_FONT = "ANSI Shadow";
const SHADOW_COLOR = chalk.hex("#5b4e9e");
const FACE = chalk.hex("#e8dcf8").bold;

function printBannerWithShadow(ascii: string) {
  const bannerLines = ascii.replace(/\s+$/, "").split("\n");
  const maxLen = Math.max(...bannerLines.map((l) => l.length));
  const rowWidth = maxLen + 2;

  for (const line of bannerLines) {
    console.log(SHADOW_COLOR((" " + line).padEnd(rowWidth)));
  }
  process.stdout.write(`\x1b[${bannerLines.length}A`);

  for (const line of bannerLines) {
    console.log(FACE(line.padEnd(rowWidth)));
  }
  console.log();
}

export async function runwakeup() {
  let ascii: string;
  try {
    ascii = figlet.textSync("Chaicodeclaw", { font: BANNER_FONT });
  } catch (err) {
    ascii = figlet.textSync("Chaicodeclaw", { font: "standard" });
  }
  printBannerWithShadow(ascii);

  const mode = await select({
    message: "which mode do you want proceed with ?",
    options: [
      { value: "cli", label: "CLI Mode" },
      { value: "telegram", label: "Telegram Mode" },
      { value: "exit", label: "Exit" },
    ],
  });
  if (isCancel(mode) || mode === "exit") {
    console.log(chalk.red("Operation cancelled."));
    process.exit(0);
  }
  if (isCancel(mode)) {
    console.log(chalk.red("Operation cancelled."));
    process.exit(0);
  }

  if (mode === "cli") {
    await runCliMode();
  } else if (mode === "telegram") {
    await runTelegramMode();
  }
}
