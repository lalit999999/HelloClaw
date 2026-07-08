import React from "react";
import { render } from "ink";
import { Root } from "./app/Root.js";
import { enterFullScreen, installExitHandlers, restoreTerminal } from "./terminal.js";

const RESIZE_CLEAR_DEBOUNCE_MS = 80;

export async function runChatUI(): Promise<void> {
  enterFullScreen();
  installExitHandlers();

  const instance = render(<Root />);

  let resizeTimer: NodeJS.Timeout | undefined;
  const onResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      instance.clear();
    }, RESIZE_CLEAR_DEBOUNCE_MS);
  };
  process.stdout.on("resize", onResize);

  try {
    await instance.waitUntilExit();
  } finally {
    process.stdout.off("resize", onResize);
    if (resizeTimer) clearTimeout(resizeTimer);
    restoreTerminal();
  }
}
