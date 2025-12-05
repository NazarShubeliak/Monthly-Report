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
 * @param {string} lable надпис для SPEND
 * @param {integer} spend скільки було витрачено на рекламу
 */
function appendSummaryTable(workSheetName, startRow, label, spend) {
  const sheet = ss.getSheetByName(workSheetName);
  const lastRow = sheet.getLastRow();

  const summaryData = [
    ["Sum of the revenue Google 99%", "", "", "", "", "ROAS"],
    [label, "", "", spend, "", ""]
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