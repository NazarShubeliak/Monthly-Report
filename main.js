function doPost(e) {
  try {
    // Step 1: Отримуємо всі дані з таблиці WooCommerce
    const data = JSON.parse(e.postData.contents);
    logger.log("Get all data from WooCommerce", Severity.INFO);

    // Step 2: Нормалізуємо дані щоб вони нам підходили
    const normalData = normalizeData(data);
    logger.log("Normalized data from \"data\"", Severity.INFO);

    // Step 3: Фільтруємо дані каскадним методом
    const remaining = splitData(normalData);
    logger.log("Filter our normal Data", Severity.INFO);

    // Step 4: Створюєом таблиці
      // WorkSheet "All of the orders"
    allOrders(normalData, "All of the orders");
    logger.log("Create \"All of the orders\"", Severity.INFO);

      // WorkSheet "Google"
    createGoogl(remaining, "Google");
    logger.log("Create table \"Google\"");

      // WorkSheet "Meta"
    createMeta(remaining, "Meta");
    logger.log("Create table \"Meta\"");

      // WorkSheet "Klaviyo"
    createKlaviyo(remaining.klaviyo, "Klaviyo");
    logger.log("Create table \"Klaviyo\"");

      // Others
    createOrders(remaining.remaining, "Other");
    logger.log("Creat table \"Orders Others\"");

    logger.log("All working good", Severity.INFO);

  } catch (error) {
    logger.log(`Error with: ${error}`, Severity.ERROR);
  }
}
