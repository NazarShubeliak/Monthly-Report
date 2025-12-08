const ss = SpreadsheetApp.getActiveSpreadsheet();
const currencyApiURL = "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_Z0Ra6UOofle3vyu3fni4ocVwuGO7uAXOnoRGvOhx&currencies=GBP%2CCHF%2CPLN%2CNOK%2CSEK%2CDKK%2CCZK&base_currency=EUR";
// const sheet = ss.getSheetByName("Google");
const logger = new LocalLogger(null, true, Severity.DEBUG);
logger.init();

const klaviyoSpend = 475;

const grobGezahltHeaderTitle = [
  "Month",
  "Google - Our infos",
  "Google - \nGoogle Ads infos",
  "Meta - Our infos",
  "Meta - \nAds manager infos",
  "Klaviyo - Our infos",
  "Klaviyo - \nKlaviyo infos",
  "",
  "Others Meta 50% - our infos",
  "Others Google 50% - our infos",
  "Others our infos"
];