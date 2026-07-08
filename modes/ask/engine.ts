import { ToolLoopAgent, stepCountIs, tool } from "ai";
import { z } from "zod";
import { getAgentModel } from "../../ai/ai.config.js";
import { ActionTracker } from "../agents/action-tracker.js";
import { ToolExecutor } from "../agents/tool-executer.js";
import { defaultAgentConfig } from "../agents/types.js";
import { createWebTools } from "../plan/websearch-tool.js";
import { runApprovalBridge } from "../agents/approval-bridge.js";
import type { EngineHooks, TurnResult } from "../engine-types.js";

function createAskTools(executor: ToolExecutor) {
  return {
    read_file: tool({
      description:
        "Read a text file from the workspace. Use a path relative to the project root.",
      inputSchema: z.object({
        path: z.string().describe("Relative file path"),
      }),
      execute: async ({ path: p }) => executor.readFile(p),
    }),

    list_files: tool({
      description: "List files and directories under a path.",
      inputSchema: z.object({
        path: z.string(),
        recursive: z.boolean().optional().default(false),
      }),
      execute: async ({ path: p, recursive }) =>
        executor.listFiles(p, recursive),
    }),

    search_files: tool({
      description:
        'Find files matching a glob pattern (e.g. "*.ts", "**/*.md"). Optional content substring filter.',
      inputSchema: z.object({
        root: z.string().describe("Directory to search, relative to root"),
        pattern: z
          .string()
          .describe("Glob-like pattern using * and ** (forward slashes)"),
        content_contains: z.string().optional(),
      }),
      execute: async ({ root, pattern, content_contains }) =>
        executor.searchFiles(root, pattern, content_contains),
    }),

    analyze_codebase: tool({
      description:
        "Summarize structure: file counts, size, extensions. Read-only.",
      inputSchema: z.object({
        path: z.string().default("."),
      }),
      execute: async ({ path: p }) => executor.analyzeCodebase(p),
    }),

    list_skills: tool({
      description:
        "List absolute paths to SKILL.md files under configured skill directories (Cursor / Claude).",
      inputSchema: z.object({}),
      execute: async () => executor.listSkills(),
    }),

    read_skill: tool({
      description:
        "Read a SKILL.md file. Path must be absolute and under skill roots, or use a path returned by list_skills.",
      inputSchema: z.object({
        path: z.string(),
      }),
      execute: async ({ path: p }) => executor.readSkill(p),
    }),

    save_answer: tool({
      description:
        "Stage a markdown file with the given content. It will only be written to disk after the user approves it.",
      inputSchema: z.object({
        filename: z
          .string()
          .describe("Plain filename ending in .md, no path separators"),
        content: z.string(),
      }),
      execute: async ({ filename, content }) => {
        const safe =
          filename.toLowerCase().endsWith(".md") &&
          !filename.includes("/") &&
          !filename.includes("\\") &&
          !filename.includes("..");
        if (!safe) return "Rejected: filename must be a plain name ending in .md";
        return executor.createFile(filename, content);
      },
    }),
  };
}

export async function runAskTurn(
  question: string,
  hooks: EngineHooks,
): Promise<TurnResult> {
  const config = defaultAgentConfig();
  config.tools.allowFileCreation = true;
  config.tools.allowFileModification = false;
  config.tools.allowFolderCreation = false;
  config.tools.allowShellExecution = false;

  const tracker = new ActionTracker();
  const executor = new ToolExecutor(tracker, config);

  const tools = {
    ...createAskTools(executor),
    ...createWebTools(tracker),
  };

  const agent = new ToolLoopAgent({
    model: getAgentModel(),
    stopWhen: stepCountIs(20),
    tools,
  });

  const result = await agent.stream({
    prompt: question.trim(),
    onStepFinish: ({ toolCalls }) => {
      for (const tc of toolCalls) {
        const preview = JSON.stringify(tc.input).slice(0, 160);
        hooks.onToolCall(String(tc.toolName), preview);
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

  return { reply: transcript.trim() || "(no answer)", applied, errors };
}
