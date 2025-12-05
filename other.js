/**
 * Створює таблицю де просто всі дані які не пройшли фільтрацію
 * @param {Array} - data дані які не пройшли фільтр
 * @param {string} - workSheetName назва таблиці
 */
function createOrders(data, workSheetName) {
  const sheet = ss.getSheetByName(workSheetName);

  if (!sheet) {
    const sheet = ss.insertSheet(workSheetName);
  } else {
    sheet.clear();
  }

  writeHeader(workSheetName);

  const values = data.map(row => Object.values(row));
  const startRow = sheet.getLastRow() +1;

  if (values.length > 0) {
    sheet.getRange(startRow, 2, values.length, values[0].length).setValues(values);
  } else {
    sheet.getRange(startRow, 2, 1, 1).setValue("No Data");
  }
  
  mergeFirstColumnWithLabel(workSheetName, startRow, "Orders Others");
  appendSummaryTable(workSheetName, startRow);
}
