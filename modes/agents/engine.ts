import { ToolLoopAgent, stepCountIs } from "ai";
import { getAgentModel } from "../../ai/ai.config.js";
import { ActionTracker } from "./action-tracker.js";
import { ToolExecutor } from "./tool-executer.js";
import { createAgentTools } from "./agent-tool.js";
import { defaultAgentConfig } from "./types.js";
import { runApprovalBridge } from "./approval-bridge.js";
import type { EngineHooks, TurnResult } from "../engine-types.js";

export async function runAgentTurn(
  goal: string,
  hooks: EngineHooks,
): Promise<TurnResult> {
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

  const result = await agent.stream({
    prompt: goal.trim(),
    onStepFinish: ({ toolCalls }) => {
      for (const tc of toolCalls) {
        const preview = JSON.stringify(tc.input).slice(0, 160);
        hooks.onToolCall(
          String(tc.toolName),
          preview + (preview.length >= 160 ? "…" : ""),
        );
      }
    },
  });

  let transcript = "";
  for await (const delta of result.textStream) {
    transcript += delta;
    hooks.onDelta(delta);
  }

  const { applied, errors } = await runApprovalBridge(
    tracker,
    executor,
    hooks,
  );

  return { reply: transcript.trim() || "(no response)", applied, errors };
}
