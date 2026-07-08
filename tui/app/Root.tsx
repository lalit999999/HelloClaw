import React, { useCallback, useEffect, useState } from "react";
import { Box } from "ink";
import { Boot } from "./Boot.js";
import { App } from "./App.js";

const RESIZE_DEBOUNCE_MS = 80;

interface Size {
  columns: number;
  rows: number;
}

function getSize(): Size {
  return {
    columns: process.stdout.columns || 80,
    rows: process.stdout.rows || 24,
  };
}

export function Root() {
  const [phase, setPhase] = useState<"boot" | "chat">("boot");
  const [size, setSize] = useState<Size>(getSize());

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    const onResize = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setSize(getSize()), RESIZE_DEBOUNCE_MS);
    };
    process.stdout.on("resize", onResize);
    return () => {
      if (timer) clearTimeout(timer);
      process.stdout.off("resize", onResize);
    };
  }, []);

  const handleBootDone = useCallback(() => setPhase("chat"), []);

  return (
    <Box flexDirection="column" width={size.columns} height={size.rows}>
      {phase === "boot" ? <Boot onDone={handleBootDone} /> : <App />}
    </Box>
  );
}
