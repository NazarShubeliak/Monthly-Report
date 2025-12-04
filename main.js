function doPost(e) {

  try {
    // Step 1: Отримуємо всі дані з таблиці WooCommerce
    const data = JSON.parse(e.postData.contents);
    logger.log("Get all data from WooCommerce", Severity.INFO);

    // Step 2: Нормалізуємо дані щоб вони нам підходили
    const normalData = normalizeData(data);
    logger.log("Normalized data from \"data\"", Severity.INFO);

    // Step 3: Створюємо таблицю "Google"
    createGoogl(normalData, "Google");
    logger.log("Create first table \"Google\"");

    logger.log("All working good", Severity.INFO);

  } catch (error) {
    logger.log(`Error with: ${error}`, Severity.ERROR);
  }
}
