import type { Mode } from "../../modes/engine-types.js";

export type {
  Mode,
  EngineHooks,
  TurnResult,
  PendingReviewGroup,
  ApprovalDecision,
} from "../../modes/engine-types.js";

export type MessageRole = "user" | "assistant" | "system" | "tool" | "error";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  mode?: Mode;
  text: string;
}
