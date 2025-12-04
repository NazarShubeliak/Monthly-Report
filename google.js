function createGoogl(data, workSheetName) {
  const sheet = ss.getSheetByName(workSheetName);

  if (!sheet) {
    ss.insertSheet(workSheetName);
  }

  sheet.clear();

  createGoogle99(data, workSheetName);
  logger.log("Create table Google 99%", Severity.DEBUG);

  createGoogle50(data, workSheetName);
  logger.log("Create table 50%", Severity.DEBUG);
}

/**
 * Створює таблицю Orders Google 99%
 * @param {Array} data всі наші товари
 * @param {string} workSheetName
 */
function createGoogle99(data, workSheetName) {
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
  appendSummaryTable(workSheetName, startRow);
}

/**
 * Створює таблицю Orders Google 50%
 * @param {Array} data всі наші товари
 * @param {string} workSheetName
 */
function createGoogle50(data, workSheetName) {
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
  appendSummaryTable(workSheetName, startRow);
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

  const googleRows = data.filter(row => row.utm_source && (row.utm_source.includes("google.") || row.utm_source.includes("googleads")));


  googleRows.sort((a, b) => {
    const aHasGclid = a.gclid && a.gclid.trim() !== "";
    const bHasGclid = b.gclid && b.gclid.trim() !== "";
    if (aHasGclid === bHasGclid) return 0;
    return aHasGclid ? -1 : 1;
  });


  // writeHeader(workSheetName);

  const values = googleRows.map(row => Object.values(row));
  const startRow = sheet.getLastRow() +1;

  sheet.getRange(startRow, 2, values.length, values[0].length).setValues(values);
}

function ordersGoogle50(data, workSheetName) {
  let sheet = ss.getSheetByName(workSheetName);

  const googleRows = data.filter(row =>
    (
      // умова 1: є gclid
      (row.gclid && row.gclid !== "") ||

      // умова 2: gclid порожній, але utm_source містить syndicatedsearch
      (row.gclid === "" && row.utm_source && row.utm_source.includes("syndicatedsearch"))
    )
    &&
    // виключаємо ті, що вже потрапили у Google таблицю
    !(row.utm_source && (row.utm_source.includes("google.") || row.utm_source.includes("googleads")))
  );

  googleRows.sort((a, b) => {
    const aHasGclid = a.gclid && a.gclid.trim() !== "";
    const bHasGclid = b.gclid && b.gclid.trim() !== "";
    if (aHasGclid === bHasGclid) return 0;
    return aHasGclid ? -1 : 1;
  });

  const values = googleRows.map(row => Object.values(row));
  const startRow = sheet.getLastRow() +1;

  sheet.getRange(startRow, 2, values.length, values[0].length).setValues(values);
}

/**
 * Записує всі заголовки для першої таблиці, також очищує всю таблицю
 * @param {string} workSheetName ім'я таблиці
 */
function writeHeader(workSheetName) {
  let sheet = ss.getSheetByName(workSheetName);

  if (!sheet) {
    sheet = ss.insertSheet(workSheetName);
  }

  // sheet.clear();

  const headers = [
    "Date",
    "Order No.",
    "Country",
    "Total",
    "Currency",
    "client_id",
    "gclid",
    "fbclid",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content"
  ];

  const start = sheet.getLastRow()+1;
  console.log(start);

  sheet.getRange(start, 2, 1, headers.length).setValues([headers]);

  const headerRange = sheet.getRange(start, 2, 1, headers.length);
  const gclidIndex = headers.indexOf("gclid") + 2

  headerRange.setFontSize(15);
  headerRange.setBackground("yellow");
  headerRange.setFontWeight("bold");
  sheet.getRange(1, gclidIndex, sheet.getMaxRows(), 1).setFontColor("green");
}

/**
 * Об'єднює першу колонку в залежності від довжини
 * @param {string} workSheetName ім'я таблиці
 * @param {integer} startRow з якого рядка починаємо об'єднювати
 * @param {string} label текст для колонки
 */
function mergeFirstColumnWithLabel(workSheetName, startRow, label) {
  const sheet = ss.getSheetByName(workSheetName);
  const lastRow = sheet.getLastRow()+1;

  sheet.setFrozenRows(1);
  console.log(`Get Last Row ${lastRow}`)
  if (lastRow > 0) {
    const mergeRange = sheet.getRange(startRow, 1, lastRow-startRow, 1);
    mergeRange.merge();
    mergeRange.setValue(label);
    mergeRange.setTextRotation(90);
    mergeRange.setVerticalAlignment("middle");
    mergeRange.setHorizontalAlignment("center");
    mergeRange.setFontWeight("bold");
  }
}

/**
 * Просто додає рядок в якому ми будемо підраховувати все до купи
 * @param {string} workSheetName ім'я таблиці
 * @param {integer} startRow рядок з якого починаємо рахувати суму
 */
function appendSummaryTable(workSheetName, startRow) {
  const sheet = ss.getSheetByName(workSheetName);
  const lastRow = sheet.getLastRow();

  const summaryData = [
    ["Sum of the revenue Google 99%", "", "", "", "", "ROAS"],
    ["Spend Meta", "", "", "", "", ""]
  ];

  sheet.getRange(lastRow + 3, 2, summaryData.length, summaryData[0].length).setValues(summaryData);

  const totalFormulaCell = sheet.getRange(lastRow + 3, 5);
  totalFormulaCell.setFormula(`=SUM(E${startRow}:E${lastRow})`);

  const roasFormulaCell = sheet.getRange(lastRow + 4, 7);
  roasFormulaCell.setFormula(`=E${lastRow+3}/E${lastRow+4}`);

  const summaryTotalRange = sheet.getRange(lastRow + 3, 2, 1, 6);
  summaryTotalRange.setBackground("lightgreen");
  summaryTotalRange.setFontSize(13);
  summaryTotalRange.setFontWeight("bold");
}
