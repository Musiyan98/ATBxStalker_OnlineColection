import { supabase } from "./supabaseClient";

/**
 * Відправляє відгук до Supabase та Telegram
 */
export async function submitFeedback(feedbackData) {
  try {
    // 1. Зберігаємо в Supabase (без .select() бо anon не має прав на SELECT)
    const { error } = await supabase.from("feedback").insert([
      {
        message: feedbackData.message,
        category: feedbackData.category,
        needs_response: feedbackData.needsResponse,
        contact_info: feedbackData.contactInfo || null,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Помилка збереження відгуку");
    }

    // Генеруємо тимчасовий ID для Telegram (реальний ID недоступний через RLS)
    const tempId = Date.now();

    // 2. Спробуємо відправити в Telegram через наш API
    try {
      await sendToTelegram(feedbackData, tempId);
      console.log("✅ Telegram notification sent successfully");
    } catch (telegramError) {
      // Логуємо помилку, але не блокуємо успішне збереження
      console.warn("⚠️ Telegram notification failed:", telegramError.message);
      // Дані успішно збережено в Supabase, навіть якщо Telegram не працює
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
}

/**
 * Відправляє повідомлення в Telegram через Netlify Function
 */
async function sendToTelegram(feedbackData, feedbackId) {
  // У production використовуємо Netlify Function, у dev - локальний сервер
  const apiUrl =
    import.meta.env.MODE === "production"
      ? "/.netlify/functions/send-telegram"
      : import.meta.env.VITE_API_URL ||
        "http://localhost:3001/api/send-telegram";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedbackId,
        message: feedbackData.message,
        category: feedbackData.category,
        needsResponse: feedbackData.needsResponse,
        contactInfo: feedbackData.contactInfo,
      }),
    });

    if (!response.ok) {
      // Спробуємо отримати JSON помилку
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Якщо не JSON, отримаємо текст
        try {
          const errorText = await response.text();
          errorMessage = errorText.substring(0, 100) || errorMessage;
        } catch {
          // Ігноруємо помилку парсингу
        }
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    // Якщо API сервер не запущений або недоступний
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("API server not running. Start it with: npm run api");
    }
    throw error;
  }
}
