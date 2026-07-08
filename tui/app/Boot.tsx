import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import figlet from "figlet";

const BANNER_FONT = "ANSI Shadow";
const FACE_COLOR = "#e8dcf8";
const REVEAL_INTERVAL_MS = 45;
const HOLD_MS = 350;

function getBannerLines(): string[] {
  let ascii: string;
  try {
    ascii = figlet.textSync("Hello CLaw", { font: BANNER_FONT });
  } catch {
    ascii = figlet.textSync("Hello Claw", { font: "standard" });
  }
  return ascii.replace(/\s+$/, "").split("\n");
}

const BANNER_LINES = getBannerLines();

interface Props {
  onDone: () => void;
}

export function Boot({ onDone }: Props) {
  const [revealed, setRevealed] = useState(0);
  const done = revealed >= BANNER_LINES.length;

  useEffect(() => {
    if (done) {
      const holdTimer = setTimeout(onDone, HOLD_MS);
      return () => clearTimeout(holdTimer);
    }
    const timer = setTimeout(() => setRevealed((n) => n + 1), REVEAL_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [revealed, done, onDone]);

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
    >
      <Box flexDirection="column">
        {BANNER_LINES.slice(0, revealed).map((line, i) => (
          <Text key={i} bold color={FACE_COLOR}>
            {line}
          </Text>
        ))}
      </Box>
      <Box marginTop={1}>
        {done ? (
          <Text dimColor>
            <Text color={FACE_COLOR}>
              <Spinner type="dots" />
            </Text>
            {" starting…"}
          </Text>
        ) : (
          <Text> </Text>
        )}
      </Box>
    </Box>
  );
}
