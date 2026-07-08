import { ToolLoopAgent, stepCountIs } from "ai";
import type { Plan } from "./types.js";
import { getAgentModel } from "../../ai/ai.config.js";
import { ActionTracker } from "../agents/action-tracker.js";
import { ToolExecutor } from "../agents/tool-executer.js";
import { defaultAgentConfig } from "../agents/types.js";
import { createAgentTools } from "../agents/agent-tool.js";
import { createWebTools } from "./websearch-tool.js";
import { generatePlan } from "./planner.js";
import { runApprovalBridge } from "../agents/approval-bridge.js";
import type { EngineHooks, TurnResult } from "../engine-types.js";

export interface PlanTurnResult extends TurnResult {
  /** Set whenever a *new* plan was generated this turn, so the caller can remember it. */
  plan?: Plan | undefined;
}

function formatPlan(plan: Plan): string {
  const lines = [`**Goal:** ${plan.goal}`, ""];
  if (plan.researchSummary) lines.push(plan.researchSummary, "");
  plan.steps.forEach((step, i) => {
    const tag = step.complexity ? ` _(${step.complexity})_` : "";
    lines.push(`${i + 1}. **${step.title}**${tag} — ${step.description}`);
  });
  lines.push(
    "",
    '_Type "run 1,3" or "run all" to execute steps, or describe a new goal to replace this plan._',
  );
  return lines.join("\n");
}

/** Parses "run 2", "run 1,3", "execute all" etc. Returns 0-based step indices, or null if not a run command. */
function parseRunCommand(input: string, stepCount: number): number[] | null {
  const m = input.trim().match(/^(?:run|execute)\s+(all|[\d,\s]+)$/i);
  if (!m?.[1]) return null;

  if (m[1].toLowerCase() === "all") {
    return Array.from({ length: stepCount }, (_, i) => i);
  }

  const idx = m[1]
    .split(",")
    .map((s) => Number.parseInt(s.trim(), 10) - 1)
    .filter((n) => Number.isInteger(n) && n >= 0 && n < stepCount);

  return idx.length ? idx : null;
}

export async function runPlanTurn(
  input: string,
  activePlan: Plan | null,
  hooks: EngineHooks,
): Promise<PlanTurnResult> {
  const runIndices = activePlan
    ? parseRunCommand(input, activePlan.steps.length)
    : null;

  if (activePlan && runIndices) {
    const config = defaultAgentConfig();
    const tracker = new ActionTracker();
    const executor = new ToolExecutor(tracker, config);
    const tools = {
      ...createAgentTools(executor),
      ...createWebTools(tracker),
    };

    let transcript = "";
    const emit = (s: string) => {
      transcript += s;
      hooks.onDelta(s);
    };

    for (const i of runIndices) {
      const step = activePlan.steps[i]!;
      emit(`${transcript ? "\n\n" : ""}**Step ${i + 1}: ${step.title}**\n`);
      hooks.onNote(`Running step ${i + 1} of ${runIndices.length}…`);

      const agent = new ToolLoopAgent({
        model: getAgentModel(),
        stopWhen: stepCountIs(30),
        tools,
      });

      const result = await agent.stream({
        prompt: [
          `Goal: ${activePlan.goal}`,
          `Step: ${step.title}`,
          step.description,
        ].join("\n"),
        onStepFinish: ({ toolCalls }) => {
          for (const tc of toolCalls) {
            const preview = JSON.stringify(tc.input).slice(0, 160);
            hooks.onToolCall(String(tc.toolName), preview);
          }
        },
      });

      for await (const delta of result.textStream) emit(delta);
    }

    const { applied, errors } = await runApprovalBridge(
      tracker,
      executor,
      hooks,
    );

    return { reply: transcript.trim() || "Steps completed.", applied, errors };
  }

  hooks.onNote("Researching and drafting plan…");
  const plan = await generatePlan(input.trim());
  return { reply: formatPlan(plan), plan };
}
