/**
 * Shared contract between mode "engines" (agent/plan/ask business logic)
 * and whatever is rendering them (the Ink chat UI, Telegram, tests, etc).
 *
 * An engine never touches stdin/stdout or a prompt library directly - it
 * only calls the hooks it's given. That's what lets the same orchestration
 * logic run under a persistent chat UI instead of one-shot @clack/prompts
 * wizards.
 */

export type Mode = "agent" | "plan" | "ask";

export interface PendingReviewGroup {
  id: string;
  label: string;
  patch: string | null;
  actionIds: string[];
}

/** Maps an individual ActionLog id -> approved (true) or rejected (false). */
export type ApprovalDecision = Map<string, boolean>;

export interface EngineHooks {
  /** A streamed text chunk from the model for the turn currently in flight. */
  onDelta: (delta: string) => void;
  /** Fired once per tool call so the UI can show a live "tool used" line. */
  onToolCall: (toolName: string, preview: string) => void;
  /** Transient status text, e.g. "Researching…", shown next to the spinner. */
  onNote: (text: string) => void;
  /**
   * Called when there are staged mutations that need a decision.
   * Resolve with `null` to reject everything (user cancelled).
   */
  requestApproval: (
    groups: PendingReviewGroup[],
  ) => Promise<ApprovalDecision | null>;
}

export interface TurnResult {
  reply: string;
  applied?: boolean | undefined;
  errors?: string[] | undefined;
}
