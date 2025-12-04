const ss = SpreadsheetApp.getActiveSpreadsheet();
const currencyApiURL = "";
// const sheet = ss.getSheetByName("Google");
const logger = new LocalLogger(null, true, Severity.DEBUG);
logger.init();