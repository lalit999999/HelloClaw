import type { Telegraf } from "telegraf";
import { isOwner } from "./auth.js";
import { Welcome } from "./constant.js";

export function regesterHandlers(bot: Telegraf) {
  bot.command("start", async (ctx) => {
    if (!isOwner(ctx.chat.id)) return;
    await ctx.reply(Welcome, { parse_mode: "Markdown" });
  });
}
