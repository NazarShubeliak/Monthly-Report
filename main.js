function doPost(e) {
  try {
    // Step 1: Отримуємо всі дані з таблиці WooCommerce
    logger.log("START PROGRMA", Severity.WARNING);
    const data = JSON.parse(e.postData.contents);
    logger.log("Get all data from WooCommerce", Severity.INFO);

    // Step 1.1: отримуємо витрати по рекламі
    const orders = data.Orders;
    const googleSpend = data["Google Spend"].replace(".", "");
    const metaSpend = data["Meta Spend"].replace(".", ",");
    logger.log(`Google Spend: ${googleSpend} Meta Spend: ${metaSpend}`, Severity.INFO);

    // Step 2: Нормалізуємо дані щоб вони нам підходили
    const normalData = normalizeData(orders);
    logger.log("Normalized data from \"data\"", Severity.INFO);

    // Step 3: Фільтруємо дані каскадним методом
    const remaining = splitData(normalData);
    logger.log("Filter our normal Data", Severity.INFO);

    // Step 4: Створюєом таблиці
      // WorkSheet "All of the orders"
    allOrders(normalData, "All of the orders", googleSpend, metaSpend, klaviyoSpend);
    logger.log("Create \"All of the orders\"", Severity.INFO);

      // WorkSheet "Google"
    createGoogl(remaining, "Google", googleSpend);
    logger.log("Create table \"Google\"");

      // WorkSheet "Meta"
    // createMeta(remaining, "Meta", metaSpend);
    logger.log("Create table \"Meta\"");

      // WorkSheet "Klaviyo"
    // createKlaviyo(remaining.klaviyo, "Klaviyo", klaviyoSpend);
    logger.log("Create table \"Klaviyo\"");

      // Others
    // createOrders(remaining.remaining, "Other");
    logger.log("Creat table \"Orders Others\"");

    // Step 5: Створюємо загальну таблицю з підрахунками
    createGrobGezahlt(remaining, googleSpend, metaSpend, klaviyoSpend, "Grob gezählt");
    logger.log("Creat table \"Grob gezählt\"")

    logger.log("All working good", Severity.INFO);

  } catch (error) {
    logger.log(`Error with: ${error}`, Severity.ERROR);
  }
}
