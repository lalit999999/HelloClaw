import { runChatUI } from "../tui/chat.js";

async function runCliMode() {
  await runChatUI();
}

export { runCliMode };
