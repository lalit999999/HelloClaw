import React from "react";
import { Box, Static, Text } from "ink";
import type { ChatMessage, MessageRole } from "./types.js";

const ROLE_STYLE: Record<MessageRole, { label: string; color: string }> = {
  user: { label: "you", color: "cyanBright" },
  assistant: { label: "claw", color: "magentaBright" },
  system: { label: "note", color: "gray" },
  tool: { label: "tool", color: "yellow" },
  error: { label: "error", color: "red" },
};

function Row({ message }: { message: ChatMessage }) {
  const style = ROLE_STYLE[message.role];
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={style.color}>
        {style.label}
        {message.mode ? ` · ${message.mode}` : ""}
      </Text>
      <Text>{message.text}</Text>
    </Box>
  );
}

interface Props {
  history: ChatMessage[];
  live: ChatMessage | null;
}

export function MessageList({ history, live }: Props) {
  return (
    <Box flexDirection="column">
      <Static items={history}>
        {(message) => <Row key={message.id} message={message} />}
      </Static>
      {live && <Row message={live} />}
    </Box>
  );
}
