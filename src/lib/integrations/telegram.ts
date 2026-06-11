import "server-only";

const token = process.env.TELEGRAM_BOT_TOKEN || "";
const chatId = process.env.TELEGRAM_CHAT_ID || "";

export async function sendTelegramNotification(
  message: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!token || !chatId) {
      console.warn("Telegram config not set");
      return { success: false, error: "Telegram not configured" };
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Telegram API error ${response.status}: ${body}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Telegram sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send Telegram message",
    };
  }
}
