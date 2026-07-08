import React, { useRef, useState } from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import type { ApprovalDecision, PendingReviewGroup } from "./types.js";
import { colorizeDiff } from "./colorDiff.js";

interface Props {
  groups: PendingReviewGroup[];
  onResolve: (decision: ApprovalDecision | null) => void;
}

type Phase = "menu" | "review";

export function ApprovalPanel({ groups, onResolve }: Props) {
  const [phase, setPhase] = useState<Phase>("menu");
  const [groupIndex, setGroupIndex] = useState(0);
  const [showDiff, setShowDiff] = useState(false);
  const decisions = useRef<Map<string, boolean>>(new Map());
  const current = groups[groupIndex];

  function approveAll(approved: boolean) {
    const map = new Map<string, boolean>();
    for (const g of groups) for (const id of g.actionIds) map.set(id, approved);
    onResolve(map);
  }

  function decideCurrent(approved: boolean) {
    if (!current) return;
    for (const id of current.actionIds) decisions.current.set(id, approved);
    if (groupIndex + 1 < groups.length) {
      setGroupIndex((i) => i + 1);
      setShowDiff(false);
    } else {
      onResolve(decisions.current);
    }
  }

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="yellow"
      paddingX={1}
      marginY={1}
    >
      <Text bold color="yellow">
        {groups.length} change{groups.length === 1 ? "" : "s"} pending approval
      </Text>

      {phase === "menu" &&
        groups.map((g) => (
          <Text key={g.id} dimColor>
            • {g.label}
          </Text>
        ))}

      {phase === "review" && current && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold>
            [{groupIndex + 1}/{groups.length}] {current.label}
          </Text>
          {showDiff && current.patch && (
            <Box marginTop={1}>
              <Text>{colorizeDiff(current.patch)}</Text>
            </Box>
          )}
        </Box>
      )}

      <Box marginTop={1}>
        {phase === "menu" ? (
          <SelectInput
            items={[
              { label: "Approve and apply all", value: "all" },
              { label: "Review one by one", value: "review" },
              { label: "Reject all", value: "cancel" },
            ]}
            onSelect={(item) => {
              if (item.value === "all") approveAll(true);
              else if (item.value === "cancel") onResolve(null);
              else setPhase("review");
            }}
          />
        ) : (
          <SelectInput
            items={[
              { label: "Accept", value: "accept" },
              {
                label: current?.patch
                  ? showDiff
                    ? "Hide diff"
                    : "Show diff"
                  : "Show diff (n/a)",
                value: "diff",
              },
              { label: "Reject", value: "reject" },
            ]}
            onSelect={(item) => {
              if (item.value === "diff") {
                if (current?.patch) setShowDiff((v) => !v);
                return;
              }
              decideCurrent(item.value === "accept");
            }}
          />
        )}
      </Box>
    </Box>
  );
}
