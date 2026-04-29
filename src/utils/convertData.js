// Скрипт для конвертації parsed_data.json у формат додатку

export function convertParsedDataToCards(parsedData) {
  return parsedData.map((card) => {
    // Беремо зображення з найвищою якістю (2x retina)
    const imageUrl =
      card.cardImages.find((img) => img.retina === "2x")?.fullUrl ||
      card.cardImages[0]?.fullUrl ||
      "";

    // Конвертуємо аудіо у вкладки
    const tabs = card.audio.map((audioItem, index) => ({
      label: audioItem.audioName,
      audio: audioItem.audioLocalPath ? `/${audioItem.audioLocalPath}` : null,
      content: formatAudioText(audioItem.audioText),
      badge: index > 0, // Перша вкладка без badge, інші з badge
    }));

    return {
      id: parseInt(card.cardNumber) || card.cardNumber,
      number: card.cardNumber.toString(), // Без padStart - просто число
      title: card.cardTitle,
      image: imageUrl,
      officialLink: card.off_link,
      tabs: tabs,
    };
  });
}

// Функція для форматування тексту у HTML з підтримкою Markdown
function formatAudioText(text) {
  if (!text) return "";

  let formatted = text;

  // 1. Конвертуємо Markdown bold (**текст:**) у HTML
  // Це виділить спікерів та заголовки секцій, які були обгорнуті в **...**
  formatted = formatted.replace(
    /\*\*([^*]+?)\*\*/g,
    '<strong class="highlight">$1</strong>',
  );

  // 2. Розбиваємо на параграфи по подвійних переносах
  const paragraphs = formatted.split("\n\n");

  // 3. Обгортаємо кожен параграф у <p>
  const htmlParagraphs = paragraphs.map((para) => {
    // Замінюємо одинарні переноси на <br> всередині параграфа
    const withBreaks = para.replace(/\n/g, "<br>");
    return `<p>${withBreaks}</p>`;
  });

  return htmlParagraphs.join("\n");
}
