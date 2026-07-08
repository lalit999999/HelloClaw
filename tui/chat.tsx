import React from "react";
import { render } from "ink";
import { App } from "./app/App.js";

export async function runChatUI(): Promise<void> {
  const { waitUntilExit } = render(<App />);
  await waitUntilExit();
}
