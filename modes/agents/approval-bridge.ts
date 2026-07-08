import type { ActionTracker } from "./action-tracker.js";
import type { ToolExecutor } from "./tool-executer.js";
import { groupPending } from "./approvel.js";
import type { EngineHooks, PendingReviewGroup } from "../engine-types.js";

export interface ApprovalOutcome {
  applied: boolean;
  errors?: string[] | undefined;
}

/**
 * Takes whatever is pending on the tracker, asks the UI (via hooks) to
 * decide on it, then applies the decision. Used by every engine so the
 * approval UX only needs to be built once (see tui/app/ApprovalPanel.tsx).
 */
export async function runApprovalBridge(
  tracker: ActionTracker,
  executor: ToolExecutor,
  hooks: EngineHooks,
): Promise<ApprovalOutcome> {
  const pending = tracker.getPendingMutations();
  if (pending.length === 0) return { applied: false };

  const groups: PendingReviewGroup[] = groupPending(pending).map((g, i) => ({
    id: `g${i}`,
    label: g.label,
    patch: g.patch,
    actionIds: g.actionIds,
  }));

  const decision = await hooks.requestApproval(groups);

  if (!decision) {
    for (const a of pending) tracker.updateStatus(a.id, "rejected", false);
    executor.clearStaging();
    return { applied: false };
  }

  for (const a of pending) {
    const approved = decision.get(a.id) ?? false;
    tracker.updateStatus(a.id, approved ? "approved" : "rejected", approved);
  }

  const { errors } = executor.applyApprovedFromTracker();
  executor.clearStaging();

  return { applied: true, errors: errors.length ? errors : undefined };
}
