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


