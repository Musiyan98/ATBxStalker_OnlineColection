/**
 * Netlify Function для відправки повідомлень в Telegram
 * Використовує Environment Variables з Netlify Dashboard
 */
export async function handler(event) {
  // Дозволяємо тільки POST запити
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const feedbackData = JSON.parse(event.body);

    // Валідація
    if (!feedbackData.message || !feedbackData.category) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

    if (!TELEGRAM_TOKEN || !ADMIN_CHAT_ID) {
      console.error("Telegram credentials not configured");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Telegram not configured" }),
      };
    }

    // Формуємо повідомлення
    const categoryEmoji = {
      complaint: "⚠️",
      suggestion: "💡",
      feedback: "💬",
    };

    const categoryNames = {
      complaint: "Скарга",
      suggestion: "Пропозиція",
      feedback: "Фідбек",
    };

    const emoji = categoryEmoji[feedbackData.category] || "📝";
    const categoryName =
      categoryNames[feedbackData.category] || feedbackData.category;

    let message = `${emoji} <b>Новий відгук #${feedbackData.feedbackId}</b>\n\n`;
    message += `<b>Категорія:</b> ${categoryName}\n`;
    message += `<b>Повідомлення:</b>\n${feedbackData.message}\n\n`;

    if (feedbackData.needsResponse && feedbackData.contactInfo) {
      message += `<b>Потрібен зворотній зв'язок:</b> Так\n`;
      message += `<b>Контакт:</b> ${feedbackData.contactInfo}\n`;
    } else {
      message += `<b>Потрібен зворотній зв'язок:</b> Ні\n`;
    }

    message += `\n<i>Дата: ${new Date().toLocaleString("uk-UA")}</i>`;

    // Відправляємо в Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Telegram API error:", errorData);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Telegram API error" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
