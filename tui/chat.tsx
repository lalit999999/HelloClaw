import React from "react";
import { render } from "ink";
import { Root } from "./app/Root.js";
import { enterFullScreen, installExitHandlers, restoreTerminal } from "./terminal.js";

export async function runChatUI(): Promise<void> {
  enterFullScreen();
  installExitHandlers();

  const { waitUntilExit } = render(<Root />);

  try {
    await waitUntilExit();
  } finally {
    restoreTerminal();
  }
}
