import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_BOT_TOKEN || "";
const chatId = process.env.TELEGRAM_CHAT_ID || "";

const bot = new TelegramBot(token, { polling: false });

export async function sendTelegramNotification(
  message: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!token || !chatId) {
      console.warn("Telegram config not set");
      return { success: false, error: "Telegram not configured" };
    }

    await bot.sendMessage(chatId, message, { parse_mode: "HTML" });
    return { success: true };
  } catch (error) {
    console.error("Telegram sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send Telegram message",
    };
  }
}
