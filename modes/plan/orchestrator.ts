import chalk from "chalk";
import { confirm, isCancel, text } from "@clack/prompts";
import { ToolLoopAgent, stepCountIs } from "ai";
import type { PlanStep } from "./types.js";
import { getAgentModel } from "../../ai/ai.config.js";
import { ActionTracker } from "../agents/action-tracker.js";
import { ToolExecutor } from "../agents/tool-executer.js";
import { defaultAgentConfig } from "../agents/types.js";
import { createAgentTools } from "../agents/agent-tool.js";
import { renderTerminalMarkdown } from "../../tuifake/terminalmd.js";
import { runApprovalFlow } from "../agents/approvel.js";
import { generatePlan } from "./planner.js";

import { printPlan, selectSteps } from "./selection.js";
import type { Plan } from "./types.js";

import { createWebTools } from "./websearch-tool.js";

function stepPrompt(goal: string, step: PlanStep): string {
  return [`Goal: ${goal}`, `Step: ${step.title}`, step.description].join("\n");
}

export async function runPlanMode(): Promise<void> {
  console.log(chalk.bold("\n🧭 Plan Mode\n"));

  const goal = await text({ message: "What is your goal?" });
  if (isCancel(goal) || !goal.trim()) return;

  const plan = await generatePlan(goal);

  printPlan(plan);

  const selected = await selectSteps(plan);
  if (selected.length === 0) return;

  const proceed = await confirm({
    message: `Execute ${selected.length} step(s)`,
    initialValue: true,
  });

  const config = defaultAgentConfig();
  const tracker = new ActionTracker();
  const executor = new ToolExecutor(tracker, config);

  const tools = {
    ...createAgentTools(executor),
    ...createWebTools(tracker),
  };

  for (const step of selected) {
    console.log(chalk.bold(`\n🔧 ${step.title}\n`));

    const agent = new ToolLoopAgent({
      model: getAgentModel(),
      stopWhen: stepCountIs(30),
      tools,
    });

    const r = await agent.generate({ prompt: stepPrompt(plan.goal, step) });

    if (r.text) return console.log(renderTerminalMarkdown(r.text));
  }

  const ok = await runApprovalFlow(tracker);

  if (!ok) return executor.clearStaging();

  const { errors } = executor.applyApprovedFromTracker();
  if (errors.length) {
    console.log(chalk.red("\nSome operations reported errors:\n"));
    for (const e of errors) console.log(chalk.red(`  • ${e}`));
  } else {
    console.log(chalk.green("\n✓ Applied.\n"));
  }
  executor.clearStaging();
}
