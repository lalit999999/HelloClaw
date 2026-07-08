#!/usr/bin/env node

import { Command } from "commander";
import { runwakeup } from "./tui/wakeup.js";

const program = new Command();

program
  .name("chaicodeclaw-build")
  .description("A CLI tool to build Chaicodeclaw projects")
  .version("0.0.1");

program
  .command("wakeup")
  .description("show the banner and pick a cli or telegram mode")
  .action(async () => {
    await runwakeup();
  });

program.parse(process.argv);
