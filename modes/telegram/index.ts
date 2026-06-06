import { Telegraf } from "telegraf";
import chalk from "chalk";
import { Welcome } from "./constant.js";
import { registerHandlers } from "./Handlers.js";

export async function runTelegramMode() {
    const Token = process.env.TELEGRAM_BOT_TOKEN;
    const ownerid = process.env.TELEGRAM_OWNER_ID;
    const bot = new Telegraf(Token!);
    registerHandlers(bot);

    await bot.telegram.sendMessage(ownerid!, Welcome , {parse_mode: "Markdown"});

    console.log(chalk.green("send a welcome message to the telegram\n"));

    bot.launch();
    console.log(chalk.green("Telegram bot is up and running press ctrl+c to stop\n"));

    await new Promise<void>((resolve) => {
        const stop = () => {
            bot.stop("SIGINT");
            resolve();
        }
        process.once("SIGINT", stop);
        process.once("SIGTERM", stop);
    });
}
 