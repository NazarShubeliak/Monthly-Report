/**
 * Просто створює аркуш де є всі товари за останній місяць
 * @param{Array} data всі наші товари
 * @param{string} workSheetName ім'я аркуша
 */
function allOrders(data, workSheetName) {
  const sheet = ss.getSheetByName(workSheetName);

  if (!sheet) {
    const sheet = ss.insertSheet(workSheetName);
  } else {
    sheet.clear();
  }

  writeHeader(workSheetName);

  const values = data.map(row => Object.values(row));
  const startRow = sheet.getLastRow() +1;

  sheet.getRange(startRow, 2, values.length, values[0].length).setValues(values);

  const lastRow = sheet.getLastRow();

  const summaryData = [
    ["Sum of the revenue Google 99%", "", "", ""],
    ["Spend Google", "", "", ""],
    ["Spend Meta", "", "", ""],
    ["Spend Klaviyo", "", "", ""],
    ["ROAS", "", "", ""],
  ];

  sheet.getRange(lastRow + 3, 2, summaryData.length, summaryData[0].length).setValues(summaryData);

  const totalFormulaCell = sheet.getRange(lastRow + 3, 5);
  totalFormulaCell.setFormula(`=SUM(E${startRow}:E${lastRow})`);

  const roasFormulaCell = sheet.getRange(lastRow + 7, 5);
  roasFormulaCell.setFormula(`=E${lastRow+3}/SUM(E${lastRow + 4}:E${lastRow + 6})`);

  const summaryTotalRange = sheet.getRange(lastRow + 3, 2, 1, 6);
  summaryTotalRange.setBackground("lightgreen");
  summaryTotalRange.setFontSize(13);
  summaryTotalRange.setFontWeight("bold");
}
