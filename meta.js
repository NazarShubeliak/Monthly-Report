/**
 * Створює аркуш Meta
 * @param {Array} data - дані з якими працює
 * @param {string} workSheetName - назва аркуша
 * @parma {integer} spend - скільки було витрачено на рекламу
 */
function createMeta(remaining, workSheetName, spend) {
  const sheet = ss.getSheetByName(workSheetName);

  if (!sheet) {
    ss.insertSheet(workSheetName);
  }

  sheet.clear();

  createMeta99(remaining.meta99, workSheetName, spend);
  logger.log("Create table Meta 99%", Severity.DEBUG);

  createMeta50(remaining.meta50, workSheetName, spend);
  logger.log("Create table 50%", Severity.DEBUG);
}

/**
 * Створює таблицю Orders Meta 99%
 * @param {Array} data всі наші товари
 * @param {string} workSheetName
 */
function createMeta99(data, workSheetName, spend) {
  // Step 1: Створюємо заголовки
  writeHeader(workSheetName);

  // Step 2: startRow - Потрібне для запису першого рядка з даними
  const sheet = ss.getSheetByName(workSheetName);
  const startRow = sheet.getLastRow() + 1;

  // Step 3: записуємо дані в таблицю
  ordersMeta99(data, workSheetName);

  // // Step 4: об'єднюємо 1 стовпчик
  mergeFirstColumnWithLabel(workSheetName, startRow, "Orders Meta 99%");

  // // Step 5: підсумовуємо нашу цю таблицю
  appendSummaryTable(workSheetName, startRow, "Facebook Spend", spend);
}

/**
 * Створює таблицю Orders Meta 50%
 * @param {Array} data всі наші товари
 * @param {string} workSheetName
 */
function createMeta50(data, workSheetName, spend) {
  // Step 1: Створюємо заголовки
  writeHeader(workSheetName);

  // Step 2: startRow - Потрібне для запису першого рядка з даними
  const sheet = ss.getSheetByName(workSheetName);
  const startRow = sheet.getLastRow() + 1;

  // Step 3: Записуємо дані в таблицю
  ordersMeta50(data, workSheetName);

  // Step 4: 
  mergeFirstColumnWithLabel(workSheetName, startRow, "Orders Meta 50%");

  // Step 5: підсумовуємо нашу цю таблицю
  appendSummaryTable(workSheetName, startRow, "Facebook Spend", spend);
}

/**
 * Фільтрує всі товари де є "google." в utm_source
 * @param {Array} data список всіх наших товарів
 * @param {string} workSheetName ім'я таблиці
 */
function ordersMeta99(data, workSheetName) {
  let sheet = ss.getSheetByName(workSheetName);

  data.sort((a, b) => {
    const aHasFbclid = a.fbclid && a.fbclid.trim() !== "";
    const bHasFbclid = b.fbclid && b.fbclid.trim() !== "";
    if (aHasFbclid === bHasFbclid) return 0;
    return aHasFbclid ? -1 : 1;
  });

  const values = data.map(row => Object.values(row));
  const startRow = sheet.getLastRow() +1;

  if (values.length > 0) {
    sheet.getRange(startRow, 2, values.length, values[0].length).setValues(values);
  } else {
    sheet.getRange(startRow, 2, 1, 1).setValue("No Data");
  }
}

/**
 * Фільтрує всі товари де немає "fb", "ig", "facebook" в utm_source але є fbclib
 * @param {Array} data список всіх наших товарів
 * @param {string} workSheetName ім'я таблиці
 */
function ordersMeta50(data, workSheetName) {
  let sheet = ss.getSheetByName(workSheetName);

  const values = data.map(row => Object.values(row));
  const startRow = sheet.getLastRow() +1;

  if (values.length > 0) {
    sheet.getRange(startRow, 2, values.length, values[0].length).setValues(values);
  } else {
    sheet.getRange(startRow, 2, 1, 1).setValue("No Data");
  }
}