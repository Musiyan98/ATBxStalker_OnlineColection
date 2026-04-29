import parsedData from "../../parsed_data.json";
import { convertParsedDataToCards } from "../utils/convertData";

// Конвертуємо дані з parsed_data.json у формат додатку
export const cardsData = convertParsedDataToCards(parsedData);
