function testCreateGoogl() {
  const sheet = ss.getSheetByName("Test");
  sheet.clear();

  const testData = [
    {
      Date: "2025-12-01",
      "Order No.": "A1001",
      Country: "UA",
      Total: 75.50,
      Currency: "EUR",
      utm_source: "googleads",
      gclid: "XYZ123"
    },
    {
      Date: "2025-12-01",
      "Order No.": "A1002",
      Country: "PL",
      Total: 19.75,
      Currency: "EUR",
      utm_source: "facebook",
      gclid: ""
    },
    {
      Date: "2025-12-02",
      "Order No.": "A1003",
      Country: "UA",
      Total: 49.99,
      Currency: "EUR",
      utm_source: "syndicatedsearch",
      gclid: ""
    },
    {
      Date: "2025-12-02",
      "Order No.": "A1004",
      Country: "DE",
      Total: 120.00,
      Currency: "EUR",
      utm_source: "bing",
      gclid: "ABC456"
    },
    {
      Date: "2025-12-03",
      "Order No.": "A1005",
      Country: "UA",
      Total: 200.00,
      Currency: "EUR",
      utm_source: "google.shopping",
      gclid: ""
    },
    {
      Date: "2025-12-03",
      "Order No.": "A1006",
      Country: "US",
      Total: 300.00,
      Currency: "EUR",
      utm_source: "instagram",
      gclid: "DEF789"
    }
  ];

  testCreateGoogle99(testData);
  testCreateGoogle50(testData);
}

function testCreateGoogle99(testData) {
  logger.log("Start function ordersGoogle99", Severity.DEBUG);
  createGoogle99(testData, "Test");
}

function testCreateGoogle50(testData) {
  logger.log("Start function ordersGoogle50", Severity.DEBUG);
  createGoogle50(testData, "Test");
}

function testConvertToEUR() {
  const testData = [
    {amount: 100, currency: "EUR"},
    {amount: 40, currency: "DKK"}, 
    {amount: 600, currency: "CHF"},
    {amount: 20, currency: "DKK"}, 
    {amount: 100, currency: "CHF"} 
  ]

  clearExchangeRatesCache();

  testData.forEach(test => {
    try {
      const result = convertToEUR(test.amount, test.currency);
      logger.log(`${test.amount} ${test.currency} = ${result} EUR`);
    } catch (error) {
      logger.log(`Error for ${test.currency}: ${error.message}`);
    }
  });
}

function testSummaryTotal() {
  appendSummaryTable("Test");
}

