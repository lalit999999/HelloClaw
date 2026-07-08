import chalk from "chalk";

export function colorizeDiff(patch: string): string {
  return patch
    .split("\n")
    .map((line) => {
      if (line.startsWith("+++") || line.startsWith("---")) return chalk.bold(line);
      if (line.startsWith("@@")) return chalk.cyan(line);
      if (line.startsWith("+")) return chalk.green(line);
      if (line.startsWith("-")) return chalk.red(line);
      return chalk.dim(line);
    })
    .join("\n");
}
