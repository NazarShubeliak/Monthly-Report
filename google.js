/**
 * Створює аркуш Google
 * @param {Array} data - дані з якими працює
 * @param {string} workSheetName - назва аркуша
 * @param {integer} - spend кількість витрати на рекламу
 */
function createGoogl(remaining, workSheetName, spend) {
  const sheet = ss.getSheetByName(workSheetName);

  if (!sheet) {
    ss.insertSheet(workSheetName);
  }

  sheet.clear();

  createGoogle99(remaining.google99, workSheetName, spend);
  logger.log("Create table Google 99%", Severity.DEBUG);

  createGoogle50(remaining.google50, workSheetName, spend);
  logger.log("Create table 50%", Severity.DEBUG);
}

/**
 * Створює таблицю Orders Google 99%
 * @param {Array} data всі наші товари
 * @param {string} workSheetName
 * @param {integer} - spend кількість витрати на рекламу
 */
function createGoogle99(data, workSheetName, spend) {
  // Step 1: Створюємо заголовки
  writeHeader(workSheetName);

  // Step 2: startRow - Потрібне для запису першого рядка з даними
  const sheet = ss.getSheetByName(workSheetName);
  const startRow = sheet.getLastRow() + 1;

  // Step 3: записуємо дані в таблицю
  ordersGoogle99(data, workSheetName);

  // Step 4: об'єднюємо 1 стовпчик
  mergeFirstColumnWithLabel(workSheetName, startRow, "Orders Google 99%");

  // Step 5: підсумовуємо нашу цю таблицю
  appendSummaryTable(workSheetName, startRow, "Google Spend", spend);
}

/**
 * Створює таблицю Orders Google 50%
 * @param {Array} data всі наші товари
 * @param {string} workSheetName
 * @param {integer} - spend кількість витрати на рекламу
 */
function createGoogle50(data, workSheetName, spend) {
  // Step 1: Створюємо заголовки
  writeHeader(workSheetName);

  // Step 2: startRow - Потрібне для запису першого рядка з даними
  const sheet = ss.getSheetByName(workSheetName);
  const startRow = sheet.getLastRow() + 1;

  // Step 3: Записуємо дані в таблицю
  ordersGoogle50(data, workSheetName);

  // Step 4: 
  mergeFirstColumnWithLabel(workSheetName, startRow, "Orders Google 50%");

  // Step 5: підсумовуємо нашу цю таблицю
  appendSummaryTable(workSheetName, startRow, "Google Spend", spend);
}

/**
 * Фільтрує всі товари де є "google." в utm_source
 * @param {Array} data список всіх наших товарів
 * @param {string} workSheetName ім'я таблиці
 */
function ordersGoogle99(data, workSheetName) {
  let sheet = ss.getSheetByName(workSheetName);

  if (!sheet) {
    sheet = ss.insertSheet(workSheetName);
  }

  data.sort((a, b) => {
    const aHasGclid = a.gclid && a.gclid.trim() !== "";
    const bHasGclid = b.gclid && b.gclid.trim() !== "";
    if (aHasGclid === bHasGclid) return 0;
    return aHasGclid ? -1 : 1;
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
 * Фільтрує всі товари де немає "google." в utm_source але є gclib
 * @param {Array} data список всіх наших товарів
 * @param {string} workSheetName ім'я таблиці
 */
function ordersGoogle50(data, workSheetName) {
  let sheet = ss.getSheetByName(workSheetName);

  data.sort((a, b) => {
    const aHasGclid = a.gclid && a.gclid.trim() !== "";
    const bHasGclid = b.gclid && b.gclid.trim() !== "";
    if (aHasGclid === bHasGclid) return 0;
    return aHasGclid ? -1 : 1;
  });

  const values = data.map(row => Object.values(row));
  const startRow = sheet.getLastRow() +1;

  if (values.length > 0) {
    sheet.getRange(startRow, 2, values.length, values[0].length).setValues(values);
  } else {
    sheet.getRange(startRow, 2, 1, 1).setValue("No Data");
  }
}
