/**
 * Нормалізуємо дані з товарами і зразу конвертуємо валюту
 * @param {Array} rawData дані які потрібно нормалізувати
 */
function normalizeData(rawData) {
  // const rawData = JSON.parse(jsonStringBodyContent);

  const keyMap = {
    "0": "Date",
    "1": "Order No.",
    "2": "Country",
    "3": "Total",
    "4": "Currency",
    "5": "client_id",
    "6": "gclid",
    "7": "fbclid",
    "8": "utm_source",
    "9": "utm_medium",
    "10": "utm_campaign",
    "11": "utm_term",
    "12": "utm_content"
  };

  return rawData.map(row => {
    const newRow = {};
    for (const key in keyMap) {
      newRow[keyMap[key]] = row[key];
    }

    newRow["Total"] = convertToEUR(newRow["Total"], newRow["Currency"]);
    newRow["Currency"] = "EUR";

    return newRow;
  });
}

/**
 * Конвертуємо ціну у Євро
 * @param {string} amount ціна яку потрібно перевести у євро
 * @param {string} currency валюту з якої потрібно перевести
 */
function convertToEUR(amount, currency) {
  if (currency === "EUR") return parseFloat(amount);

  const rates = getExchangeRatesFromCacheOrAPI();
  const rate = rates[currency];

  if (!rate) {
    logger.log(`Error not found currency ${currency}`, Severity.ERROR);
    return
  }

  const eurValue = parseFloat(amount) / rate;
  return eurValue.toFixed(2);
}

/**
 * Отримуємо дані з АПІ а саме курс євро
 */
function getExchangeRatesFromCacheOrAPI() {
  const cache = CacheService.getScriptCache();
  const cachedRates = cache.get('exchangeRates');

  if (cachedRates) {
    return JSON.parse(cachedRates);
  } else {
    const response = UrlFetchApp.fetch(currencyApiURL);
    const data = JSON.parse(response.getContentText());

    if (data.data) {
      const exchangeRates = data.data;
      cache.put('exchangeRates', JSON.stringify(exchangeRates), 21600); // Cache for 6 hours
      return exchangeRates;
    } else {
      throw new Error('Не вдалося отримати курси валют');
    }
  }
}

/**
 * А це просто для того щоб отримувати дані з API
 */
function clearExchangeRatesCache() {
  const cache = CacheService.getScriptCache();
  cache.remove('exchangeRates'); // видаляємо ключ exchangeRates
}

/**
 * splitData(data)
 *
 * Каскадно розподіляє масив даних по групах:
 * - google99 : utm_source містить "google." або "googleads"
 * - google50 : gclid ≠ "" або utm_source = "syndicatedsearch", але не дублює google99
 * - meta99   : utm_source = "fb", "ig" або містить "facebook"
 * - meta50   : fbclid ≠ "", але не дублює meta99
 * - remaining: все інше
 *
 * @param {Array<Object>} data - масив рядків із полями utm_source, gclid, fbclid тощо
 * @returns {Object} об’єкт із групами даних
 */
function splitData(data) {
  // Робимо копію даних
  let remaining = [...data];

  // Записуємо дані тільки для Google 99%
  const google99 = remaining.filter(row => row.utm_source && (row.utm_source.includes("google.") || row.utm_source.includes("googleads")));
  remaining = remaining.filter(row => !google99.includes(row));

  // Записуємо дані тільки для Meta 99%
  const meta99 = remaining.filter(row =>
    row.utm_source &&
    (
      row.utm_source === "fb" ||
      row.utm_source === "ig" ||
      row.utm_source.includes("facebook")
    )
  );
  remaining = remaining.filter(row => !meta99.includes(row));

  // Записуємо дані для Klaviyo
  const klaviyo = remaining.filter(row =>
    (row.utm_source && row.utm_source === "campaign") ||
    (row.utm_medium && row.utm_medium === "email")
  );
  remaining = remaining.filter(row => !klaviyo.includes(row));

  // Записуємо дані тільки для Google 50%
  const google50 = remaining.filter(row =>
    (row.gclid && row.gclid !== "") ||
    (row.gclid === "" && row.utm_source && row.utm_source.includes("syndicatedsearch"))
  );
  remaining = remaining.filter(row => !google50.includes(row))

  // Записуємо дані для Meta 50%
  const meta50 = remaining.filter(row => 
    row.fbclid && row.fbclid !== "" &&
    !(
      row.utm_source &&
      (
        row.utm_source === "fb" ||
        row.utm_source === "ig" ||
        row.utm_source.includes("facebook")        
      )
    )
  )
  remaining = remaining.filter(row => !meta50.includes(row));

  return {
    google99: google99 ?? [],
    google50: google50 ?? [],
    meta99: meta99 ?? [],
    meta50: meta50 ?? [],
    klaviyo: klaviyo ?? [],
    remaining: remaining ?? [], // Тут всі дані які не пройшли фільтр тобто до Other
  };
}
