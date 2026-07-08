const ESC = "\x1b";

let cleanedUp = false;

export function enterFullScreen(): void {
  if (!process.stdout.isTTY) return;
  process.stdout.write(`${ESC}[2J${ESC}[3J${ESC}[H`);
  process.stdout.write(`${ESC}[?25l`);
}

export function restoreTerminal(): void {
  if (cleanedUp) return;
  cleanedUp = true;
  if (process.stdout.isTTY) {
    process.stdout.write(`${ESC}[?25h`);
  }
}

let handlersInstalled = false;

export function installExitHandlers(): void {
  if (handlersInstalled) return;
  handlersInstalled = true;

  process.on("exit", restoreTerminal);

  const exitOnSignal = () => {
    restoreTerminal();
    process.exit(0);
  };
  process.on("SIGTERM", exitOnSignal);
  process.on("SIGHUP", exitOnSignal);

  process.on("uncaughtException", (err) => {
    restoreTerminal();
    console.error(err);
    process.exit(1);
  });
}
