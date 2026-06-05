import type { ActionTracker } from "./action-tracker.js";

export async function runApprovalMode(
  tracker: ActionTracker,
): Promise<boolean> {
  console.log("approval mode");
  return true;
}
