import React, { useCallback, useRef, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";
import { MessageList } from "./MessageList.js";
import { ApprovalPanel } from "./ApprovalPanel.js";
import type {
  ApprovalDecision,
  ChatMessage,
  EngineHooks,
  Mode,
  PendingReviewGroup,
  TurnResult,
} from "./types.js";
import type { Plan } from "../../modes/plan/types.js";
import { runAgentTurn } from "../../modes/agents/engine.js";
import { runAskTurn } from "../../modes/ask/engine.js";
import { runPlanTurn } from "../../modes/plan/engine.js";

const MODES: Mode[] = ["agent", "plan", "ask"];

const MODE_COLOR: Record<Mode, string> = {
  agent: "green",
  plan: "blue",
  ask: "magenta",
};

const MODE_HINT: Record<Mode, string> = {
  agent: "describe a task to automate…",
  plan: 'describe a goal, then "run 1,3" or "run all"…',
  ask: "ask anything about this codebase…",
};

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `m${idCounter}`;
}

export function App() {
  const { exit } = useApp();
  const [mode, setMode] = useState<Mode>("agent");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [note, setNote] = useState("");
  const [pendingGroups, setPendingGroups] = useState<
    PendingReviewGroup[] | null
  >(null);

  const approvalResolver = useRef<
    ((decision: ApprovalDecision | null) => void) | null
  >(null);
  const lastPlan = useRef<Plan | null>(null);

  useInput((char, key) => {
    if (key.tab && key.shift) {
      if (!isProcessing) {
        setMode((m) => MODES[(MODES.indexOf(m) + 1) % MODES.length]!);
      }
      return;
    }
    if (key.ctrl && char === "c") {
      exit();
      setImmediate(() => process.exit(0));
    }
  });

  const requestApproval = useCallback(
    (groups: PendingReviewGroup[]): Promise<ApprovalDecision | null> => {
      return new Promise((resolve) => {
        approvalResolver.current = resolve;
        setPendingGroups(groups);
      });
    },
    [],
  );

  function resolveApproval(decision: ApprovalDecision | null) {
    setPendingGroups(null);
    const resolver = approvalResolver.current;
    approvalResolver.current = null;
    resolver?.(decision);
  }

  function pushResult(result: TurnResult) {
    setHistory((h) => [
      ...h,
      { id: nextId(), role: "assistant", mode, text: result.reply },
    ]);
    if (result.errors?.length) {
      setHistory((h) => [
        ...h,
        { id: nextId(), role: "error", mode, text: result.errors!.join("\n") },
      ]);
    } else if (result.applied) {
      setHistory((h) => [
        ...h,
        { id: nextId(), role: "system", mode, text: "✓ Changes applied." },
      ]);
    }
  }

  async function submit(rawText: string) {
    const text = rawText.trim();
    if (!text || isProcessing) return;

    setInput("");
    setHistory((h) => [...h, { id: nextId(), role: "user", mode, text }]);
    setIsProcessing(true);
    setLiveText("");
    setNote("");

    const hooks: EngineHooks = {
      onDelta: (delta) => setLiveText((t) => t + delta),
      onToolCall: (toolName, preview) =>
        setHistory((h) => [
          ...h,
          { id: nextId(), role: "tool", mode, text: `${toolName} ${preview}` },
        ]),
      onNote: setNote,
      requestApproval,
    };

    try {
      if (mode === "agent") {
        pushResult(await runAgentTurn(text, hooks));
      } else if (mode === "ask") {
        pushResult(await runAskTurn(text, hooks));
      } else {
        const result = await runPlanTurn(text, lastPlan.current, hooks);
        if (result.plan) lastPlan.current = result.plan;
        pushResult(result);
      }
    } catch (err) {
      setHistory((h) => [
        ...h,
        {
          id: nextId(),
          role: "error",
          mode,
          text: err instanceof Error ? err.message : String(err),
        },
      ]);
    } finally {
      setIsProcessing(false);
      setLiveText("");
      setNote("");
    }
  }

  const liveMessage: ChatMessage | null =
    isProcessing && liveText
      ? { id: "live", role: "assistant", mode, text: liveText }
      : null;

  return (
    <Box flexDirection="column" height="100%">
      <Box flexDirection="column" flexGrow={1}>
        <MessageList history={history} live={liveMessage} />
      </Box>

      {pendingGroups ? (
        <ApprovalPanel groups={pendingGroups} onResolve={resolveApproval} />
      ) : (
        <Box
          flexDirection="column"
          borderStyle="round"
          borderColor={MODE_COLOR[mode]}
          paddingX={1}
        >
          <Box justifyContent="space-between">
            <Text bold color={MODE_COLOR[mode]}>
              {mode.toUpperCase()}
            </Text>
            <Text dimColor>shift+tab to switch mode · ctrl+c to quit</Text>
          </Box>

          {isProcessing ? (
            <Box>
              <Text color={MODE_COLOR[mode]}>
                <Spinner type="dots" />
              </Text>
              <Text dimColor> {note || "working…"}</Text>
            </Box>
          ) : (
            <Box>
              <Text color={MODE_COLOR[mode]}>{"> "}</Text>
              <TextInput
                value={input}
                onChange={setInput}
                onSubmit={submit}
                placeholder={MODE_HINT[mode]}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
